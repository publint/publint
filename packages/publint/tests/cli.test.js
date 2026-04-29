import path from 'node:path'
import cp from 'node:child_process'
import util from 'node:util'
import { describe, expect, onTestFinished, test } from 'vitest'
import { createFixture } from 'fs-fixture'

const cliPath = path.resolve(import.meta.dirname, '../src/cli.js')
const exec = util.promisify(cp.exec)

/**
 * @param {string} cwd
 * @param {string} command
 */
async function runCliProcess(cwd, command = '') {
  let { stdout, stderr } = await exec(`node "${cliPath}" ${command}`, {
    cwd,
    env: {
      ...process.env,
      NO_COLOR: '1',
      PUBLINT_INTERNAL_SKIP_CLI_RUN: undefined,
    },
  })
  stdout = stdout.replace(/v\d+\.\d+\.\d+/g, 'v0.0.0')
  return { stdout, stderr }
}

describe('publint run [path]', () => {
  test('basic', async () => {
    const fixture = await createFixture({
      'package.json': JSON.stringify({
        name: 'test',
        version: '0.0.1',
        private: true,
        type: 'module',
      }),
    })
    onTestFinished(() => fixture.rm())

    const { stdout, stderr } = await runCliProcess(fixture.path)

    expect(stdout).toMatchInlineSnapshot(`
      "Running publint v0.0.0 for test...
      Packing files with \`npm pack\`...
      Linting...
      All good!
      "
    `)
    expect(stderr).toMatchInlineSnapshot(`""`)
  })
})

describe('publint deps [dir]', () => {
  test('basic', async () => {
    const fixture = await createFixture({
      'package.json': JSON.stringify({
        name: 'test',
        version: '0.0.1',
        private: true,
        type: 'module',
      }),
    })
    onTestFinished(() => fixture.rm())

    const { stdout, stderr } = await runCliProcess(fixture.path, 'deps')

    expect(stdout).toMatchInlineSnapshot(`
      "The \`publint deps\` command is deprecated. You can use a different tool to run \`publint\` in dependencies instead. e.g. \`npx renoma --filter-rules "publint"\`
      Running publint v0.0.0 for test deps...
      No dependencies found
      "
    `)
    expect(stderr).toMatchInlineSnapshot(`""`)
  })
})
