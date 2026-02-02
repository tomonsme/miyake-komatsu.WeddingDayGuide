<template>
  <header
    class="sticky top-0 z-40 w-full border-b border-champagne/40 bg-royal/85 backdrop-blur transition-colors duration-300"
    :class="{ 'bg-royal/95 border-champagne/60': scrolled }"
  >
    <div class="relative mx-auto flex min-h-[var(--header-height)] max-w-screen-lg items-center justify-end px-[var(--header-pad-x)] py-[var(--header-pad-y)]">
      <NuxtLink to="/" class="absolute left-1/2 flex -translate-x-1/2 items-center gap-[var(--header-gap)]">
        <NuxtImg
          src="/shared/favicon.png"
          alt="logo"
          class="h-[var(--header-logo-size)] w-[var(--header-logo-size)]"
          width="48"
          height="48"
          preset="icon"
          decoding="async"
        />
        <span class="font-display text-[var(--header-text-size)] leading-none tracking-wide text-white text-shadow-soft uppercase whitespace-nowrap">Wedding Day</span>
      </NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const scrolled = ref(false)

onMounted(() => {
  const onScrollHeader = () => {
    scrolled.value = window.scrollY > 8
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true })
})
</script>
