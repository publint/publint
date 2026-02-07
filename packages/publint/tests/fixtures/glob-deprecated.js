export default {
  'package.json': JSON.stringify({
    name: 'publint-glob-deprecated',
    version: '0.0.1',
    private: true,
    type: 'commonjs',
    imports: {
      '#dep': './src/',
    },
    exports: {
      './': './src/',
      './conditions/': {
        import: './src/conditions/import/',
        require: './src/conditions/require/',
      },
    },
  }),
}
