# Troubleshooting

This page contains common issues and solutions when using publint. If any of these solutions do not work, please [open an issue](https://github.com/publint/publint/issues/new).

## The CLI process hangs when linting

If the last log output was ``Packing files with `<pm> pack`...`` (where `<pm>` could be npm, pnpm, yarn, etc), it's likely that the packing command being executed was hanging internally. To confirm this, you can run that packing command manually and see if it hangs.

There are several common reasons why it might hang:

1. **The package manager it's using might not be the same as what you use for publishing**. For example, you may use pnpm to install dependencies, but npm to publish packages. publint is only able to make a [best guess](https://github.com/antfu-collective/package-manager-detector) of the preferred package manager based on the lock files.

   Different package managers may interpret the `"files"` field in `package.json` differently, which may sometimes glob into `node_modules` or large directories that are not meant to be published.

   **To fix this**, you can specify a different package manager by passing `--pack <pm>` to the CLI, or `pack: '<pm>'` to the options (where `<pm>` could be npm, pnpm, yarn, etc).

2. **Circular execution via [lifecycle scripts](https://docs.npmjs.com/cli/v11/using-npm/scripts#life-cycle-scripts)**. While publint tries to add additional flags internally to prevent lifecycle scripts from running, some package managers do not respect or support these flags.

   For example, [`npm pack`](https://docs.npmjs.com/cli/v11/using-npm/scripts#npm-pack) can be set to ignore `prepack` and `postpack` scripts, but it'll still run the `prepare` script. [`yarn pack`](https://yarnpkg.com/advanced/lifecycle-scripts#prepack-and-postpack) does not support ignoring the `prepack` and `postpack` scripts.

   **To fix this**, avoiding calling `publint` in these lifecycle scripts, and run `publint` in a separate step instead.

## Yarn 1 is not supported

publint doesn't support yarn 1. However, there are several workarounds:

- Pass a different package manager to pack files, e.g. `publint --pack npm`. This will cause publint to call `npm pack` to pack files even though you're using yarn to install dependencies.

  If this option is used, make sure the packed files (as shown by `npm pack` logs when running manually) are correct. Different package managers interpret the `"files"` field of the `package.json` differently.

- Or upgrade yarn to v3 or v4, which are officially supported.
- Or pack the files manually and pass the tarball to publint, e.g. `publint ./mylib-1.0.0.tgz`.
