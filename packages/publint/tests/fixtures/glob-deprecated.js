export default {
  'package.json': JSON.stringify({
    name: 'publint-glob-deprecated',
    version: '0.0.1',
    private: true,
    type: 'commonjs',
    exports: {
      './': './src/',
    },
  }),
}