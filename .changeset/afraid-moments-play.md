---
'publint': patch
---

Remove the `EXPORTS_TYPES_INVALID_FORMAT` rule and the deprecated `publint deps` command ([#146](https://github.com/publint/publint/issues/146), [#149](https://github.com/publint/publint/pull/149)); use [arethetypeswrong](https://arethetypeswrong.github.io/) for types vs ESM/CJS checks and `npx renoma --filter-rules "publint"` (or similar) to lint dependencies.
