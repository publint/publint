---
'publint': patch
---

Remove the deprecated `publint deps` command ([#146](https://github.com/publint/publint/issues/146), [#149](https://github.com/publint/publint/pull/149)). Use `npx renoma --filter-rules "publint"` (or similar) to lint dependencies instead.
