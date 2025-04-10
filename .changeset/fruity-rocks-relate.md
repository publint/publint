---
'publint': patch
---

Add a new warning when the `"exports"` or `"imports"` field contain a fallback array as most tooling will only the pick the first value that can be parsed, and other tooling may work differently leading to inconsistent behaviors
