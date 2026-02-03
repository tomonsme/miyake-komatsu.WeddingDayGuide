<template>
  <main class="overflow-x-hidden bg-gradient-to-b from-ink to-midnight text-white">
    <section class="mx-auto w-full max-w-screen-lg px-4 pt-8 pb-4 sm:px-6 sm:pt-12 sm:pb-6 md:pt-14">
      <div class="mb-4 flex items-start justify-between gap-4 sm:mb-6">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-white/85">Photos</p>
          <h1 class="mt-2 font-display text-3xl text-gold">{{ photo.title }}</h1>
          <p v-if="photo.subtitle" class="mt-2 text-sm text-white/85">{{ photo.subtitle }}</p>
        </div>
        <NuxtLink to="/" class="btn-secondary btn-sm justify-center whitespace-nowrap home-back-btn">ホームへ戻る</NuxtLink>
      </div>

      <div class="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div class="grid gap-3 min-w-0">
          <div class="luxe-card">
            <div class="luxe-card__inner p-4">
              <div class="flex flex-wrap items-center gap-1 text-[10px] uppercase tracking-[0.28em] text-white/55">
              </div>

              <div class="mt-3 share-frame share-frame--compact">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <p class="share-frame__title">Files</p>
                  <span v-if="selectedItems.length" class="text-[10px] uppercase tracking-[0.28em] text-white/60">
                    {{ fileCountLabel }}
                  </span>
                </div>
                <div
                  class="mt-3 share-picker share-picker--compact cursor-pointer text-center"
                  @click="openFilePicker"
                >
                  <input
                    ref="fileInput"
                    type="file"
                    class="sr-only"
                    accept="image/*,video/*"
                    multiple
                    @change="onFileChange"
                  />
                  <p class="text-[11px] text-white/70">タップしてファイルを選択</p>
                </div>

                <p v-if="uploadError" class="mt-3 text-xs text-rose-200" role="alert">{{ uploadError }}</p>

                <div v-if="selectedItems.length" class="mt-3 w-full">
                  <div class="flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-white/60">
                    <span>Preview</span>
                    <span class="text-white/50">横にスワイプ</span>
                  </div>
                  <div ref="previewScroller" class="mt-1 share-preview-wrap">
                    <div
                      v-for="(item, idx) in selectedItems"
                      :key="`${item.file.name}-${item.file.size}-${idx}`"
                      class="share-preview__item"
                    >
                      <img
                        v-if="!item.isVideo"
                        :src="item.url"
                        :alt="item.file.name"
                        class="share-preview__media"
                        loading="lazy"
                        decoding="async"
                      />
                      <video
                        v-else
                        :src="item.url"
                        class="share-preview__media"
                        muted
                        playsinline
                        preload="metadata"
                      ></video>
                      <span v-if="item.isVideo" class="share-preview__badge">VIDEO</span>
                      <button type="button" class="share-preview__remove" @click="removeFile(idx)" aria-label="削除">×</button>
                    </div>
                  </div>
                  <div class="mt-2 flex flex-wrap items-center justify-between gap-1 text-xs text-white/60">
                    <span>{{ fileCountLabel }}</span>
                    <span>{{ totalSizeLabel }}</span>
                    <button
                      type="button"
                      class="text-[10px] uppercase tracking-[0.28em] text-white/60 transition disabled:opacity-60"
                      :disabled="uploadState === 'uploading'"
                      @click="clearSelected"
                    >
                      選択をクリア
                    </button>
                  </div>
                </div>
              </div>

              <div class="mt-3 share-frame share-frame--compact">
                <p class="share-frame__title">Sender</p>
                <div class="mt-3">
                  <label for="sender" class="text-[10px] uppercase tracking-[0.28em] text-white/60">お名前（任意）</label>
                  <input
                    id="sender"
                    v-model="senderName"
                    type="text"
                    maxlength="20"
                    placeholder="例）Tomoya"
                    class="mt-2 w-full rounded-2xl border border-gold/30 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-gold/60"
                    @input="onNameInput"
                  />
                </div>
                <div class="share-divider share-divider--compact"></div>
                <div class="flex flex-col gap-1 sm:flex-row">
                  <button
                    type="button"
                    class="btn-gold btn-sm w-full sm:w-auto"
                    :disabled="!canUpload"
                    :aria-busy="uploadState === 'uploading'"
                    @click="uploadFiles"
                  >
                    {{ uploadButtonLabel }}
                  </button>
                </div>
                <p v-if="uploadState === 'done'" class="mt-2 text-xs text-gold" role="status">送信しました</p>
                <p v-else-if="uploadState === 'error'" class="mt-2 text-xs text-rose-200" role="status">送信できませんでした</p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid gap-3 min-w-0">
          
          <div class="luxe-card">
            <div class="luxe-card__inner p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs uppercase tracking-[0.3em] text-white/80">Gallery</p>
                  <p class="mt-1 text-[10px] text-white/60">写真 {{ galleryTotal }}件</p>
                </div>
                <span class="text-[10px] uppercase tracking-[0.28em] text-white/45">自動更新</span>
              </div>

              <div v-if="galleryState === 'loading'" class="mt-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center text-xs text-white/70">
                読み込み中...
              </div>
              <div v-else-if="galleryState === 'error'" class="mt-3 rounded-2xl border border-rose-300/30 bg-rose-200/10 px-4 py-5 text-center text-xs text-rose-200">
                {{ galleryError || '読み込みできませんでした' }}
              </div>
              <div v-else-if="slideGroups.length" class="mt-3">
                <div class="relative aspect-[4/3] overflow-hidden rounded-3xl border border-gold/20 bg-black/40">
                  <div
                    v-for="(group, idx) in slideGroups"
                    :key="`group-${idx}`"
                    class="absolute inset-0 transition-opacity duration-700 ease-out"
                    :class="idx === currentSlide ? 'opacity-100' : 'opacity-0'"
                  >
                    <div v-if="isGrouped" class="grid h-full w-full grid-cols-2 grid-rows-2 gap-1 p-1">
                      <div
                        v-for="(item, innerIdx) in group"
                        :key="item.key"
                        class="overflow-hidden rounded-xl bg-black/30"
                      >
                        <img
                          :src="item.url"
                          :alt="`Shared photo ${idx * slideGroupSize + innerIdx + 1}`"
                          class="h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </div>
                    <img
                      v-else
                      :src="group[0].url"
                      :alt="`Shared photo ${idx + 1}`"
                      class="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <button
                    type="button"
                    class="absolute inset-0"
                    :aria-label="isGrouped ? '次のセット' : '次の写真'"
                    @click="nextSlide"
                  ></button>
                  <div class="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-[10px] text-white/70">
                    {{ currentSlide + 1 }} / {{ slideGroups.length }}
                  </div>
                </div>
                <p class="mt-2 text-[10px] text-white/60">
                  {{ isGrouped ? 'タップで次のセットへ' : 'タップで次の写真へ' }}
                </p>
              </div>
              <div v-else class="mt-3 rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-5 text-center text-xs text-white/60">
                まだ写真がありません 送ってくれた写真がここに表示されます 
              </div>
              <p class="mt-2 text-[10px] text-white/55">動画は保存されますが スライドショーには表示されません </p>
            </div>
          </div>

          <div v-if="hasBackupLink" class="luxe-card">
            <div class="luxe-card__inner p-4">
              <p class="text-xs uppercase tracking-[0.3em] text-white/80">Backup Link</p>
              <p class="mt-2 text-xs text-white/75">送信がうまくいかない場合はこちら</p>
              <a
                :href="photo.linkUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-secondary btn-sm mt-4 w-full justify-center"
              >{{ photo.linkLabel || 'リンクを開く' }}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useEventData } from '../../composables/useEventData'

