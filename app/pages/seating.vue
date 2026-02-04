<template>
  <main class="bg-gradient-to-b from-ink to-midnight text-white">
    <section class="mx-auto w-full max-w-screen-lg px-4 pt-12 pb-4 sm:px-6 sm:pt-16 sm:pb-6 md:pt-20">
      <div class="mb-6 flex items-start justify-between gap-4 sm:mb-8">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-white/85">Seating</p>
          <h1 class="mt-2 font-display text-3xl text-gold">席次表</h1>
          <p class="mt-2 text-sm text-white/85">お席のご案内</p>
        </div>
        <NuxtLink to="/" class="btn-secondary btn-sm justify-center home-back-btn">ホームへ戻る</NuxtLink>
      </div>

      <div v-if="hasPdf" class="seating-view-toggle">
        <div class="seating-view-toggle__group">
          <button
            type="button"
            class="seating-fullscreen-btn"
            :class="{ 'is-active': viewMode === 'chart' }"
            @click="setViewMode('chart')"
          >
            席次表を見る
          </button>
          <a
            v-if="seatingPdfViewUrl"
            :href="seatingPdfViewUrl"
            target="_blank"
            rel="noopener"
            class="seating-fullscreen-btn seating-view-link"
          >
            PDFを開く
          </a>
          <button
            type="button"
            class="seating-fullscreen-btn"
            @click="toggleFullscreen"
          >
            {{ fullscreenButtonLabel }}
          </button>
        </div>
      </div>

      <div v-if="hasPdf" v-show="viewMode === 'pdf'" class="seating-pdf-inline">
        <iframe
          class="seating-pdf-frame"
          :src="seatingPdfViewUrl"
          title="席次表PDF"
          loading="lazy"
        ></iframe>
      </div>

      <div
        ref="seatingShellRef"
        class="seating-shell"
        :class="{ 'seating-shell--fullscreen': isFullscreen }"
        v-show="!hasPdf || viewMode === 'chart'"
      >
        <div v-if="!hasPdf" class="seating-controls sm:hidden">
          <button
            type="button"
            class="seating-fullscreen-btn"
            @click="toggleFullscreen"
          >
            {{ fullscreenButtonLabel }}
          </button>
        </div>
        <div
          ref="seatingScrollRef"
          class="seating-scroll"
          :class="{ 'seating-scroll--fullscreen': isFullscreen }"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
          @wheel="onWheel"
        >
        <div ref="seatingSheetRef" class="seating-sheet">
          <div class="seating-header">
            <div class="seating-header__left">
              <p class="seating-kicker-row">
                <span class="seating-sub">席次表</span>
              </p>
            </div>
            <div class="seating-header__center">
              <div class="seating-couple">
                <div v-if="groomName">
                  <span class="seating-label">新郎</span>
                  <span class="seating-name">{{ groomName }}</span>
                </div>
                <div v-if="brideName">
                  <span class="seating-label">新婦</span>
                  <span class="seating-name">{{ brideName }}</span>
                </div>
              </div>
            </div>
            <div class="seating-header__right"></div>
          </div>

          <div class="seating-grid">
            <div v-for="(row, rowIndex) in tableRows" :key="`row-${rowIndex}`" class="seating-row">
              <div
                v-for="(item, itemIndex) in row"
                :key="`cell-${rowIndex}-${itemIndex}`"
                class="seating-cell"
                :class="{ 'seating-cell--empty': item.kind === 'empty' }"
                :style="{ gridColumn: `span ${item.span}` }"
              >
                <template v-if="item.kind === 'table'">
                  <div class="seating-table">
                    <div v-if="item.table.group" class="seating-table__meta">
                      <span class="seating-table__meta-name">{{ item.table.group }}</span>
                    </div>
                    <div class="seating-diagram" :class="seatingClass(item.table)">
                      <div class="seating-column seating-column--left">
                        <div
                          v-for="seat in seatColumns(item.table).left"
                          :key="`${item.table.name}-l-${seat.name}`"
                          class="seating-seat-card"
                        >
                          <span v-if="seat.role" class="seating-seat-role">{{ seat.role }}</span>
                          <span class="seating-seat-name">{{ seat.name }}<span v-if="seatSuffix(seat)" class="seating-seat-suffix">{{ seatSuffix(seat) }}</span></span>
                        </div>
                      </div>
                      <div class="seating-table__circle">
                        <span class="seating-table__center">{{ item.table.name }}</span>
                      </div>
                      <div class="seating-column seating-column--right">
                        <div
                          v-for="seat in seatColumns(item.table).right"
                          :key="`${item.table.name}-r-${seat.name}`"
                          class="seating-seat-card"
                        >
                          <span v-if="seat.role" class="seating-seat-role">{{ seat.role }}</span>
                          <span class="seating-seat-name">{{ seat.name }}<span v-if="seatSuffix(seat)" class="seating-seat-suffix">{{ seatSuffix(seat) }}</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else-if="item.kind === 'pair'">
                  <div class="seating-table-pair">
                    <div
                      v-for="(pairTable, pairIndex) in item.tables"
                      :key="`${pairTable.name}-${pairIndex}`"
                      class="seating-table"
                      :class="pairIndex === 0 ? 'seating-table--paired-left' : 'seating-table--paired-right'"
                    >
                      <div v-if="pairTable.group" class="seating-table__meta">
                        <span class="seating-table__meta-name">{{ pairTable.group }}</span>
                      </div>
                      <div class="seating-diagram" :class="seatingClass(pairTable)">
                        <div class="seating-column seating-column--left">
                          <div
                            v-for="seat in seatColumns(pairTable).left"
                            :key="`${pairTable.name}-l-${seat.name}`"
                            class="seating-seat-card"
                          >
                            <span v-if="seat.role" class="seating-seat-role">{{ seat.role }}</span>
                            <span class="seating-seat-name">{{ seat.name }}<span v-if="seatSuffix(seat)" class="seating-seat-suffix">{{ seatSuffix(seat) }}</span></span>
                          </div>
                        </div>
                        <div class="seating-table__circle">
                          <span class="seating-table__center">{{ pairTable.name }}</span>
                        </div>
                        <div class="seating-column seating-column--right">
                          <div
                            v-for="seat in seatColumns(pairTable).right"
                            :key="`${pairTable.name}-r-${seat.name}`"
                            class="seating-seat-card"
                          >
                            <span v-if="seat.role" class="seating-seat-role">{{ seat.role }}</span>
                            <span class="seating-seat-name">{{ seat.name }}<span v-if="seatSuffix(seat)" class="seating-seat-suffix">{{ seatSuffix(seat) }}</span></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      <p v-show="!hasPdf || viewMode === 'chart'" class="mt-3 hidden text-xs text-white/70 sm:block">※ 横にスクロールできます</p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { useEventData } from '../../composables/useEventData'

