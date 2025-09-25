<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

interface FuzzyDecryptProps {
  text: string
  speed?: number
  characters?: string
  baseIntensity?: number
  hoverIntensity?: number
  fontSize?: number
  fontFamily?: string
  color?: string
}

const props = withDefaults(defineProps<FuzzyDecryptProps>(), {
  speed: 25,
  characters: 'abcdefghijklmnopqrstuvwxyz!@#%&*_+',
  baseIntensity: 0.2,
  hoverIntensity: 0.5,
  fontSize: 32,
  fontFamily: 'monospace',
  color: '#fff',
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
let isHovering = false

onMounted(() => {
  const canvas = canvasRef.value!
  const ctx = canvas.getContext('2d')!
  const target = props.text

  let revealedIndices = new Set<number>()
  let displayText = ''
  let phase: 'decrypt' | 'fuzzy' = 'decrypt'
  let step = 0
  let frameCounter = 0

  const offscreen = document.createElement('canvas')
  const offCtx = offscreen.getContext('2d')!

  const fuzzRange = 30
  ;(canvas as any).widthAdjusted = false

  const updateCanvasSize = () => {
    ctx.font = `${props.fontSize}px ${props.fontFamily}`
    const metrics = ctx.measureText(target)
    const textWidth = Math.ceil(metrics.width) + fuzzRange * 2

    canvas.width = textWidth
    canvas.height = props.fontSize! // высота = fontSize
    offscreen.width = textWidth
    offscreen.height = canvas.height
    ;(canvas as any).widthAdjusted = false
  }

  updateCanvasSize()

  const handleMouseEnter = () => (isHovering = true)
  const handleMouseLeave = () => (isHovering = false)
  canvas.addEventListener('mouseenter', handleMouseEnter)
  canvas.addEventListener('mouseleave', handleMouseLeave)

  function shuffleText(original: string, revealed: Set<number>): string {
    return original
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' '
        if (revealed.has(i)) return original[i]
        return props.characters![Math.floor(Math.random() * props.characters!.length)]
      })
      .join('')
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.font = `${props.fontSize}px ${props.fontFamily}`
    ctx.fillStyle = props.color
    ctx.textBaseline = 'top'

    const yCenter = (canvas.height - props.fontSize!) / 2

    if (phase === 'decrypt') {
      if (revealedIndices.size < target.length) {
        frameCounter++
        if (frameCounter >= props.speed!) {
          frameCounter = 0
          revealedIndices.add(step)
          step++
        }
        displayText = shuffleText(target, revealedIndices)
      } else {
        displayText = target
        phase = 'fuzzy'
      }

      const textWidth = ctx.measureText(displayText).width
      const xCenter = canvas.width / 2
      ctx.fillText(displayText, xCenter - textWidth / 2, yCenter)
    } else if (phase === 'fuzzy') {
      // Пересчет ширины после дешифровки
      if (!(canvas as any).widthAdjusted) {
        const textWidth = ctx.measureText(target).width
        canvas.width = Math.ceil(textWidth)
        offscreen.width = canvas.width
        ;(canvas as any).widthAdjusted = true
      }

      offCtx.clearRect(0, 0, offscreen.width, offscreen.height)
      offCtx.font = `${props.fontSize}px ${props.fontFamily}`
      offCtx.fillStyle = props.color
      offCtx.textBaseline = 'top'
      offCtx.fillText(target, 0, 0)

      const intensity = isHovering ? props.hoverIntensity! : props.baseIntensity!
      const lineHeight = props.fontSize!

      for (let j = 0; j < lineHeight; j++) {
        const dx = Math.floor(intensity * (Math.random() - 0.5) * fuzzRange)
        ctx.drawImage(offscreen, 0, j, offscreen.width, 1, dx, yCenter + j, offscreen.width, 1)
      }
    }

    requestAnimationFrame(draw)
  }

  draw()

  onUnmounted(() => {
    canvas.removeEventListener('mouseenter', handleMouseEnter)
    canvas.removeEventListener('mouseleave', handleMouseLeave)
  })

  // watch(
  //   () => props.text,
  //   () => {
  //     revealedIndices = new Set()
  //     step = 0
  //     phase = 'decrypt'
  //     updateCanvasSize()
  //   },
  // )
})
</script>

<template>
  <canvas ref="canvasRef"></canvas>
</template>
