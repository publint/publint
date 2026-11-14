import path from 'node:path'
import { expect, onTestFinished, test } from 'vitest'
import { createFixture } from 'fs-fixture'
import {
  exportsGlob,
  getAdjacentDtsPath,
  getCodeFormat,
  isCodeCjs,
  isCodeEsm,
  isDeprecatedGitHubGitUrl,
  isFileContentLintable,
  isFilePathLintable,
  isGitUrl,
  isShorthandGitHubOrGitLabUrl,
  isShorthandRepositoryUrl,
  stripComments,
  hasEsModuleAndExportsDefault,
  normalizeTypesSubpath,
  matchTypesVersionsPattern,
  doesTypesVersionRangeMatchLatest,
} from '../src/shared/utils.js'
import { createNodeVfs } from '../src/node/vfs-node.js'
import { publint } from '../src/index-node.js'
import { formatMessage } from '../src/utils.js'

const cjsCode = [
  `require('bla')`,
  `function foo() { require('bla') }`,
  `module.exports = 'bla'`,
  `exports.foo = 'bla'`,
  `exports.default = 'bla'`,
  `Object.defineProperty(exports, 'foo', { value: 'bla' })`,
  `Object.defineProperties(exports, { foo: { value: 'bla' } })`,
  `Object.assign(exports, { foo: 'bla' })`,
]

const esmCode = [
  `import 'bla'`,
  `import foo from 'bla'`,
  `import { foo } from 'bla'`,
  `import { foo as bar } from 'bla'`,
  'export default "bla"',
  'export const foo = "bla"',
  'export function foo() { return "bla" }',
]

const isoCode = [`console.log('hello')`, `document.title = 'bla`]

test('isCodeCjs', () => {
  for (const code of cjsCode) {
    expect(isCodeCjs(code), code).toEqual(true)
  }
  for (const code of esmCode) {
    expect(isCodeCjs(code), code).toEqual(false)
  }
  for (const code of isoCode) {
    expect(isCodeCjs(code), code).toEqual(false)
  }
})

test('isCodeCjs', () => {
  for (const code of cjsCode) {
    expect(isCodeEsm(code), code).toEqual(false)
  }
  for (const code of esmCode) {
    expect(isCodeEsm(code), code).toEqual(true)
  }
  for (const code of isoCode) {
    expect(isCodeEsm(code), code).toEqual(false)
  }
})

test('isFilePathLintable', () => {
  expect(isFilePathLintable('foo.js')).toEqual(true)
  expect(isFilePathLintable('foo.mjs')).toEqual(true)
  expect(isFilePathLintable('foo.cjs')).toEqual(true)
  expect(isFilePathLintable('foo.test.js')).toEqual(true)
  expect(isFilePathLintable('foo.ts')).toEqual(false)
  expect(isFilePathLintable('foo.ts.js')).toEqual(true)
  expect(isFilePathLintable('foo.js.ts')).toEqual(false)
})

test('isFileContentLintable', () => {
  expect(isFileContentLintable(`console.log('foo')`)).toEqual(true)
  expect(isFileContentLintable(`//@flow\nfoo`)).toEqual(false)
  expect(isFileContentLintable(`// @flow\nfoo`)).toEqual(false)
  expect(isFileContentLintable(`// @flow strict\nfoo`)).toEqual(false)
  expect(isFileContentLintable(`'use strict';\n// @flow`)).toEqual(false)
  expect(isFileContentLintable(`/*@flow*/\nfoo`)).toEqual(false)
  expect(isFileContentLintable(`/* @flow */\nfoo`)).toEqual(false)
  expect(isFileContentLintable(`/* @flow strict */\nfoo`)).toEqual(false)
  expect(isFileContentLintable(`'use strict';\n/* @flow */`)).toEqual(false)
  expect(isFileContentLintable(`console.log('// @flow')`)).toEqual(true)
  expect(isFileContentLintable(`console.log('/* @flow */')`)).toEqual(true)
  expect(isFileContentLintable(`/** @flow */`)).toEqual(false)
  expect(
    isFileContentLintable(`
/**
 * @flow
 */`),
  ).toEqual(false)
})

test('getCodeFormat', () => {
  for (const code of cjsCode) {
    expect(getCodeFormat(code), code).toEqual('CJS')
  }
  for (const code of esmCode) {
    expect(getCodeFormat(code), code).toEqual('ESM')
  }
  for (const code of isoCode) {
    expect(getCodeFormat(code), code).toEqual('unknown')
  }
})

