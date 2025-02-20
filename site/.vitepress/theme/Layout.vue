<script setup>
import { useData, useRouter } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import AppLayout from '../../src/app/VitepressLayout.vue'
import NotFound from './NotFound.vue'

const { frontmatter, page } = useData()
const router = useRouter()
const isDocs = router.route.path.startsWith('/docs/')
</script>

<template>
  <AppLayout
    v-if="frontmatter.layout === 'app' || (page.isNotFound && !isDocs)"
  />
  <DefaultTheme.Layout v-else>
    <template #not-found>
      <NotFound />
    </template>
    <Content />
  </DefaultTheme.Layout>
</template>
