<script setup>
import { VPButton } from 'vitepress/theme'
</script>

<template>
  <div class="mt-30 flex flex-col items-center justify-center">
    <h1 class="text-6xl font-bold mb-2">404</h1>
    <p class="text-xl font-bold opacity-70 mb-8">PAGE NOT FOUND</p>
    <div class="flex gap-4">
      <VPButton href="/" theme="alt" text="Home"></VPButton>
      <VPButton href="/docs/" theme="alt" text="Docs"></VPButton>
    </div>
  </div>
</template>
