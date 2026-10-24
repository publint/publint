export default {
  'package.json': JSON.stringify({
    name: 'publint-bin-path-not-normalized',
    version: '0.0.1',
    private: true,
    type: 'commonjs',
    bin: {
      foo: './bin/foo.js',
      bar: 'bin/bar.js',
    },
  }),
  'bin/foo.js': "#!/usr/bin/env node\nconsole.log('foo')",
  'bin/bar.js': "#!/usr/bin/env node\nconsole.log('bar')",
}
