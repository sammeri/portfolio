<template>
  <div
    ref="cardRef"
    class="relative overflow-hidden"
    :style="{ position: 'relative', overflow: 'hidden' }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted, watch, withDefaults, defineProps } from 'vue'
import { gsap } from 'gsap'

interface Props {
  disableAnimations?: boolean
  particleCount?: number
  glowColor?: string
  enableTilt?: boolean
  clickEffect?: boolean
  enableMagnetism?: boolean
}

const DEFAULT_PARTICLE_COUNT = 12
const DEFAULT_GLOW_COLOR = '0, 200, 83'

const props = withDefaults(defineProps<Props>(), {
  disableAnimations: false,
  particleCount: DEFAULT_PARTICLE_COUNT,
  glowColor: DEFAULT_GLOW_COLOR,
  enableTilt: true,
  clickEffect: false,
  enableMagnetism: false,
})

const cardRef = ref<HTMLDivElement | null>(null)
const particlesRef = ref<HTMLDivElement[]>([])
const timeoutsRef = ref<number[]>([])
const isHoveredRef = ref(false)
const memoizedParticles = ref<HTMLDivElement[]>([])
const particlesInitialized = ref(false)
const magnetismAnimationRef = ref<gsap.core.Tween | null>(null)

const createParticleElement = (
  x: number,
  y: number,
  color: string = DEFAULT_GLOW_COLOR,
): HTMLDivElement => {
  const el = document.createElement('div')
  el.className = 'particle'
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `
  return el
}

const initializeParticles = () => {
  if (particlesInitialized.value || !cardRef.value) return
  const { width, height } = cardRef.value.getBoundingClientRect()
  memoizedParticles.value = Array.from({ length: props.particleCount! }, () =>
    createParticleElement(Math.random() * width, Math.random() * height, props.glowColor),
  )
  particlesInitialized.value = true
}

const clearAllParticles = () => {
  // clear timeouts
  timeoutsRef.value.forEach((id) => clearTimeout(id))
  timeoutsRef.value = []
  // kill magnetism tween
  magnetismAnimationRef.value?.kill()
  // animate out and remove
  particlesRef.value.forEach((particle) => {
    gsap.to(particle, {
      scale: 0,
      opacity: 0,
      duration: 0.28,
      ease: 'back.in(1.7)',
      onComplete: () => particle.parentNode?.removeChild(particle),
    })
  })
  particlesRef.value = []
  particlesInitialized.value = false // allow re-init later if wanted
  memoizedParticles.value = []
}

const animateParticles = () => {
  if (!cardRef.value || !isHoveredRef.value || props.disableAnimations) return
  if (!particlesInitialized.value) initializeParticles()

  memoizedParticles.value.forEach((particle, index) => {
    const timeoutId = window.setTimeout(() => {
      if (!isHoveredRef.value || !cardRef.value) return
      const clone = particle.cloneNode(true) as HTMLDivElement
      cardRef.value!.appendChild(clone)
      particlesRef.value.push(clone)

      gsap.fromTo(
        clone,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' },
      )

      gsap.to(clone, {
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 100,
        rotation: Math.random() * 360,
        duration: 2 + Math.random() * 2,
        ease: 'none',
        repeat: -1,
        yoyo: true,
      })

      gsap.to(clone, {
        opacity: 0.3,
        duration: 1.5,
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true,
      })
    }, index * 100)

    timeoutsRef.value.push(timeoutId as unknown as number)
  })
}

let cleanupEventListeners: (() => void) | null = null

const setupEventListeners = () => {
  if (props.disableAnimations || !cardRef.value) return
  const el = cardRef.value

  const handleMouseEnter = () => {
    isHoveredRef.value = true
    animateParticles()
    gsap.to(el, { y: -2, duration: 0.3, ease: 'power2.out' })

    if (props.enableTilt) {
      gsap.to(el, {
        rotateX: 5,
        rotateY: 5,
        duration: 0.3,
        ease: 'power2.out',
        transformPerspective: 1000,
      })
    }
  }

  const handleMouseLeave = () => {
    isHoveredRef.value = false
    clearAllParticles()

    if (props.enableTilt) {
      gsap.to(el, {
        rotateX: 0,
        rotateY: 0,
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
      })
    }
    if (props.enableMagnetism) {
      gsap.to(el, { x: 0, y: 0, duration: 0.3, ease: 'power2.out' })
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!props.enableTilt && !props.enableMagnetism) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    if (props.enableTilt) {
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

    if (props.enableMagnetism) {
      const magnetX = (x - centerX) * 0.05
      const magnetY = (y - centerY) * 0.05
      magnetismAnimationRef.value = gsap.to(el, {
        x: magnetX,
        y: magnetY,
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }

  const handleClick = (e: MouseEvent) => {
    if (!props.clickEffect) return
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
      background: radial-gradient(circle, rgba(${props.glowColor}, 0.4) 0%, rgba(${props.glowColor}, 0.2) 30%, transparent 70%);
      left: ${x - maxDistance}px;
      top: ${y - maxDistance}px;
      pointer-events: none;
      z-index: 1000;
    `

    el.appendChild(ripple)

    gsap.fromTo(
      ripple,
      { scale: 0, opacity: 1 },
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
  el.addEventListener('mouseleave', handleMouseLeave)
  el.addEventListener('mousemove', handleMouseMove)
  el.addEventListener('click', handleClick)

  cleanupEventListeners = () => {
    isHoveredRef.value = false
    el.removeEventListener('mouseenter', handleMouseEnter)
    el.removeEventListener('mouseleave', handleMouseLeave)
    el.removeEventListener('mousemove', handleMouseMove)
    el.removeEventListener('click', handleClick)
    clearAllParticles()
  }
}

onMounted(() => {
  nextTick(() => {
    setupEventListeners()
  })
})

onUnmounted(() => {
  cleanupEventListeners?.()
})

// re-setup if relevant props change
watch(
  () => [
    props.disableAnimations,
    props.enableTilt,
    props.enableMagnetism,
    props.clickEffect,
    props.glowColor,
  ],
  () => {
    cleanupEventListeners?.()
    setupEventListeners()
  },
  { deep: false },
)
</script>

<style scoped></style>
