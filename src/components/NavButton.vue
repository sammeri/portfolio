<script setup>
import { ref } from 'vue'
import { useNavigationStore } from '../stores/navigation'
import MagicBento from './vue-bits/MagicBento/MagicBento.vue'

const navigationStore = useNavigationStore()

const enableStars = ref(true)
const enableSpotlight = ref(true)
const disableAnimations = ref(false)
const spotlightRadius = ref(400)
const enableTilt = ref(false)
const clickEffect = ref(true)
const enableMagnetism = ref(false)

const handleSectionClick = (sectionId) => {
  navigationStore.setCurrentSection(sectionId)
}
</script>

<template>
  <nav class="o-panel" aria-label="Main navigation">
    <!-- <div class="w-full demo-container">
      <MagicBento
        :enable-stars="enableStars"
        :enable-spotlight="enableSpotlight"
        :disable-animations="disableAnimations"
        :spotlight-radius="spotlightRadius"
        :enable-tilt="enableTilt"
        :click-effect="clickEffect"
        :enable-magnetism="enableMagnetism"
      />
    </div> -->
    <div class="o-grid" role="list">
      <button
        v-for="section in navigationStore.sections"
        :key="section.id"
        class="o-tile"
        :class="{ active: navigationStore.currentSection === section.id }"
        role="listitem"
        :aria-label="section.title"
        @click="handleSectionClick(section.id)"
        :disabled="navigationStore.isTransitioning"
      >
        <div class="icon">{{ section.icon }}</div>
        <h4>{{ section.title }}</h4>
      </button>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.o-tile.active {
  border-color: rgba(0, 255, 71, 0.4);
  background: rgba(0, 255, 71, 0.05);
  box-shadow: 0 0 20px rgba(0, 255, 71, 0.1);
  transform: translateY(-2px);
}

.o-tile.active .icon {
  filter: drop-shadow(0 0 8px rgba(0, 255, 71, 0.6));
}

.o-tile.active h4 {
  color: var(--neon);
  text-shadow: 0 0 10px rgba(0, 255, 71, 0.3);
}

.o-tile:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
