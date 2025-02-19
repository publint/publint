<script setup>
import Footer from './components/Footer.vue'
import devAppUrl from './app.js?url'

const appUrl = import.meta.env.PROD ? '__APP_URL__' : devAppUrl
</script>

<template>
  <main class="min-h-screen">
    <div id="publint-app"></div>
    <component is="script" type="module" :src="appUrl"></component>
  </main>
  <Footer />
</template>
