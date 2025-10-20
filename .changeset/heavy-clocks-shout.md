---
'publint': patch
---

Skip file existence checks when crawling subpath imports as they may be dev-only and not used after bundling or publish. This check may be improved in the future when publint can scan for files to see if the subpath imports are used.
