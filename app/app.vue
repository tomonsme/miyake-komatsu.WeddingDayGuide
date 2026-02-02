<template>
  <div
    class="min-h-screen relative overflow-x-hidden"
    :class="{
      'is-game-arcade': route.path === '/guide',
      'font-serif bg-gradient-to-b from-ink to-midnight': route.path !== '/guide'
    }"
  >
    <!-- Subtle gold particles in the distance -->
    <GoldParticles v-if="route.path !== '/guide'" class="pointer-events-none absolute inset-0 z-0" />
    <Sparkles v-if="route.path !== '/guide'" class="pointer-events-none absolute inset-0 z-[1]" />
    <NuxtLoadingIndicator color="#BDA06A" /> <!-- gold accent for loading -->
    <NuxtRouteAnnouncer />
    <SiteHeader />
    <NuxtPage />
    <SiteFooter />
    <!-- Soft light reveal on initial load -->
    <LightReveal v-if="route.path !== '/guide'" />
  </div>
  
</template>

<script setup lang="ts">
// Use explicit relative imports to avoid alias resolution issues during dev
import SiteHeader from '../components/SiteHeader.vue'
import SiteFooter from '../components/SiteFooter.vue'
import GoldParticles from '../components/GoldParticles.vue'
import LightReveal from '../components/LightReveal.vue'
import Sparkles from '../components/Sparkles.vue'

const route = useRoute()

onMounted(() => {
  const nodes = Array.from(document.querySelectorAll('section')) as HTMLElement[]
  const set = new Set<HTMLElement>()
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        (e.target as HTMLElement).classList.add('is-in')
        set.add(e.target as HTMLElement)
        if (set.size === nodes.length) io.disconnect()
      }
    })
  }, { threshold: 0.15 })
  nodes.forEach((n) => {
    n.classList.add('reveal')
    io.observe(n)
  })
})
</script>