const { displayCouple, photoShare } = useEventData()
const photo = computed(() => photoShare.value)
const hasBackupLink = computed(() => {
  const link = photo.value?.linkUrl || ''
  return Boolean(link)
})

const MAX_FILES = 20
const NAME_KEY = 'wedding-photo-sender'
const SLIDE_GROUP_LIMIT = 11
const SLIDE_GROUP_SIZE = 4
const AUTO_REFRESH_MS = 60000
const ALLOWED_EXTS = ['.jpg', '.jpeg', '.png', '.heic', '.heif', '.webp', '.mp4', '.mov']

const senderName = ref('')

type SelectedItem = { file: File; url: string; isVideo: boolean }
const selectedItems = ref<SelectedItem[]>([])
const uploadState = ref<'idle' | 'uploading' | 'done' | 'error'>('idle')
const uploadError = ref('')

const fileInput = ref<HTMLInputElement | null>(null)
const previewScroller = ref<HTMLDivElement | null>(null)
let previewCleanup: (() => void) | null = null

type GalleryItem = { key: string; url: string; lastModified: string }
type PresignUpload = { key: string; url: string; headers?: Record<string, string> }
type PresignResponse = { uploads: PresignUpload[] }
const galleryItems = ref<GalleryItem[]>([])
const galleryTotal = ref(0)
const galleryState = ref<'idle' | 'loading' | 'error'>('idle')
const galleryError = ref('')
const currentSlide = ref(0)
let slideshowTimer: ReturnType<typeof setInterval> | null = null
let galleryRefreshTimer: ReturnType<typeof setInterval> | null = null

