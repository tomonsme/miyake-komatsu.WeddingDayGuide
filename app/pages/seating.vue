<template>
  <main class="min-h-screen bg-gradient-to-b from-ink to-midnight text-white">
    <section class="mx-auto w-full max-w-screen-lg px-4 py-12 sm:px-6 sm:py-16 md:py-20">
      <div class="mb-6 flex items-start justify-between gap-4 sm:mb-8">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-white/85">Seating</p>
          <h1 class="mt-2 font-display text-3xl text-gold">席次表</h1>
          <p class="mt-2 text-sm text-white/85">お席のご案内</p>
        </div>
        <NuxtLink to="/" class="btn-secondary btn-sm justify-center">ホームへ戻る</NuxtLink>
      </div>

      <div ref="seatingShellRef" class="seating-shell" :class="{ 'seating-shell--fullscreen': isFullscreen }">
        <div class="seating-controls sm:hidden">
          <div v-if="!isFullscreen" class="seating-hints">
            <span class="seating-pill">横向き推奨</span>
            <span class="seating-pill">横にスクロール</span>
          </div>
          <button
            type="button"
            class="seating-fullscreen-btn"
            :disabled="isToggling"
            :aria-busy="isToggling"
            @click="toggleFullscreen"
          >
            {{ isFullscreen ? '閉じる' : '全画面で見る' }}
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
          @touchstart="onTouchStart"
          @touchmove.prevent="onTouchMove"
          @touchend="onTouchEnd"
          @touchcancel="onTouchEnd"
          @wheel.prevent="onWheel"
        >
        <div ref="seatingSheetRef" class="seating-sheet">
          <div class="seating-header">
            <div class="seating-header__left">
              <p class="seating-kicker-row">
                <span class="seating-kicker">Seating Chart</span>
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
      <p class="mt-3 hidden text-xs text-white/70 sm:block">※ 横にスクロールできます</p>
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

const { displayCouple, seating, profile, displayDateParts, venue, venueRoom } = useEventData()
const tables = computed(() => seating.value?.tables ?? [])
const isFullscreen = ref(false)
const isToggling = ref(false)
const lockRequestId = ref(0)
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
const MAX_ZOOM = 2.2
const DOUBLE_TAP_DELAY = 300
let lastTapAt = 0
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
  const viewWidth = scrollEl.clientWidth
  const sheetWidth = sheetEl.offsetWidth || 1
  const fitWidth = viewWidth / sheetWidth / baseScale
  return Math.min(BASE_MIN_ZOOM, fitWidth)
}

function clampPan(nextX: number, nextY: number, nextZoom: number) {
  const scrollEl = seatingScrollRef.value
  const sheetEl = seatingSheetRef.value
  if (!scrollEl || !sheetEl) return { x: nextX, y: nextY }
  const baseScale = getBaseScale()
  const totalScale = baseScale * nextZoom
  const scaledWidth = sheetEl.offsetWidth * totalScale
  const scaledHeight = sheetEl.offsetHeight * totalScale
  const viewWidth = scrollEl.clientWidth
  const viewHeight = scrollEl.clientHeight
  const maxX = Math.max(0, (scaledWidth - viewWidth) / 2)
  const maxY = Math.max(0, (scaledHeight - viewHeight) / 2)
  return {
    x: clamp(nextX, -maxX, maxX),
    y: clamp(nextY, -maxY, maxY)
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
  if (event.pointerType === 'touch' && event.cancelable) event.preventDefault()
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
  if (!pointers.has(event.pointerId)) return
  if (event.pointerType === 'touch' && event.cancelable) event.preventDefault()
  pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
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
    const scrollRect = seatingScrollRef.value?.getBoundingClientRect()
    if (!scrollRect) {
      applyTransform(panStart.x + deltaCenter.x, panStart.y + deltaCenter.y, nextZoom)
      return
    }
    const centerX = center.x - scrollRect.left - scrollRect.width / 2
    const centerY = center.y - scrollRect.top - scrollRect.height / 2
    const scaleChange = nextZoom / zoomStart
    const nextX = panStart.x + deltaCenter.x + centerX * (1 - scaleChange)
    const nextY = panStart.y + deltaCenter.y + centerY * (1 - scaleChange)
    applyTransform(nextX, nextY, nextZoom)
  }
}

