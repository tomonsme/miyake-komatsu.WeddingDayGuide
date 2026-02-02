<template>
  <transition name="fade">
    <div v-if="show" class="pointer-events-none fixed inset-0 z-[70]" aria-hidden="true">
      <div class="absolute inset-0" :style="styleA"></div>
      <div class="absolute inset-0" :style="styleB"></div>
    </div>
  </transition>
</template>

<script setup lang="ts">
const show = ref(true)
const styleA = {
  background: 'radial-gradient(60% 40% at 50% 20%, rgba(255,255,255,.12), rgba(255,255,255,0) 70%)'
}
const styleB = {
  background: 'linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,0))',
  mixBlendMode: 'soft-light'
} as any

onMounted(() => {
  setTimeout(() => { show.value = false }, 700)
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 400ms ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

