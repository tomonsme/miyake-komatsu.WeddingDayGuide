<template>
  <main class="bg-gradient-to-b from-ink to-midnight text-white">
    <section class="mx-auto w-full max-w-screen-lg px-4 pt-12 pb-4 sm:px-6 sm:pt-16 sm:pb-6 md:pt-20">
      <div class="mb-6 flex items-start justify-between gap-4 sm:mb-8">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-white/85">Profile</p>
          <h1 class="mt-2 font-display text-3xl text-gold">プロフィール</h1>
          <p class="mt-2 text-sm text-white/85">新郎新婦のご紹介</p>
        </div>
        <NuxtLink to="/" class="btn-secondary btn-sm justify-center home-back-btn">ホームへ戻る</NuxtLink>
      </div>

      <div class="paper-sheet">
        <div class="paper-sheet__inner grain">
          <section>
            <div class="text-center">
              <p class="profile-heading">Profile</p>
              <p class="mt-1 text-[11px] text-[#b89358]/80">プロフィール</p>
              <div class="divider"></div>
            </div>

            <div class="mt-6 grid grid-cols-2 gap-4">
              <div class="text-center">
                <NuxtImg
                  v-if="groom.image"
                  :src="groom.image"
                  :alt="groom.name"
                  class="profile-photo mx-auto h-24 w-24 sm:h-28 sm:w-28"
                  width="160"
                  height="160"
                  preset="avatar"
                  loading="lazy"
                  decoding="async"
                />
                <p class="mt-3 font-display text-base text-[#2b2a28]">{{ groom.name }}</p>
              </div>
              <div class="text-center">
                <NuxtImg
                  v-if="bride.image"
                  :src="bride.image"
                  :alt="bride.name"
                  class="profile-photo mx-auto h-24 w-24 sm:h-28 sm:w-28"
                  width="160"
                  height="160"
                  preset="avatar"
                  loading="lazy"
                  decoding="async"
                />
                <p class="mt-3 font-display text-base text-[#2b2a28]">{{ bride.name }}</p>
              </div>
            </div>

            <div class="mt-6">
              <table class="profile-table">
                <tbody>
                  <tr v-for="row in profileRows" :key="row.label" class="profile-row">
                    <td class="profile-row__cell">
                      <span v-for="(line, idx) in toLines(row.left)" :key="`left-${row.label}-${idx}`">{{ line }}</span>
                    </td>
                    <th scope="row" class="profile-row__label">{{ row.label }}</th>
                    <td class="profile-row__cell">
                      <span v-for="(line, idx) in toLines(row.right)" :key="`right-${row.label}-${idx}`">{{ line }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useEventData } from '../../composables/useEventData'

const { displayCouple, profile } = useEventData()

const profileRows = computed(() => profile.value?.rows ?? [])
const groom = computed(() => profile.value?.groom ?? { name: '', image: '' })
const bride = computed(() => profile.value?.bride ?? { name: '', image: '' })
function splitProfileLine(value: string) {
  const trimmed = value.trim()
  const match = /^(.+?)(\([^()]+\))$/.exec(trimmed)
  if (match) return [match[1], match[2]]
  return [value]
}
function toLines(value: string | string[] | undefined) {
  if (!value) return []
  const lines = Array.isArray(value) ? value : [value]
  return lines.flatMap((line) => splitProfileLine(line))
}

useHead(() => {
  const pageTitle = `Profile | ${displayCouple.value}`
  return {
    title: pageTitle,
    meta: [
      { name: 'description', content: '新郎新婦のプロフィール' },
      { property: 'og:title', content: pageTitle }
    ]
  }
})
</script>
