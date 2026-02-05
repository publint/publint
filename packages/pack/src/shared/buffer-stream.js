/**
 * @param {Uint8Array} uint8array
 * @returns {ReadableStream<Uint8Array>}
 */
export function uint8ArrayToReadableStream(uint8array) {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(uint8array)
      controller.close()
    },
  })
}

/**
 * @param {ArrayBuffer} arrayBuffer
 * @returns {ReadableStream<Uint8Array>}
 */
export function arrayBufferToReadableStream(arrayBuffer) {
  return new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(arrayBuffer))
      controller.close()
    },
  })
}

/**
 * @param {ReadableStream<Uint8Array>} readableStream
 * @returns {Promise<ArrayBuffer>}
 */
export async function readableStreamToArrayBuffer(readableStream) {
  return await new Response(readableStream).arrayBuffer()
}
