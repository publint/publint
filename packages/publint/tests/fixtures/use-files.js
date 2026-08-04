export default {
  'package.json': JSON.stringify({
    name: 'publint-use-files',
    version: '0.0.1',
    private: true,
    type: 'module',
    exports: './main.js',
  }),
  '.github': {
    workflows: {
      'ci.yml': 'name: CI',
    },
  },
  src: {
    'foo.test.js': "import { foo } from '../main.js'",
  },
  test: {
    'bar.spec.ts': 'export {}',
  },
  'main.js': "export const foo = 'foo'",
}
