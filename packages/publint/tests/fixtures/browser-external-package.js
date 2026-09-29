export default {
  'package.json': JSON.stringify({
    name: 'publint-browser-external-package',
    version: '0.0.1',
    private: true,
    type: 'commonjs',
    main: './index.js',
    sideEffects: false,
    browser: {
      './server.js': './client.js',
      'dep/cjs/index.js': 'dep/esm/index.js',
    },
    dependencies: {
      dep: '^1.0.0',
    },
  }),
  'index.js': '',
  'server.js': '',
  'client.js': '',
}
