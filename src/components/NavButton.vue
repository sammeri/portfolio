<script setup>
import { ref } from 'vue'
import MagicBento from './vue-bits/MagicBento/MagicBento.vue'

const enableStars = ref(true)
const enableSpotlight = ref(true)
const disableAnimations = ref(false)
const spotlightRadius = ref(400)
const enableTilt = ref(false)
const clickEffect = ref(true)
const enableMagnetism = ref(false)
</script>

<template>
  <nav class="o-panel" aria-label="Main navigation">
    <div class="w-full demo-container">
      <MagicBento
        :enable-stars="enableStars"
        :enable-spotlight="enableSpotlight"
        :disable-animations="disableAnimations"
        :spotlight-radius="spotlightRadius"
        :enable-tilt="enableTilt"
        :click-effect="clickEffect"
        :enable-magnetism="enableMagnetism"
      />
    </div>
    <!-- <div class="o-grid" role="list">
      <button class="o-tile" role="listitem" aria-label="About">
        <div class="icon">👤</div>
        <h4>Обо мне</h4>
      </button>

      <button class="o-tile" role="listitem" aria-label="Experience">
        <div class="icon">🎒</div>
        <h4>Опыт</h4>
      </button>

      <button class="o-tile" role="listitem" aria-label="Education">
        <div class="icon">📚</div>
        <h4>Образование</h4>
      </button>

      <button class="o-tile" role="listitem" aria-label="Tech Stack">
        <div class="icon">&lt;/&gt;</div>
        <h4>Стек</h4>
      </button>

      <button class="o-tile" role="listitem" aria-label="Portfolio">
        <div class="icon">🗂️</div>
        <h4>Портфолио</h4>
      </button>

      <button class="o-tile" role="listitem" aria-label="Contact">
        <div class="icon">✉️</div>
        <h4>Контакты</h4>
      </button>

      <button class="o-tile" role="listitem" aria-label="Resume">
        <div class="icon">📄</div>
        <h4>Резюме</h4>
      </button>

      <button class="o-tile" role="listitem" aria-label="Team Roles">
        <div class="icon">👥</div>
        <h4>Роли</h4>
      </button>
    </div> -->
  </nav>
</template>

<style lang="scss" scoped></style>
