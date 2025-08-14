---
title: JavaScript API
---

# JavaScript API

To programmatically run `publint`, import it from the package and execute it:

```js
import { publint } from 'publint'

const { messages } = await publint({
  // options...
})
```

`messages` is an array of message object that describes the the code, severity, and location of the issue. To format it as a string, you can use the `formatMessage` utility:

```js {2,8-15}
import { publint } from 'publint'
import { formatMessage } from 'publint/utils'

const { messages, pkg } = await publint({
  // options...
})

for (const message of messages) {
  console.log(formatMessage(message, pkg))
}
```

## Options

vite-plugin-publint-api

## Examples

### Basic usage

Works in Node.js.

```js
import { publint } from 'publint'

const result = await publint({ pkgDir: './packages/mylib' })
```

### Lint a tarball

Works in Node.js and browsers.

```js
import { publint } from 'publint'

// Fetch tarball
const response = await fetch(
  'https://registry.npmjs.org/mylib/-/mylib-1.0.0.tgz',
)
if (!response.body) throw new Error('Failed to fetch tarball')

const result = await publint({ pack: { tarball: response.body } })
```

### Lint a tarball locally

Works in Node.js.

```js
import fs from 'node:fs/promises'
import { publint } from 'publint'

const nodeBuffer = await fs.readFile('./mylib-1.0.0.tgz')
const tarballBuffer = nodeBuffer.buffer.slice(
  nodeBuffer.byteOffset,
  nodeBuffer.byteOffset + nodeBuffer.byteLength
)
+const result = await publint({ pack: { tarball: tarballBuffer } })
```

### Manually unpack and pass as files

Works in Node.js and browsers.

```js
import { publint } from 'publint'
import { unpack } from '@publint/pack'

// Fetch tarball
const response = await fetch(
  'https://registry.npmjs.org/mylib/-/mylib-1.0.0.tgz',
)
if (!response.body) throw new Error('Failed to fetch tarball')

const { rootDir, files } = await unpack(response.body)
// Do something with `files` if needed

const result = await publint({ pkgDir: rootDir, pack: { files } })
```
