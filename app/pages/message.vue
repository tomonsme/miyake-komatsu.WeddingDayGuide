<template>
  <main class="min-h-screen bg-gradient-to-b from-ink to-midnight text-white">
    <section class="mx-auto w-full max-w-screen-lg px-4 py-12 sm:px-6 sm:py-16 md:py-20">
      <div class="mb-6 flex items-start justify-between gap-4 sm:mb-8">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-white/85">Message</p>
          <h1 class="mt-2 font-display text-3xl text-gold">メッセージ</h1>
          <p class="mt-2 text-sm text-white/85">ご挨拶</p>
        </div>
        <NuxtLink to="/" class="btn-secondary btn-sm justify-center">ホームへ戻る</NuxtLink>
      </div>

      <div class="message-card message-card--clear">
        <div class="message-card__inner">
          <section>
            <div class="text-center">
            </div>

            <div class="mt-5 space-y-4 text-sm leading-relaxed text-white/85 text-center">
              <p v-for="(paragraph, idx) in messageParagraphs" :key="`para-${idx}`">
                <span v-for="(line, lineIdx) in paragraph" :key="`line-${idx}-${lineIdx}`" class="block">{{ line }}</span>
              </p>
            </div>

            <div v-if="messageDate || messageSignature" class="mt-6 text-center text-sm text-white/70">
              <p v-if="messageDate">{{ messageDate }}</p>
              <p v-if="messageSignature" class="mt-1 font-display text-base text-white">{{ messageSignature }}</p>
            </div>
          </section>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useEventData } from '../../composables/useEventData'

const { displayCouple, message } = useEventData()

const messageDate = computed(() => message.value?.date ?? '')
const messageSignature = computed(() => message.value?.signature ?? '')

const messageParagraphs = computed(() => {
  const lines = message.value?.lines ?? []
  const paragraphs: string[][] = []
  let current: string[] = []
  for (const line of lines) {
    if (!line) {
      if (current.length) {
        paragraphs.push(current)
        current = []
      }
      continue
    }
    current.push(line)
  }
  if (current.length) paragraphs.push(current)
  return paragraphs
})

useHead(() => {
  const pageTitle = `Message | ${displayCouple.value}`
  return {
    title: pageTitle,
    meta: [
      { name: 'description', content: 'ご挨拶' },
      { property: 'og:title', content: pageTitle }
    ]
  }
})
</script>
