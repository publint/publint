# publint

## 0.3.12

### Patch Changes

- Fix shebang check to allow spaces after the `#!` ([#183](https://github.com/publint/publint/pull/183))

## 0.3.11

### Patch Changes

- Update `EXPORTS_GLOB_NO_DEPRECATED_SUBPATH_MAPPING` message and severity to error ([#179](https://github.com/publint/publint/pull/179))

- Add a new warning when the `"exports"` or `"imports"` field contain a fallback array as most tooling will only the pick the first value that can be parsed, and other tooling may work differently leading to inconsistent behaviors ([#180](https://github.com/publint/publint/pull/180))

## 0.3.10

### Patch Changes

- Support custom conditions in `"exports"` that points to raw TS or TSX files. This configuration is common in monorepo setups where packages refer to the raw files among themselves using a custom condition so custom aliasing isn't needed. ([`b34ea94`](https://github.com/publint/publint/commit/b34ea9433fb7457ac7f5f8ade972e1589ca9c89e))

  With this support, the `"types"` condition is allowed to come after any exports of the raw TS or TSX files. File existence checks are also disabled for raw TS and TSX files reference as after publish these files may intentionally be not published.

## 0.3.9

### Patch Changes

- Support the `formatMessage` utility in the browser. It has a new `color: 'html'` option to highlight important parts with `<strong>` tags instead of ANSI colors. It also has a new `reference: boolean` option so the messages are worded in reference of the message location. ([`e1cfef0`](https://github.com/publint/publint/commit/e1cfef0b9b49c1eb55c9679308d761b7ce211fc2))

- If `formatMessage` is passed a `package.json` object with missing keys, the message part that references the value will now fallback to `"undefined"` instead of completely erroring out. ([`45962d1`](https://github.com/publint/publint/commit/45962d1e39250569aa877eb3568725bee7d5b434))

## 0.3.8

### Patch Changes

- Support passing a tarball path to the publint CLI. This allows to easily lint any tarball files at hand. ([#166](https://github.com/publint/publint/pull/166))

  ```bash
  npx publint ./mylib-1.0.0.tgz
  ```

- The `publint` API now returns a `pkg` object as a convenience to pass it to `formatMessage` ([#166](https://github.com/publint/publint/pull/166))

- Updated dependencies [[`02d169b`](https://github.com/publint/publint/commit/02d169b1c1bb4739427b261dbc6cccdea37abdca)]:
  - @publint/pack@0.1.2

## 0.3.7

### Patch Changes

- The `"imports"` field is now linted with the following rules: ([#162](https://github.com/publint/publint/pull/162))
  - `IMPORTS_KEY_INVALID`: Ensure the imports key starts with a `#`
  - `IMPORTS_VALUE_INVALID`: Ensure the imports value is a valid path that starts with a `./`
  - `IMPORTS_GLOB_NO_MATCHED_FILES`: Ensure the imports glob matches at least one file
  - `IMPORTS_DEFAULT_SHOULD_BE_LAST`: Ensure the `"default"` condition is last in an entrypoint's object
  - `IMPORTS_MODULE_SHOULD_BE_ESM`: Ensure the `"module"` condition file is ESM
  - `IMPORTS_MODULE_SHOULD_PRECEDE_REQUIRE`: Ensure the `"module"` condition precedes the `"require"` condition in an entrypoint's object

- Improve SSH git URL detection when checking the `"repository"` field. Values like `"git@github.com:user/project.git"` is now detected as a valid git URL, but will be suggested to use a full git URL instead, like `"git+ssh://git@github.com/user/project.git"` ([`28da844`](https://github.com/publint/publint/commit/28da844027e549f0b90ccb95c96e2578b433c6f3))

- Fix exports types message when the `"require"` or `"import"` condition already exists but the dts file format is still invalid ([`a731ec3`](https://github.com/publint/publint/commit/a731ec3a39f9e62e32e6ed54e9eb87f55b6326aa))

## 0.3.6

### Patch Changes

- Fix checking bin field file path that omits `.js` or `/index.js` ([`04f289e`](https://github.com/publint/publint/commit/04f289ec2a8f9ff6967b7da95c19670825ea062c))

## 0.3.5

### Patch Changes

- Check the `"bin"` field if the referenced file exists, has the correct JS format, and can be executed ([#150](https://github.com/publint/publint/pull/150))

- Deprecate the `deps` command. The command has been tricky to maintain and incomplete (e.g. doesn't lint recursively). A separate tool can be used to run publint on dependencies instead, e.g. `npx renoma --filter-rules "publint"`. ([#149](https://github.com/publint/publint/pull/149))

## 0.3.4

### Patch Changes

- When globbing `"exports"` values that contains `*`, also respect `"exports"` keys that mark paths as null. For example: ([`b9605ae`](https://github.com/publint/publint/commit/b9605ae17be4370be65fd584f8aada26e7236799))

  ```json
  {
    "exports": {
      "./*": "./dist/*",
      "./browser/*": null
    }
  }
  ```

  The glob in `"./*": "./dist/*"` will no longer match and lint files in `"./browser/*"` as it's marked null (internal).

- Update logs when running the `publint` CLI: ([`58d96a2`](https://github.com/publint/publint/commit/58d96a25ced0d74aa1cc41b98c79bccb663802f9))
  - The `publint` version is now displayed.
  - The packing command is also displayed.
  - Messages are now logged in the order of errors, warnings, and suggestions, instead of the other way round, to prioritize errors.
  - The `publint deps` command no longer logs passing dependencies. Only failing dependencies are logged.

  Examples:

  ```bash
  $ npx publint
  $ Running publint v0.X.X for my-library...
  $ Packing files with `npm pack`...
  $ All good!
  ```

  ```bash
  $ npx publint deps
  $ Running publint v0.X.X for my-library deps...
  $ x my-dependency
  $ Errors:
  $ 1. ...
  ```

- Fix detecting shorthand repository URLs with the `.` character ([`09d8cbb`](https://github.com/publint/publint/commit/09d8cbb933a530d1f96eec8d516f9b0a6aa3f7f2))

- Clarify message when `"types"` is not the first condition in the `"exports"` field ([`5a6ba00`](https://github.com/publint/publint/commit/5a6ba00b3d3734b6d9c7b3b2ee6ae22004a358f6))

- Correctly detect if a `"types"` value in `"exports"` is used for dual publishing ([`3f3d8b2`](https://github.com/publint/publint/commit/3f3d8b297359e293dba86a7132764846ab2e2384))

## 0.3.3

### Patch Changes

- Rename `EXPORT_TYPES_INVALID_FORMAT` message to `EXPORTS_TYPES_INVALID_FORMAT` ([#139](https://github.com/publint/publint/pull/139))

- Allow versioned types conditions (e.g. `"types@>=5.2"`) in `"exports"` when checking for `"types"` condition ordering ([#138](https://github.com/publint/publint/pull/138))

## 0.3.2

### Patch Changes

- (Potentially breaking) Disable running lifecycle scripts, such as `prepare`, `prepack`, and `postpack`, when running the pack command internally. This returns to the behavior in v0.2. (Note that this change does not apply to yarn as it does not support ignoring lifecycle scripts for local projects) ([#128](https://github.com/publint/publint/pull/128))

  This change is made as running lifecycle scripts was an unintentional behavior during the v0.3 breaking change, which could cause the linting process to take longer than expected, or even cause infinite loops if `publint` is used in a lifecycle script.

- Update repository and bugs URLs to point to the new `publint` organization ([`1eda033`](https://github.com/publint/publint/commit/1eda0334e9f3647867dcc39d85fe04690ca9e543))

- Updated dependencies [[`1eda033`](https://github.com/publint/publint/commit/1eda0334e9f3647867dcc39d85fe04690ca9e543), [`10e3891`](https://github.com/publint/publint/commit/10e3891ba7f3d438c5c3c394423bdbc2078cf7e6)]:
  - @publint/pack@0.1.1

## 0.3.1

### Patch Changes

- Correctly process the `pack` option ([#124](https://github.com/publint/publint/pull/124))

## 0.3.0

### Minor Changes

- The `vfs` option is removed in favour of an extended support of `pack: { tarball: ArrayBuffer | ReadableStream }` and `pack: { files: PackFile[] }` APIs. Now, it is even easier to use `publint` in the browser or against a packed `.tgz` file in Node.js. See the docs for more examples of how to use these new options. ([#122](https://github.com/publint/publint/pull/122))

- Bump node version support to >=18 ([`cb2ed8b`](https://github.com/publint/publint/commit/cb2ed8b052146b25607f2f19d9a2c53c3d8b2f2e))

- `publint` now runs your project's package manager's `pack` command to get the list of packed files for linting. The previous `npm-packlist` dependency is now removed. ([#120](https://github.com/publint/publint/pull/120))

  > NOTE: In this release (v0.3.0), the `pack` command also runs lifecycle scripts like `prepare`, `prepack`, and `postpack`. This behavior is unintentional and is fixed in v0.3.2, where they will no longer run (except for yarn as it does not support ignoring lifecycle scripts for local projects). This returns to the behavior in v0.2.

  A new `pack` option is added to the node API to allow configuring this. It defaults to `'auto'` and will automatically detect your project's package manager using [`package-manager-detector`](https://github.com/antfu-collective/package-manager-detector). See its JSDoc for more information of the option.

  This change is made as package managers have different behaviors for packing files, so running their `pack` command directly allows for more accurate linting. However, as a result of executing these commands in a child process, it may take 200-500ms longer to lint depending on the package manager used and the project size. The new handling also does not support yarn 1. See [this comment](https://github.com/publint/publint/issues/11#issuecomment-2176160022) for more information.

  If you use yarn 1, you should upgrade to the latest yarn version or a different package manager. Otherwise, no other changes are required for this new behavior.

### Patch Changes

- Initial setup to publish with Changesets ([`24a62f5`](https://github.com/publint/publint/commit/24a62f57dd1e5fc6e6410d3e2f99811475b61480))

- When a dependency with the `file:` or `link:` protocol is specified in the `package.json`, it will now error to prevent accidentally publishing dependencies that will likely not work when installed by end-users ([`6e6ab33`](https://github.com/publint/publint/commit/6e6ab33dd2180cc7d770a92353f67cb674964102))

- Fix `EXPORT_TYPES_INVALID_FORMAT` linting to detect `.d.mts` and `.d.cts` files ([`af5e88b`](https://github.com/publint/publint/commit/af5e88b4d3d5260b532a6cdbbde7216a785c0e07))

- Updated dependencies [[`d0b406b`](https://github.com/publint/publint/commit/d0b406befb0f76efc0936f9afb1e6c4679bcbdfb)]:
  - @publint/pack@0.1.0
