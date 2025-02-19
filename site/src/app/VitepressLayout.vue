<script setup>
import { defineClientComponent } from 'vitepress'
import Footer from './components/Footer.vue'

const App = defineClientComponent(() => import('./App.vue'))
</script>

<template>
  <main class="min-h-screen">
    <App />
  </main>
  <Footer />
</template>
