---
title: Getting started
---

# Getting started

publint is a [linter](<https://en.wikipedia.org/wiki/Lint_(software)>) that checks [npm](https://npmjs.com) packages to ensure the widest compatibility across environments, such as [Vite](https://vite.dev), [Webpack](https://webpack.js.org), [Rollup](https://rollupjs.org), [Node.js](https://nodejs.org), etc. It also reports best practices and common configuration mistakes that aim to improve the overall quality of the package.

Check out the [comparisons](./comparisons.md) page to see how publint differs from other tools.

## Usage

The easiest way to use publint is through [publint.dev](https://publint.dev) (this website!). Search for an npm package, paste an npm link, or paste a pkg.pr.new link to start linting the package.

You can also run publint locally with `npx publint`, which is a CLI that performs the same checks as on the website. See the [CLI page](./cli.md) for more information.

::: code-group

```bash [npm]
npx publint
```

```bash [pnpm]
pnpm dlx publint
```

```bash [yarn]
yarn dlx publint
```

:::

## Local installation

You can also install `publint` locally if you prefer to run it in CI or before publishing your package. First, install `publint` with your package manager:

::: code-group

```bash [npm]
npm install --save-dev publint
```

```bash [pnpm]
pnpm add --save-dev publint
```

```bash [yarn]
yarn add --dev publint
```

:::

Then, setup a script to execute `publint` in your `package.json`:

```json title="package.json"
{
  "scripts": {
    "lint:package": "publint"
  }
}
```

You can then call the script with your package manager:

::: code-group

```bash [npm]
npm run publint
```

```bash [pnpm]
pnpm publint
```

```bash [yarn]
yarn publint
```

:::

If you'd like to lint a package in a different directory, you can pass the path as an argument, like `publint ./dir`. See the [CLI page](./cli.md) for more information.

If you'd like to use `publint` programmatically, check out the [JavaScript API page](./javascript-api.md).

::: tip
If the package has a build step, it must be run first before running `publint` so that it can lint against the files to be published.
:::

## Community integration

publint can also be used through different tools below:

| Name                                                           | Description                                                                                                                                         |
| -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| [vscode-publint](https://github.com/kravetsone/vscode-publint) | A VSCode extension to lint `package.json` with publint. ([Marketplace](https://marketplace.visualstudio.com/items?itemName=kravets.vscode-publint)) |
| [renoma](https://github.com/bluwy/renoma)                      | A recursive node_modules analyzer with opinionated package health checks. Run `npx renoma --filter-rules publint` to run publint on all packages.   |
