<script setup>
import FuzzyDecryptedText from '../vue-bits/FuzzyDecryptedText.vue'
import { ref, onMounted } from 'vue'

const isVisible = ref(false)
const projects = ref([
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'Полнофункциональная платформа электронной коммерции с админ-панелью',
    tech: ['Vue.js', 'Nuxt.js', 'Node.js', 'MongoDB'],
    status: 'production',
    year: '2024',
    features: [
      'Каталог товаров с фильтрацией',
      'Корзина и система оплаты',
      'Личный кабинет пользователя',
      'Админ-панель для управления',
    ],
  },
  {
    id: 2,
    title: 'Task Management System',
    description: 'Система управления задачами для команд разработки',
    tech: ['React', 'TypeScript', 'Express.js', 'PostgreSQL'],
    status: 'production',
    year: '2023',
    features: [
      'Канбан-доски для проектов',
      'Система уведомлений',
      'Отчеты и аналитика',
      'Интеграция с Git',
    ],
  },
  {
    id: 3,
    title: 'Real-time Chat Application',
    description: 'Мессенджер с поддержкой групповых чатов и файлообмена',
    tech: ['Vue.js', 'Socket.io', 'Node.js', 'Redis'],
    status: 'production',
    year: '2023',
    features: [
      'Мгновенный обмен сообщениями',
      'Групповые чаты',
      'Отправка файлов',
      'Статусы пользователей',
    ],
  },
  {
    id: 4,
    title: 'Portfolio Website Builder',
    description: 'Конструктор сайтов-портфолио для креативных профессий',
    tech: ['Vue.js', 'Vite', 'GSAP', 'Three.js'],
    status: 'development',
    year: '2024',
    features: [
      'Drag & Drop редактор',
      '3D анимации и эффекты',
      'Адаптивные шаблоны',
      'SEO оптимизация',
    ],
  },
])

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 300)
})

const getStatusColor = (status) => {
  return status === 'production' ? '#00ff47' : '#ffff00'
}

const getStatusText = (status) => {
  return status === 'production' ? 'PROD' : 'DEV'
}
</script>

<template>
  <div class="section-container">
    <div class="section-header">
      <div class="section-title">
        <FuzzyDecryptedText
          text=">>> ПОРТФОЛИО ПРОЕКТОВ"
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
          <span class="command">git log --oneline --graph</span>
        </div>
      </div>

      <div class="projects-grid">
        <div
          v-for="(project, index) in projects"
          :key="project.id"
          class="project-card"
          :style="{ animationDelay: `${index * 0.15}s` }"
        >
          <div class="project-header">
            <div class="project-title-row">
              <h3 class="project-title">{{ project.title }}</h3>
              <div class="project-meta">
                <span class="project-year">{{ project.year }}</span>
                <span
                  class="project-status"
                  :style="{
                    color: getStatusColor(project.status),
                    textShadow: `0 0 5px ${getStatusColor(project.status)}40`,
                  }"
                >
                  {{ getStatusText(project.status) }}
                </span>
              </div>
            </div>
            <p class="project-description">{{ project.description }}</p>
          </div>

          <div class="project-tech">
            <div class="tech-label">Stack:</div>
            <div class="tech-tags">
              <span v-for="tech in project.tech" :key="tech" class="tech-tag">
                {{ tech }}
              </span>
            </div>
          </div>

          <div class="project-features">
            <div class="features-label">Features:</div>
            <ul class="features-list">
              <li v-for="feature in project.features" :key="feature" class="feature-item">
                <span class="feature-bullet">></span>
                {{ feature }}
              </li>
            </ul>
          </div>

          <div class="project-actions">
            <button class="action-btn">
              <span class="btn-icon">🔗</span>
              Live Demo
            </button>
            <button class="action-btn">
              <span class="btn-icon">📁</span>
              Source Code
            </button>
          </div>
        </div>
      </div>

      <div class="terminal-output">
        <div class="info-line">
          <span class="prompt">$</span>
          <span class="command">echo "Больше проектов на GitHub..."</span>
        </div>
        <div class="output">
          <p>github.com/ilya-maistrenko</p>
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

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 25px;
  margin: 30px 0;
}

.project-card {
  background: rgba(0, 255, 71, 0.02);
  border: 1px solid rgba(0, 255, 71, 0.1);
  border-radius: 8px;
  padding: 25px;
  opacity: 0;
  animation: slideInUp 0.6s ease forwards;
  transition: all 0.3s ease;
}

.project-card:hover {
  border-color: rgba(0, 255, 71, 0.3);
  box-shadow: 0 0 20px rgba(0, 255, 71, 0.1);
  transform: translateY(-2px);
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.project-header {
  margin-bottom: 20px;
}

.project-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.project-title {
  color: var(--neon);
  font-family: 'DaysOne', monospace;
  font-size: 18px;
  margin: 0;
  flex: 1;
}

.project-meta {
  display: flex;
  gap: 10px;
  align-items: center;
}

.project-year {
  color: rgba(155, 220, 146, 0.7);
  font-size: 12px;
}

.project-status {
  font-family: 'DaysOne', monospace;
  font-size: 10px;
  padding: 2px 6px;
  border: 1px solid currentColor;
  border-radius: 3px;
  text-transform: uppercase;
}

.project-description {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.project-tech {
  margin-bottom: 20px;
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

.project-features {
  margin-bottom: 25px;
}

.features-label {
  color: rgba(0, 255, 71, 0.8);
  font-size: 12px;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
  font-size: 13px;
  color: var(--muted);
}

.feature-bullet {
  color: var(--neon);
  font-family: 'DaysOne', monospace;
}

.project-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  background: rgba(0, 255, 71, 0.05);
  border: 1px solid rgba(0, 255, 71, 0.2);
  color: rgba(0, 255, 71, 0.9);
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'DaysOne', monospace;
}

.action-btn:hover {
  background: rgba(0, 255, 71, 0.1);
  border-color: rgba(0, 255, 71, 0.4);
  box-shadow: 0 0 10px rgba(0, 255, 71, 0.2);
}

.btn-icon {
  font-size: 10px;
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
  .projects-grid {
    grid-template-columns: 1fr;
  }

  .project-title-row {
    flex-direction: column;
    gap: 10px;
  }

  .project-actions {
    flex-direction: column;
  }
}
</style>
