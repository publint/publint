export default {
  'package.json': JSON.stringify({
    name: 'publint-publish-config-directory',
    version: '0.0.1',
    private: true,
    exports: './missing.js',
    publishConfig: {
      directory: './build',
    },
  }),
  'build/index.js': '',
  'build/package.json': JSON.stringify({
    name: 'publint-publish-config-directory-build',
    version: '0.0.1',
    private: true,
    type: 'commonjs',
    exports: './index.js',
  }),
}
