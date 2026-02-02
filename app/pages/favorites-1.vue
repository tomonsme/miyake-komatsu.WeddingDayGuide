<template>
  <main class="min-h-screen bg-gradient-to-b from-ink to-midnight text-white">
    <section class="mx-auto w-full max-w-screen-lg px-4 py-12 sm:px-6 sm:py-16 md:py-20">
      <div class="mb-6 flex items-start justify-between gap-4 sm:mb-8">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-white/80">Favorites</p>
          <h1 class="mt-2 font-display text-3xl text-gold">推しの写真</h1>
          <p class="mt-2 text-sm text-white/85">Tomoya</p>
        </div>
        <NuxtLink to="/" class="btn-secondary btn-sm justify-center">ホームへ戻る</NuxtLink>
      </div>

      <div class="luxe-card">
        <div class="luxe-card__inner">
          <p class="text-xs uppercase tracking-[0.3em] text-white/75">Album</p>
          <div class="mt-4 grid gap-4">
            <figure v-for="(photo, idx) in photos" :key="photo.src" class="overflow-hidden rounded-2xl border border-gold/20 bg-black/30">
              <NuxtImg
                :src="photo.src"
                :alt="`推しの写真 ${idx + 1}`"
                class="aspect-[4/3] h-auto w-full object-cover"
                width="960"
                height="720"
                preset="album"
                loading="lazy"
                decoding="async"
              />
              <figcaption class="px-3 py-2 text-xs text-white/85">
                <span>{{ photo.title }}</span>
                <span v-if="photo.note" class="mt-1 block text-[10px] text-white/60">{{ photo.note }}</span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useEventData } from '../../composables/useEventData'

const photos = [
  { src: '/pages/favorites-1/201582_0.jpg', title: '吉野お花見ニコニコともや' },
  { src: '/pages/favorites-1/201580_0.jpg', title: '軍艦島大晴れ男ともや', note: '(大雨予報でほぼ諦めてたのに流石です)' },
  { src: '/pages/favorites-1/201581_0.jpg', title: '手乗りともや' },
  { src: '/pages/favorites-1/201579_0.jpg', title: 'パリ逃走中ともや' },
  { src: '/pages/favorites-1/201583_0.jpg', title: 'ダッフィー耳ともや', note: '(絶対ダッフィーの耳が良かった小松大満足)' }
]

const { displayCouple } = useEventData()

useHead(() => {
  const pageTitle = `Favorites | ${displayCouple.value}`
  return {
    title: pageTitle,
    meta: [
      { name: 'description', content: '推しの写真' },
      { property: 'og:title', content: pageTitle }
    ]
  }
})
</script>
