---
'@publint/pack': patch
---

Use proper command interpolation to prevent command injection on untrusted input. As it's not expected that this package is used with untrusted input, a vulnerability is not published. However, the fix is made still as a caution.
