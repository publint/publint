<script setup>
import { useRouter } from 'vitepress'
import { onMounted, useTemplateRef, onUnmounted } from 'vue'
import { mount, unmount } from 'svelte'
import App from './App.svelte'
import { url, updateHref } from './utils/url'

const router = useRouter()
// Only update if VitePress routing to the home page, or if it can't find a route.
// If we try to update our own router when VitePress has that page, we'll then
// render the package page which we don't want. VitePress' router is a little slower.
router.onAfterRouteChange = () => {
  if (router.route.path === '/' || router.route.component == null) {
    updateHref()
  }
}
url.push = router.go

const div = useTemplateRef('publint-app')

onMounted(() => {
  if (div.value) {
    mount(App, { target: div.value })
  }
})

onUnmounted(() => {
  if (div.value) {
    unmount(App)
  }
})
</script>

<template>
  <div ref="publint-app"></div>
</template>
