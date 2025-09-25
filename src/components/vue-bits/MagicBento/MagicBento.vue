<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import ParticleCard from './ParticleCard.vue'
import GlobalSpotlight from './GlobalSpotlight.vue'
import BentoCardGrid from './BentoCardGrid.vue'

interface BentoCardProps {
  color?: string
  title?: string
  description?: string
  label?: string
  textAutoHide?: boolean
  disableAnimations?: boolean
}

interface BentoProps {
  textAutoHide?: boolean
  enableStars?: boolean
  enableSpotlight?: boolean
  enableBorderGlow?: boolean
  disableAnimations?: boolean
  spotlightRadius?: number
  particleCount?: number
  enableTilt?: boolean
  glowColor?: string
  clickEffect?: boolean
  enableMagnetism?: boolean
}

const DEFAULT_PARTICLE_COUNT = 12
const DEFAULT_SPOTLIGHT_RADIUS = 300
const DEFAULT_GLOW_COLOR = '0, 200, 83'
const MOBILE_BREAKPOINT = 768

const cardData: BentoCardProps[] = [
  { color: '#000C00', title: 'Обо мне' },
  { color: '#000C00', title: 'Навыки / стек' },
  { color: '#000C00', title: 'Кейсы' },
  { color: '#000C00', title: 'Опыт' },
]

const props = withDefaults(defineProps<BentoProps>(), {
  textAutoHide: true,
  enableStars: true,
  enableSpotlight: true,
  enableBorderGlow: true,
  disableAnimations: false,
  spotlightRadius: DEFAULT_SPOTLIGHT_RADIUS,
  particleCount: DEFAULT_PARTICLE_COUNT,
  enableTilt: false,
  glowColor: DEFAULT_GLOW_COLOR,
  clickEffect: true,
  enableMagnetism: true,
}) as BentoProps

const {
  textAutoHide,
  enableStars,
  enableSpotlight,
  enableBorderGlow,
  disableAnimations,
  spotlightRadius,
  particleCount,
  enableTilt,
  glowColor,
  clickEffect,
  enableMagnetism,
} = props

const gridRef = ref<HTMLDivElement | null>(null)

/* mobile detection composable */
const useMobileDetection = () => {
  const isMobile = ref(false)

  const checkMobile = () => {
    isMobile.value = window.innerWidth <= MOBILE_BREAKPOINT
  }

  onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
  })

  return isMobile
}

const isMobile = useMobileDetection()
const cardElements = ref<HTMLDivElement[]>([])

const shouldDisableAnimations = computed(() => disableAnimations || isMobile.value)

const baseClassName = computed(() => {
  return `card flex flex-col justify-between relative w-full max-w-full overflow-hidden transition-[box-shadow] duration-300 ease-in-out  ${
    enableBorderGlow ? 'card--border-glow' : ''
  }`
})

const getCardStyle = (card: BentoCardProps) => ({
  backgroundColor: card.color || 'var(--background-dark)',
  borderColor: 'var(--border-color)',
  // color: 'var(--white)',
  '--glow-x': '50%',
  '--glow-y': '50%',
  '--glow-intensity': '0',
  '--glow-radius': '400px',
})

const setupCardRef = (el: HTMLDivElement | null, index: number) => {
  if (!el) return
  cardElements.value[index] = el

  const handleMouseEnter = () => {
    if (shouldDisableAnimations.value) return
    gsap.to(el, { y: -2, duration: 0.3, ease: 'power2.out' })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (shouldDisableAnimations.value) return

    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    if (enableTilt) {
      const rotateX = ((y - centerY) / centerY) * -10
      const rotateY = ((x - centerX) / centerX) * 10

      gsap.to(el, {
        rotateX,
        rotateY,
        duration: 0.1,
        ease: 'power2.out',
        transformPerspective: 1000,
      })
    }

    if (enableMagnetism) {
      const magnetX = (x - centerX) * 0.05
      const magnetY = (y - centerY) * 0.05

      gsap.to(el, {
        x: magnetX,
        y: magnetY,
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }

  const handleMouseLeave = () => {
    if (shouldDisableAnimations.value) return

    if (enableTilt) {
      gsap.to(el, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.3,
        ease: 'power2.out',
      })
    }

    if (enableMagnetism) {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
      })
    } else {
      gsap.to(el, { y: 0, duration: 0.3, ease: 'power2.out' })
    }
  }

  const handleClick = (e: MouseEvent) => {
    if (!clickEffect || shouldDisableAnimations.value) return

    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const maxDistance = Math.max(
      Math.hypot(x, y),
      Math.hypot(x - rect.width, y),
      Math.hypot(x, y - rect.height),
      Math.hypot(x - rect.width, y - rect.height),
    )

    const ripple = document.createElement('div')
    ripple.style.cssText = `
          position: absolute;
          width: ${maxDistance * 2}px;
          height: ${maxDistance * 2}px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
          left: ${x - maxDistance}px;
          top: ${y - maxDistance}px;
          pointer-events: none;
          z-index: 1000;
        `

    el.appendChild(ripple)

    gsap.fromTo(
      ripple,
      {
        scale: 0,
        opacity: 1,
      },
      {
        scale: 1,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => ripple.remove(),
      },
    )
  }

  el.addEventListener('mouseenter', handleMouseEnter)
  el.addEventListener('mousemove', handleMouseMove)
  el.addEventListener('mouseleave', handleMouseLeave)
  el.addEventListener('click', handleClick)
}
</script>

