import {
  arrayBufferToReadableStream,
  readableStreamToArrayBuffer,
} from '../shared/buffer-stream.js'
import { getFilesRootDir, parseTar } from '../shared/parse-tar.js'

/** @type {import('../index.d.ts').unpack} */
export async function unpack(tarball) {
  const stream = tarball instanceof ReadableStream ? tarball : arrayBufferToReadableStream(tarball)
  const buffer = await readableStreamToArrayBuffer(
    // @ts-expect-error not dealing with this issue for now
    stream.pipeThrough(new DecompressionStream('gzip')),
  )
  const files = parseTar(buffer)
  const rootDir = getFilesRootDir(files)
  return { files, rootDir }
}
