---
'publint': patch
---

Add `NESTED_PACKAGE_JSON_FIELD_IGNORED` to warn when published nested `package.json` files define `"exports"` or `"imports"`, which Node.js ignores outside the package root.
