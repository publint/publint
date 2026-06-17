import { expect, test } from 'vitest'
import { pack } from '../src/node/pack.js'

test('error on unknown package manager', async () => {
  await expect(pack('.', { packageManager: /** @type {any} */ ('unknown') })).rejects.toThrow(
    'Unsupported package manager: unknown',
  )
})
