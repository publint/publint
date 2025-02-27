---
'publint': patch
---

Improve SSH git URL detection when checking the `"repository"` field. Values like `"git@github.com:user/project.git"` is now detected as a valid git URL, but will be suggested to use a full git URL instead, like `"git+ssh://git@github.com/user/project.git"`
