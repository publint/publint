---
title: Attributify JSX transformer
description: Support valueless attributify in JSX/TSX (@unocss/transformer-attributify-jsx)
---

# Attributify JSX transformer

### Title <Badge type="tip" text="^1.9.0" />

<Button>Hello</Button>


## Hello

Hello world. [asdas](https://example.com)

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::

> [!NOTE]
> Highlights information that users should take into account, even when skimming.

> [!TIP]
> Optional information to help a user be more successful. [asdas](https://example.com)

> [!IMPORTANT]
> Crucial information necessary for users to succeed. 

> [!WARNING]
> Critical content demanding immediate user attention due to potential risks.

> [!CAUTION]
> Negative potential consequences of an action.

```html
<ul>
  <li v-for="todo in todos" :key="todo.id">{{ todo.text }}</li>
</ul>
```
