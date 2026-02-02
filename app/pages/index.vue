<template>
  <main class="min-h-screen bg-gradient-to-b from-ink to-midnight text-white">
    <section class="relative min-h-[62vh] overflow-hidden">
      <div class="absolute inset-0">
        <div class="absolute inset-0 hero-ambient" aria-hidden="true"></div>
      </div>

      <div class="relative z-10 mx-auto flex min-h-[62vh] w-full max-w-screen-lg flex-col justify-start px-4 pt-4 pb-8 sm:px-6 sm:pt-5 sm:pb-10">
        <div class="text-center">
          <div class="mx-auto max-w-xl rounded-3xl hero-panel px-5 py-4 sm:px-6 sm:py-5">
            <h1 class="font-display text-[clamp(2rem,8.8vw,4.15rem)] sm:text-[3.2rem] md:text-[3.8rem] tracking-wide text-white/95 text-shadow-soft whitespace-nowrap">{{ eventLine }}</h1>
            <p class="mt-2 text-[clamp(0.75rem,3.2vw,1rem)] tracking-[0.12em] text-white/85 text-shadow-soft whitespace-nowrap">{{ displayCouple }}</p>
          </div>
        </div>

        <div class="mt-4 sm:mt-6">
          <p class="text-center text-[12px] uppercase tracking-[0.3em] text-white/85">Home</p>

          <div class="mt-2 grid grid-cols-3 gap-2 sm:mt-3 sm:place-items-center sm:gap-3 md:gap-4">
            <button
              v-for="item in storyboardItems"
              :key="item.id"
              type="button"
              class="group story-card relative w-full aspect-[1/1] sm:aspect-auto sm:w-[200px] sm:h-[250px] md:w-[230px] md:h-[288px] lg:w-[240px] lg:h-[300px] border border-gold/30 bg-white/5 text-left shadow-[0_18px_36px_-26px_rgba(0,0,0,.55)] transition duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
              :class="{ 'story-card--seating': item.id === 'seating' }"
              @click="jumpTo(item.to)"
              :aria-label="item.title"
            >
              <NuxtImg
                v-if="item.image"
                :src="item.image"
                alt=""
                :class="[
                  'story-card__media absolute inset-0 h-full w-full',
                  isZoomedOut(item.id) ? 'object-contain bg-midnight/70' : 'object-cover'
                ]"
                width="240"
                height="300"
                :preset="isZoomedOut(item.id) ? 'storyContain' : 'story'"
                loading="lazy"
                decoding="async"
              />
              <span v-if="item.image" class="story-card__overlay" aria-hidden="true"></span>
              <span v-else class="story-card__bg" aria-hidden="true"></span>
              <span class="story-card__body">
                <span class="story-card__caption">
                  <span class="story-card__label">{{ item.label }}</span>
                  <span class="story-card__title">{{ item.title }}</span>
                  <span v-if="item.subtitle" class="story-card__sub">{{ item.subtitle }}</span>
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useEventData } from '../../composables/useEventData'

const { displayCouple, venue, displayDateParts, storyboardItems } = useEventData()
const eventLine = 'Wedding Day Guide'
const zoomOutIds = new Set(['message', 'notes', 'thanks'])

function isZoomedOut(id?: string) {
  return id ? zoomOutIds.has(id) : false
}

function jumpTo(target?: string) {
  if (!target) return
  if (target.startsWith('/')) {
    navigateTo(target)
    return
  }
  navigateTo(`/${target}`)
}

useHead(() => {
  const pageTitle = `${displayCouple.value} | Wedding Day Home`
  const desc = `${displayDateParts.value.date} ${displayDateParts.value.dow} ${venue.value}`
  return {
    title: pageTitle,
    meta: [
      { name: 'description', content: desc },
      { property: 'og:title', content: pageTitle },
      { property: 'og:description', content: desc }
    ]
  }
})
</script>
