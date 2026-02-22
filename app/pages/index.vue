<template>
  <main class="bg-gradient-to-b from-ink to-midnight text-white">
    <section class="mx-auto flex min-h-[70vh] w-full max-w-screen-lg items-center px-4 py-12 sm:px-6 sm:py-16 md:py-20">
      <div class="mx-auto w-full max-w-2xl rounded-3xl border border-gold/35 bg-white/5 p-6 text-center shadow-[0_24px_70px_-40px_rgba(0,0,0,.75)] sm:p-10">
        <p class="text-xs uppercase tracking-[0.3em] text-white/80">Thank You</p>
        <h1 class="mx-auto mt-3 px-2 font-display text-[clamp(0.95rem,5vw,2rem)] leading-tight text-gold whitespace-nowrap">
          ご来場ありがとうございました
        </h1>
        <p class="mx-auto mt-5 max-w-[30ch] text-sm leading-relaxed text-white/85 sm:text-base">
          <span class="block">みなさまのおかげで</span>
          <span class="mt-1 block">かけがえのない一日になりました</span>
        </p>
        <p class="mx-auto mt-3 max-w-[28ch] text-sm leading-relaxed text-white/80 sm:text-base">
          <span class="block">お忙しい中お越しいただき</span>
          <span class="mt-1 block">本当にありがとうございました</span>
        </p>

        <p class="mt-8 text-xs text-white/60">
          {{ displayCouple }}
        </p>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useEventData } from '../../composables/useEventData'

const { displayCouple } = useEventData()

useHead(() => {
  const pageTitle = `Thank You | ${displayCouple.value}`
  return {
    title: pageTitle,
    meta: [
      { name: 'description', content: 'ご来場ありがとうございました' },
      { property: 'og:title', content: pageTitle },
      { property: 'og:description', content: 'ご来場ありがとうございました' }
    ]
  }
})
</script>
