<script setup>
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import AppLayout from '../../src/app/VitepressLayout.vue'

const { frontmatter, page } = useData()
</script>

<template>
  <AppLayout v-if="frontmatter.layout === 'app' || page.isNotFound" />
  <DefaultTheme.Layout v-else>
    <Content />
  </DefaultTheme.Layout>
</template>
