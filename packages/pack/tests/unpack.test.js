import { assert, beforeAll, describe, expect, test } from 'vitest'
import { unpack as browserUnpack } from '../src/browser/unpack.js'
import { unpack as nodeUnpack } from '../src/node/unpack.js'

const testTarballUrl = 'https://registry.npmjs.org/@publint/pack/-/pack-0.1.3.tgz'

/** @type {Response} */
let tarballResponse

beforeAll(async () => {
  tarballResponse = await fetch(testTarballUrl)
})

describe('browser unpack', () => {
  const unpack = browserUnpack

  test('with readable stream', async () => {
    const tarball = tarballResponse.clone().body
    assert(tarball)
    const result = await unpack(tarball)
    expect(result.files.length).toBeGreaterThan(0)
  })

  test('with array buffer', async () => {
    const tarball = await tarballResponse.clone().arrayBuffer()
    const result = await unpack(tarball)
    expect(result.files.length).toBeGreaterThan(0)
  })

  test('with uint8array', async () => {
    const cloned = tarballResponse.clone()
    if (cloned.bytes == null) return // Works in Node.js 22.3+ only
    const tarball = await cloned.bytes()
    const result = await unpack(tarball)
    expect(result.files.length).toBeGreaterThan(0)
  })
})

describe('node unpack', () => {
  const unpack = nodeUnpack

  test('with readable stream', async () => {
    const tarball = tarballResponse.clone().body
    assert(tarball)
    const result = await unpack(tarball)
    expect(result.files.length).toBeGreaterThan(0)
  })

  test('with array buffer', async () => {
    const tarball = await tarballResponse.clone().arrayBuffer()
    const result = await unpack(tarball)
    expect(result.files.length).toBeGreaterThan(0)
  })

  test('with uint8array', async () => {
    const cloned = tarballResponse.clone()
    if (cloned.bytes == null) return // Works in Node.js 22.3+ only
    const tarball = await cloned.bytes()
    const result = await unpack(tarball)
    expect(result.files.length).toBeGreaterThan(0)
  })
})
