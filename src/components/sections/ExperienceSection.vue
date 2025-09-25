<script setup>
import FuzzyDecryptedText from '../vue-bits/FuzzyDecryptedText.vue'
import { ref, onMounted } from 'vue'

const isVisible = ref(false)
const experiences = ref([
  {
    id: 1,
    company: 'TechCorp Solutions',
    position: 'Senior Frontend Developer',
    period: '2022 - настоящее время',
    location: 'Москва (удаленно)',
    type: 'full-time',
    description: 'Разработка и поддержка крупных веб-приложений для корпоративных клиентов',
    achievements: [
      'Руководство командой из 4 frontend разработчиков',
      'Внедрение современного стека технологий (Vue 3, TypeScript)',
      'Оптимизация производительности приложений на 40%',
      'Создание дизайн-системы и компонентной библиотеки',
    ],
    tech: ['Vue.js', 'TypeScript', 'Nuxt.js', 'SCSS', 'Jest'],
  },
  {
    id: 2,
    company: 'StartupHub',
    position: 'Frontend Developer',
    period: '2020 - 2022',
    location: 'Санкт-Петербург',
    type: 'full-time',
    description: 'Разработка MVP и прототипов для стартапов в сфере FinTech',
    achievements: [
      'Разработка 8+ проектов с нуля до production',
      'Интеграция с различными API и платежными системами',
      'Создание адаптивных интерфейсов для мобильных устройств',
      'Участие в техническом планировании проектов',
    ],
    tech: ['React', 'JavaScript', 'Redux', 'Material-UI', 'Webpack'],
  },
  {
    id: 3,
    company: 'WebStudio Pro',
    position: 'Junior Frontend Developer',
    period: '2019 - 2020',
    location: 'Москва',
    type: 'full-time',
    description: 'Создание корпоративных сайтов и интернет-магазинов',
    achievements: [
      'Верстка 20+ лендингов и корпоративных сайтов',
      'Изучение современных фреймворков и инструментов',
      'Работа с CMS и системами управления контентом',
      'Оптимизация сайтов для поисковых систем',
    ],
    tech: ['HTML', 'CSS', 'JavaScript', 'jQuery', 'Bootstrap'],
  },
  {
    id: 4,
    company: 'Freelance',
    position: 'Web Developer',
    period: '2018 - 2019',
    location: 'Удаленно',
    type: 'freelance',
    description: 'Фриланс проекты для малого и среднего бизнеса',
    achievements: [
      'Выполнение 15+ проектов различной сложности',
      'Работа с международными клиентами',
      'Изучение основ UX/UI дизайна',
      'Развитие навыков коммуникации с заказчиками',
    ],
    tech: ['HTML', 'CSS', 'JavaScript', 'PHP', 'WordPress'],
  },
])

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 300)
})

const getTypeColor = (type) => {
  switch (type) {
    case 'full-time':
      return '#00ff47'
    case 'freelance':
      return '#ffff00'
    default:
      return '#ff8c00'
  }
}

const getTypeText = (type) => {
  switch (type) {
    case 'full-time':
      return 'FULL-TIME'
    case 'freelance':
      return 'FREELANCE'
    default:
      return 'CONTRACT'
  }
}
</script>

