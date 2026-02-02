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
        <div class="seating-scroll" :class="{ 'seating-scroll--fullscreen': isFullscreen }">
        <div class="seating-sheet">
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
const groomName = computed(() => profile.value?.groom?.name ?? '')
const brideName = computed(() => profile.value?.bride?.name ?? '')
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
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
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
