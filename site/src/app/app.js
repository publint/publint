import { mount } from 'svelte'
import App from './App.svelte'

mount(App, {
  // @ts-expect-error
  target: document.getElementById('publint-app'),
})
