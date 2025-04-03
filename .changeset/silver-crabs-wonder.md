---
'publint': patch
---

Support custom conditions in `"exports"` that points to raw TS or TSX files. This configuration is common in monorepo setups where packages refer to the raw files among themselves using a custom condition so custom aliasing isn't needed.

With this support, the `"types"` condition is allowed to come after any exports of the raw TS or TSX files. File existence checks are also disabled for raw TS and TSX files reference as after publish these files may intentionally be not published.
