---
'publint': patch
---

Add a new warning when an entrypoint is exported as CJS-only, has a default export, and has the `__esModule` marker. This setup has different interpretations by bundlers and runtimes, and implicit handling detection that may not be obvious for both package authors and users, hence it is discouraged.
