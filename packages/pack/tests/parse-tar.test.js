import { describe, expect, test } from 'vitest'
import { getFilesRootDir, parseTar } from '../src/shared/parse-tar.js'

const encoder = new TextEncoder()
const decoder = new TextDecoder()

/**
 * Builds a tar archive in-memory so the header bytes can be varied directly.
 * @param {{ name: string, content: string }[]} files
 * @param {string} typeflag the type written at offset 156. '0' is the POSIX ustar
 *   form written by npm and pnpm 11, '\0' the pre-POSIX form written by pnpm 12.
 */
function createTar(files, typeflag) {
  const blocks = []

  for (const file of files) {
    const content = encoder.encode(file.content)
    const header = new Uint8Array(512)

    header.set(encoder.encode(file.name), 0)
    header.set(encoder.encode('000644 \0'), 100) // mode
    header.set(encoder.encode(content.byteLength.toString(8).padStart(11, '0') + ' '), 124) // size
    header.set(encoder.encode('00000000000 '), 136) // mtime
    header.set(encoder.encode(typeflag), 156)
    header.set(encoder.encode('ustar\0' + '00'), 257) // magic + version

    // The checksum is computed with its own field read as spaces, then written
    // back as octal.
    header.set(encoder.encode('        '), 148)
    const sum = header.reduce((total, byte) => total + byte, 0)
    header.set(encoder.encode(sum.toString(8).padStart(6, '0') + '\0 '), 148)

    const padded = new Uint8Array(Math.ceil(content.byteLength / 512) * 512)
    padded.set(content, 0)

    blocks.push(header, padded)
  }

  // End-of-archive marker: two zero-filled blocks.
  blocks.push(new Uint8Array(1024))

  const total = blocks.reduce((size, block) => size + block.byteLength, 0)
  const tar = new Uint8Array(total)
  let offset = 0
  for (const block of blocks) {
    tar.set(block, offset)
    offset += block.byteLength
  }
  return tar.buffer
}

const files = [
  { name: 'package/package.json', content: '{ "name": "test" }' },
  { name: 'package/index.js', content: 'export default 1\n' },
]

describe('parseTar', () => {
  // '0' and '\0' both mean a regular file. POSIX.1-2017 says a typeflag of binary
  // zero "should be recognized as meaning a regular file when extracting files
  // from the archive"; GNU tar calls it AREGTYPE. npm and pnpm 11 write '0',
  // pnpm 12 writes '\0'.
  for (const [label, typeflag] of [
    ['regular file type', '0'],
    ['pre-POSIX regular file type', '\0'],
  ]) {
    test(`parses files with the ${label}`, () => {
      const parsed = parseTar(createTar(files, typeflag))

      expect(parsed.map((file) => file.name)).toEqual(['package/package.json', 'package/index.js'])
      expect(decoder.decode(parsed[0].data)).toBe('{ "name": "test" }')
      expect(getFilesRootDir(parsed)).toBe('package')
    })
  }

  test('stops at the end-of-archive marker', () => {
    const tar = createTar(files, '0')
    const trailing = new Uint8Array(tar.byteLength + 512)
    trailing.set(new Uint8Array(tar), 0)
    // Anything after the marker is not part of the archive.
    trailing.set(encoder.encode('package/extra.js'), tar.byteLength)

    expect(parseTar(trailing.buffer)).toHaveLength(2)
  })
})
