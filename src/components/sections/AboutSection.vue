<script setup>
import FuzzyDecryptedText from '../vue-bits/FuzzyDecryptedText.vue'
import { ref, onMounted } from 'vue'
import { useNavigationStore } from '@/stores/navigation'

const isVisible = ref(false)
const navigationStore = useNavigationStore()

const handleSectionClick = (sectionId) => {
  navigationStore.setCurrentSection(sectionId)
}

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 300)
})
</script>

<template>
  <div class="section-container relative z-10">
    <div class="section-header">
      <div class="flex h-auto">
        <FuzzyDecryptedText
          text=">>> ИНФОРМАЦИЯ О РАЗРАБОТЧИКЕ"
          :font-size="24"
          font-family="DaysOne"
          color="#00ff47"
          :speed="5"
          :enable-hover="true"
          :base-intensity="0.02"
          :hover-intensity="0.15"
        />
        <FuzzyDecryptedText
          text="_"
          :font-size="24"
          font-family="DaysOne"
          color="#00ff47"
          :speed="5"
          :enable-hover="true"
          :base-intensity="0.02"
          :hover-intensity="0.15"
          class="terminal-cursor"
        />
      </div>
      <button
        class="cursor-pointer"
        @click="handleSectionClick('hero')"
        :disabled="navigationStore.isTransitioning"
      >
        Назад
      </button>
    </div>

    <div class="section-content" :class="{ visible: isVisible }">
      <div class="info-block">
        <div class="info-line">
          <span class="prompt">$</span>
          <span class="command">whoami</span>
        </div>
        <div class="output">
          <p>Илья Майстренко - Frontend Developer</p>
          <p>Специализация: Vue.js, React, TypeScript</p>
          <p>Опыт: 5+ лет коммерческой разработки</p>
        </div>
      </div>

      <div class="info-block">
        <div class="info-line">
          <span class="prompt">$</span>
          <span class="command">cat about.txt</span>
        </div>
        <div class="output">
          <p>Создаю современные веб-приложения с фокусом на пользовательский опыт.</p>
          <p>Увлекаюсь новыми технологиями и постоянно изучаю лучшие практики.</p>
          <p>Работаю как в команде, так и на фрилансе.</p>
          <br />
          <p>Принципы работы:</p>
          <p>• Чистый и поддерживаемый код</p>
          <p>• Производительность и оптимизация</p>
          <p>• Адаптивность и доступность</p>
          <p>• Современные подходы к разработке</p>
        </div>
      </div>

      <div class="info-block">
        <div class="info-line">
          <span class="prompt">$</span>
          <span class="command">ls -la contacts/</span>
        </div>
        <div class="output">
          <p>email: ilya.maistrenko@example.com</p>
          <p>telegram: @ilya_dev</p>
          <p>github: github.com/ilya-maistrenko</p>
          <p>linkedin: linkedin.com/in/ilya-maistrenko</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.section-container {
  padding: 20px;
  font-family: 'Rubik-Regular', monospace;
  color: var(--muted);
  line-height: 1.6;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(0, 255, 71, 0.2);
}

.terminal-cursor {
  color: var(--neon);
  font-size: 24px;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

.section-content {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
}

.section-content.visible {
  opacity: 1;
  transform: translateY(0);
}

.info-block {
  margin-bottom: 25px;
  background: rgba(0, 255, 71, 0.02);
  border: 1px solid rgba(0, 255, 71, 0.1);
  border-radius: 8px;
  padding: 15px;
}

.info-line {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-family: 'DaysOne', monospace;
}

.prompt {
  color: var(--neon);
  font-weight: bold;
}

.command {
  color: rgba(0, 255, 71, 0.8);
}

.output {
  margin-left: 20px;
  color: var(--muted);
}

.output p {
  margin: 5px 0;
  font-size: 14px;
}

.output p:first-child {
  color: rgba(0, 255, 71, 0.9);
  font-weight: 500;
}
</style>
