---
title: Comparisons
---

# Comparisons

## ESLint

[ESLint](https://eslint.org) is a popular linter for JavaScript projects. The main difference between both tools is that ESLint focuses on the source code, while publint focuses on the published code. While both code may be of the same file, it has different assumptions and are handled differently accordingly. For example:

- Code quality is important in ESLint, but not in publint as it does not affect how the code is published.
- The whole package is taken into account when linting in publint, instead of linting in a file-by-file basis.
- The linting rules in publint are often more concrete and non-configurable as different environments have explicit requirements when running code.

In most cases, you can use both tooling together without conflicts.

## Are the types wrong?

[Are the types wrong?](https://arethetypeswrong.github.io) (attw) is a tool that checks for types issues. It can often report similar issues caught by publint, e.g. ESM and CJS types masquerading, but the underlying implementation differs where attw uses the TypeScript compiler to check for issues, while publint performs its own static analysis.

At the moment, attw is able to report issues that publint does not, so it's recommended to use both tooling together if you'd like to catch all possible issues.

## eslint-plugin-package-json

[eslint-plugin-package-json](https://github.com/JoshuaKGoldberg/eslint-plugin-package-json) is an ESLint plugin that allows linting a `package.json` file. It performs checks that overlap with publint, e.g. ensuring field types are correct, validating the `"repository"` field, etc. It also implements other general-purpose checks that may be useful to ensure consistent and opinionated `package.json`s across projects.

Publint doesn't aim to implement all of its rules, only the ones that affect publishing are supported. But furthermore, publint is able to check for issues beyond the `package.json`, e.g. checking for ESM and CJS formats, file existence, etc.

You can use the tool without conflicts if you're looking to enforce a consistent `package.json` file across projects, or if you'd like to catch certain issues that publint doesn't.

## npm-package-json-lint

[npm-package-json-lint](https://npmpackagejsonlint.org) is a standalone linter that covers a similar scope to `eslint-plugin-package-json`, but has a lot more lint rules and is highly configurable to fit your specific opinions on `package.json` files. It shares the same comparison as [above](#eslint-plugin-package-json).
