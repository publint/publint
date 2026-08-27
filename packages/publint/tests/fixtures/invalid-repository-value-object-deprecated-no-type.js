export default {
  'package.json': JSON.stringify({
    name: 'publint-invalid-repository-value-object-deprecated-no-type',
    version: '0.0.1',
    private: true,
    type: 'commonjs',
    repository: {
      // `type` omitted: it's optional and defaults to git, so the url should
      // still be checked (https://github.com/publint/publint/issues/256)
      url: 'git://www.github.com/publint/publint',
    },
  }),
}
