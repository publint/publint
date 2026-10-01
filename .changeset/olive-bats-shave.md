---
'publint': patch
---

Add `EXPORTS_IMPORT_CONDITION_ONLY` to warn when an `"exports"` entrypoint resolves with the `"import"` condition but not with the `"require"` condition, which prevents the entrypoint from being required even though Node.js supports `require(esm)`
