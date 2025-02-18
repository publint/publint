<script setup>
import 'virtual:uno.css'
import Footer from './components/Footer.vue'
import appUrl from './app.js?url'
</script>

<template>
  <main class="min-h-screen">
    <div id="publint-app"></div>
    <component is="script" type="module" :src="appUrl"></component>
  </main>
  <Footer />
</template>
