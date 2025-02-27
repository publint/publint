export default {
  'package.json': JSON.stringify({
    name: 'publint-imports-external-package',
    version: '0.0.1',
    private: true,
    type: 'commonjs',
    imports: {
      '#dep': {
        node: 'dep-node-native',
        default: './dep-polyfill.js',
      },
      '#fs': {
        node: 'node:fs',
        default: './fs-polyfill.js',
      },
    },
    dependencies: {
      'dep-node-native': '^1.0.0',
    },
  }),
  'dep-polyfill.js': '',
  'fs-polyfill.js': '',
}
