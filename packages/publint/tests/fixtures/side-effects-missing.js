export default {
  'package.json': JSON.stringify({
    name: 'publint-side-effects-missing',
    version: '0.0.1',
    private: true,
    type: 'module',
    exports: {
      '.': {
        module: './main.mjs',
        default: './main.mjs',
      },
    },
  }),
  'main.mjs': "export const value = 'ok'",
}
