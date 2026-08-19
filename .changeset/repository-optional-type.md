---
'publint': patch
---

Check the `repository.url` value even when `repository.type` is omitted. `type` is optional and defaults to git, so packages using the object form without it were previously skipped for the deprecated-protocol, invalid-git-url, and shorthand-URL checks.
