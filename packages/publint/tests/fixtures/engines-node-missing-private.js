export default {
  'package.json': JSON.stringify({
    name: 'publint-engines-node-missing-private',
    version: '0.0.1',
    private: true,
    type: 'commonjs',
    exports: {
      node: './index.cjs',
      default: './index.js',
    },
  }),
  'index.cjs': 'module.exports = {}',
  'index.js': 'export default {}',
}
