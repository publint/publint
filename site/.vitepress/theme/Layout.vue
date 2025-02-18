<script setup>
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import AppLayout from '../../src/app/VitepressLayout.vue'

const { frontmatter } = useData()
</script>

<template>
  <AppLayout v-if="frontmatter.layout === 'app'" />
  <DefaultTheme.Layout v-else>
    <Content />
  </DefaultTheme.Layout>
</template>
