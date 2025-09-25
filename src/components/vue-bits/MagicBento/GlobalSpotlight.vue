<template></template>
<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted, watch, withDefaults, defineProps } from 'vue'
import { gsap } from 'gsap'

const DEFAULT_SPOTLIGHT_RADIUS = 300
const DEFAULT_GLOW_COLOR = '0, 200, 83'

/**
 * Props:
 * - gridRef: HTMLDivElement | null  (как в оригинале — ожидается сам DOM-элемент)
 * - disableAnimations, enabled, spotlightRadius, glowColor — с дефолтами
 */
const props = withDefaults(
  defineProps<{
    gridRef: HTMLDivElement | null
    disableAnimations?: boolean
    enabled?: boolean
    spotlightRadius?: number
    glowColor?: string
  }>(),
  {
    disableAnimations: false,
    enabled: true,
    spotlightRadius: DEFAULT_SPOTLIGHT_RADIUS,
    glowColor: DEFAULT_GLOW_COLOR,
  },
)

const spotlightRef = ref<HTMLElement | null>(null)

let cleanupEventListeners: (() => void) | null = null

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
})

const updateCardGlowProperties = (
  card: HTMLElement,
  mouseX: number,
  mouseY: number,
  glow: number,
  radius: number,
) => {
  const rect = card.getBoundingClientRect()
  const relativeX = ((mouseX - rect.left) / rect.width) * 100
  const relativeY = ((mouseY - rect.top) / rect.height) * 100

  card.style.setProperty('--glow-x', `${relativeX}%`)
  card.style.setProperty('--glow-y', `${relativeY}%`)
  card.style.setProperty('--glow-intensity', glow.toString())
  card.style.setProperty('--glow-radius', `${radius}px`)
}

const setupEventListeners = () => {
  // повторяю проверку как в оригинале
  if (props.disableAnimations || !props.gridRef || !props.enabled) return

  const spotlight = document.createElement('div')
  spotlight.className = 'global-spotlight'
  spotlight.style.cssText = `
    position: fixed;
    width: 800px;
    height: 800px;
    border-radius: 50%;
    pointer-events: none;
    background: radial-gradient(circle,
      rgba(${props.glowColor}, 0.15) 0%,
      rgba(${props.glowColor}, 0.08) 15%,
      rgba(${props.glowColor}, 0.04) 25%,
      rgba(${props.glowColor}, 0.02) 40%,
      rgba(${props.glowColor}, 0.01) 65%,
      transparent 70%
    );
    z-index: 200;
    opacity: 0;
    transform: translate(-50%, -50%);
    mix-blend-mode: screen;
  `
  document.body.appendChild(spotlight)
  spotlightRef.value = spotlight

  const handleMouseMove = (e: MouseEvent) => {
    if (!spotlightRef.value || !props.gridRef) return

    const section = props.gridRef.closest('.bento-section')
    const rect = section?.getBoundingClientRect()
    const mouseInside = !!(
      rect &&
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    )

    if (!mouseInside) {
      gsap.to(spotlightRef.value, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
      })
      ;(props.gridRef.querySelectorAll('.card') as NodeListOf<HTMLDivElement>).forEach((card) => {
        card.style.setProperty('--glow-intensity', '0')
      })
      return
    }

    const { proximity, fadeDistance } = calculateSpotlightValues(props.spotlightRadius!)
    let minDistance = Infinity

    ;(props.gridRef.querySelectorAll('.card') as NodeListOf<HTMLDivElement>).forEach((card) => {
      const cardRect = card.getBoundingClientRect()
      const centerX = cardRect.left + cardRect.width / 2
      const centerY = cardRect.top + cardRect.height / 2
      const distance =
        Math.hypot(e.clientX - centerX, e.clientY - centerY) -
        Math.max(cardRect.width, cardRect.height) / 2
      const effectiveDistance = Math.max(0, distance)

      minDistance = Math.min(minDistance, effectiveDistance)

      let glowIntensity = 0
      if (effectiveDistance <= proximity) {
        glowIntensity = 1
      } else if (effectiveDistance <= fadeDistance) {
        glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity)
      }

      updateCardGlowProperties(card, e.clientX, e.clientY, glowIntensity, props.spotlightRadius!)
    })

    gsap.to(spotlightRef.value, {
      left: e.clientX,
      top: e.clientY,
      duration: 0.1,
      ease: 'power2.out',
    })

    const targetOpacity =
      minDistance <= proximity
        ? 0.8
        : minDistance <= fadeDistance
          ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
          : 0

    gsap.to(spotlightRef.value, {
      opacity: targetOpacity,
      duration: targetOpacity > 0 ? 0.2 : 0.5,
      ease: 'power2.out',
    })
  }

  const handleMouseLeave = () => {
    ;(props.gridRef!.querySelectorAll('.card') as NodeListOf<HTMLDivElement>).forEach((card) => {
      card.style.setProperty('--glow-intensity', '0')
    })
    if (spotlightRef.value) {
      gsap.to(spotlightRef.value, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseleave', handleMouseLeave)

  cleanupEventListeners = () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseleave', handleMouseLeave)
    spotlightRef.value?.parentNode?.removeChild(spotlightRef.value!)
    spotlightRef.value = null
  }
}

onMounted(() => {
  nextTick(() => {
    setupEventListeners()
  })
})

onUnmounted(() => {
  cleanupEventListeners?.()
  cleanupEventListeners = null
})

// если пропы меняются — пересоздаём обработчики (как в оригинале)
watch(
  () => props,
  () => {
    if (props.gridRef) {
      cleanupEventListeners?.()
      setupEventListeners()
    }
  },
  { deep: true },
)
</script>

<style scoped>
.global-spotlight {
  pointer-events: none;
  will-change: left, top, opacity;
}
</style>
