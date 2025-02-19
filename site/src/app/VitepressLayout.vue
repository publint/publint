<script setup>
import Footer from './components/Footer.vue'
import App from './App.vue'
</script>

<template>
  <main class="min-h-screen">
    <ClientOnly>
      <App />
    </ClientOnly>
  </main>
  <Footer />
</template>
