<script setup>
import FuzzyDecryptedText from '../vue-bits/FuzzyDecryptedText.vue'
import { ref, onMounted } from 'vue'

const isVisible = ref(false)
const skillCategories = ref([
  {
    title: 'Frontend Frameworks',
    skills: [
      { name: 'Vue.js', level: 95, years: '4 года' },
      { name: 'React', level: 85, years: '3 года' },
      { name: 'Nuxt.js', level: 90, years: '2 года' },
      { name: 'Next.js', level: 80, years: '2 года' },
    ],
  },
  {
    title: 'Languages & Tools',
    skills: [
      { name: 'JavaScript', level: 95, years: '5+ лет' },
      { name: 'TypeScript', level: 90, years: '3 года' },
      { name: 'HTML/CSS', level: 98, years: '6+ лет' },
      { name: 'SASS/SCSS', level: 90, years: '4 года' },
    ],
  },
  {
    title: 'Backend & Database',
    skills: [
      { name: 'Node.js', level: 75, years: '2 года' },
      { name: 'Express.js', level: 70, years: '2 года' },
      { name: 'MongoDB', level: 65, years: '1.5 года' },
      { name: 'PostgreSQL', level: 60, years: '1 год' },
    ],
  },
  {
    title: 'DevOps & Tools',
    skills: [
      { name: 'Git', level: 90, years: '5+ лет' },
      { name: 'Webpack/Vite', level: 85, years: '3 года' },
      { name: 'Docker', level: 70, years: '1.5 года' },
      { name: 'CI/CD', level: 65, years: '1 год' },
    ],
  },
])

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 300)
})

const getSkillBarWidth = (level) => {
  return `${level}%`
}

const getSkillColor = (level) => {
  if (level >= 90) return '#00ff47'
  if (level >= 75) return '#7fff00'
  if (level >= 60) return '#ffff00'
  return '#ff8c00'
}
</script>

<template>
  <div class="section-container">
    <div class="section-header">
      <div class="section-title">
        <FuzzyDecryptedText
          text=">>> ТЕХНИЧЕСКИЙ СТЕК"
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
          <span class="command">npm list --depth=0</span>
        </div>
      </div>

      <div class="skills-grid">
        <div
          v-for="(category, index) in skillCategories"
          :key="category.title"
          class="skill-category"
          :style="{ animationDelay: `${index * 0.2}s` }"
        >
          <h3 class="category-title">{{ category.title }}</h3>

          <div class="skills-list">
            <div v-for="skill in category.skills" :key="skill.name" class="skill-item">
              <div class="skill-header">
                <span class="skill-name">{{ skill.name }}</span>
                <span class="skill-years">{{ skill.years }}</span>
                <span class="skill-level">{{ skill.level }}%</span>
              </div>

              <div class="skill-bar">
                <div class="skill-bar-bg"></div>
                <div
                  class="skill-bar-fill"
                  :style="{
                    width: getSkillBarWidth(skill.level),
                    backgroundColor: getSkillColor(skill.level),
                    boxShadow: `0 0 10px ${getSkillColor(skill.level)}40`,
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="terminal-output">
        <div class="info-line">
          <span class="prompt">$</span>
          <span class="command">echo "Постоянно изучаю новые технологии..."</span>
        </div>
        <div class="output">
          <p>Следующие в изучении: Svelte, Rust, WebAssembly, Three.js</p>
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

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin: 30px 0;
}

.skill-category {
  background: rgba(0, 255, 71, 0.02);
  border: 1px solid rgba(0, 255, 71, 0.1);
  border-radius: 8px;
  padding: 20px;
  opacity: 0;
  animation: slideInUp 0.6s ease forwards;
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

.category-title {
  color: var(--neon);
  font-family: 'DaysOne', monospace;
  font-size: 16px;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.skills-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.skill-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.skill-name {
  color: rgba(0, 255, 71, 0.9);
  font-weight: 500;
}

.skill-years {
  color: rgba(155, 220, 146, 0.7);
  font-size: 12px;
}

.skill-level {
  color: var(--neon);
  font-family: 'DaysOne', monospace;
  font-size: 12px;
}

.skill-bar {
  position: relative;
  height: 6px;
  border-radius: 3px;
  overflow: hidden;
}

.skill-bar-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 255, 71, 0.1);
  border: 1px solid rgba(0, 255, 71, 0.2);
  border-radius: 3px;
}

.skill-bar-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 3px;
  transition: width 1.5s ease;
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    filter: brightness(1);
  }
  to {
    filter: brightness(1.2);
  }
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
  .skills-grid {
    grid-template-columns: 1fr;
  }

  .skill-header {
    flex-wrap: wrap;
    gap: 5px;
  }
}
</style>