test('hasEsModuleAndExportsDefault', () => {
  expect(
    hasEsModuleAndExportsDefault(`
    exports.__esModule = true;
    exports.default = megalodon_1.default;
  `),
  ).toEqual(true)
  expect(
    hasEsModuleAndExportsDefault(`
    exports.__esModule = true;
    exports.default = exports
  `),
  ).toEqual(false)
  expect(
    hasEsModuleAndExportsDefault(`
    exports.__esModule = true;
    exports.default = exports;
  `),
  ).toEqual(false)
  expect(
    hasEsModuleAndExportsDefault(`
    exports.__esModule = true;
    const foo = 'foo';
    exports.foo = foo;
    exports.default = { foo };
  `),
  ).toEqual(false)
  expect(
    hasEsModuleAndExportsDefault(`
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = megalodon_1.default;
  `),
  ).toEqual(true)
  expect(
    hasEsModuleAndExportsDefault(`
    exports.__esModule = true;
  `),
  ).toEqual(false)
  expect(
    hasEsModuleAndExportsDefault(`
    exports.default = megalodon_1.default;
  `),
  ).toEqual(false)
  expect(
    hasEsModuleAndExportsDefault(`
    // Some comment
    exports.__esModule = true;
    /* another comment */
    exports.default = megalodon_1.default;
  `),
  ).toEqual(true)
  expect(
    hasEsModuleAndExportsDefault(`
    exports.__esModule=true;
    exports.default=megalodon_1.default;
  `),
  ).toEqual(true)
  expect(
    hasEsModuleAndExportsDefault(`
    exports.__esModule=true;
    exports["default"]=megalodon_1.default;
  `),
  ).toEqual(true)
  expect(
    hasEsModuleAndExportsDefault(`
    exports.__esModule=true;
    exports['default']=megalodon_1.default;
  `),
  ).toEqual(true)
  expect(
    hasEsModuleAndExportsDefault(`
    export default function foo() {}
  `),
  ).toEqual(false)
})

test('isGitUrl', () => {
  expect(isGitUrl('https://host.xz/path/to/repo.git/')).toEqual(true)
  expect(isGitUrl('http://host.xz/path/to/repo.git/')).toEqual(true)
  expect(isGitUrl('https://host.xz/path/to/repo.git')).toEqual(true)
  expect(isGitUrl('https://host.xz/~path/~to/~repo.git')).toEqual(true)
  expect(isGitUrl('https://subdomain.host.xz/path/to/repo.git')).toEqual(true)
  expect(isGitUrl('https://192.168.0.1/path/to/repo.git')).toEqual(true)
  expect(isGitUrl('https://192.168.0.1:1234/path/to/repo.git')).toEqual(true)
  expect(isGitUrl('http://host.xz/path/to/repo.git')).toEqual(true)
  expect(isGitUrl('git+https://host.xz/path/to/repo.git')).toEqual(true)
  expect(isGitUrl('git+https://host.xz/path/to/repo')).toEqual(true)
  expect(isGitUrl('https://host.xz/path/to/repo.git')).toEqual(true)
  expect(isGitUrl('git+ssh://git@host.xz/path/to/repo.git')).toEqual(true)
  expect(isGitUrl('git+ssh://git@host.xz/path/to/repo')).toEqual(true)
  expect(isGitUrl('git+ssh://git@host.xz:1234/path/to/repo')).toEqual(true)
  expect(isGitUrl('git+ssh://host.xz:1234/path/to/repo')).toEqual(true)
  expect(isGitUrl('git://host.xz/path/to/repo.git')).toEqual(true)
  expect(isGitUrl('git://host.xz/path/to/repo')).toEqual(true)
  expect(isGitUrl('ssh://git@host.xz/user/project.git')).toEqual(true)
  expect(isGitUrl('ssh://git@host.xz:user/project.git')).toEqual(true)
  expect(isGitUrl('git+ssh://git@host.xz/user/project.git')).toEqual(true)
  expect(isGitUrl('git+ssh://git@host.xz:user/project.git')).toEqual(true)
  expect(isGitUrl('git@github.com:user/project.git')).toEqual(true)

  expect(isGitUrl('file://host.xz/path/to/repo')).toEqual(false)
  expect(isGitUrl('/User/foo/bar')).toEqual(false)
})

test('isDeprecatedGitHubGitUrl', () => {
  expect(isDeprecatedGitHubGitUrl('git://github.com/user/project.git')).toEqual(true)
  expect(isDeprecatedGitHubGitUrl('https://github.com/user/project')).toEqual(false)
})