<template>
  <div class="section-container">
    <div class="section-header">
      <div class="section-title">
        <FuzzyDecryptedText
          text=">>> ОПЫТ РАБОТЫ"
          :font-size="24"
          font-family="DaysOne"
          color="#00ff47"
          :speed="15"
          :enable-hover="true"
          :base-intensity="0.02"
          :hover-intensity="0.15"
        />
      </div>
      <div class="terminal-cursor">_</div>
    </div>

    <div class="section-content" :class="{ visible: isVisible }">
      <div class="terminal-output">
        <div class="info-line">
          <span class="prompt">$</span>
          <span class="command">history | grep "work"</span>
        </div>
      </div>

      <div class="timeline">
        <div
          v-for="(exp, index) in experiences"
          :key="exp.id"
          class="timeline-item"
          :style="{ animationDelay: `${index * 0.2}s` }"
        >
          <div class="timeline-marker">
            <div class="timeline-dot"></div>
            <div class="timeline-line" v-if="index < experiences.length - 1"></div>
          </div>

          <div class="experience-card">
            <div class="experience-header">
              <div class="experience-title-row">
                <h3 class="experience-position">{{ exp.position }}</h3>
                <div class="experience-meta">
                  <span class="experience-period">{{ exp.period }}</span>
                  <span
                    class="experience-type"
                    :style="{
                      color: getTypeColor(exp.type),
                      borderColor: getTypeColor(exp.type),
                      textShadow: `0 0 5px ${getTypeColor(exp.type)}40`,
                    }"
                  >
                    {{ getTypeText(exp.type) }}
                  </span>
                </div>
              </div>

              <div class="experience-company-row">
                <h4 class="experience-company">{{ exp.company }}</h4>
                <span class="experience-location">{{ exp.location }}</span>
              </div>

              <p class="experience-description">{{ exp.description }}</p>
            </div>

            <div class="experience-achievements">
              <div class="achievements-label">Достижения:</div>
              <ul class="achievements-list">
                <li
                  v-for="achievement in exp.achievements"
                  :key="achievement"
                  class="achievement-item"
                >
                  <span class="achievement-bullet">✓</span>
                  {{ achievement }}
                </li>
              </ul>
            </div>

            <div class="experience-tech">
              <div class="tech-label">Технологии:</div>
              <div class="tech-tags">
                <span v-for="tech in exp.tech" :key="tech" class="tech-tag">
                  {{ tech }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="terminal-output">
        <div class="info-line">
          <span class="prompt">$</span>
          <span class="command">echo "Общий опыт: 5+ лет"</span>
        </div>
        <div class="output">
          <p>Готов к новым вызовам и интересным проектам!</p>
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

.section-content {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
}

.section-content.visible {
  opacity: 1;
  transform: translateY(0);
}

.terminal-output {
  margin-bottom: 20px;
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
  font-size: 14px;
}

.timeline {
  margin: 30px 0;
}

.timeline-item {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  opacity: 0;
  animation: slideInLeft 0.6s ease forwards;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.timeline-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--neon);
  box-shadow: 0 0 10px rgba(0, 255, 71, 0.5);
  z-index: 1;
}

.timeline-line {
  width: 2px;
  height: 100%;
  min-height: 120px;
  background: linear-gradient(to bottom, rgba(0, 255, 71, 0.3) 0%, rgba(0, 255, 71, 0.1) 100%);
  margin-top: 10px;
}

.experience-card {
  background: rgba(0, 255, 71, 0.02);
  border: 1px solid rgba(0, 255, 71, 0.1);
  border-radius: 8px;
  padding: 25px;
  flex: 1;
  transition: all 0.3s ease;
}

.experience-card:hover {
  border-color: rgba(0, 255, 71, 0.3);
  box-shadow: 0 0 20px rgba(0, 255, 71, 0.1);
}

.experience-header {
  margin-bottom: 20px;
}

.experience-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.experience-position {
  color: var(--neon);
  font-family: 'DaysOne', monospace;
  font-size: 18px;
  margin: 0;
  flex: 1;
}

.experience-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

.experience-period {
  color: rgba(155, 220, 146, 0.7);
  font-size: 12px;
}

.experience-type {
  font-family: 'DaysOne', monospace;
  font-size: 10px;
  padding: 2px 6px;
  border: 1px solid currentColor;
  border-radius: 3px;
  text-transform: uppercase;
}

.experience-company-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.experience-company {
  color: rgba(0, 255, 71, 0.9);
  font-size: 16px;
  margin: 0;
  font-weight: 500;
}

.experience-location {
  color: rgba(155, 220, 146, 0.6);
  font-size: 12px;
}

.experience-description {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.experience-achievements {
  margin-bottom: 20px;
}

.achievements-label {
  color: rgba(0, 255, 71, 0.8);
  font-size: 12px;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.achievements-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.achievement-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 13px;
  color: var(--muted);
  line-height: 1.4;
}

.achievement-bullet {
  color: var(--neon);
  font-size: 12px;
  margin-top: 2px;
  flex-shrink: 0;
}

.experience-tech {
  margin-top: 20px;
}

.tech-label {
  color: rgba(0, 255, 71, 0.8);
  font-size: 12px;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tag {
  background: rgba(0, 255, 71, 0.1);
  color: rgba(0, 255, 71, 0.9);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  border: 1px solid rgba(0, 255, 71, 0.2);
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

@media (max-width: 768px) {
  .timeline-item {
    gap: 15px;
  }

  .experience-title-row {
    flex-direction: column;
    gap: 10px;
  }

  .experience-company-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .experience-meta {
    align-items: flex-start;
  }
}
</style>
