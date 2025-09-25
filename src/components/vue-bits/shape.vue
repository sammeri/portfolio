<template>
  <div ref="shapeBlurContainer" class="shape-blur-container" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, withDefaults, defineProps, useTemplateRef } from 'vue'
import * as THREE from 'three'

/* --- типы и дефолты --- */
interface ShapeBlurProps {
  className?: string
  variation?: number
  pixelRatioProp?: number
  shapeSize?: number
  roundness?: number
  borderSize?: number
  circleSize?: number
  circleEdge?: number
  /** основной цвет — принимает "#rrggbb" или "r,g,b" (0-255) или "rgb(r,g,b)" */
  mainColor?: string
}

const props = withDefaults(defineProps<ShapeBlurProps>(), {
  className: '',
  variation: 0,
  pixelRatioProp: 2,
  shapeSize: 1.2,
  roundness: 0.4,
  borderSize: 0.05,
  circleSize: 0.3,
  circleEdge: 0.5,
  mainColor: '255,255,255', // белый по умолчанию
})

/* --- парсер цвета: принимает "#00ff00" или "0,255,0" или "rgb(0,255,0)" -> возвращает {r,g,b} 0..1 --- */
function parseColorToNormalizedRGB(input?: string) {
  if (!input) return { r: 1, g: 1, b: 1 }
  const s = input.trim()
  // hex: #rrggbb or rrggbb
  const hexMatch = s.match(/^#?([0-9a-fA-F]{6})$/)
  if (hexMatch) {
    const hex = hexMatch[1]
    const r = parseInt(hex.slice(0, 2), 16) / 255
    const g = parseInt(hex.slice(2, 4), 16) / 255
    const b = parseInt(hex.slice(4, 6), 16) / 255
    return { r, g, b }
  }
  // rgb(...) or "r,g,b"
  const rgbMatch = s.match(/(?:rgb\()?\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)?/)
  if (rgbMatch) {
    const r = Math.max(0, Math.min(255, +rgbMatch[1])) / 255
    const g = Math.max(0, Math.min(255, +rgbMatch[2])) / 255
    const b = Math.max(0, Math.min(255, +rgbMatch[3])) / 255
    return { r, g, b }
  }
  // fallback white
  return { r: 1, g: 1, b: 1 }
}

/* --- остальная логика компонента (сохранил твою реализацию) --- */
const shapeBlurContainer = useTemplateRef<HTMLDivElement>('shapeBlurContainer')

let animationFrameId: number
let time = 0
let lastTime = 0
let scene: THREE.Scene
let camera: THREE.OrthographicCamera
let renderer: THREE.WebGLRenderer
let material: THREE.ShaderMaterial
let quad: THREE.Mesh
let resizeObserver: ResizeObserver | null = null

const vMouse = new THREE.Vector2()
const vMouseDamp = new THREE.Vector2()
const vResolution = new THREE.Vector2()

let w = 1
let h = 1

/* --- vertex shader (без изменений) --- */
const vertexShader = /* glsl */ `
varying vec2 v_texcoord;
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    v_texcoord = uv;
}
`

/* --- fragment shader: добавил uniform u_color --- */
const fragmentShader = /* glsl */ `
varying vec2 v_texcoord;

uniform vec3 u_color;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_pixelRatio;

uniform float u_shapeSize;
uniform float u_roundness;
uniform float u_borderSize;
uniform float u_circleSize;
uniform float u_circleEdge;

#ifndef PI
#define PI 3.1415926535897932384626433832795
#endif
#ifndef TWO_PI
#define TWO_PI 6.2831853071795864769252867665590
#endif

#ifndef VAR
#define VAR 0
#endif

#ifndef FNC_COORD
#define FNC_COORD
vec2 coord(in vec2 p) {
    p = p / u_resolution.xy;
    if (u_resolution.x > u_resolution.y) {
        p.x *= u_resolution.x / u_resolution.y;
        p.x += (u_resolution.y - u_resolution.x) / u_resolution.y / 2.0;
    } else {
        p.y *= u_resolution.y / u_resolution.x;
        p.y += (u_resolution.x - u_resolution.y) / u_resolution.x / 2.0;
    }
    p -= 0.5;
    p *= vec2(-1.0, 1.0);
    return p;
}
#endif

#define st0 coord(gl_FragCoord.xy)
#define mx coord(u_mouse * u_pixelRatio)

float sdRoundRect(vec2 p, vec2 b, float r) {
    vec2 d = abs(p - vec2(0.5)) * 4.2 - b + vec2(r);
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
}
float sdCircle(in vec2 st, in vec2 center) {
    return length(st - center) * 2.0;
}
float sdPoly(in vec2 p, in float w, in int sides) {
    float a = atan(p.x, p.y) + PI;
    float r = TWO_PI / float(sides);
    float d = cos(floor(0.5 + a / r) * r - a) * length(max(abs(p) * 1.0, 0.0));
    return d * 2.0 - w;
}

float aastep(float threshold, float value) {
    float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
    return smoothstep(threshold - afwidth, threshold + afwidth, value);
}
float fill(in float x) { return 1.0 - aastep(0.0, x); }
float fill(float x, float size, float edge) {
    return 1.0 - smoothstep(size - edge, size + edge, x);
}
float stroke(in float d, in float t) { return (1.0 - aastep(t, abs(d))); }
float stroke(float x, float size, float w, float edge) {
    float d = smoothstep(size - edge, size + edge, x + w * 0.5) - smoothstep(size - edge, size + edge, x - w * 0.5);
    return clamp(d, 0.0, 1.0);
}

float strokeAA(float x, float size, float w, float edge) {
    float afwidth = length(vec2(dFdx(x), dFdy(x))) * 0.70710678;
    float d = smoothstep(size - edge - afwidth, size + edge + afwidth, x + w * 0.5)
            - smoothstep(size - edge - afwidth, size + edge + afwidth, x - w * 0.5);
    return clamp(d, 0.0, 1.0);
}

void main() {
    vec2 st = st0 + 0.5;
    vec2 posMouse = mx * vec2(1., -1.) + 0.5;

    float size = u_shapeSize;
    float roundness = u_roundness;
    float borderSize = u_borderSize;
    float circleSize = u_circleSize;
    float circleEdge = u_circleEdge;

    float sdfCircle = fill(
        sdCircle(st, posMouse),
        circleSize,
        circleEdge
    );

    float sdf;
    if (VAR == 0) {
        sdf = sdRoundRect(st, vec2(size), roundness);
        sdf = strokeAA(sdf, 0.0, borderSize, sdfCircle) * 4.0;
    } else if (VAR == 1) {
        sdf = sdCircle(st, vec2(0.5));
        sdf = fill(sdf, 0.6, sdfCircle) * 1.2;
    } else if (VAR == 2) {
        sdf = sdCircle(st, vec2(0.5));
        sdf = strokeAA(sdf, 0.58, 0.02, sdfCircle) * 4.0;
    } else if (VAR == 3) {
        sdf = sdPoly(st - vec2(0.5, 0.45), 0.3, 3);
        sdf = fill(sdf, 0.05, sdfCircle) * 1.4;
    }

    vec3 color = u_color; // <-- use the uniform color
    float alpha = sdf;
    gl_FragColor = vec4(color.rgb, alpha);
}
`

/* --- pointer, resize, update функции без изменений --- */
const onPointerMove = (e: PointerEvent | MouseEvent) => {
  const mount = shapeBlurContainer.value
  if (!mount) return
  const rect = mount.getBoundingClientRect()
  vMouse.set(e.clientX - rect.left, e.clientY - rect.top)
}

const resize = () => {
  const container = shapeBlurContainer.value
  if (!container) return

  w = container.clientWidth
  h = container.clientHeight
  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  renderer.setSize(w, h, false)
  renderer.setPixelRatio(dpr)

  camera.left = -w / 2
  camera.right = w / 2
  camera.top = h / 2
  camera.bottom = -h / 2
  camera.updateProjectionMatrix()

  quad.scale.set(w, h, 1)
  vResolution.set(w, h).multiplyScalar(dpr)
  material.uniforms.u_pixelRatio.value = dpr
}

const update = () => {
  time = performance.now() * 0.001
  const dt = time - lastTime
  lastTime = time

  vMouseDamp.x = THREE.MathUtils.damp(vMouseDamp.x, vMouse.x, 8, dt)
  vMouseDamp.y = THREE.MathUtils.damp(vMouseDamp.y, vMouse.y, 8, dt)

  renderer.render(scene, camera)
  animationFrameId = requestAnimationFrame(update)
}

/* --- инициализация шейдера: создаём uniform u_color и задаём начальное значение --- */
const initShapeBlur = () => {
  const mount = shapeBlurContainer.value
  if (!mount) return

  scene = new THREE.Scene()
  camera = new THREE.OrthographicCamera()
  camera.position.z = 1

  renderer = new THREE.WebGLRenderer({ alpha: true })
  renderer.setClearColor(0x000000, 0)
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'
  renderer.domElement.style.display = 'block'
  mount.appendChild(renderer.domElement)

  const geo = new THREE.PlaneGeometry(1, 1)

  // parse initial color and create THREE.Color
  const parsed = parseColorToNormalizedRGB(props.mainColor)
  const threeColor = new THREE.Color(parsed.r, parsed.g, parsed.b)

  material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      u_color: { value: threeColor }, // <-- added uniform
      u_mouse: { value: vMouseDamp },
      u_resolution: { value: vResolution },
      u_pixelRatio: { value: props.pixelRatioProp },
      u_shapeSize: { value: props.shapeSize },
      u_roundness: { value: props.roundness },
      u_borderSize: { value: props.borderSize },
      u_circleSize: { value: props.circleSize },
      u_circleEdge: { value: props.circleEdge },
    },
    defines: { VAR: props.variation },
    transparent: true,
  })

  quad = new THREE.Mesh(geo, material)
  scene.add(quad)

  document.addEventListener('mousemove', onPointerMove)
  document.addEventListener('pointermove', onPointerMove)

  resize()

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mount)
  } else {
    window.addEventListener('resize', resize)
  }

  update()
}

