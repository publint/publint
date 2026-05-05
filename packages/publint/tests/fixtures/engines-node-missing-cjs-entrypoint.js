export default {
  'package.json': JSON.stringify({
    name: 'publint-engines-node-missing-cjs-entrypoint',
    version: '0.0.1',
    type: 'commonjs',
    main: './index.cjs',
  }),
  'index.cjs': 'module.exports = {}',
}
