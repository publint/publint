export function pack() {
  throw new Error('`pack` is not supported in the browser')
}

export function packAsList() {
  throw new Error('`packAsList` is not supported in the browser')
}

export function packAsJson() {
  throw new Error('`packAsJson` is not supported in the browser')
}

export function getPackDirectory() {
  throw new Error('`getPackDirectory` is not supported in the browser')
}

export { unpack } from './browser/unpack.js'
