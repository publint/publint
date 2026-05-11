export default {
  'package.json': JSON.stringify({
    name: 'publint-side-effects-present',
    version: '0.0.1',
    private: true,
    type: 'module',
    sideEffects: false,
    exports: {
      '.': {
        module: './main.mjs',
        default: './main.mjs',
      },
    },
  }),
  'main.mjs': "export const value = 'ok'",
}