type SeatEntry = string | { name: string; role?: string; suffix?: string }
type SeatingTable = { name: string; group?: string; seats: SeatEntry[]; leftCount?: number; pairWithNext?: boolean }
type SeatingRowItem =
  | { kind: 'empty'; span: 1 }
  | { kind: 'table'; span: 1; table: SeatingTable }
  | { kind: 'pair'; span: 2; tables: [SeatingTable, SeatingTable] }

const { displayCouple, seating, seatingPdfUrl, profile, displayDateParts, venue, venueRoom } = useEventData()
const tables = computed(() => seating.value?.tables ?? [])
const isFullscreen = ref(false)
const hasPdf = computed(() => Boolean(seatingPdfUrl.value))
const seatingPdfViewUrl = computed(() => buildPdfViewUrl(seatingPdfUrl.value))
const viewMode = ref<'chart' | 'pdf'>('chart')
const userSelectedView = ref(false)
const seatingShellRef = ref<HTMLElement | null>(null)
const seatingScrollRef = ref<HTMLElement | null>(null)
const seatingSheetRef = ref<HTMLElement | null>(null)
const panX = ref(0)
const panY = ref(0)
const zoom = ref(1)
const pointers = new Map<number, { x: number; y: number }>()
let dragStart = { x: 0, y: 0 }
let panStart = { x: 0, y: 0 }
let zoomStart = 1
let pinchStartDistance = 0
let pinchStartCenter = { x: 0, y: 0 }
const BASE_MIN_ZOOM = 0.8
const MAX_ZOOM = 3.2
const AUTO_FIT_PADDING = 12
const isSmallScreen = ref(false)
const shouldAutoFit = ref(true)
let smallScreenQuery: MediaQueryList | null = null
const updateSmallScreen = () => {
  if (!smallScreenQuery) return
  isSmallScreen.value = smallScreenQuery.matches
}
const tableRows = computed<SeatingRowItem[][]>(() => {
  const cols = 4
  const ordered = [...tables.value]
  const rows: SeatingRowItem[][] = []
  for (let i = 0; i < ordered.length; i += cols) {
    const slice = ordered.slice(i, i + cols)
    while (slice.length < cols) slice.push(null as any)
    const items: SeatingRowItem[] = []
    for (let c = 0; c < cols; c += 1) {
      const table = slice[c] as SeatingTable | null
      if (!table) {
        items.push({ kind: 'empty', span: 1 })
        continue
      }
      if (table.pairWithNext && slice[c + 1]) {
        items.push({ kind: 'pair', span: 2, tables: [table, slice[c + 1] as SeatingTable] })
        c += 1
        continue
      }
      items.push({ kind: 'table', span: 1, table })
    }
    rows.push(items)
  }
  return rows
})

