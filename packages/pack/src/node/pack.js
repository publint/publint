import fs from 'node:fs/promises'
import path from 'node:path'
import { exec } from 'tinyexec'
import { resolvePackageManagerCommand } from './utils.js'

/** @type {import('../index.d.ts').pack} */
export async function pack(dir, opts) {
  const packageManager = opts?.packageManager ?? 'npm'

  const command = resolvePackageManagerCommand(packageManager)
  command.push('pack')

  // Handle tarball output
  const packDestination = opts?.destination ?? dir
  if (opts?.destination) {
    switch (packageManager) {
      case 'yarn':
        command.push('--out', path.join(packDestination, 'package.tgz'))
        break
      case 'bun':
        command.push('--destination', packDestination)
        break
      default:
        command.push('--pack-destination', packDestination)
        break
    }
  }

  // Handle ignore-scripts
  if (opts?.ignoreScripts) {
    switch (packageManager) {
      case 'pnpm':
        command.push('--config.ignore-scripts=true')
        break
      case 'yarn':
        // yarn does not support ignoring scripts
        break
      default:
        command.push('--ignore-scripts')
        break
    }
  }

  const output = await exec(command[0], command.slice(1), { nodeOptions: { cwd: dir } })

  // Get first file that ends with `.tgz` in the pack destination.
  // Also double-check against stdout as usually the package manager also prints
  // the tarball file name there, in case the directory has existing tarballs.
  const tarballFile = await fs.readdir(packDestination).then((files) => {
    return files.find((file) => file.endsWith('.tgz') && output.stdout.includes(file))
  })
  if (!tarballFile) {
    if (output.stdout.startsWith('yarn pack v1')) {
      throw new Error(
        `Yarn 1 is not supported to pack files. Command output:\n${JSON.stringify(output, null, 2)}`,
      )
    } else {
      throw new Error(
        `Failed to find packed tarball file in ${packDestination}. Command output:\n${JSON.stringify(output, null, 2)}`,
      )
    }
  }

  return path.join(packDestination, tarballFile)
}
