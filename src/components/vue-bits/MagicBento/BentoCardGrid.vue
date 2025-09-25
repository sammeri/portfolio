<script setup lang="ts">
import { ref, onMounted, defineProps } from 'vue'

const props = defineProps<{
  gridRef: (el: HTMLDivElement | null) => void
}>()

const gridElement = ref<HTMLDivElement | null>(null)

onMounted(() => {
  props.gridRef(gridElement.value)
})
</script>

<template>
  <div
    ref="gridElement"
    class="relative gap-2 grid select-none bento-section"
    :style="{ fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.5rem)' }"
  >
    <slot />
  </div>
</template>
