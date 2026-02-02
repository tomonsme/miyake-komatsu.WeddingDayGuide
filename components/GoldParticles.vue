<template>
  <canvas ref="canvas" class="block w-full h-full"></canvas>
</template>

<script setup lang="ts">
const canvas = ref<HTMLCanvasElement | null>(null)

interface P { x: number; y: number; r: number; vx: number; vy: number; a: number; hue: number }
let particles: P[] = []
let raf = 0

function rand(min: number, max: number) { return Math.random() * (max - min) + min }

function init(c: HTMLCanvasElement) {
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  const rect = c.getBoundingClientRect()
  c.width = Math.floor(rect.width * dpr)
  c.height = Math.floor(rect.height * dpr)
  const count = Math.max(48, Math.floor((rect.width * rect.height) / 28000))
  particles = new Array(count).fill(0).map(() => ({
    x: rand(0, c.width),
    y: rand(0, c.height),
    r: rand(0.6, 1.8) * dpr,
    vx: rand(-0.04, 0.04) * dpr,
    vy: rand(0.02, 0.08) * dpr,
    a: rand(0.35, 0.75),
    hue: rand(42, 48) // warm gold hue
  }))
}

function draw(c: HTMLCanvasElement) {
  const ctx = c.getContext('2d')!
  ctx.clearRect(0, 0, c.width, c.height)
  ctx.globalCompositeOperation = 'lighter'
  for (const p of particles) {
    // motion
    p.x += p.vx + Math.sin((p.y + p.x) * 0.0008) * 0.06
    p.y += p.vy
    if (p.y > c.height + 8) { p.y = -8; p.x = rand(0, c.width) }
    if (p.x < -8) p.x = c.width + 8
    if (p.x > c.width + 8) p.x = -8
    // glow point
    const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4)
    grd.addColorStop(0, `hsla(${p.hue}, 70%, 76%, ${p.a})`)
    grd.addColorStop(1, 'hsla(0, 0%, 100%, 0)')
    ctx.fillStyle = grd
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2)
    ctx.fill()
  }
}

function loop() {
  if (!canvas.value) return
  draw(canvas.value)
  raf = requestAnimationFrame(loop)
}

function handleResize() {
  if (!canvas.value) return
  init(canvas.value)
}

onMounted(() => {
  if (!canvas.value) return
  init(canvas.value)
  window.addEventListener('resize', handleResize, { passive: true })
  raf = requestAnimationFrame(loop)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
:host { display: block; }
</style>

