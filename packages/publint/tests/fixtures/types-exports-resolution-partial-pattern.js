export default {
  'package.json': JSON.stringify({
    name: 'publint-types-exports-resolution-partial-pattern',
    version: '0.0.1',
    private: true,
    type: 'module',
    exports: {
      './*': {
        import: {
          types: './lib/*.d.ts',
          default: './lib/*.js',
        },
        require: {
          default: './lib/*.cjs',
        },
      },
    },
  }),
  lib: {
    'feature.d.cts': '',
    'feature.d.ts': '',
    'feature.cjs': '',
    'feature.js': '',
    nested: {
      'package.json': JSON.stringify({ type: 'commonjs' }),
      'other.d.ts': '',
      'other.cjs': '',
      'other.js': '',
    },
  },
}
