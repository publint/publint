<script setup>
import { onMounted, onBeforeUnmount, useTemplateRef } from 'vue'
import { mount, unmount } from 'svelte'
import App from './App.svelte'

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
