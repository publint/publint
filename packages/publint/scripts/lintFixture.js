import fs from 'node:fs/promises'
import path from 'node:path'
import cp from 'node:child_process'
import { fileURLToPath } from 'node:url'
import prompts from 'prompts'
import { createFixture } from 'fs-fixture'

// Files and directories
const cliPath = fileURLToPath(new URL('../src/cli.js', import.meta.url))
const fixturesDir = fileURLToPath(new URL('../tests/fixtures/', import.meta.url))
const fixtureFiles = (await fs.readdir(fixturesDir)).filter((file) => file.endsWith('.js'))

// Prompt user for fixture
const hasSpecifiedFixtureFile = fixtureFiles.includes(process.argv[2] + '.js')
const selectedFixtureFile = hasSpecifiedFixtureFile
  ? process.argv[2] + '.js'
  : (
      await prompts({
        type: 'select',
        name: 'selectedFixtureFile',
        message: 'Select a fixture to lint',
        choices: fixtureFiles.map((file) => ({
          title: file.slice(0, -3),
          value: file,
        })),
      })
    ).selectedFixtureFile

// Create fixture
const fixturePath = path.resolve(fixturesDir, selectedFixtureFile)
const fixtureContent = (await import(fixturePath)).default
const fixture = await createFixture(fixtureContent)

// Lint
try {
  const args = process.argv.slice(hasSpecifiedFixtureFile ? 3 : 2)
  const lintProcess = cp.spawn('node', [cliPath, ...args], {
    cwd: fixture.path,
    stdio: 'inherit',
  })

  await new Promise((resolve, reject) => {
    lintProcess.on('exit', resolve)
    lintProcess.on('error', reject)
  })
} finally {
  await fixture.rm()
}
