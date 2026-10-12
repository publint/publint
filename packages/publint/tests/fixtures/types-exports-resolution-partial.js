export default {
  'package.json': JSON.stringify({
    name: 'publint-types-exports-resolution-partial',
    version: '0.0.1',
    private: true,
    type: 'module',
    exports: {
      '.': {
        import: {
          types: './main.d.ts',
          default: './main.js',
        },
        require: {
          default: './main.cjs',
        },
      },
    },
  }),
  'main.d.ts': '',
  'main.cjs': '',
  'main.js': '',
}
