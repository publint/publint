export default {
  'package.json': JSON.stringify({
    name: 'publint-invalid-field-types',
    version: '0.0.1',
    private: true,
    type: 'commonjs',
    main: 0,
    module: true,
    'jsnext:main': false,
    repository: 123,
    imports: '123',
  }),
}
