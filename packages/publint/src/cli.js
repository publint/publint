#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import { createRequire } from 'node:module'
import sade from 'sade'
import c from 'picocolors'
import { publint } from './index-node.js'
import { formatMessage } from './shared/message.js'

const version = createRequire(import.meta.url)('../package.json').version
const cli = sade('publint', false)
  .version(version)
  .option('--level', `Level of messages to log ('suggestion' | 'warning' | 'error')`, 'suggestion')
  .option(
    '--pack',
    `Package manager to use for packing ('auto' | 'npm' | 'yarn' | 'pnpm' | 'bun' | false)`,
    'auto',
  )
  .option('--strict', `Report warnings as errors`, false)

cli
  .command('run [path]', 'Lint a directory or tarball file path (defaults to current directory)', {
    default: true,
  })
  .action(async (runPath, opts) => {
    opts = normalizeOpts(opts)

    // If a path is passed, see if it's a path to a file (likely the tarball file)
    let isTarballFilePassed = false
    if (runPath) {
      const stat = await fs.stat(runPath).catch(() => {})
      isTarballFilePassed = !!stat?.isFile()
    }

    /** @type {string | undefined} */
    let pkgDir
    /** @type {string} */
    let pkgName
    // CLI-specific feature allowing a tarball path to be loaded directly
    if (isTarballFilePassed) {
      try {
        const nodeBuffer = await fs.readFile(runPath)
        opts.pack = {
          tarball: nodeBuffer.buffer.slice(
            nodeBuffer.byteOffset,
            nodeBuffer.byteOffset + nodeBuffer.byteLength,
          ),
        }
      } catch (err) {
        console.log(c.red(`Unable to unpack the tarball at ${runPath}: `) + err)
        process.exit(1)
      }
      pkgName = runPath
      // `pkgDir` is unset so that core will infer the correct dir when unpacking itself
    }
    // Lint from the filesystem
    else {
      pkgDir = runPath ? path.resolve(runPath) : process.cwd()
      const pkg = await getPackageJson(pkgDir).catch(() => {
        console.log(c.red(`Unable to read package.json at ${pkgDir}`))
        process.exit(1)
      })
      pkgName = pkg.pkgName
    }

    console.log(`Running ${c.bold(`publint v${version}`)} for ${c.bold(pkgName)}...`)

    const { messages, pkg } = await publint({
      pkgDir,
      level: opts.level,
      strict: opts.strict,
      pack: opts.pack,
      // @ts-expect-error internal property to log packing progress
      _log: true,
    })
    if (messages.length === 0) {
      console.log(c.bold(c.green('All good!')))
    } else {
      formatMessages(messages, pkg).forEach((l) => console.log(l))
    }
  })

if (!process.env.PUBLINT_INTERNAL_SKIP_CLI_RUN) {
  cli.parse(process.argv)
}

/**
 * @param {string} pkgDir
 */
async function getPackageJson(pkgDir) {
  const pkgJsonPath = path.join(pkgDir, 'package.json')
  const rootPkgContent = await fs.readFile(pkgJsonPath, 'utf8')
  const pkgJson = JSON.parse(rootPkgContent)
  /** @type {string} */
  const pkgName = pkgJson.name || path.basename(pkgDir)
  return { pkgName, pkgJson }
}

/**
 *
 * @param {import('./index.d.ts').Message[]} messages
 * @param {any} pkgJson
 */
function formatMessages(messages, pkgJson) {
  /** @type {string[]} */
  const logs = []

  const errors = messages.filter((v) => v.type === 'error')
  if (errors.length) {
    logs.push(c.bold(c.red('Errors:')))
    errors.forEach((m, i) => logs.push(c.dim(`${i + 1}. `) + formatMessage(m, pkgJson)))
    process.exitCode = 1
  }

  const warnings = messages.filter((v) => v.type === 'warning')
  if (warnings.length) {
    logs.push(c.bold(c.yellow('Warnings:')))
    warnings.forEach((m, i) => logs.push(c.dim(`${i + 1}. `) + formatMessage(m, pkgJson)))
  }

  const suggestions = messages.filter((v) => v.type === 'suggestion')
  if (suggestions.length) {
    logs.push(c.bold(c.blue('Suggestions:')))
    suggestions.forEach((m, i) => logs.push(c.dim(`${i + 1}. `) + formatMessage(m, pkgJson)))
  }

  return logs
}

/**
 * @param {any} opts
 */
function normalizeOpts(opts) {
  if (opts.pack === 'false') opts.pack = false
  return opts
}