/* --- при очистке и т.д. --- */
const cleanup = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }

  if (resizeObserver) {
    resizeObserver.disconnect()
  } else {
    window.removeEventListener('resize', resize)
  }

  document.removeEventListener('mousemove', onPointerMove)
  document.removeEventListener('pointermove', onPointerMove)

  const mount = shapeBlurContainer.value
  if (mount && renderer) {
    mount.removeChild(renderer.domElement)
    renderer.dispose()
  }
}

/* --- следим за изменениями пропов (включая mainColor) --- */
watch(
  () => [
    props.variation,
    props.pixelRatioProp,
    props.shapeSize,
    props.roundness,
    props.borderSize,
    props.circleSize,
    props.circleEdge,
    props.mainColor,
  ],
  () => {
    if (material) {
      material.uniforms.u_pixelRatio.value = props.pixelRatioProp
      material.uniforms.u_shapeSize.value = props.shapeSize
      material.uniforms.u_roundness.value = props.roundness
      material.uniforms.u_borderSize.value = props.borderSize
      material.uniforms.u_circleSize.value = props.circleSize
      material.uniforms.u_circleEdge.value = props.circleEdge
      material.defines.VAR = props.variation
      // update color uniform:
      const parsed = parseColorToNormalizedRGB(props.mainColor)
      if (
        material.uniforms.u_color?.value &&
        (material.uniforms.u_color.value as THREE.Color).setRGB
      ) {
        ;(material.uniforms.u_color.value as THREE.Color).setRGB(parsed.r, parsed.g, parsed.b)
      } else {
        material.uniforms.u_color.value = new THREE.Color(parsed.r, parsed.g, parsed.b)
      }
      material.needsUpdate = true
    }
  },
  { deep: true },
)

onMounted(() => {
  initShapeBlur()
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
.shape-blur-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.shape-blur-container :deep(canvas) {
  width: 100% !important;
  height: 100% !important;
  display: block;
}
</style>
