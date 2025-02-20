/// <reference types="svelte" />
/// <reference types="vite/client" />

declare namespace svelteHTML {
  interface HTMLAttributes<T> {
    'on:clickoutside'?: (event: MouseEvent) => any
  }
}
