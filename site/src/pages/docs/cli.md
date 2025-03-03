---
title: CLI
---

<script setup>
const options = [
  {
    flag: '--level',
    type: `'suggestion' | 'warning' | 'error'`,
    default: `'suggestion'`,
    description: 'Level of messages to log.',
  },
  {
    flag: '--pack',
    type: `'auto' | 'npm' | 'yarn' | 'pnpm' | 'bun' | false`,
    default: `'auto'`,
    description: 'Package manager to use for packing.',
  },
  {
    flag: '--strict',
    type: 'boolean',
    default: 'false',
    description: 'Report warnings as errors.',
  },
]

const optionsHtml = `\
<table>
  <thead>
    <tr>
      <th>Flag</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
  ${options.map(option => `\
    <tr>
      <td><code>${option.flag}</code></td>
      <td>
        <p><strong>Type:</strong> <code>${option.type}</code></p>
        <p><strong>Default:</strong> <code>${option.default}</code></p>
        <p>${option.description}</p>
      </td>
    </tr>
  `).join('\n')}
  </tbody>
</table>`
</script>

# Command line interface

## `publint [path] [options]`

`[path]`: Pass a directory path to lint a specific directory, or pass a tarball file path to lint the tarball directly. If not provided, the current directory is linted.

`[options]`:

<div v-html="optionsHtml" />

Check out the [JavaScript API Options](./javascript-api.md#options) section for further information of each options.

## Examples

```bash
# Run publint on the current directory
publint

# Run publint on a specific directory
publint ./dir

# Run publint on a tarball
publint ./mylib-1.0.0.tgz

# Ignore suggestions (only show warnings and errors)
publint --level warning

# Treat warnings as errors
publint --strict

# Use a specific package manager to pack the package (default auto-detects)
publint --pack npm
```

<style>
._docs_cli table p {
  margin: 0
}
._docs_cli table tbody > tr > td:first-child {
  white-space: nowrap;
}
</style>