test('isShorthandGitHubOrGitLabUrl', () => {
  const f = isShorthandGitHubOrGitLabUrl // shorten to please prettier
  expect(f('https://github.com/user/project')).toEqual(true)
  expect(f('git+https://github.com/user/project')).toEqual(true)
  expect(f('https://github.com/user/project.git')).toEqual(true)
  expect(f('git@github.com:user/project.git')).toEqual(true)
  expect(f('https://gitlab.com/user/project')).toEqual(true)
  expect(f('git+https://gitlab.com/user/project')).toEqual(true)
  expect(f('https://gitlab.com/user/project.git')).toEqual(true)
  expect(f('git@gitlab.com:user/project.git')).toEqual(true)

  expect(f('https://bitbucket.com/user/project')).toEqual(false)
  expect(f('https://example.com')).toEqual(false)
})

test('isShortHandRepositoryUrl', () => {
  const f = isShorthandRepositoryUrl // shorten to please prettier
  expect(f('user/project')).toEqual(true)
  expect(f('github:user/project')).toEqual(true)
  expect(f('gist:11081aaa281')).toEqual(true)
  expect(f('bitbucket:user/project')).toEqual(true)
  expect(f('gitlab:user/project')).toEqual(true)

  expect(f('us-er/project')).toEqual(true)
  expect(f('user/pro-ject')).toEqual(true)
  expect(f('us.er/project')).toEqual(true)
  expect(f('user/pro.ject')).toEqual(true)
  expect(f('us.-er/pro.-ject')).toEqual(true)
  expect(f('github:us-er/project')).toEqual(true)
  expect(f('github:user/pro-ject')).toEqual(true)
  expect(f('github:us.er/project')).toEqual(true)
  expect(f('github:user/pro.ject')).toEqual(true)
  expect(f('github:us.-er/pro.-ject')).toEqual(true)

  expect(f('foobar')).toEqual(false)
  expect(f('https://github.com/user/project')).toEqual(false)
})

test('stripComments', () => {
  const result = stripComments(`
  // hello world
  /*
    mutli
        line
    // import {} from 'bla'
  */
 /**
  * jsdoc // comment
  */
  `).trim()
  expect(result).toEqual('')
})

test('exportsGlob', async () => {
  const fixturePath = path.resolve(process.cwd(), 'tests/fixtures/glob.js')
  const fixtureContent = (await import(fixturePath)).default
  const fixture = await createFixture(fixtureContent)
  onTestFinished(() => fixture.rm())

  const r = (/** @type {string} */ s) => fixture.getPath(s)
  const v = createNodeVfs()

  // prettier-ignore
  expect(await exportsGlob(r('./*.js'), v)).toEqual([r('alpha.js'), r('dual-extension/index.js')])
  // prettier-ignore
  expect(await exportsGlob(r('./*.mjs'), v)).toEqual([r('bravo.mjs'), r('dual-extension/index.mjs')])
  // prettier-ignore
  expect(await exportsGlob(r('./*.css'), v)).toEqual([r('charlie.css'), r('quebec/romeo.css')])
  // prettier-ignore
  expect(await exportsGlob(r('./*.json'), v)).toEqual([r('delta.json'), r('package.json')])
  expect(await exportsGlob(r('./*.cjs'), v)).toEqual([r('quebec/sierra.cjs')])
  // prettier-ignore
  expect(await exportsGlob(r('./quebec/*'), v)).toEqual([r('quebec/romeo.css'), r('quebec/sierra.cjs')])
  expect(await exportsGlob(r('./*lph*.js'), v)).toEqual([r('alpha.js')])
  // prettier-ignore
  expect(await exportsGlob(r('./qu*b*c/si*rra.cjs'), v)).toEqual([r('quebec/sierra.cjs')])
})

test('getAdjacentDtsPath', () => {
  expect(getAdjacentDtsPath('foo.js')).toEqual('foo.d.ts')
  expect(getAdjacentDtsPath('foo.mjs')).toEqual('foo.d.mts')
  expect(getAdjacentDtsPath('foo.cjs')).toEqual('foo.d.cts')
  expect(getAdjacentDtsPath('foo.jsx')).toEqual('foo.d.ts')
  expect(getAdjacentDtsPath('foo.test.js')).toEqual('foo.test.d.ts')
  expect(getAdjacentDtsPath('path/foo.js')).toEqual('path/foo.d.ts')
})

