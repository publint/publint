---
'publint': patch
---

The `"imports"` field is now linted with the following rules:

- `IMPORTS_KEY_INVALID`: Ensure the imports key starts with a `#`
- `IMPORTS_VALUE_INVALID`: Ensure the imports value is a valid path that starts with a `./`
- `IMPORTS_GLOB_NO_MATCHED_FILES`: Ensure the imports glob matches at least one file
- `IMPORTS_DEFAULT_SHOULD_BE_LAST`: Ensure the `"default"` condition is last in an entrypoint's object
- `IMPORTS_MODULE_SHOULD_BE_ESM`: Ensure the `"module"` condition file is ESM
- `IMPORTS_MODULE_SHOULD_PRECEDE_REQUIRE`: Ensure the `"module"` condition precedes the `"require"` condition in an entrypoint's object