<template>
  <GlobalSpotlight
    v-if="enableSpotlight"
    :grid-ref="gridRef"
    :disable-animations="shouldDisableAnimations"
    :enabled="enableSpotlight"
    :spotlight-radius="spotlightRadius"
    :glow-color="glowColor"
  />
  <BentoCardGrid :grid-ref="(el) => (gridRef = el)">
    <div class="gap-2 o-grid card-responsive w-full">
      <template v-for="(card, index) in cardData" :key="index">
        <ParticleCard
          v-if="enableStars"
          class="o-tile"
          :class="baseClassName"
          :style="getCardStyle(card)"
          :disable-animations="shouldDisableAnimations"
          :particle-count="particleCount"
          :glow-color="glowColor"
          :enable-tilt="enableTilt"
          :click-effect="clickEffect"
          :enable-magnetism="enableMagnetism"
        >
          <div class="relative flex justify-between gap-3 card__header">
            <span class="text-base card__label">{{ card.label }}</span>
          </div>
          <div class="relative flex flex-col card__content">
            <h3
              :class="`card__title font-normal text-base m-0 mb-1 ${textAutoHide ? 'text-clamp-1' : ''}`"
            >
              {{ card.title }}
            </h3>
            <p
              :class="`card__description text-xs leading-5 opacity-90 ${textAutoHide ? 'text-clamp-2' : ''}`"
            >
              {{ card.description }}
            </p>
          </div>
        </ParticleCard>

        <div
          v-else
          :class="baseClassName"
          :style="getCardStyle(card)"
          :ref="(el) => setupCardRef(el as HTMLDivElement, index)"
        >
          <div class="relative flex justify-between gap-3 card__header">
            <span class="text-base card__label">{{ card.label }}</span>
          </div>
          <div class="relative flex flex-col card__content">
            <h3
              :class="`card__title font-normal text-base m-0 mb-1 ${textAutoHide ? 'text-clamp-1' : ''}`"
            >
              {{ card.title }}
            </h3>
            <p
              :class="`card__description text-xs leading-5 opacity-90 ${textAutoHide ? 'text-clamp-2' : ''}`"
            >
              {{ card.description }}
            </p>
          </div>
        </div>
      </template>
    </div>
  </BentoCardGrid>
</template>

<style scoped>
.bento-section {
  --glow-x: 50%;
  --glow-y: 50%;
  --glow-intensity: 0;
  --glow-radius: 200px;
  --glow-color: v-bind(glowColor);
  --border-color: rgba(0, 255, 71, 0.06);
  --background-dark: #060010;
  --white: hsl(0, 0%, 100%);
}

.card-responsive {
  grid-template-columns: 1fr;
  margin: 0 auto;
  /* backdrop-filter: blur(4px); */
}

@media (min-width: 600px) {
  .card-responsive {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .card-responsive {
    grid-template-columns: repeat(4, 1fr);
  }
}

.card--border-glow::after {
  content: '';
  position: absolute;
  inset: 0;
  padding: 6px;
  background: radial-gradient(
    var(--glow-radius) circle at var(--glow-x) var(--glow-y),
    rgba(v-bind(glowColor), calc(var(--glow-intensity) * 0.8)) 0%,
    rgba(v-bind(glowColor), calc(var(--glow-intensity) * 0.4)) 30%,
    transparent 60%
  );
  border-radius: inherit;
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: subtract;
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.card--border-glow:hover::after {
  opacity: 1;
}

.card--border-glow:hover {
  box-shadow:
    0 4px 20px rgba(46, 24, 78, 0.4),
    0 0 30px rgba(v-bind(glowColor), 0.2);
}

.particle::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: rgba(v-bind(glowColor), 0.2);
  border-radius: 50%;
  z-index: -1;
}

.particle-container:hover {
  box-shadow:
    0 4px 20px rgba(46, 24, 78, 0.2),
    0 0 30px rgba(v-bind(glowColor), 0.2);
}

.text-clamp-1 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.text-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 599px) {
  .card-responsive {
    grid-template-columns: repeat(2, 1fr);
  }

  .card-responsive .card {
    width: 100%;
    min-height: 60px;
  }
}
</style>
