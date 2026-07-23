# @publint/pack

## 0.1.6

### Patch Changes

- [#242](https://github.com/publint/publint/pull/242) [`4a8dc75`](https://github.com/publint/publint/commit/4a8dc757f7928dd884c762c9315f6e99d8805917) - Export `supportedPackageManagers` for list of supported package managers in the library

- [#241](https://github.com/publint/publint/pull/241) [`7740a62`](https://github.com/publint/publint/commit/7740a62fe60cc874de25fe491793eaf2bfc11d9e) - Support npm v12 and pnpm v11

## 0.1.5

### Patch Changes

- Use proper command interpolation to prevent command injection on untrusted input. As it's not expected that this package is used with untrusted input, a vulnerability is not published. However, the fix is made still as a caution. ([#238](https://github.com/publint/publint/pull/238))

## 0.1.4

### Patch Changes

- Allow passing `Uint8Array` in `unpack()` ([`30016ac`](https://github.com/publint/publint/commit/30016acdfaa3a4ea9a5d5862dcb81dcecd319355))

## 0.1.3

### Patch Changes

- Add new `getPackDirectory()` API to get the directory that is being packed by the package manager ([#216](https://github.com/publint/publint/pull/216))

## 0.1.2

### Patch Changes

- Improve error message when yarn 1 is used to pack files ([#169](https://github.com/publint/publint/pull/169))

## 0.1.1

### Patch Changes

- Update repository and bugs URLs to point to the new `publint` organization ([`1eda033`](https://github.com/publint/publint/commit/1eda0334e9f3647867dcc39d85fe04690ca9e543))

- Add a new `ignoreScripts` option for `pack()`, `packAsList()`, and `packAsJson()` APIs to allow ignoring lifecycle scripts when running the pack command ([#128](https://github.com/publint/publint/pull/128))

## 0.1.0

### Minor Changes

- Initial release ([#120](https://github.com/publint/publint/pull/120))
