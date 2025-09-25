<script setup>
import { ref, onMounted } from 'vue'
import Hero from './Hero.vue'
import Noise from './vue-bits/Noise.vue'

const open = ref(false)
onMounted(() => {
  open.value = true
})
</script>

<template>
  <header class="relative o-panel overflow-clip" aria-label="Profile header">
    <Noise
      :pattern-size="60"
      :pattern-scale-x="7"
      :pattern-scale-y="0"
      :pattern-alpha="10"
      mixBlendMode="overlay"
      class="absolute top-0 left-0 z-1 w-full h-full max-h-full max-w-full"
    />
    <transition name="fade">
      <Hero v-if="open" />
    </transition>
  </header>
</template>

<style scoped>
.shape-blur-effect {
  position: absolute;
  height: calc(100% + 50px);
  width: calc(100% + 50px);
  opacity: 0.5;
  transition: all 0.3s ease;
  color: #f10a0a;

  &:hover {
    opacity: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
