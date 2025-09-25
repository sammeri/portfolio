import { defineStore } from 'pinia'

export const useNavigationStore = defineStore('navigation', {
  state: () => ({
    currentSection: 'hero',
    sections: [
      { id: 'about', title: 'Обо мне', icon: '👤' },
      { id: 'skills', title: 'Навыки / стек', icon: '⚡' },
      { id: 'projects', title: 'Кейсы', icon: '🗂️' },
      { id: 'experience', title: 'Опыт', icon: '🎒' },
    ],
    isTransitioning: false,
  }),

  actions: {
    setCurrentSection(sectionId) {
      if (this.currentSection !== sectionId && !this.isTransitioning) {
        this.isTransitioning = true
        this.currentSection = sectionId

        // Сброс флага перехода через небольшую задержку
        setTimeout(() => {
          this.isTransitioning = false
        }, 800)
      }
    },

    getCurrentSectionData() {
      return this.sections.find((section) => section.id === this.currentSection)
    },
  },
})
