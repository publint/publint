---
'publint': patch
---

Re-enable file existence checks for TS and TSX files if they do not use custom conditions. In v0.3.10, this was done unconditionally instead which missed catching possible file typos if only common conditions are used.
