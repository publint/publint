export default {
  'package.json': JSON.stringify({
    name: 'publint-types-exports-resolution-partial-environments',
    version: '0.0.1',
    private: true,
    type: 'module',
    types: './generic.d.ts',
    exports: {
      '.': {
        node: {
          import: {
            types: './node.d.ts',
            default: './node.js',
          },
          require: {
            default: './node.cjs',
          },
        },
        browser: {
          import: {
            types: './browser.d.ts',
            default: './browser.js',
          },
          require: {
            default: './browser.cjs',
          },
        },
        deno: {
          import: {
            types: './deno.d.ts',
            default: './deno.js',
          },
          require: {
            default: './deno.cjs',
          },
        },
      },
    },
  }),
  'browser.d.ts': '',
  'browser.cjs': '',
  'browser.js': '',
  'deno.d.ts': '',
  'deno.cjs': '',
  'deno.js': '',
  'generic.d.ts': '',
  'node.d.ts': '',
  'node.cjs': '',
  'node.js': '',
}