test('normalizeTypesSubpath', () => {
  expect(normalizeTypesSubpath('index.d.ts')).toEqual('index.d.ts')
  expect(normalizeTypesSubpath('./index.d.ts')).toEqual('index.d.ts')
  expect(normalizeTypesSubpath('./dist/types/index.d.ts')).toEqual('dist/types/index.d.ts')
  expect(normalizeTypesSubpath('dist/sub/../index.d.ts')).toEqual('dist/index.d.ts')
  expect(normalizeTypesSubpath('')).toEqual('index')
  expect(normalizeTypesSubpath('.')).toEqual('index')
  expect(normalizeTypesSubpath('./')).toEqual('index')
  expect(normalizeTypesSubpath('../outside.d.ts')).toEqual(undefined)
})

test('matchTypesVersionsPattern', () => {
  const versionPaths = {
    '*': ['dist/*'],
    'sub/*': ['dist/sub/*'],
    'sub/exact': ['dist/exact.d.ts'],
    '*.d.ts': ['dist/dts/*.d.ts'],
    'a*b*c': ['ignored'],
  }

  expect(matchTypesVersionsPattern(versionPaths, 'sub/exact')).toEqual({
    pattern: 'sub/exact',
    matchedStar: undefined,
    targets: ['dist/exact.d.ts'],
  })
  expect(matchTypesVersionsPattern(versionPaths, 'sub/foo')).toEqual({
    pattern: 'sub/*',
    matchedStar: 'foo',
    targets: ['dist/sub/*'],
  })
  expect(matchTypesVersionsPattern(versionPaths, 'index.d.ts')).toEqual({
    pattern: '*',
    matchedStar: 'index.d.ts',
    targets: ['dist/*'],
  })
  expect(matchTypesVersionsPattern({ ssr: ['./dist/ssr.d.ts'] }, 'index.d.ts')).toEqual(undefined)
})

test('doesTypesVersionRangeMatchLatest', () => {
  expect(doesTypesVersionRangeMatchLatest('*')).toEqual(true)
  expect(doesTypesVersionRangeMatchLatest('x')).toEqual(true)
  expect(doesTypesVersionRangeMatchLatest('>=4.0')).toEqual(true)
  expect(doesTypesVersionRangeMatchLatest('>= 4.0.0')).toEqual(true)
  expect(doesTypesVersionRangeMatchLatest('>3.5')).toEqual(true)
  expect(doesTypesVersionRangeMatchLatest('<3.8 || >=4.2')).toEqual(true)
  expect(doesTypesVersionRangeMatchLatest('3.1 - *')).toEqual(true)

  expect(doesTypesVersionRangeMatchLatest('<4.0')).toEqual(false)
  expect(doesTypesVersionRangeMatchLatest('<=3.9')).toEqual(false)
  expect(doesTypesVersionRangeMatchLatest('>3.1 <4.0')).toEqual(false)
  expect(doesTypesVersionRangeMatchLatest('3.1 - 3.9')).toEqual(false)
  expect(doesTypesVersionRangeMatchLatest('^4.0.0')).toEqual(false)
  expect(doesTypesVersionRangeMatchLatest('~3.8.0')).toEqual(false)
  expect(doesTypesVersionRangeMatchLatest('4.0')).toEqual(false)
  expect(doesTypesVersionRangeMatchLatest('invalid')).toEqual(false)
})

