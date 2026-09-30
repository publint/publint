export default {
  'package.json': JSON.stringify({
    name: 'publint-types-exports-resolution-partial-shared-condition',
    version: '0.0.1',
    private: true,
    type: 'module',
    exports: {
      '.': {
        node: {
          import: {
            types: './node.d.ts',
            default: './node.js',
          },
        },
        browser: {
          import: {
            types: './browser.d.ts',
            default: './browser.js',
          },
        },
        require: {
          default: './shared.cjs',
        },
      },
    },
  }),
  'browser.d.ts': '',
  'browser.js': '',
  'node.d.ts': '',
  'node.js': '',
  'shared.cjs': '',
}
