<script setup>
import { useRouter } from 'vitepress'
import { onMounted, onBeforeUnmount, useTemplateRef } from 'vue'
import { mount, unmount } from 'svelte'
import App from './App.svelte'
import { url, updateHref } from './utils/url'

const router = useRouter()
router.onAfterRouteChange = () => updateHref()
url.push = router.go

const div = useTemplateRef('publint-app')

onMounted(() => {
  if (div.value) {
    mount(App, { target: div.value })
  }
})

onBeforeUnmount(() => {
  if (div.value) {
    unmount(App)
  }
})
</script>

<template>
  <div ref="publint-app"></div>
</template>