const setViewMode = (mode: 'chart' | 'pdf') => {
  viewMode.value = mode
  userSelectedView.value = true
  if (mode === 'pdf' && isFullscreen.value) {
    isFullscreen.value = false
  }
}

watch([hasPdf, isSmallScreen], ([value]) => {
  if (!value) {
    viewMode.value = 'chart'
    userSelectedView.value = false
    return
  }
  if (!userSelectedView.value) {
    viewMode.value = 'chart'
  }
}, { immediate: true })

watch(viewMode, async (value) => {
  if (!process.client) return
  if (value !== 'chart') return
  shouldAutoFit.value = true
  await nextTick()
  autoFit()
})

function toGivenName(fullName?: string) {
  if (!fullName) return ''
  const parts = fullName.trim().split(/\s+/)
  return parts[parts.length - 1] || ''
}

const groomName = computed(() => toGivenName(profile.value?.groom?.name))
const brideName = computed(() => toGivenName(profile.value?.bride?.name))
const dateLine = computed(() => {
  const date = displayDateParts.value?.date
  if (!date) return ''
  const [y, m, d] = date.split('.')
  const dow = displayDateParts.value?.dow ?? ''
  if (!y || !m || !d) return ''
  return `${y}年${m}月${d}日 ${dow}`
})

function buildPdfViewUrl(url: string) {
  if (!url) return ''
  const [base, hash] = url.split('#')
  if (!hash) return `${base}#page=1&zoom=page-fit`
  const params = new URLSearchParams(hash)
  if (!params.has('page')) params.set('page', '1')
  if (!params.has('view') && !params.has('zoom')) params.set('zoom', 'page-fit')
  return `${base}#${params.toString()}`
}

function normalizeSeat(seat: SeatEntry) {
  if (typeof seat === 'string') return { name: seat }
  return seat
}

function seatColumns(table: SeatingTable) {
  const seats = table.seats.map(normalizeSeat)
  const leftCount = table.leftCount ?? Math.ceil(seats.length / 2)
  return {
    left: seats.slice(0, leftCount),
    right: seats.slice(leftCount)
  }
}

function seatingClass(table: SeatingTable) {
  const columns = seatColumns(table)
  const maxCount = Math.max(columns.left.length, columns.right.length)
  if (maxCount <= 2) return 'seating-diagram--compact'
  if (maxCount <= 3) return 'seating-diagram--snug'
  return 'seating-diagram--dense'
}

