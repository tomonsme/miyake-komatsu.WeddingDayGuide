<template>
  <main class="min-h-screen bg-gradient-to-b from-ink to-midnight text-white">
    <section class="mx-auto w-full max-w-screen-lg px-4 py-12 sm:px-6 sm:py-16 md:py-20">
      <div class="mb-6 flex items-start justify-between gap-4 sm:mb-8">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-white/85">Notes</p>
          <h1 class="mt-2 font-display text-3xl text-gold">お願い</h1>
          <p class="mt-2 text-sm text-white/85">みなさまへのお願い</p>
        </div>
        <NuxtLink to="/" class="btn-secondary btn-sm justify-center">ホームへ戻る</NuxtLink>
      </div>

      <div class="grid gap-6">
        <div class="grid gap-4">
          <div class="grid gap-4 md:grid-cols-2">
            <div v-for="(note, i) in notes" :key="`${note.title}-${i}`" class="luxe-card">
              <div class="luxe-card__inner">
                <div class="flex items-center justify-between">
                  <p class="text-xs uppercase tracking-[0.3em] text-white/80">{{ note.title }}</p>
                  <span class="text-[10px] uppercase tracking-[0.28em] text-white/50">Note {{ i + 1 }}</span>
                </div>
                <p class="mt-3 text-sm leading-relaxed text-white/90 whitespace-pre-line">{{ note.body }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useEventData } from '../../composables/useEventData'

const { displayCouple, notes } = useEventData()

useHead(() => {
  const pageTitle = `Notes | ${displayCouple.value}`
  return {
    title: pageTitle,
    meta: [
      { name: 'description', content: '当日のお願い事項' },
      { property: 'og:title', content: pageTitle }
    ]
  }
})
</script>
