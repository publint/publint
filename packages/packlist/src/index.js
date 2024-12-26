import { guessPackageManager } from './package-manager.js'
import { packlistWithJson } from './packlist-with-json.js'
import { packlistWithPack } from './packlist-with-pack.js'

/** @type {import('../index').packlist} */
export async function packlist(dir, opts) {
  const packageManager =
    opts?.packageManager == null || opts.packageManager === 'auto'
      ? guessPackageManager(dir)
      : opts.packageManager

  switch (opts?.strategy) {
    case 'json':
      return await packlistWithJson(dir, packageManager)
    case 'pack':
      return await packlistWithPack(dir, packageManager)
    default:
      try {
        return await packlistWithJson(dir, packageManager)
      } catch {
        return await packlistWithPack(dir, packageManager)
      }
  }
}