const fileCountLabel = computed(() => `選択 ${selectedItems.value.length}/${MAX_FILES}件`)
const totalSize = computed(() => selectedItems.value.reduce((sum, item) => sum + item.file.size, 0))
const totalSizeLabel = computed(() => `合計 ${formatBytes(totalSize.value)}`)
const canUpload = computed(() => selectedItems.value.length > 0 && uploadState.value !== 'uploading')
const uploadButtonLabel = computed(() => {
  if (uploadState.value === 'uploading') return '送信中...'
  if (selectedItems.value.length > 0) return `${selectedItems.value.length}件を送信`
  return '送信する'
})

const isGrouped = computed(() => galleryItems.value.length > SLIDE_GROUP_LIMIT)
const slideGroupSize = computed(() => (isGrouped.value ? SLIDE_GROUP_SIZE : 1))
const slideGroups = computed(() => {
  const groups: GalleryItem[][] = []
  const size = slideGroupSize.value
  for (let i = 0; i < galleryItems.value.length; i += size) {
    groups.push(galleryItems.value.slice(i, i + size))
  }
  return groups
})

const openFilePicker = () => {
  fileInput.value?.click()
}

const setupPreviewScroller = () => {
  if (previewCleanup) {
    previewCleanup()
    previewCleanup = null
  }
  const scroller = previewScroller.value
  if (!scroller) return
  const onWheel = (event: WheelEvent) => {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
    if (scroller.scrollWidth <= scroller.clientWidth) return
    event.preventDefault()
    scroller.scrollLeft += event.deltaY
  }
  let isDragging = false
  let startX = 0
  let startScrollLeft = 0
  const onPointerDown = (event: PointerEvent) => {
    if (event.button !== 0) return
    if (event.pointerType !== 'mouse') return
    const target = event.target as HTMLElement
    if (target.closest('button')) return
    isDragging = true
    startX = event.clientX
    startScrollLeft = scroller.scrollLeft
    scroller.classList.add('is-dragging')
    scroller.setPointerCapture(event.pointerId)
  }
  const onPointerMove = (event: PointerEvent) => {
    if (!isDragging) return
    const delta = event.clientX - startX
    scroller.scrollLeft = startScrollLeft - delta
  }
  const stopDrag = (event: PointerEvent) => {
    if (!isDragging) return
    isDragging = false
    scroller.classList.remove('is-dragging')
    scroller.releasePointerCapture(event.pointerId)
  }
  scroller.addEventListener('wheel', onWheel, { passive: false })
  scroller.addEventListener('pointerdown', onPointerDown)
  scroller.addEventListener('pointermove', onPointerMove)
  scroller.addEventListener('pointerup', stopDrag)
  scroller.addEventListener('pointercancel', stopDrag)
  scroller.addEventListener('pointerleave', stopDrag)
  previewCleanup = () => {
    scroller.removeEventListener('wheel', onWheel)
    scroller.removeEventListener('pointerdown', onPointerDown)
    scroller.removeEventListener('pointermove', onPointerMove)
    scroller.removeEventListener('pointerup', stopDrag)
    scroller.removeEventListener('pointercancel', stopDrag)
    scroller.removeEventListener('pointerleave', stopDrag)
    scroller.classList.remove('is-dragging')
  }
}

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) addFiles(input.files)
  input.value = ''
}

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes}B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)}KB`
  const mb = kb / 1024
  return `${mb.toFixed(1)}MB`
}

const addFiles = (files: FileList) => {
  uploadError.value = ''
  const next = [...selectedItems.value]
  for (const file of Array.from(files)) {
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'))
    const isAllowedType = file.type.startsWith('image/') || file.type.startsWith('video/')
    const isAllowedExt = ALLOWED_EXTS.includes(ext)
    if (!isAllowedType && !isAllowedExt) {
      uploadError.value = '画像または動画のみ送信できます'
      continue
    }
    if (next.length >= MAX_FILES) {
      uploadError.value = `最大${MAX_FILES}件までです`
      break
    }
    const url = URL.createObjectURL(file)
    next.push({ file, url, isVideo: file.type.startsWith('video/') })
  }
  selectedItems.value = next
  uploadState.value = 'idle'
}

const removeFile = (idx: number) => {
  const removed = selectedItems.value[idx]
  if (removed) URL.revokeObjectURL(removed.url)
  selectedItems.value = selectedItems.value.filter((_, index) => index !== idx)
}

const clearSelected = () => {
  selectedItems.value.forEach((item) => URL.revokeObjectURL(item.url))
  selectedItems.value = []
  uploadState.value = 'idle'
  uploadError.value = ''
}

const onNameInput = () => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(NAME_KEY, senderName.value.trim())
}

const stopSlideshow = () => {
  if (slideshowTimer) clearInterval(slideshowTimer)
  slideshowTimer = null
}

const stopGalleryRefresh = () => {
  if (galleryRefreshTimer) clearInterval(galleryRefreshTimer)
  galleryRefreshTimer = null
}

const startGalleryRefresh = () => {
  stopGalleryRefresh()
  if (typeof window === 'undefined') return
  galleryRefreshTimer = setInterval(() => {
    if (document.visibilityState === 'hidden') return
    void loadGallery({ silent: true })
  }, AUTO_REFRESH_MS)
}

const startSlideshow = () => {
  stopSlideshow()
  if (slideGroups.value.length <= 1) return
  if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
  slideshowTimer = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slideGroups.value.length
  }, 4000)
}

const nextSlide = () => {
  if (!slideGroups.value.length) return
  currentSlide.value = (currentSlide.value + 1) % slideGroups.value.length
}

const formatFetchError = (err: unknown) => {
  const error = err as {
    statusCode?: number
    statusMessage?: string
    message?: string
    data?: { statusCode?: number; statusMessage?: string; message?: string }
  }
  const statusCode = error.statusCode ?? error.data?.statusCode
  const statusMessage = error.statusMessage || error.data?.statusMessage
  const message = error.message || error.data?.message || 'Unknown error'
  const detail = statusCode ? `${statusCode} ${statusMessage || message}` : message
  return { statusCode, statusMessage, message, detail }
}

const loadGallery = async (options: { silent?: boolean; fresh?: boolean } = {}) => {
  const hasItems = galleryItems.value.length > 0
  const showLoading = !options.silent || !hasItems
  if (galleryState.value === 'loading') return
  if (showLoading) galleryState.value = 'loading'
  if (showLoading) galleryError.value = ''
  try {
    const response = await $fetch<{ items: GalleryItem[]; total?: number }>('/api/photos', {
      method: 'GET',
      query: { limit: 40, order: 'latest', fresh: options.fresh ? 1 : undefined }
    })
    galleryItems.value = response.items || []
    galleryTotal.value = typeof response.total === 'number' ? response.total : galleryItems.value.length
    if (showLoading) currentSlide.value = 0
    galleryState.value = 'idle'
    galleryError.value = ''
  } catch (err) {
    const info = formatFetchError(err)
    console.error('gallery fetch failed', info, err)
    if (showLoading) {
      galleryState.value = 'error'
      galleryError.value = `写真の読み込みに失敗しました (${info.detail})`
    } else {
      galleryState.value = 'idle'
    }
  }
}

const onVisibilityChange = () => {
  if (typeof document === 'undefined') return
  if (document.visibilityState === 'visible') void loadGallery({ silent: true, fresh: true })
}

const uploadFiles = async () => {
  if (!canUpload.value) return
  uploadState.value = 'uploading'
  uploadError.value = ''
  try {
    const payload = {
      files: selectedItems.value.map((item) => ({
        name: item.file.name,
        type: item.file.type,
        size: item.file.size
      })),
      name: senderName.value.trim()
    }
    const presign = await $fetch<PresignResponse>('/api/photos/presign', {
      method: 'POST',
      body: payload
    })

    if (!presign.uploads?.length) {
      throw new Error('No presigned uploads returned')
    }

    for (let i = 0; i < selectedItems.value.length; i += 1) {
      const item = selectedItems.value[i]
      const target = presign.uploads[i]
      if (!item || !target) {
        throw new Error('Upload mapping mismatch')
      }
      const response = await fetch(target.url, {
        method: 'PUT',
        headers: target.headers || {},
        body: item.file
      })
      if (!response.ok) {
        let detail = ''
        try {
          detail = await response.text()
        } catch {
          detail = ''
        }
        const message = detail ? `S3 upload failed (${response.status}): ${detail}` : `S3 upload failed (${response.status})`
        throw new Error(message)
      }
    }

    clearSelected()
    uploadState.value = 'done'
    void loadGallery({ fresh: true })
    setTimeout(() => {
      if (uploadState.value === 'done') uploadState.value = 'idle'
    }, 2000)
  } catch (err) {
    uploadState.value = 'error'
    const info = formatFetchError(err)
    console.error('upload failed', info, err)
    uploadError.value = `送信できませんでした (${info.detail})`
  }
}

onMounted(() => {
  if (typeof window === 'undefined') return
  const saved = window.localStorage.getItem(NAME_KEY)
  if (saved) senderName.value = saved
  void loadGallery()
  startGalleryRefresh()
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onBeforeUnmount(() => {
  clearSelected()
  stopSlideshow()
  stopGalleryRefresh()
  document.removeEventListener('visibilitychange', onVisibilityChange)
  if (previewCleanup) previewCleanup()
})

watch(
  () => slideGroups.value.length,
  (len) => {
    if (!len) {
      currentSlide.value = 0
      stopSlideshow()
      return
    }
    if (currentSlide.value >= len) currentSlide.value = 0
    startSlideshow()
  }
)

watch(
  () => selectedItems.value.length,
  async (len) => {
    if (!len) {
      if (previewCleanup) previewCleanup()
      return
    }
    await nextTick()
    setupPreviewScroller()
  }
)

useHead(() => {
  const pageTitle = `Photos | ${displayCouple.value}`
  return {
    title: pageTitle,
    meta: [
      { name: 'description', content: '写真共有' },
      { property: 'og:title', content: pageTitle }
    ]
  }
})
</script>
