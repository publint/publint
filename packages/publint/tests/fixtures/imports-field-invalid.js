export default {
  'package.json': JSON.stringify({
    name: 'publint-imports-field-invalid',
    version: '0.0.1',
    private: true,
    type: 'commonjs',
    imports: {
      dep: './main.js',
    },
  }),
  'main.js': '',
}
