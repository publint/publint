export default {
  'package.json': JSON.stringify({
    name: 'publint-exports-import-condition-only-resolvable',
    version: '0.0.1',
    private: true,
    type: 'module',
    exports: {
      // dual published, `require` resolves to the CJS output
      '.': {
        types: './lib/index.d.ts',
        import: './lib/index.js',
        require: './lib/index.cjs',
      },
      // ESM only, but `require` resolves through the "default" condition
      './default': {
        types: './lib/index.d.ts',
        default: './lib/index.js',
      },
      // the "node" condition is matched before the "import" condition is reached
      './node': {
        node: './lib/index.js',
        import: './lib/index.js',
      },
      // `require` backtracks to the outer "default" once the "node" branch misses
      './nested-fallback': {
        node: {
          import: './lib/index.js',
        },
        default: './lib/index.js',
      },
      // Node.js also matches "module-sync" when requiring
      './module-sync': {
        'module-sync': './lib/index.js',
        import: './lib/index.js',
      },
      // `require` is deliberately blocked by the package author
      './blocked': {
        import: './lib/index.js',
        require: null,
      },
      // not a JavaScript file, so there is nothing to require
      './styles.css': {
        import: './lib/styles.css',
      },
      // a plain string value resolves for every condition
      './string': './lib/index.js',
    },
    engines: {
      node: '>=20',
    },
  }),
  'lib/index.js': "export const foo = 'bar'",
  'lib/index.cjs': "module.exports = 'bar'",
  'lib/index.d.ts': 'export declare const foo: string',
  'lib/styles.css': '.foo { color: red }',
}
