<template>
  <main class="bg-gradient-to-b from-ink to-midnight text-white">
    <section class="mx-auto w-full max-w-screen-lg px-4 pt-12 pb-4 sm:px-6 sm:pt-16 sm:pb-6 md:pt-20">
      <div class="mb-6 flex items-start justify-between gap-4 sm:mb-8">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-white/80">Favorites</p>
          <h1 class="mt-2 font-display text-3xl text-gold">推しの写真②</h1>
          <p class="mt-2 text-sm text-white/85">Mihono</p>
        </div>
        <NuxtLink to="/" class="btn-secondary btn-sm justify-center home-back-btn">ホームへ戻る</NuxtLink>
      </div>

      <div class="luxe-card">
        <div class="luxe-card__inner">
          <p class="text-xs uppercase tracking-[0.3em] text-white/75">Album</p>
          <div class="mt-4 grid gap-4">
            <figure v-for="(photo, idx) in photos" :key="photo.src" class="overflow-hidden rounded-2xl border border-gold/20 bg-black/30">
                <NuxtImg
                  :src="photo.src"
                  :alt="photo.title"
                  class="aspect-[4/3] h-auto w-full object-cover"
                  :style="photo.position ? { objectPosition: photo.position } : undefined"
                  width="960"
                  height="720"
                  sizes="xs:92vw sm:90vw md:88vw lg:86vw xl:84vw 2xl:640px"
                  preset="album"
                  loading="lazy"
                  decoding="async"
                />
              <figcaption class="border-t border-gold/10 bg-black/40 px-4 py-3 text-sm text-white/80">
                {{ photo.title }}
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
  { src: '/pages/favorites-2/IMG_3344.jpg', title: '笑顔爆発', position: '50% 25%' },
  { src: '/pages/favorites-2/IMG_4945.jpg', title: 'イカを前にした笑顔' },
  { src: '/pages/favorites-2/IMG_5850.jpg', title: 'かっけえっス', position: '45% 20%' },
  { src: '/pages/favorites-2/IMG_8799.jpg', title: 'アナザースカイ' },
  { src: '/pages/favorites-2/IMG_9385.JPG', title: '初のアナ雪アトラクションでテンアゲ' }
]

const { displayCouple } = useEventData()

useHead(() => {
  const pageTitle = `Favorites 2 | ${displayCouple.value}`
  return {
    title: pageTitle,
    meta: [
      { name: 'description', content: '推しの写真②' },
      { property: 'og:title', content: pageTitle }
    ]
  }
})
</script>
