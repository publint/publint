/**
 * @param {ArrayBuffer} buffer
 * @returns {import('../index.d.ts').TarballFile[]}
 */
export function parseTar(buffer) {
  const decoder = new TextDecoder()
  /** @type {import('../index.d.ts').TarballFile[]} */
  const files = []

  // Name of the next entry from a preceding PAX (x) or GNU long name (L) header,
  // used for paths that do not fit in the 100-byte name field
  /** @type {string | undefined} */
  let longName

  let offset = 0
  while (offset + 512 <= buffer.byteLength) {
    // Get file size from header (from offset 124, 12 bytes)
    const size = parseInt(read(buffer, decoder, offset + 124, 12), 8)

    // This may be NaN (because of parseInt("\0", 8)) which is used here as a fast-path
    // for detecting the end-of-archive marker, or if the tarball is corrupted
    if (Number.isNaN(size)) break

    // Get file type from header (from offset 156, 1 byte)
    const type = read(buffer, decoder, offset + 156, 1)

    if (type === 'x') {
      // PAX extended header for the next entry. Only the `path` record is needed.
      const path = parsePaxPath(buffer, decoder, offset + 512, size)
      if (path != null) longName = path
    } else if (type === 'L') {
      // GNU long name for the next entry
      longName = read(buffer, decoder, offset + 512, size).split('\0', 1)[0]
    } else if (type === '0' || type === '\0') {
      // Only handle files ('0', or '\0' as written by pre-POSIX archivers). Packed
      // packages often only contain files and no directories. Global PAX headers (g)
      // are ignored as they don't carry per-file names.
      let name = longName
      if (name == null) {
        // Get file name from header (from offset 0, 100 bytes)
        name = readString(buffer, decoder, offset, 100)
        // In the ustar format, longer paths are split with the leading directories
        // stored in the prefix field (from offset 345, 155 bytes). Check the magic
        // (from offset 257, 6 bytes) as GNU tar uses this area for other fields.
        if (read(buffer, decoder, offset + 257, 6) === 'ustar\0') {
          const prefix = readString(buffer, decoder, offset + 345, 155)
          if (prefix) name = prefix + '/' + name
        }
      }

      // Get file content from header (from offset 512, `size` bytes)
      const data = new Uint8Array(buffer, offset + 512, size)

      files.push({ name, data })
    }

    // An extended header only applies to the entry directly after it
    if (type !== 'x' && type !== 'L') longName = undefined

    // Skip header and file content (padded to 512 bytes)
    offset += 512 + Math.ceil(size / 512) * 512
  }

  return files
}

/**
 * Parse the `path` record from PAX extended header data. Records are formatted
 * as "<length> <key>=<value>\n", where <length> is the byte length of the record.
 * @param {ArrayBuffer} buffer
 * @param {TextDecoder} decoder
 * @param {number} offset
 * @param {number} size
 * @returns {string | undefined}
 */
function parsePaxPath(buffer, decoder, offset, size) {
  const bytes = new Uint8Array(buffer, offset, size)
  /** @type {string | undefined} */
  let path
  let i = 0
  while (i < bytes.length) {
    const space = bytes.indexOf(0x20, i)
    if (space === -1) break
    const length = parseInt(decoder.decode(bytes.subarray(i, space)), 10)
    if (!(length > 0)) break
    // Exclude the trailing newline
    const record = decoder.decode(bytes.subarray(space + 1, i + length - 1))
    const eq = record.indexOf('=')
    if (eq !== -1 && record.slice(0, eq) === 'path') path = record.slice(eq + 1)
    i += length
  }
  return path
}

/**
 * Read a NUL-terminated string field
 * @param {ArrayBuffer} buffer
 * @param {TextDecoder} decoder
 * @param {number} offset
 * @param {number} length
 */
function readString(buffer, decoder, offset, length) {
  return read(buffer, decoder, offset, length).split('\0', 1)[0]
}

/**
 * @param {ArrayBuffer} buffer
 * @param {TextDecoder} decoder
 * @param {number} offset
 * @param {number} length
 */
function read(buffer, decoder, offset, length) {
  const view = new Uint8Array(buffer, offset, length)
  return decoder.decode(view)
}

/**
 * @param {import('../index.d.ts').TarballFile[]} files
 */
export function getFilesRootDir(files) {
  return files.length ? files[0].name.split('/')[0] : 'package'
}