function onPointerUp(event: PointerEvent) {
  if (!seatingScrollRef.value) return
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

function onTouchStart(event: TouchEvent) {
  if (event.cancelable) event.preventDefault()
  if (typeof window !== 'undefined' && 'PointerEvent' in window) return
  if (event.touches.length === 1) {
    const touch = event.touches[0]
    dragStart = { x: touch.clientX, y: touch.clientY }
    panStart = { x: panX.value, y: panY.value }
    zoomStart = zoom.value
    pinchStartDistance = 0
    return
  }
  if (event.touches.length === 2) {
    const [t1, t2] = Array.from(event.touches)
    pinchStartDistance = getDistance({ x: t1.clientX, y: t1.clientY }, { x: t2.clientX, y: t2.clientY })
    pinchStartCenter = getCenter({ x: t1.clientX, y: t1.clientY }, { x: t2.clientX, y: t2.clientY })
    panStart = { x: panX.value, y: panY.value }
    zoomStart = zoom.value
  }
}

function onTouchMove(event: TouchEvent) {
  if (event.cancelable) event.preventDefault()
  if (typeof window !== 'undefined' && 'PointerEvent' in window) return
  if (event.touches.length === 1) {
    const touch = event.touches[0]
    const dx = touch.clientX - dragStart.x
    const dy = touch.clientY - dragStart.y
    applyTransform(panStart.x + dx, panStart.y + dy, zoom.value)
    return
  }
  if (event.touches.length === 2) {
    const [t1, t2] = Array.from(event.touches)
    if (!pinchStartDistance) return
    const distance = getDistance({ x: t1.clientX, y: t1.clientY }, { x: t2.clientX, y: t2.clientY })
    const rawZoom = zoomStart * (distance / pinchStartDistance)
    const minZoom = getMinZoom()
    const nextZoom = clamp(rawZoom, minZoom, MAX_ZOOM)
    const center = getCenter({ x: t1.clientX, y: t1.clientY }, { x: t2.clientX, y: t2.clientY })
    const deltaCenter = { x: center.x - pinchStartCenter.x, y: center.y - pinchStartCenter.y }
    const scrollRect = seatingScrollRef.value?.getBoundingClientRect()
    if (!scrollRect) {
      applyTransform(panStart.x + deltaCenter.x, panStart.y + deltaCenter.y, nextZoom)
      return
    }
    const centerX = center.x - scrollRect.left - scrollRect.width / 2
    const centerY = center.y - scrollRect.top - scrollRect.height / 2
    const scaleChange = nextZoom / zoomStart
    const nextX = panStart.x + deltaCenter.x + centerX * (1 - scaleChange)
    const nextY = panStart.y + deltaCenter.y + centerY * (1 - scaleChange)
    applyTransform(nextX, nextY, nextZoom)
  }
}

function onTouchEnd(event: TouchEvent) {
  if (event.cancelable) event.preventDefault()
  if (typeof window !== 'undefined' && 'PointerEvent' in window) return
  if (event.touches.length === 1) {
    const touch = event.touches[0]
    dragStart = { x: touch.clientX, y: touch.clientY }
    panStart = { x: panX.value, y: panY.value }
    zoomStart = zoom.value
    return
  }
  if (event.touches.length === 0) {
    pinchStartDistance = 0
  }
}

function preventGesture(event: Event) {
  event.preventDefault()
}

function isInsideSeating(event: Event) {
  const root = seatingScrollRef.value
  if (!root) return false
  if (event.composedPath) {
    return event.composedPath().includes(root)
  }
  const target = event.target as Node | null
  return target ? root.contains(target) : false
}

function handleDocumentTouchStart(event: TouchEvent) {
  if (!isInsideSeating(event)) return
  if (event.touches.length > 1 && event.cancelable) {
    event.preventDefault()
  }
}

function handleDocumentTouchMove(event: TouchEvent) {
  if (!isInsideSeating(event)) return
  if (event.cancelable) event.preventDefault()
}

function handleDocumentTouchEnd(event: TouchEvent) {
  if (!isInsideSeating(event)) return
  const now = Date.now()
  if (now - lastTapAt < DOUBLE_TAP_DELAY && event.cancelable) {
    event.preventDefault()
  }
  lastTapAt = now
}

function handleDocumentGesture(event: Event) {
  if (!isInsideSeating(event)) return
  event.preventDefault()
}

function onWheel(event: WheelEvent) {
  if (!seatingScrollRef.value) return
  if (event.ctrlKey) {
    const zoomFactor = Math.exp(-event.deltaY * 0.002)
    const minZoom = getMinZoom()
    const nextZoom = clamp(zoom.value * zoomFactor, minZoom, MAX_ZOOM)
    const rect = seatingScrollRef.value.getBoundingClientRect()
    const centerX = event.clientX - rect.left - rect.width / 2
    const centerY = event.clientY - rect.top - rect.height / 2
    const scaleChange = nextZoom / zoom.value
    const nextX = panX.value + centerX * (1 - scaleChange)
    const nextY = panY.value + centerY * (1 - scaleChange)
    applyTransform(nextX, nextY, nextZoom)
    return
  }
  applyTransform(panX.value - event.deltaX, panY.value - event.deltaY, zoom.value)
}

const handleResize = () => {
  applyTransform(panX.value, panY.value, zoom.value)
}

async function lockOrientation(requestId: number) {
  if (!process.client) return
  const orientation = typeof screen !== 'undefined' ? screen.orientation : undefined
  if (!orientation?.lock) return
  try {
    await orientation.lock('landscape')
  } catch {
    // Ignore unsupported or blocked orientation locks.
  }
  if (requestId !== lockRequestId.value || !isFullscreen.value) {
    unlockOrientation()
  }
}

function unlockOrientation() {
  if (!process.client) return
  const orientation = typeof screen !== 'undefined' ? screen.orientation : undefined
  if (!orientation?.unlock) return
  try {
    orientation.unlock()
  } catch {
    // Ignore unlock errors.
  }
}

async function requestFullscreen(target: HTMLElement | null) {
  if (!process.client || !target) return
  const request =
    target.requestFullscreen ||
    (target as any).webkitRequestFullscreen ||
    (target as any).msRequestFullscreen
  if (!request) return
  try {
    await request.call(target)
  } catch {
    // Ignore fullscreen errors; we still use the overlay fallback.
  }
}

async function exitFullscreen() {
  if (!process.client) return
  const doc = document as any
  const exit = document.exitFullscreen || doc.webkitExitFullscreen || doc.msExitFullscreen
  if (!exit) return
  try {
    await exit.call(document)
  } catch {
    // Ignore exit errors.
  }
}

async function toggleFullscreen() {
  if (isToggling.value) return
  isToggling.value = true
  const next = !isFullscreen.value
  isFullscreen.value = next
  lockRequestId.value += 1
  const requestId = lockRequestId.value
  if (next) {
    await requestFullscreen(seatingShellRef.value)
    await lockOrientation(requestId)
  } else {
    unlockOrientation()
    await exitFullscreen()
  }
  isToggling.value = false
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isFullscreen.value) {
    isFullscreen.value = false
  }
}

