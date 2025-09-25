<script setup>
import { ref, onMounted } from 'vue'
import { useNavigationStore } from '../stores/navigation'
import Hero from './Hero.vue'
import AboutSection from './sections/AboutSection.vue'
import SkillsSection from './sections/SkillsSection.vue'
import ProjectsSection from './sections/ProjectsSection.vue'
import ExperienceSection from './sections/ExperienceSection.vue'
import Noise from './vue-bits/Noise.vue'

const navigationStore = useNavigationStore()
const open = ref(false)

onMounted(() => {
  open.value = true
})

const getCurrentComponent = () => {
  switch (navigationStore.currentSection) {
    case 'about':
      return AboutSection
    case 'skills':
      return SkillsSection
    case 'projects':
      return ProjectsSection
    case 'experience':
      return ExperienceSection
    default:
      return Hero
  }
}
</script>

<template>
  <header
    class="relative o-panel overflow-auto h-auto max-h-110 min-h-120"
    aria-label="Profile header"
  >
    <Noise
      :pattern-size="60"
      :pattern-scale-x="7"
      :pattern-scale-y="0"
      :pattern-alpha="10"
      mixBlendMode="overlay"
      class="absolute top-0 left-0 z-1 w-full h-full max-h-full max-w-full"
    />
    <transition name="fade" mode="out-in">
      <component :is="getCurrentComponent()" v-if="open" :key="navigationStore.currentSection" />
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
  transition: all 0.6s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
