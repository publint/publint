<script setup>
import { useRouter } from 'vitepress'
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'
import { mount, unmount } from 'svelte'
import App from './App.svelte'
import { url, updateHref } from './utils/url'

const router = useRouter()
// Only update if VitePress routing to the home page, or if it can't find a route.
// If we try to update our own router when VitePress has that page, we'll then
// render the package page which we don't want. VitePress' router is a little slower.
router.onAfterRouteChange = () => {
  if (router.route.path === '/' || router.route.component == null) {
    // Skip SPA url update if we're routing to a known VitePress page.
    // This isn't technically needed, but sometimes somehow the SPA url still gets updated
    // so just do this extra guard for now.
    if (!['/docs/', '/rules'].includes(router.route.path)) {
      updateHref()
    }
  }
}
url.push = router.go

const div = useTemplateRef('publint-app')
/** @type {any} */
let app

onMounted(() => {
  if (div.value) {
    app = mount(App, { target: div.value })
  }
})

onBeforeUnmount(() => {
  if (div.value && app) {
    unmount(app)
    app = undefined
  }
})
</script>

<template>
  <div ref="publint-app"></div>
</template>
