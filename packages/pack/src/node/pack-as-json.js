import fs from 'node:fs/promises'
import { exec } from 'tinyexec'
import { getTempPackDir, resolvePackageManagerCommand } from './utils.js'

/** @type {import('../index.d.ts').packAsJson} */
export async function packAsJson(dir, opts) {
  const packageManager = opts?.packageManager ?? 'npm'
  if (packageManager === 'bun') {
    throw new Error('`packAsJson` is not supported for `bun`')
  }

  const command = resolvePackageManagerCommand(packageManager)
  command.push('pack', '--json')

  // Handle tarball output. Try `--dry-run` if possible to not output any tarball,
  // otherwise pack to a temporary directory and delete it later
  const supportsDryRun = packageManager === 'npm' || packageManager === 'yarn'
  /** @type {string | undefined} */
  let packDestination
  if (supportsDryRun) {
    command.push('--dry-run')
  } else {
    packDestination = await getTempPackDir()
    command.push('--pack-destination', packDestination)
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

  let { stdout } = await exec(command[0], command.slice(1), { nodeOptions: { cwd: dir } })

  try {
    stdout = stdout.trim()
    if (packageManager === 'pnpm') {
      stdout = fixPnpmStdout(stdout)
    } else if (packageManager === 'yarn') {
      stdout = fixYarnStdout(stdout)
    }
    return JSON.parse(stdout)
  } finally {
    if (!supportsDryRun && packDestination) {
      await fs.rm(packDestination, { recursive: true })
    }
  }
}

// pnpm outputs lifecycle script logs if not ignoring scripts
/**
 * @param {string} stdout
 */
function fixPnpmStdout(stdout) {
  // If starts with `{`, it's likely a valid JSON
  if (stdout.startsWith('{')) return stdout

  // Otherwise try to find its usual output format, `{\n  "name": ...`
  const usualStartIndex = /\{\s*"name"/.exec(stdout)?.index
  if (usualStartIndex != null) return stdout.slice(usualStartIndex)

  // Otherwise, simply try to find the first `{` character
  const firstBraceIndex = stdout.indexOf('{')
  if (firstBraceIndex !== -1) return stdout.slice(firstBraceIndex)

  // If all fails, return the original stdout
  return stdout
}

// yarn outputs invalid json for some reason
/**
 * @param {string} stdout
 */
function fixYarnStdout(stdout) {
  const lines = stdout.split('\n')
  // Combine lines as arrays
  let fixedStdout = '['
  for (const line of lines) {
    if (line) fixedStdout += line + ','
  }
  // Remove trailing slash
  if (fixedStdout[fixedStdout.length - 1] === ',') {
    fixedStdout = fixedStdout.slice(0, -1)
  }
  fixedStdout += ']'
  return fixedStdout
}
