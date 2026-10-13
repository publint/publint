import fs from 'node:fs/promises'
import { afterEach, describe, test, vi } from 'vitest'
import { createFixture } from 'fs-fixture'
import { exec } from 'tinyexec'
import { pack } from '../src/node/pack.js'
import { unpack } from '../src/node/unpack.js'
import { packAsListWithJson, packAsListWithPack } from '../src/node/pack-as-list.js'
import { isBunInstalled, setupCorepackAndTestHooks } from './utils.js'

const isCI = process.env.CI !== undefined
// For some very weird reason, package manager binaries with corepack do not work
// on Windows, except yarn. All `exec()` calls just hang. Gave up after 4 hours.
const isWindowsCI = isCI && process.platform === 'win32'

const doesntSupportIgnoreScripts = (/** @type {string} */ pm) => pm.startsWith('yarn')

const defaultPackageJsonData = {
  name: 'test-package',
  version: '1.0.0',
  private: true,
}

// NOTE: npm tests are only run in CI because corepack npm support can delete your
// local npm installation. https://github.com/nodejs/corepack/issues/112
const packageManagers = /** @type {string[]} */ (
  [
    'empty',
    isCI && 'npm@9.9.4',
    isCI && 'npm@10.9.9',
    isCI && 'npm@11.19.0',
    isCI && 'npm@12.0.2',
    'yarn@3.8.7',
    'yarn@4.18.0',
    'pnpm@8.15.9',
    'pnpm@9.15.9',
    'pnpm@10.34.5',
    'pnpm@11.22.0',
    'pnpm@12.0.0',
    'bun',
  ].filter(Boolean)
)

await setupCorepackAndTestHooks()

/**
 * @param {import('fs-fixture').FsFixture} fixture
 * @param {string | undefined} fallbackPackageManager
 * @param {string} strategy
 * @param {boolean} ignoreScripts
 * @param {import('vitest').ExpectStatic} expect
 */
async function packlistWithFixture(
  fixture,
  fallbackPackageManager,
  strategy,
  ignoreScripts,
  expect,
) {
  const pkgJson = await fixture.readFile('package.json', 'utf8')
  const packageManager = JSON.parse(pkgJson).packageManager

  try {
    if (packageManager) {
      const [name, version] = packageManager.split('@')
      const { stdout } = await exec(name, ['--version'], { nodeOptions: { cwd: fixture.path } })
      expect(stdout.trim()).toEqual(version)
    }

    const packAsList = strategy === 'json' ? packAsListWithJson : packAsListWithPack
    const pm = packageManager?.split('@')[0] ?? fallbackPackageManager ?? 'npm'

    return await packAsList(fixture.path, pm, ignoreScripts)
  } finally {
    await fixture.rm()
  }
}

// NOTE: only test recent package manager releases
for (const pm of packageManagers) {
  if (pm === 'bun' && process.env.CI === undefined && !(await isBunInstalled())) {
    console.info('Skipping bun tests because bun is not installed.')
    continue
  }

  const packageManagerValue = pm === 'empty' || pm === 'bun' ? {} : { packageManager: pm }

  for (const strategy of ['json', 'pack']) {
    if (strategy === 'json' && (pm === 'pnpm@8.15.9' || pm === 'bun')) {
      // Skip this test because `pack --json` is not supported in pnpm v8
      continue
    }

    // Other package manager can be detected via `package.json` `packageManager` field
    const fallbackPackageManager = pm === 'bun' ? 'bun' : undefined
    /** @type {import('vitest').TestOptions} */
    const testOpts = { concurrent: true, timeout: process.env.CI ? 8000 : 5000 }

    test.skipIf(isWindowsCI)(
      `packlist - ${pm} / ${strategy} / no-files`,
      testOpts,
      async ({ expect }) => {
        const fixture = await createFixture({
          'package.json': JSON.stringify({
            ...defaultPackageJsonData,
            ...packageManagerValue,
          }),
          'a.js': '',
        })

        const list = await packlistWithFixture(
          fixture,
          fallbackPackageManager,
          strategy,
          false,
          expect,
        )
        expect(list.sort()).toEqual(['a.js', 'package.json'])
      },
    )

    test.skipIf(isWindowsCI)(
      `packlist - ${pm} / ${strategy} / with-files`,
      testOpts,
      async ({ expect }) => {
        const fixture = await createFixture({
          'package.json': JSON.stringify({
            ...defaultPackageJsonData,
            ...packageManagerValue,
            files: ['a.js'],
          }),
          'a.js': '',
          'b.js': '',
        })

        const list = await packlistWithFixture(
          fixture,
          fallbackPackageManager,
          strategy,
          false,
          expect,
        )
        expect(list.sort()).toEqual(['a.js', 'package.json'])
      },
    )

    test.skipIf(isWindowsCI)(
      `packlist - ${pm} / ${strategy} / with-files-and-glob`,
      testOpts,
      async ({ expect }) => {
        // Bun packs this wrongly
        if (pm === 'bun') return

        const fixture = await createFixture({
          'package.json': JSON.stringify({
            ...defaultPackageJsonData,
            ...packageManagerValue,
            files: ['dir', '!dir/b.js'],
          }),
          'dir/a.js': '',
          'dir/b.js': '',
        })

        const list = await packlistWithFixture(
          fixture,
          fallbackPackageManager,
          strategy,
          false,
          expect,
        )
        expect(list.sort()).toEqual(['dir/a.js', 'package.json'])
      },
    )

    test.skipIf(isWindowsCI || doesntSupportIgnoreScripts(pm))(
      `packlist - ${pm} / ${strategy} / ignore-scripts-true`,
      testOpts,
      async ({ expect }) => {
        const fixture = await createFixture({
          'package.json': JSON.stringify({
            ...defaultPackageJsonData,
            ...packageManagerValue,
            scripts: {
              prepack: "node -e \"require('fs').writeFileSync('prepack.js', '')\"",
            },
          }),
          'a.js': '',
        })

        const list = await packlistWithFixture(
          fixture,
          fallbackPackageManager,
          strategy,
          true,
          expect,
        )
        // NOTE: for some reason the below `exists` check is always false, even if prepack script
        // is run. But the next expect should still verify that prepack.js is not packed.
        expect(await fixture.exists('prepack.js')).toBe(false)
        expect(list.sort()).toEqual(['a.js', 'package.json'])
      },
    )

    test.skipIf(isWindowsCI || doesntSupportIgnoreScripts(pm))(
      `packlist - ${pm} / ${strategy} / ignore-scripts-false`,
      testOpts,
      async ({ expect }) => {
        const fixture = await createFixture({
          'package.json': JSON.stringify({
            ...defaultPackageJsonData,
            ...packageManagerValue,
            scripts: {
              prepack: "node -e \"require('fs').writeFileSync('prepack.js', '')\"",
            },
          }),
          'a.js': '',
        })

        const list = await packlistWithFixture(
          fixture,
          fallbackPackageManager,
          strategy,
          false,
          expect,
        )
        expect(list.sort()).toEqual(['a.js', 'package.json', 'prepack.js'])
      },
    )
  }
}

