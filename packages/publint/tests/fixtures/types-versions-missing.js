export default {
  'package.json': JSON.stringify({
    name: 'publint-types-versions-missing',
    version: '0.0.1',
    private: true,
    type: 'commonjs',
    types: 'dist/types/index.d.ts',
    typings: './missing-typings.d.ts',
    files: ['package.json', 'dist/types'],
    typesVersions: {
      '>=4.0': {
        ssr: ['./dist/ssr/missing.d.ts'],
        'sub/*': ['./dist/missing/*'],
        unpublished: ['./dist/unpublished/index.d.ts'],
        '*': ['dist/types/*'],
      },
    },
  }),
  'dist/types/index.d.ts': 'export declare const main: string;\n',
  'dist/unpublished/index.d.ts': 'export declare const hidden: string;\n',
}
