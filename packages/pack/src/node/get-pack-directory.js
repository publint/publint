import fs from 'node:fs/promises'
import path from 'node:path'

/** @type {import('../index.d.ts').getPackDirectory} */
export async function getPackDirectory(dir, packageManager) {
  if (packageManager === 'pnpm') {
    // pnpm respects `publishConfig.directory` field in `package.json`
    try {
      const pkgJsonPath = path.resolve(dir, 'package.json')
      const pkgJsonData = JSON.parse(await fs.readFile(pkgJsonPath, 'utf-8'))
      if (pkgJsonData.publishConfig?.directory) {
        return path.resolve(dir, pkgJsonData.publishConfig.directory)
      }
    } catch {
      // Ignore errors in case `package.json` is malformed or anything
    }
  }

  // All other package managers don't support changing the packed directory
  return dir
}
