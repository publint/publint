export default {
  'package.json': JSON.stringify({
    name: 'publint-engines-node-missing-no-node-condition',
    version: '0.0.1',
    type: 'module',
    exports: {
      default: './index.js',
    },
  }),
  'index.js': 'export default {}',
}
