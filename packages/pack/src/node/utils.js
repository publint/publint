import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'

/**
 * @param {string} packageManager
 * @returns {string[]}
 */
export function resolvePackageManagerCommand(packageManager) {
  if (!['npm', 'yarn', 'pnpm', 'bun'].includes(packageManager)) {
    throw new Error(`Unsupported package manager: ${packageManager}`)
  }
  // NOTE: Maybe consider using tinyexec if this isn't robust
  const command = [packageManager]
  if (packageManager === 'bun') {
    command.push('pm')
  }
  return command
}

export async function getTempPackDir() {
  const tempDir = os.tmpdir() + path.sep
  const tempPackDir = await fs.mkdtemp(tempDir + 'publint-pack-')
  return await fs.realpath(tempPackDir)
}
