export default {
  'package.json': JSON.stringify({
    name: 'publint-engines-node-missing',
    version: '0.0.1',
    type: 'commonjs',
    exports: {
      node: './index.cjs',
      default: './index.js',
    },
  }),
  'index.cjs': 'module.exports = {}',
  'index.js': 'export default {}',
}
