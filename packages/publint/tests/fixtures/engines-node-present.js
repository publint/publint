export default {
  'package.json': JSON.stringify({
    name: 'publint-engines-node-present',
    version: '0.0.1',
    type: 'commonjs',
    exports: {
      node: './index.cjs',
      default: './index.js',
    },
    engines: {
      node: '>=18',
    },
  }),
  'index.cjs': 'module.exports = {}',
  'index.js': 'export default {}',
}
