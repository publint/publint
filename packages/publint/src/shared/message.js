import picocolors from 'picocolors'
import {
  formatMessagePath as fp,
  getPkgPathValue,
  replaceLast,
} from './utils.js'

/** @type {import('../utils.d.ts').formatMessage} */
export function formatMessage(m, pkg, opts = {}) {
  const h = getHighlighter(opts.color)
  /** @param {string[]} path */
  const pv = (path) => {
    try {
      return String(getPkgPathValue(pkg, path))
    } catch {
      return 'undefined'
    }
  }

  switch (m.code) {
    case 'IMPLICIT_INDEX_JS_INVALID_FORMAT':
      return `index.js should be ${m.args.expectFormat} but it is ${m.args.actualFormat}`
    case 'FILE_INVALID_FORMAT': {
      const relativePath = m.args.actualFilePath ?? pv(m.path)
      let start = ''
      if (opts.reference || m.path[0] === 'name') {
        start = h.bold(relativePath)
      } else {
        const is = pv(m.path).includes('*') ? 'matches' : 'is'
        start = `${h.bold(fp(m.path))} ${is} ${h.bold(relativePath)} and`
      }
      return `${start} is written in ${h.warn(m.args.actualFormat)}, but is interpreted as ${h.warn(m.args.expectFormat)}. Consider using the ${h.warn(m.args.expectExtension)} extension, e.g. ${h.bold(replaceLast(relativePath, '.js', m.args.expectExtension))}`
    }
    case 'FILE_INVALID_EXPLICIT_FORMAT': {
      const relativePath = m.args.actualFilePath ?? pv(m.path)
      let start = ''
      if (opts.reference || m.path[0] === 'name') {
        start = h.bold(relativePath)
      } else {
        const is = pv(m.path).includes('*') ? 'matches' : 'is'
        start = `${h.bold(fp(m.path))} ${is} ${h.bold(relativePath)} and`
      }
      return `${start} ends with the ${h.warn(m.args.actualExtension)} extension, but the code is written in ${h.warn(m.args.actualFormat)}. Consider using the ${h.warn(m.args.expectExtension)} extension, e.g. ${h.bold(replaceLast(relativePath, m.args.actualExtension, m.args.expectExtension))}`
    }
    case 'FILE_INVALID_JSX_EXTENSION': {
      const relativePath = m.args.globbedFilePath ?? pv(m.path)
      let start = ''
      if (opts.reference || m.path[0] === 'name') {
        start = h.bold(relativePath)
      } else {
        const is = m.args.globbedFilePath ? 'matches' : 'is'
        start = `${h.bold(fp(m.path))} ${is} ${h.bold(relativePath)} and`
      }
      return `${start} uses an invalid ${h.bold(m.args.actualExtension)} extension. You don't need to split ESM and CJS formats for JSX. You should write a single file in ESM with the ${h.bold('.jsx')} extension instead, e.g. ${h.bold(replaceLast(pv(m.path), m.args.actualExtension, '.jsx'))}`
    }
    case 'FILE_DOES_NOT_EXIST':
      if (opts.reference) {
        return `File does not exist`
      } else {
        return `${h.bold(fp(m.path))} is ${h.bold(pv(m.path))} but the file does not exist.`
      }
    case 'FILE_NOT_PUBLISHED':
      if (opts.reference) {
        return `File is not published. Is it specified in ${h.bold('pkg.files')}?`
      } else {
        return `${h.bold(fp(m.path))} is ${h.bold(pv(m.path))} but the file is not published. Is it specified in ${h.bold('pkg.files')}?`
      }
    case 'HAS_ESM_MAIN_BUT_NO_EXPORTS':
      return `${h.bold('pkg.main')} is an ESM file, but it is usually better to use ${h.bold('pkg.exports')} instead. If you don't support Node.js 12.6 and below, you can also remove ${h.bold('pkg.main')}. (This will be a breaking change)`
    case 'HAS_MODULE_BUT_NO_EXPORTS':
      return `${h.bold('pkg.module')} is used to output ESM, but ${h.bold('pkg.exports')} is not defined. As Node.js doesn't read ${h.bold('pkg.module')}, the ESM output may be skipped. Consider adding ${h.bold('pkg.exports')} to export the ESM output. ${h.bold('pkg.module')} can usually be removed alongside too. (This will be a breaking change)`
    case 'MODULE_SHOULD_BE_ESM':
    case 'EXPORTS_MODULE_SHOULD_BE_ESM':
    case 'IMPORTS_MODULE_SHOULD_BE_ESM': {
      const start = opts.reference ? 'Should' : `${h.bold(fp(m.path))} should`
      return `${start} be ESM, but the code is written in CJS.`
    }
    case 'EXPORTS_GLOB_NO_MATCHED_FILES':
    case 'IMPORTS_GLOB_NO_MATCHED_FILES': {
      const start = opts.reference
        ? 'Does'
        : `${h.bold(fp(m.path))} is ${h.bold(pv(m.path))} but does`
      return `${start} not match any files.`
    }
    case 'EXPORTS_GLOB_NO_DEPRECATED_SUBPATH_MAPPING':
    case 'IMPORTS_GLOB_NO_DEPRECATED_SUBPATH_MAPPING':
      return `${h.bold(fp(m.path))} maps to a path that ends with ${h.bold('/')} which is deprecated. Use ${h.bold(fp(m.args.expectPath))}: "${h.bold(m.args.expectValue)}" instead.`
    case 'EXPORTS_TYPES_SHOULD_BE_FIRST': {
      const start = opts.reference ? 'Should' : `${h.bold(fp(m.path))} should`
      return `${start} be the first in the object as conditions are order-sensitive so it can be resolved by TypeScript.`
    }
    case 'EXPORTS_MODULE_SHOULD_PRECEDE_REQUIRE':
    case 'IMPORTS_MODULE_SHOULD_PRECEDE_REQUIRE': {
      const start = opts.reference ? 'Should' : `${h.bold(fp(m.path))} should`
      return `${start} come before the "require" condition so it can take precedence when used by a bundler.`
    }
    case 'EXPORTS_DEFAULT_SHOULD_BE_LAST':
    case 'IMPORTS_DEFAULT_SHOULD_BE_LAST': {
      const start = opts.reference ? 'Should' : `${h.bold(fp(m.path))} should`
      return `${start} be the last in the object so it doesn't take precedence over the keys following it.`
    }
    case 'EXPORTS_VALUE_INVALID':
    case 'IMPORTS_VALUE_INVALID': {
      const start = opts.reference
        ? h.bold(pv(m.path))
        : `${h.bold(fp(m.path))} is ${h.bold(pv(m.path))} but`
      return `${start} is invalid as it does not start with "${h.bold('./')}". Use ${h.bold(m.args.suggestValue)} instead.`
    }
    case 'EXPORTS_MISSING_ROOT_ENTRYPOINT': {
      const mainField = m.args.mainFields[0]
      const start = opts.reference
        ? 'The root entrypoint is missing'
        : `${h.bold(fp(m.path))} is missing the root entrypoint export`
      return `${start}, which is defined in ${h.bold('pkg.' + mainField)}. Environments that support the ${h.bold('"exports"')} field will ignore ${h.bold('pkg.' + mainField)} as ${h.bold('"exports"')} takes the highest priority. Consider adding ${h.bold(fp(m.path.concat('.')))}: "${h.bold(pv([mainField]))}".`
    }
    case 'USE_EXPORTS_BROWSER':
      return (
        `${h.bold('pkg.browser')} with a string value can be refactored to use ${h.bold('pkg.exports')} and the ${h.bold('"browser"')} condition to declare browser-specific exports. ` +
        `e.g. ${h.bold('pkg.exports["."].browser')}: "${h.bold(pv(m.path))}". (This will be a breaking change)`
      )
    case 'USE_EXPORTS_OR_IMPORTS_BROWSER':
      return `${h.bold('pkg.browser')} with an object value can be refactored to use ${h.bold('pkg.exports')}/${h.bold('pkg.imports')} and the ${h.bold('"browser"')} condition to declare browser-specific exports. (This will be a breaking change)`
    case 'USE_FILES':
      return `The package ${h.bold('publishes internal tests or config files')}. You can use ${h.bold('pkg.files')} to only publish certain files and save user bandwidth.`
    case 'USE_TYPE':
      return `The package does not specify the ${h.bold('"type"')} field. Node.js may attempt to detect the package type causing a small performance hit. Consider adding ${h.bold('"type"')}: "${h.bold('commonjs')}".`
    case 'USE_LICENSE':
      return `The package does not specify the ${h.bold('"license"')} field but a license file was detected at ${h.bold(m.args.licenseFilePath)}. Consider adding a ${h.bold('"license"')} field so it's displayed on npm.`
    case 'TYPES_NOT_EXPORTED': {
      const typesFilePath = exportsRel(m.args.typesFilePath)
      const start = opts.reference ? 'The' : h.bold(fp(m.path))
      if (m.args.actualExtension && m.args.expectExtension) {
        return (
          `${start} types is not exported. Consider adding ${h.bold(fp(m.path) + '.types')} to be compatible with TypeScript's ${h.bold('"moduleResolution": "bundler"')} compiler option. ` +
          `Note that you cannot use "${h.bold(typesFilePath)}" because it has a mismatching format. Instead, you can duplicate the file and use the ${h.bold(m.args.expectExtension)} extension, e.g. ` +
          `${h.bold(fp(m.path) + '.types')}: "${h.bold(replaceLast(typesFilePath, m.args.actualExtension, m.args.expectExtension))}"`
        )
      } else {
        return `${start} types is not exported. Consider adding ${h.bold(fp(m.path) + '.types')}: "${h.bold(typesFilePath)}" to be compatible with TypeScript's ${h.bold('"moduleResolution": "bundler"')} compiler option.`
      }
    }
    case 'EXPORTS_TYPES_INVALID_FORMAT': {
      let additionalMessage = ''
      // ambiguous default export
      if (m.args.expectFormat === 'ESM' && m.args.actualFormat === 'CJS') {
        additionalMessage = `This causes the types to be ambiguous when default importing the package due to its implied interop. `
      }
      // incorrect dynamic import restriction
      else if (m.args.expectFormat === 'CJS' && m.args.actualFormat === 'ESM') {
        additionalMessage = `This causes the types to only work when dynamically importing the package, even though the package exports CJS. `
      }
      const start = opts.reference ? 'The' : h.bold(fp(m.path))
      return (
        `${start} types is interpreted as ${m.args.actualFormat} when resolving with the "${h.bold(m.args.condition)}" condition. ` +
        additionalMessage +
        `Consider splitting out two ${h.bold('"types"')} conditions for ${h.bold('"import"')} and ${h.bold('"require"')}, and use the ${h.warn(m.args.expectExtension)} extension, ` +
        `e.g. ${h.bold(fp(m.args.expectPath))}: "${h.bold(replaceLast(pv(m.path), m.args.actualExtension, m.args.expectExtension))}"`
      )
    }
    case 'FIELD_INVALID_VALUE_TYPE': {
      let expectStr = m.args.expectTypes[0]
      for (let i = 1; i < m.args.expectTypes.length; i++) {
        if (i === m.args.expectTypes.length - 1) {
          expectStr += ` or ${m.args.expectTypes[i]}`
        } else {
          expectStr += `, ${m.args.expectTypes[i]}`
        }
      }
      const start = opts.reference
        ? 'The field value has'
        : `${h.bold(fp(m.path))} is ${h.bold(pv(m.path))} which is`
      return `${start} an invalid ${h.bold(m.args.actualType)} type. Expected a ${h.bold(expectStr)} type instead.`
    }
    case 'EXPORTS_VALUE_CONFLICTS_WITH_BROWSER': {
      const start = opts.reference
        ? `${h.bold(pv(m.path))} matches`
        : `${h.bold(fp(m.path))} is ${h.bold(pv(m.path))} which also matches`
      return `${start} ${h.bold(fp(m.args.browserPath))}: "${h.bold(pv(m.args.browserPath))}", which overrides the path when building the library with the "${h.bold(m.args.browserishCondition)}" condition. This is usually unintentional and may cause build issues. Consider using a different file name for ${h.bold(pv(m.path))}.`
    }
    case 'DEPRECATED_FIELD_JSNEXT':
      return `${h.bold(fp(m.path))} is deprecated. ${h.bold('pkg.module')} should be used instead.`
    case 'INVALID_REPOSITORY_VALUE':
      switch (m.args.type) {
        case 'invalid-string-shorthand': {
          const start = opts.reference
            ? 'The field value'
            : `${h.bold(fp(m.path))} is ${h.bold(pv(m.path))} which`
          return `${start} isn't a valid shorthand value supported by npm. Consider using an object that references a repository.`
        }
        case 'invalid-git-url': {
          const start = opts.reference
            ? 'The field value'
            : `${h.bold(fp(m.path))} is ${h.bold(pv(m.path))} which`
          return `${start} isn't a valid git URL. A valid git URL is usually in the form of "${h.bold('git+https://example.com/user/repo.git')}".`
        }
        case 'deprecated-github-git-protocol': {
          const start = opts.reference
            ? 'The field value'
            : `${h.bold(fp(m.path))} is ${h.bold(pv(m.path))} which`
          return `${start} uses the git:// protocol that is deprecated by GitHub due to security concerns. Consider replacing the protocol with https://.`
        }
        case 'shorthand-git-sites': {
          const start = opts.reference
            ? 'The field value'
            : `${h.bold(fp(m.path))} is ${h.bold(pv(m.path))} but`
          return `${start} could be a full git URL like "${h.bold(m.args.suggestValue)}".`
        }
      }
    case 'LOCAL_DEPENDENCY':
      if (opts.reference) {
        return `This dependency references a local package that will likely not work when installed by end-users.`
      } else {
        return `The "${h.bold(m.path[m.path.length - 1])}" dependency references "${h.bold(pv(m.path))}" that will likely not work when installed by end-users.`
      }
    case 'BIN_FILE_NOT_EXECUTABLE': {
      const start = opts.reference
        ? 'This bin file'
        : `${h.bold(fp(m.path))} is ${h.bold(pv(m.path))} but the file`
      return `${start} is not executable. It should start with a shebang, e.g. ${h.bold('#!/usr/bin/env node')}.`
    }
    case 'IMPORTS_KEY_INVALID':
      const start = opts.reference
        ? `The imports key is invalid as it`
        : `${h.bold(fp(m.path))} is invalid as the imports key`
      return `${start} does not start with "${h.bold('#')}". Use ${h.bold(m.args.suggestKey)} instead.`
    default:
      return
  }
}

/** @type { import('picocolors/types.js').Colors | undefined } */
let _picocolorsWithForcedColor

/**
 * @param {import('../utils.js').FormatMessageOptions['color']} color
 */
function getHighlighter(color) {
  /** @type {(s: string) => string} */
  let bold
  /** @type {(s: string) => string} */
  let warn

  switch (color) {
    case 'html':
      bold = (s) => `<strong>${s}</strong>`
      warn = (s) => `<strong>${s}</strong>`
      break
    case true:
      _picocolorsWithForcedColor ??= picocolors.createColors(true)
      // @ts-expect-error
      bold = (s) => _picocolorsWithForcedColor.bold(s)
      // @ts-expect-error
      warn = (s) => _picocolorsWithForcedColor.yellow(s)
      break
    case false:
      bold = (s) => s
      warn = (s) => s
      break
    default:
      bold = (s) => picocolors.bold(s)
      warn = (s) => picocolors.yellow(s)
      break
  }

  return { bold, warn }
}

/**
 * Make sure s is an `"exports"` compatible relative path
 * @param {string} s
 */
function exportsRel(s) {
  if (s[0] === '.') return s
  if (s[0] === '/') return '.' + s
  return './' + s
}
