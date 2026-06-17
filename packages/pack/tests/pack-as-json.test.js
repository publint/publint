import { expect, test } from 'vitest'
import { packAsJson } from '../src/node/pack-as-json.js'

test('error on unknown package manager', async () => {
  await expect(packAsJson('.', { packageManager: /** @type {any} */ ('unknown') })).rejects.toThrow(
    'Unsupported package manager: unknown',
  )
})
