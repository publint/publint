export default {
  'package.json': JSON.stringify({
    name: 'publint-types-versions',
    version: '0.0.1',
    private: true,
    type: 'commonjs',
    types: 'index.d.ts',
    typesVersions: {
      '>=4.0': {
        ssr: ['./dist/ssr'],
        '*': ['dist/types/*'],
      },
    },
  }),
  'dist/types/index.d.ts': 'export declare const main: string;\n',
  'dist/ssr/index.d.ts': 'export declare const ssr: string;\n',
}