const handleFullscreenChange = () => {
  if (!process.client) return
  const doc = document as any
  const active = Boolean(document.fullscreenElement || doc.webkitFullscreenElement || doc.msFullscreenElement)
  if (!active && isFullscreen.value) {
    isFullscreen.value = false
    unlockOrientation()
  }
}

watch(isFullscreen, (value) => {
  if (!process.client) return
  document.body.style.overflow = value ? 'hidden' : ''
  requestAnimationFrame(() => applyTransform(panX.value, panY.value, zoom.value))
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
  window.addEventListener('resize', handleResize)
  seatingScrollRef.value?.addEventListener('gesturestart', preventGesture, { passive: false } as AddEventListenerOptions)
  seatingScrollRef.value?.addEventListener('gesturechange', preventGesture, { passive: false } as AddEventListenerOptions)
  seatingScrollRef.value?.addEventListener('gestureend', preventGesture, { passive: false } as AddEventListenerOptions)
  document.addEventListener('touchstart', handleDocumentTouchStart, { passive: false, capture: true })
  document.addEventListener('touchmove', handleDocumentTouchMove, { passive: false, capture: true })
  document.addEventListener('touchend', handleDocumentTouchEnd, { passive: false, capture: true })
  document.addEventListener('gesturestart', handleDocumentGesture, { passive: false, capture: true })
  document.addEventListener('gesturechange', handleDocumentGesture, { passive: false, capture: true })
  document.addEventListener('gestureend', handleDocumentGesture, { passive: false, capture: true })
  requestAnimationFrame(() => applyTransform(panX.value, panY.value, zoom.value))
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  window.removeEventListener('resize', handleResize)
  seatingScrollRef.value?.removeEventListener('gesturestart', preventGesture as EventListener)
  seatingScrollRef.value?.removeEventListener('gesturechange', preventGesture as EventListener)
  seatingScrollRef.value?.removeEventListener('gestureend', preventGesture as EventListener)
  document.removeEventListener('touchstart', handleDocumentTouchStart, true)
  document.removeEventListener('touchmove', handleDocumentTouchMove, true)
  document.removeEventListener('touchend', handleDocumentTouchEnd, true)
  document.removeEventListener('gesturestart', handleDocumentGesture, true)
  document.removeEventListener('gesturechange', handleDocumentGesture, true)
  document.removeEventListener('gestureend', handleDocumentGesture, true)
  if (process.client) document.body.style.overflow = ''
  unlockOrientation()
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
