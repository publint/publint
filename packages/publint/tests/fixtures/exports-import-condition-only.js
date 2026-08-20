export default {
  'package.json': JSON.stringify({
    name: 'publint-exports-import-condition-only',
    version: '0.0.1',
    private: true,
    type: 'module',
    exports: {
      '.': {
        types: './lib/index.d.ts',
        import: './lib/index.js',
      },
      './utils': {
        types: './lib/utils.d.ts',
        import: './lib/utils.js',
      },
      // the "import" condition is nested, so `require` misses the "node" branch entirely
      './node-only': {
        node: {
          import: './lib/index.js',
        },
      },
    },
    engines: {
      node: '>=20',
    },
  }),
  'lib/index.js': "export const foo = 'bar'",
  'lib/index.d.ts': 'export declare const foo: string',
  'lib/utils.js': "export const util = 'util'",
  'lib/utils.d.ts': 'export declare const util: string',
}