// Keep environment changes separate from the concurrent package manager tests above.
describe('npm pack with dry-run configured', { concurrent: false }, () => {
  afterEach(() => vi.unstubAllEnvs())

  const npmPackageManagers = isCI
    ? packageManagers.filter((pm) => pm.startsWith('npm@'))
    : [undefined]

  for (const packageManager of npmPackageManagers) {
    for (const config of [
      'unset',
      'false',
      'lowercase',
      'uppercase',
      'npmrc',
      'scripts',
      'failed-script',
    ]) {
      test.skipIf(isWindowsCI)(`${packageManager ?? 'npm'} / ${config}`, async ({ expect }) => {
        vi.stubEnv(
          'npm_config_dry_run',
          ['lowercase', 'scripts', 'failed-script'].includes(config) ? 'true' : undefined,
        )
        vi.stubEnv('NPM_CONFIG_DRY_RUN', config === 'uppercase' ? 'true' : undefined)
        if (config === 'false') vi.stubEnv('npm_config_dry_run', 'false')
        const originalLowercase = process.env.npm_config_dry_run
        const originalUppercase = process.env.NPM_CONFIG_DRY_RUN
        const fixture = await createFixture({
          'package.json': JSON.stringify({
            ...defaultPackageJsonData,
            ...(packageManager ? { packageManager } : {}),
            scripts: {
              prepack:
                config === 'failed-script'
                  ? 'node -e "process.exit(1)"'
                  : "node -e \"require('fs').writeFileSync('prepack.js', '')\"",
            },
          }),
          'a.js': 'export const value = 42\n',
          ...(config === 'npmrc' ? { '.npmrc': 'dry-run=true\n' } : {}),
          destination: {},
        })
        try {
          if (packageManager) {
            const { stdout } = await exec('npm', ['--version'], {
              nodeOptions: { cwd: fixture.path },
            })
            expect(stdout.trim()).toBe(packageManager.split('@')[1])
          }
          const packing = pack(fixture.path, {
            packageManager: 'npm',
            destination: `${fixture.path}/destination`,
            ignoreScripts: !['scripts', 'failed-script'].includes(config),
          })
          if (config === 'failed-script') {
            await expect(packing).rejects.toThrow()
            expect(await fs.readdir(`${fixture.path}/destination`)).toEqual([])
          } else {
            const tarball = await packing
            const { files } = await unpack(await fs.readFile(tarball))
            const expectedFiles = ['package/a.js', 'package/package.json']
            if (config === 'scripts') expectedFiles.push('package/prepack.js')
            expect(files.map((file) => file.name).sort()).toEqual(expectedFiles.sort())
            expect(
              new TextDecoder().decode(files.find((file) => file.name === 'package/a.js')?.data),
            ).toBe('export const value = 42\n')
            expect(await fixture.exists('prepack.js')).toBe(config === 'scripts')
          }
          expect(process.env.npm_config_dry_run).toBe(originalLowercase)
          expect(process.env.NPM_CONFIG_DRY_RUN).toBe(originalUppercase)
        } finally {
          await fixture.rm()
        }
      })
    }
  }
})
