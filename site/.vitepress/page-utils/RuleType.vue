<script setup>
import { messageTypeToColor } from '../../src/app/utils/colors.js'

const props = defineProps({
  type: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <span class="inline-flex gap-1 mx-1 vertical-middle">
    <span
      v-for="(type, index) in type.split(',')"
      :key="index"
      :class="`${messageTypeToColor(type)} w-4 h-4 opacity-80 rounded-full`"
      :title="type"
    ></span>
  </span>
</template>
