export default {
  'package.json': JSON.stringify({
    name: 'publint-nested-package-json',
    version: '0.0.1',
    private: true,
    type: 'module',
    exports: {
      '.': './dist/index.js',
    },
  }),
  'dist/index.js': "export const foo = 'bar'",
  'dist/package.json': JSON.stringify({
    type: 'module',
    exports: {
      '.': './index.js',
    },
    imports: {
      '#util': './util.js',
    },
  }),
  'dist/util.js': "export const util = 'util'",
}
