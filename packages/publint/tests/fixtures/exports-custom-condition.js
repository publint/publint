export default {
  'package.json': JSON.stringify({
    name: 'publint-exports-custom-condition',
    version: '0.0.1',
    private: true,
    type: 'module',
    exports: {
      './ts': {
        '@scope/custom-condition': './src/index-ts.ts',
        types: './dist/index-ts.d.ts',
        default: './dist/index-ts.js',
      },
      './tsx': {
        '@scope/custom-condition': './src/index-tsx.tsx',
        types: './dist/index-tsx.d.ts',
        default: './dist/index-tsx.js',
      },
    },
  }),
  // NOTE: `.ts` amd `.tsx` files can be not published as they're local specific
  'dist/index-ts.d.ts': "export declare const foo = 'bar';",
  'dist/index-ts.js': "export const foo = 'bar';",
  'dist/index-tsx.d.ts': "export declare const foo = 'bar';",
  'dist/index-tsx.js': "export const foo = 'bar';",
}
