import { describe, expect, test } from 'vitest'
import { parseTar } from '../src/shared/parse-tar.js'

const encoder = new TextEncoder()

/**
 * @param {{ name: string, type?: string, prefix?: string, magic?: string, data?: Uint8Array }} entry
 */
function header({ name, type = '0', prefix = '', magic = 'ustar\0', data = new Uint8Array() }) {
  const block = new Uint8Array(512)
  block.set(encoder.encode(name), 0)
  block.set(encoder.encode(data.length.toString(8).padStart(11, '0') + '\0'), 124)
  block.set(encoder.encode(type), 156)
  block.set(encoder.encode(magic), 257)
  block.set(encoder.encode(prefix), 345)
  const content = new Uint8Array(Math.ceil(data.length / 512) * 512)
  content.set(data)
  return [block, content]
}

/**
 * @param {Record<string, string>} records
 */
function paxData(records) {
  const parts = Object.entries(records).map(([key, value]) => {
    const body = ` ${key}=${value}\n`
    const bodyLength = encoder.encode(body).length
    let length = bodyLength + 1
    while (String(length).length + bodyLength !== length) length++
    return length + body
  })
  return encoder.encode(parts.join(''))
}

/**
 * @param {Uint8Array[][]} entries
 */
function tar(entries) {
  const blocks = [...entries.flat(), new Uint8Array(1024)]
  const out = new Uint8Array(blocks.reduce((n, b) => n + b.length, 0))
  let offset = 0
  for (const b of blocks) {
    out.set(b, offset)
    offset += b.length
  }
  return out.buffer
}

/**
 * @param {ArrayBuffer} buffer
 */
function parse(buffer) {
  return parseTar(buffer).map((f) => ({
    name: f.name,
    data: new TextDecoder().decode(f.data),
  }))
}

const longDir = `package/dist/${'a'.repeat(60)}/${'b'.repeat(60)}`
const longFile = `package/dist/${'c'.repeat(120)}.js`

describe('parseTar', () => {
  test('reads short names', () => {
    const buffer = tar([header({ name: 'package/index.js', data: encoder.encode('x') })])
    expect(parse(buffer)).toEqual([{ name: 'package/index.js', data: 'x' }])
  })

  test('joins the ustar prefix field with the name field', () => {
    const buffer = tar([header({ name: 'index.js', prefix: longDir, data: encoder.encode('x') })])
    expect(parse(buffer)).toEqual([{ name: `${longDir}/index.js`, data: 'x' }])
  })

  test('ignores the prefix area without the ustar magic', () => {
    // GNU tar stores other fields where ustar has the prefix
    const buffer = tar([header({ name: 'package/index.js', prefix: 'junk', magic: 'ustar  \0' })])
    expect(parse(buffer).map((f) => f.name)).toEqual(['package/index.js'])
  })

  test('uses the PAX path record for the next entry only', () => {
    const buffer = tar([
      header({
        name: 'PaxHeader',
        type: 'x',
        data: paxData({ mtime: '0', path: longFile }),
      }),
      // pnpm writes a placeholder name here
      header({ name: 'PaxHeader', data: encoder.encode('long') }),
      header({ name: 'package/package.json', data: encoder.encode('{}') }),
    ])
    expect(parse(buffer)).toEqual([
      { name: longFile, data: 'long' },
      { name: 'package/package.json', data: '{}' },
    ])
  })

  test('reads multi-byte PAX paths by byte length', () => {
    const name = `package/${'ł'.repeat(60)}/${'ż'.repeat(10)}.js`
    const buffer = tar([
      header({ name: 'PaxHeader', type: 'x', data: paxData({ path: name, uid: '1' }) }),
      header({ name: 'truncated' }),
    ])
    expect(parse(buffer).map((f) => f.name)).toEqual([name])
  })

  test('ignores PAX headers without a path record', () => {
    const buffer = tar([
      header({ name: 'PaxHeader', type: 'x', data: paxData({ mtime: '0' }) }),
      header({ name: 'package/index.js', prefix: 'ignored-without-magic', magic: '' }),
    ])
    expect(parse(buffer).map((f) => f.name)).toEqual(['package/index.js'])
  })

  test('uses GNU long name headers', () => {
    const buffer = tar([
      header({ name: '././@LongLink', type: 'L', data: encoder.encode(longFile + '\0') }),
      header({ name: longFile.slice(0, 100), data: encoder.encode('long') }),
      header({ name: 'package/index.js' }),
    ])
    expect(parse(buffer).map((f) => f.name)).toEqual([longFile, 'package/index.js'])
  })
})
