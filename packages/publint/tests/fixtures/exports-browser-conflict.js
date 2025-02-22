export default {
  'package.json': JSON.stringify({
    name: 'publint-exports-browser-conflict',
    version: '0.0.1',
    private: true,
    type: 'commonjs',
    browser: {
      './lib.server.js': './lib.browser.js',
    },
    exports: {
      '.': {
        worker: {
          import: './lib.server.js',
        },
        browser: {
          import: './lib.browser.js',
        },
        default: './lib.server.js',
      },
    },
  }),
  'lib.browser.js': '',
  'lib.server.js': '',
}
