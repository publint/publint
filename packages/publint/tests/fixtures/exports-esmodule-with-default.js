export default {
  'package.json': JSON.stringify({
    name: 'publint-exports-esmodule-with-default',
    version: '0.0.1',
    private: true,
    type: 'commonjs',
    main: './lib.js',
    exports: {
      '.': './lib.js',
    },
  }),
  'lib.js': `
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = megalodon_1.default;
`,
}
