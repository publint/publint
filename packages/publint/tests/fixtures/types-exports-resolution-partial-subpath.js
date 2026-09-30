export default {
  'package.json': JSON.stringify({
    name: 'publint-types-exports-resolution-partial-subpath',
    version: '0.0.1',
    private: true,
    type: 'module',
    types: './main.d.ts',
    exports: {
      '.': {
        types: './main.d.ts',
        default: './main.js',
      },
      './feature': {
        import: {
          types: './feature.d.ts',
          default: './feature.js',
        },
        require: {
          default: './feature.cjs',
        },
      },
      './adjacent': {
        import: {
          types: './adjacent.d.ts',
          default: './adjacent.js',
        },
        require: {
          default: './adjacent.cjs',
        },
      },
      './untyped': {
        import: './untyped.js',
        require: './untyped.cjs',
      },
    },
  }),
  'adjacent.d.cts': '',
  'adjacent.d.ts': '',
  'adjacent.cjs': '',
  'adjacent.js': '',
  'feature.d.ts': '',
  'feature.cjs': '',
  'feature.js': '',
  'main.d.ts': '',
  'main.js': '',
  'untyped.cjs': '',
  'untyped.js': '',
}
