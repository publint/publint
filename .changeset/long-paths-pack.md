---
'@publint/pack': patch
---

Fix unpacking files with paths longer than 100 characters. The ustar `prefix` field, PAX `path` records, and GNU long name headers are now read, so these files are no longer truncated, misnamed as `PaxHeader`, or reported as missing.