test('typesVersions resolution and validation', async () => {
  /**
   * @param {Record<string, string>} files
   */
  const runPackFiles = async (files) => {
    const pkg = JSON.parse(files['package.json'])
    const pack = {
      files: Object.entries(files).map(([name, data]) => ({
        name: `package/${name}`,
        data,
      })),
    }
    const result = await publint({ pkgDir: 'package', pack, level: 'suggestion' })
    return {
      pkg,
      messages: result.messages,
      formatted: result.messages.map((m) => formatMessage(m, pkg, { color: false })),
    }
  }

  // 1. Empty typesVersions should still check types existence
  {
    const { messages } = await runPackFiles({
      'package.json': JSON.stringify({
        name: 'empty-tv',
        version: '1.0.0',
        type: 'module',
        types: './main.d.ts',
        typesVersions: {},
      }),
    })
    expect(messages).toEqual([
      { code: 'FILE_DOES_NOT_EXIST', args: {}, path: ['types'], type: 'error' },
    ])
  }

  // 2. Remapped types that double-prefixes path (faker #1966)
  {
    const { messages, formatted } = await runPackFiles({
      'package.json': JSON.stringify({
        name: 'double-prefix',
        version: '1.0.0',
        type: 'module',
        types: 'dist/types/index.d.ts',
        typesVersions: {
          '>=4.0': { '*': ['dist/types/*'] },
        },
      }),
      'dist/types/index.d.ts': 'export {};\n',
    })
    expect(messages).toEqual([
      {
        code: 'FILE_DOES_NOT_EXIST',
        args: { resolvedFilePaths: ['dist/types/dist/types/index.d.ts'] },
        path: ['types'],
        type: 'error',
      },
    ])
    expect(formatted).toEqual([
      'pkg.types is dist/types/index.d.ts (resolved as dist/types/dist/types/index.d.ts via pkg.typesVersions) but the file does not exist.',
    ])
  }

  // 3. Downlevel `<4.0` typesVersions still checks modern unmapped `types`, and supports fallback arrays
  {
    const { messages: validMsgs } = await runPackFiles({
      'package.json': JSON.stringify({
        name: 'downlevel-valid',
        version: '1.0.0',
        type: 'module',
        types: './helper.d.ts',
        typesVersions: {
          '<4.0': { '*': ['ts3.8/*', '*'] },
        },
      }),
      'ts3.8/only-old.d.ts': 'export {};\n',
      'helper.d.ts': 'export {};\n',
    })
    expect(validMsgs).toEqual([])

    const { messages: missingModernMsgs } = await runPackFiles({
      'package.json': JSON.stringify({
        name: 'downlevel-missing-modern',
        version: '1.0.0',
        type: 'module',
        types: './index.d.ts',
        typesVersions: {
          '<4.0': { '*': ['./ts3.8/*'] },
        },
      }),
      'ts3.8/index.d.ts': 'export {};\n',
    })
    expect(missingModernMsgs).toEqual([
      { code: 'FILE_DOES_NOT_EXIST', args: {}, path: ['types'], type: 'error' },
    ])
  }

  // 4. Extensionless glob targets & invalid typesVersions field value types
  {
    const { messages: extlessMsgs } = await runPackFiles({
      'package.json': JSON.stringify({
        name: 'extless-glob',
        version: '1.0.0',
        type: 'module',
        typesVersions: {
          '*': { 'components/*': ['dist/components/*/index'] },
        },
      }),
      'dist/components/Button/index.d.ts': 'export {};\n',
    })
    expect(extlessMsgs).toEqual([])

    const { messages: invalidMsgs } = await runPackFiles({
      'package.json': JSON.stringify({
        name: 'invalid-tv',
        version: '1.0.0',
        type: 'module',
        typesVersions: {
          '>=4.0': 'bad',
          '*': {
            foo: './not-an-array.d.ts',
            bar: [123],
          },
        },
      }),
    })
    expect(invalidMsgs).toEqual([
      {
        code: 'FIELD_INVALID_VALUE_TYPE',
        args: { actualType: 'string', expectTypes: ['object'] },
        path: ['typesVersions', '>=4.0'],
        type: 'error',
      },
      {
        code: 'FIELD_INVALID_VALUE_TYPE',
        args: { actualType: 'string', expectTypes: ['array'] },
        path: ['typesVersions', '*', 'foo'],
        type: 'error',
      },
      {
        code: 'FIELD_INVALID_VALUE_TYPE',
        args: { actualType: 'number', expectTypes: ['string'] },
        path: ['typesVersions', '*', 'bar', '0'],
        type: 'error',
      },
    ])
  }

  // 5. TYPES_NOT_EXPORTED uses typesVersions-resolved path when suggesting exports.types
  {
    const { messages, formatted } = await runPackFiles({
      'package.json': JSON.stringify({
        name: 'types-not-exported-tv',
        version: '1.0.0',
        type: 'module',
        sideEffects: false,
        types: 'index.d.ts',
        typesVersions: {
          '>=4.0': { '*': ['dist/types/*'] },
        },
        exports: {
          '.': {
            import: './dist/esm/index.mjs',
          },
        },
      }),
      'dist/types/index.d.ts': 'export declare const x: number;\n',
      'dist/esm/index.mjs': 'export const x = 1;\n',
    })
    expect(messages).toEqual([
      {
        code: 'TYPES_NOT_EXPORTED',
        args: {
          typesFilePath: 'dist/types/index.d.ts',
          actualExtension: undefined,
          expectExtension: undefined,
        },
        path: ['exports', '.', 'import'],
        type: 'warning',
      },
    ])
    expect(formatted[0]).toContain('"./dist/types/index.d.ts"')
  }
})
