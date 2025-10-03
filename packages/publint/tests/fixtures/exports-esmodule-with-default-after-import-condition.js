export default {
  'package.json': JSON.stringify({
    name: 'publint-exports-esmodule-with-default-after-import-condition',
    version: '0.0.1',
    private: true,
    type: 'commonjs',
    main: './lib.js',
    exports: {
      '.': {
        import: './lib.mjs',
        default: './lib.js',
      },
    },
  }),
  'lib.mjs': `
export default megalodon_1.default;
`,
  'lib.js': `
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = megalodon_1.default;
`,
}
