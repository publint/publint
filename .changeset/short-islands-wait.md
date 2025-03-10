---
'publint': patch
---

If `formatMessage` is passed a `package.json` object with missing keys, the message part that references the value will now fallback to `"undefined"` instead of completely erroring out.