function seatSuffix(seat: { suffix?: string }) {
  if (seat.suffix === '') return ''
  return seat.suffix ?? '様'
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getBaseScale() {
  if (!process.client || !seatingShellRef.value) return 1
  const value = getComputedStyle(seatingShellRef.value).getPropertyValue('--seating-scale')
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

function getMinZoom() {
  const scrollEl = seatingScrollRef.value
  const sheetEl = seatingSheetRef.value
  if (!scrollEl || !sheetEl) return BASE_MIN_ZOOM
  const baseScale = getBaseScale()
  const { width: viewWidth, height: viewHeight } = getViewportMetrics()
  const sheetWidth = sheetEl.offsetWidth || 1
  const sheetHeight = sheetEl.offsetHeight || 1
  const fitWidth = viewWidth / sheetWidth / baseScale
  const fitHeight = viewHeight / sheetHeight / baseScale
  return Math.min(BASE_MIN_ZOOM, fitWidth, fitHeight)
}

function getFitZoom() {
  const scrollEl = seatingScrollRef.value
  const sheetEl = seatingSheetRef.value
  if (!scrollEl || !sheetEl) return 1
  const baseScale = getBaseScale()
  const { width: viewWidth, height: viewHeight } = getViewportMetrics()
  const safeWidth = Math.max(1, viewWidth - AUTO_FIT_PADDING * 2)
  const safeHeight = Math.max(1, viewHeight - AUTO_FIT_PADDING * 2)
  const sheetWidth = sheetEl.offsetWidth || 1
  const sheetHeight = sheetEl.offsetHeight || 1
  const fitWidth = safeWidth / sheetWidth / baseScale
  const fitHeight = safeHeight / sheetHeight / baseScale
  const fitZoom = Math.min(1, fitWidth, fitHeight)
  return clamp(fitZoom, getMinZoom(), MAX_ZOOM)
}

function autoFit() {
  applyTransform(0, 0, getFitZoom())
}


function getViewportMetrics() {
  const scrollEl = seatingScrollRef.value
  if (!scrollEl || !process.client) return { width: 1, height: 1, offsetX: 0, offsetY: 0 }
  const style = getComputedStyle(scrollEl)
  const paddingLeft = Number.parseFloat(style.paddingLeft) || 0
  const paddingRight = Number.parseFloat(style.paddingRight) || 0
  const paddingTop = Number.parseFloat(style.paddingTop) || 0
  const paddingBottom = Number.parseFloat(style.paddingBottom) || 0
  const width = Math.max(1, scrollEl.clientWidth - paddingLeft - paddingRight)
  const height = Math.max(1, scrollEl.clientHeight - paddingTop - paddingBottom)
  return { width, height, offsetX: paddingLeft, offsetY: paddingTop }
}

function parseOriginValue(value: string, size: number) {
  if (!value) return 0
  if (value.endsWith('px')) {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  if (value.endsWith('%')) {
    const parsed = Number.parseFloat(value)
    return Number.isFinite(parsed) ? (parsed / 100) * size : 0
  }
  if (value === 'left' || value === 'top') return 0
  if (value === 'center') return size / 2
  if (value === 'right' || value === 'bottom') return size
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function getTransformOrigin(sheetEl: HTMLElement) {
  if (!process.client) return { x: 0, y: 0 }
  const style = getComputedStyle(sheetEl)
  const parts = style.transformOrigin.split(' ')
  const width = sheetEl.offsetWidth || 1
  const height = sheetEl.offsetHeight || 1
  const x = parseOriginValue(parts[0] ?? '0px', width)
  const y = parseOriginValue(parts[1] ?? '0px', height)
  return { x, y }
}

function getZoomPivot(clientX: number, clientY: number, panOffset = { x: panX.value, y: panY.value }) {
  const scrollEl = seatingScrollRef.value
  const sheetEl = seatingSheetRef.value
  if (!scrollEl || !sheetEl) return null
  const scrollRect = scrollEl.getBoundingClientRect()
  const view = getViewportMetrics()
  const origin = getTransformOrigin(sheetEl)
  return {
    x: clientX - scrollRect.left - view.offsetX - origin.x - panOffset.x,
    y: clientY - scrollRect.top - view.offsetY - origin.y - panOffset.y
  }
}

function getAxisBounds(viewSize: number, contentSize: number) {
  if (contentSize <= viewSize) {
    const center = (viewSize - contentSize) / 2
    return { min: center, max: center }
  }
  return { min: viewSize - contentSize, max: 0 }
}

function clampPan(nextX: number, nextY: number, nextZoom: number) {
  const scrollEl = seatingScrollRef.value
  const sheetEl = seatingSheetRef.value
  if (!scrollEl || !sheetEl) return { x: nextX, y: nextY }
  const baseScale = getBaseScale()
  const totalScale = baseScale * nextZoom
  const scaledWidth = sheetEl.offsetWidth * totalScale
  const scaledHeight = sheetEl.offsetHeight * totalScale
  const { width: viewWidth, height: viewHeight } = getViewportMetrics()
  const boundsX = getAxisBounds(viewWidth, scaledWidth)
  const boundsY = getAxisBounds(viewHeight, scaledHeight)
  return {
    x: clamp(nextX, boundsX.min, boundsX.max),
    y: clamp(nextY, boundsY.min, boundsY.max)
  }
}

function applyTransform(nextX: number, nextY: number, nextZoom: number, shouldClamp = true) {
  const minZoom = getMinZoom()
  const clampedZoom = clamp(nextZoom, minZoom, MAX_ZOOM)
  const clamped = shouldClamp ? clampPan(nextX, nextY, clampedZoom) : { x: nextX, y: nextY }
  panX.value = clamped.x
  panY.value = clamped.y
  zoom.value = clampedZoom
  const shell = seatingShellRef.value
  if (!shell) return
  shell.style.setProperty('--seating-offset-x', `${panX.value}px`)
  shell.style.setProperty('--seating-offset-y', `${panY.value}px`)
  shell.style.setProperty('--seating-zoom', String(zoom.value))
}

function getDistance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function getCenter(a: { x: number; y: number }, b: { x: number; y: number }) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
}

function onPointerDown(event: PointerEvent) {
  if (!seatingScrollRef.value) return
  if (event.pointerType === 'mouse' && event.button !== 0) return
  if (event.pointerType === 'touch' && !isFullscreen.value) return
  if (event.pointerType === 'touch' && event.cancelable) event.preventDefault()
  shouldAutoFit.value = false
  seatingScrollRef.value.setPointerCapture(event.pointerId)
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
  if (pointers.size === 1) {
    dragStart = { x: event.clientX, y: event.clientY }
    panStart = { x: panX.value, y: panY.value }
    zoomStart = zoom.value
    pinchStartDistance = 0
  } else if (pointers.size === 2) {
    const [p1, p2] = Array.from(pointers.values())
    pinchStartDistance = getDistance(p1, p2)
    pinchStartCenter = getCenter(p1, p2)
    panStart = { x: panX.value, y: panY.value }
    zoomStart = zoom.value
  }
}

function onPointerMove(event: PointerEvent) {
  if (event.pointerType === 'touch' && !isFullscreen.value) return
  if (!pointers.has(event.pointerId)) return
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
  if (event.pointerType === 'touch' && event.cancelable) event.preventDefault()
  if (pointers.size === 1) {
    const point = Array.from(pointers.values())[0]
    const dx = point.x - dragStart.x
    const dy = point.y - dragStart.y
    applyTransform(panStart.x + dx, panStart.y + dy, zoom.value)
    return
  }
  if (pointers.size === 2) {
    const [p1, p2] = Array.from(pointers.values())
    if (!pinchStartDistance) return
    const distance = getDistance(p1, p2)
    const rawZoom = zoomStart * (distance / pinchStartDistance)
    const minZoom = getMinZoom()
    const nextZoom = clamp(rawZoom, minZoom, MAX_ZOOM)
    const center = getCenter(p1, p2)
    const deltaCenter = { x: center.x - pinchStartCenter.x, y: center.y - pinchStartCenter.y }
    const pivot = getZoomPivot(center.x, center.y, panStart)
    if (!pivot) {
      applyTransform(panStart.x + deltaCenter.x, panStart.y + deltaCenter.y, nextZoom)
      return
    }
    const scaleChange = nextZoom / zoomStart
    const nextX = panStart.x + deltaCenter.x + pivot.x * (1 - scaleChange)
    const nextY = panStart.y + deltaCenter.y + pivot.y * (1 - scaleChange)
    applyTransform(nextX, nextY, nextZoom)
  }
}

function onPointerUp(event: PointerEvent) {
  if (!seatingScrollRef.value) return
  if (event.pointerType === 'touch' && !isFullscreen.value) return
  if (event.pointerType === 'touch' && event.cancelable) event.preventDefault()
  if (seatingScrollRef.value.hasPointerCapture(event.pointerId)) {
    seatingScrollRef.value.releasePointerCapture(event.pointerId)
  }
  if (!pointers.has(event.pointerId)) return
  pointers.delete(event.pointerId)
  if (pointers.size === 1) {
    const point = Array.from(pointers.values())[0]
    dragStart = { x: point.x, y: point.y }
    panStart = { x: panX.value, y: panY.value }
    zoomStart = zoom.value
  } else if (pointers.size === 0) {
    pinchStartDistance = 0
  }
}

function preventGesture(event: Event) {
  event.preventDefault()
}

function onWheel(event: WheelEvent) {
  if (event.ctrlKey) {
    if (!seatingScrollRef.value) return
    if (event.cancelable) event.preventDefault()
    shouldAutoFit.value = false
    const zoomFactor = Math.exp(-event.deltaY * 0.002)
    const minZoom = getMinZoom()
    const nextZoom = clamp(zoom.value * zoomFactor, minZoom, MAX_ZOOM)
    const pivot = getZoomPivot(event.clientX, event.clientY)
    const scaleChange = nextZoom / zoom.value
    const nextX = panX.value + (pivot ? pivot.x : 0) * (1 - scaleChange)
    const nextY = panY.value + (pivot ? pivot.y : 0) * (1 - scaleChange)
    applyTransform(nextX, nextY, nextZoom)
    return
  }
  if (!seatingScrollRef.value || !isFullscreen.value) return
  if (event.cancelable) event.preventDefault()
  shouldAutoFit.value = false
  applyTransform(panX.value - event.deltaX, panY.value - event.deltaY, zoom.value)
}

const handleResize = () => {
  if (shouldAutoFit.value) {
    autoFit()
    return
  }
  applyTransform(panX.value, panY.value, zoom.value)
}

function toggleFullscreen() {
  if (hasPdf.value && viewMode.value !== 'chart') return
  isFullscreen.value = !isFullscreen.value
}

const fullscreenButtonLabel = computed(() => {
  return isFullscreen.value ? '閉じる' : '全画面で見る'
})

let bodyScrollLock: {
  scrollY: number
  styles: { overflow: string; position: string; top: string; width: string }
} | null = null

const lockBodyScroll = () => {
  if (typeof window === 'undefined' || bodyScrollLock) return
  const body = document.body
  bodyScrollLock = {
    scrollY: window.scrollY,
    styles: {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width
    }
  }
  body.style.overflow = 'hidden'
  body.style.position = 'fixed'
  body.style.top = `-${bodyScrollLock.scrollY}px`
  body.style.width = '100%'
}

const unlockBodyScroll = () => {
  if (typeof window === 'undefined' || !bodyScrollLock) return
  const body = document.body
  body.style.overflow = bodyScrollLock.styles.overflow
  body.style.position = bodyScrollLock.styles.position
  body.style.top = bodyScrollLock.styles.top
  body.style.width = bodyScrollLock.styles.width
  const { scrollY } = bodyScrollLock
  bodyScrollLock = null
  window.scrollTo(0, scrollY)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') return
  if (isFullscreen.value) isFullscreen.value = false
}

watch(isFullscreen, async (value) => {
  if (!process.client) return
  if (value) {
    lockBodyScroll()
  } else {
    unlockBodyScroll()
  }
  shouldAutoFit.value = true
  await nextTick()
  if (value) {
    autoFit()
    return
  }
  pointers.clear()
  pinchStartDistance = 0
  autoFit()
})

onMounted(() => {
  smallScreenQuery = window.matchMedia('(max-width: 640px)')
  updateSmallScreen()
  smallScreenQuery.addEventListener('change', updateSmallScreen)
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('resize', handleResize)
  seatingScrollRef.value?.addEventListener('gesturestart', preventGesture, { passive: false } as AddEventListenerOptions)
  seatingScrollRef.value?.addEventListener('gesturechange', preventGesture, { passive: false } as AddEventListenerOptions)
  seatingScrollRef.value?.addEventListener('gestureend', preventGesture, { passive: false } as AddEventListenerOptions)
  requestAnimationFrame(() => {
    if (viewMode.value === 'chart') autoFit()
  })
})

onBeforeUnmount(() => {
  smallScreenQuery?.removeEventListener('change', updateSmallScreen)
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', handleResize)
  seatingScrollRef.value?.removeEventListener('gesturestart', preventGesture as EventListener)
  seatingScrollRef.value?.removeEventListener('gesturechange', preventGesture as EventListener)
  seatingScrollRef.value?.removeEventListener('gestureend', preventGesture as EventListener)
  if (process.client) unlockBodyScroll()
})

useHead(() => {
  const pageTitle = `Seating | ${displayCouple.value}`
  return {
    title: pageTitle,
    meta: [
      { name: 'description', content: '席次表' },
      { property: 'og:title', content: pageTitle }
    ]
  }
})
</script>
