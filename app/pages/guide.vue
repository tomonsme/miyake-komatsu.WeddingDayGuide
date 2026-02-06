<template>
  <main class="game-arcade min-h-screen">
    <div
      v-if="tapActive"
      class="game-tap-overlay"
      @pointerdown.prevent="tapHit"
      @touchmove.prevent
      @wheel.prevent
      aria-hidden="true"
    ></div>
    <section class="game-screen">
      <div class="dq-header">
        <div class="dq-title-panel">
          <p class="dq-kicker">EXTRAS</p>
          <h1 class="dq-title">ミニゲーム</h1>
          <p class="dq-subtitle">10秒タップ & 11.11秒ストップ</p>
        </div>
        <NuxtLink to="/" class="dq-home-btn">ホームへ戻る</NuxtLink>
      </div>

      <div class="dq-hud">
        <div class="luxe-card dq-panel">
          <div class="luxe-card__inner dq-panel__inner dq-panel--stats">
            <div class="flex items-center justify-between gap-3">
              <p class="dq-label">ステータス</p>
              <span class="game-chip" :class="hasNickname ? 'game-chip--ready' : 'game-chip--idle'">
                {{ hasNickname ? 'OK' : 'なまえ' }}
              </span>
            </div>
            <p class="mt-1 text-sm text-white">ニックネームを入力するとランキングに反映されます</p>
            <div class="mt-2">
              <label for="nickname" class="dq-label">なまえ</label>
              <input
                id="nickname"
                v-model="nickname"
                type="text"
                maxlength="12"
                placeholder="例）Tomoya"
                class="game-input mt-2 w-full px-4 py-3 text-sm"
                @input="onNicknameInput"
              />
              <div class="mt-1 flex items-center justify-between text-[10px] text-white/55">
                <span>12文字まで</span>
                <span>{{ nicknameCount }}/{{ MAX_NAME_LEN }}</span>
              </div>
              <p v-if="nicknameError" class="mt-1 text-xs text-rose-200">{{ nicknameError }}</p>
            </div>
          </div>
        </div>

        <div class="luxe-card dq-panel dq-panel--command">
          <div class="luxe-card__inner dq-panel__inner">
            <p class="dq-label">ゲームを選択</p>
            <div
              class="mt-3 game-tabs"
              role="tablist"
              aria-label="ミニゲーム"
              @keydown.left.prevent="cycleTab(-1)"
              @keydown.right.prevent="cycleTab(1)"
            >
              <button
                id="tab-tap10"
                type="button"
                class="game-tab"
                role="tab"
                :aria-selected="activeGame === 'tap10'"
                :tabindex="activeGame === 'tap10' ? 0 : -1"
                aria-controls="panel-tap10"
                :class="{ 'is-active': activeGame === 'tap10' }"
                @click="activeGame = 'tap10'"
              >
                <span class="game-tab__label">10秒タップ</span>
                <span class="game-tab__sub">タップ</span>
                <span class="game-tab__meta">
                  <span class="game-chip game-tab__state" :class="tapStatusClass">{{ tapStatusLabel }}</span>
                  <span v-if="tapBest > 0" class="score-pill">Best {{ tapBest }}</span>
                </span>
              </button>
              <button
                id="tab-stop11"
                type="button"
                class="game-tab"
                role="tab"
                :aria-selected="activeGame === 'stop11'"
                :tabindex="activeGame === 'stop11' ? 0 : -1"
                aria-controls="panel-stop11"
                :class="{ 'is-active': activeGame === 'stop11' }"
                @click="activeGame = 'stop11'"
              >
                <span class="game-tab__label">11.11秒ストップ</span>
                <span class="game-tab__sub">ストップ</span>
                <span class="game-tab__meta">
                  <span class="game-chip game-tab__state" :class="stopStatusClass">{{ stopStatusLabel }}</span>
                  <span v-if="stopBestDelta !== null" class="score-pill">Best Δ {{ formatDelta(stopBestDelta) }}</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="luxe-card dq-panel dq-panel--dialog">
        <div class="luxe-card__inner dq-panel__inner" aria-live="polite">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <button
                type="button"
                class="dq-label game-reset-trigger"
                aria-label="ランキングをリセット"
                @pointerdown.prevent="startLeaderboardResetPress"
                @pointerup="cancelLeaderboardResetPress"
                @pointerleave="cancelLeaderboardResetPress"
                @pointercancel="cancelLeaderboardResetPress"
                @contextmenu.prevent
              >
                ランキング
              </button>
              <span v-if="leaderboardReflecting" class="inline-flex items-center">
                <span class="game-spinner game-spinner--sm" aria-hidden="true"></span>
              </span>
            </div>
            <span class="live-badge" :class="liveIndicator ? '' : 'text-white/50 border-white/20'">
              <span class="live-dot" :class="liveIndicator ? 'is-on' : 'is-off'"></span>
              {{ liveIndicator ? 'LIVE' : 'OFFLINE' }}
            </span>
          </div>
          <p class="mt-1 text-sm text-white/85">会場内でリアルタイム更新</p>
          <p class="mt-0.5 text-[10px] text-white/50">※上位3件のみ表示</p>
          <p v-if="leaderboardError" class="mt-1 text-xs text-rose-200">{{ leaderboardError }}</p>
          <div class="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <div class="flex items-center justify-between">
                <p class="dq-label text-white/60">10秒タップ</p>
              </div>
              <ol v-if="leaderboard.tap10.length" class="mt-2 space-y-2 text-xs">
                <li
                  v-for="(entry, idx) in leaderboard.tap10"
                  :key="entry.id"
                  class="game-entry flex items-center justify-between"
                  :class="{ 'is-top': idx === 0 }"
                >
                  <span class="text-white/80">{{ idx + 1 }}. {{ entry.name }}</span>
                  <span class="text-white">{{ entry.score }}</span>
                </li>
              </ol>
              <p v-else class="mt-2 text-xs text-white/60">まだ登録なし</p>
            </div>
            <div>
              <div class="flex items-center justify-between">
                <p class="dq-label text-white/60">11.11秒ストップ</p>
              </div>
              <ol v-if="leaderboard.stop11.length" class="mt-2 space-y-2 text-xs">
                <li
                  v-for="(entry, idx) in leaderboard.stop11"
                  :key="entry.id"
                  class="game-entry flex items-center justify-between"
                  :class="{ 'is-top': idx === 0 }"
                >
                  <div>
                    <p class="text-white/80">{{ idx + 1 }}. {{ entry.name }}</p>
                    <p class="text-[10px] text-white/50">
                      差 {{ formatDelta(entry.meta?.deltaMs ?? entry.score) }}
                    </p>
                  </div>
                  <span class="text-white">{{ formatSeconds(entry.meta?.timeMs ?? stopTargetMs) }}s</span>
                </li>
              </ol>
              <p v-else class="mt-2 text-xs text-white/60">まだ登録なし</p>
            </div>
          </div>
        </div>
      </div>

      <div class="luxe-card dq-panel dq-panel--arena">
        <div class="luxe-card__inner dq-panel__inner">
          <div class="mt-1">
              <section
                id="panel-tap10"
                role="tabpanel"
                aria-labelledby="tab-tap10"
                v-show="activeGame === 'tap10'"
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="dq-label">ゲーム1</p>
                    <h2 class="mt-1 dq-title-sm">10秒タップ</h2>
                    <p class="mt-1 text-xs text-white/80">10秒で何回タップできるか</p>
                  </div>
                  <span class="game-chip" :class="tapStatusClass">{{ tapStatusLabel }}</span>
                </div>

                <div class="mt-3 game-panel game-panel--tap">
                  <div class="game-panel__inner">
                    <div class="grid gap-2">
                      <div class="grid grid-cols-2 gap-2">
                        <div class="game-kpi">
                          <span class="game-kpi__label">Time</span>
                          <span class="game-kpi__value">{{ tapTimeLabel }}s</span>
                        </div>
                        <div class="game-kpi">
                          <span class="game-kpi__label">Taps</span>
                          <span class="game-kpi__value">{{ tapScore }}</span>
                        </div>
                      </div>
                      <div class="game-meter">
                        <div
                          class="game-meter__bar"
                          :style="{ width: `${Math.round(tapProgress * 100)}%` }"
                        ></div>
                      </div>
                      <button
                        type="button"
                        class="game-pad"
                        :class="{ 'is-active': tapActive }"
                        :disabled="!tapActive"
                        @pointerdown.prevent="tapHit"
                        @keydown.space.prevent="tapHit"
                        @keydown.enter.prevent="tapHit"
                      >
                        <span class="game-pad__label">タップ</span>
                        <span class="game-pad__sub">{{ tapActive ? '連打！' : 'スタート後にタップ' }}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div class="mt-3 flex flex-wrap items-center gap-2">
                  <button type="button" class="btn-primary btn-sm" @click="tapStart">
                    {{ tapActive ? 'リスタート' : 'スタート' }}
                  </button>
                  <button
                    type="button"
                    class="btn-secondary btn-sm"
                    :disabled="!tapSubmitReady"
                    :aria-busy="tapSubmitState === 'saving' || tapSubmitState === 'reflecting'"
                    @click="submitTapScore"
                  >
                    <span
                      v-if="tapSubmitState === 'saving' || tapSubmitState === 'reflecting'"
                      class="game-spinner game-spinner--sm"
                      aria-hidden="true"
                    ></span>
                    <span>{{ tapSubmitLabel }}</span>
                  </button>
                </div>
                <p class="mt-2 text-xs text-white/70" aria-live="polite">{{ tapMessage }}</p>
                <div class="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/70">
                  <span v-if="tapActive" class="score-pill">Now {{ tapScore }}</span>
                </div>
                <p v-if="tapSubmitState === 'error'" class="mt-1 text-xs text-rose-200">
                  {{ tapSubmitNotice || '送信できませんでした' }}
                </p>
              </section>

              <section
                id="panel-stop11"
                role="tabpanel"
                aria-labelledby="tab-stop11"
                v-show="activeGame === 'stop11'"
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="dq-label">ゲーム2</p>
                    <h2 class="mt-1 dq-title-sm">11.11秒ストップ</h2>
                    <p class="mt-1 text-xs text-white/80">11.11秒でストップできるか</p>
                  </div>
                  <span class="game-chip" :class="stopStatusClass">{{ stopStatusLabel }}</span>
                </div>

                <div class="mt-3 game-panel game-panel--stop">
                  <div class="game-panel__inner">
                    <div class="flex items-center justify-between">
                      <span class="score-pill">もくひょう 11.11s</span>
                      <span v-if="stopDeltaMs !== null" class="score-pill">差 {{ formatDelta(stopDeltaMs) }}</span>
                    </div>
                    <p class="mt-3 game-timer" :class="{ 'is-hidden': stopActive && stopElapsedMs >= stopHideMs }">
                      {{ stopDisplay }}
                    </p>
                    <div v-if="stopProgressVisible" class="mt-2 game-meter">
                      <div
                        class="game-meter__bar"
                        :style="{ width: `${Math.round(stopProgress * 100)}%` }"
                      ></div>
                    </div>
                    <div v-else class="mt-2 game-meter is-hidden">
                      <div class="game-meter__veil"></div>
                    </div>
                    <p class="mt-2 text-xs text-white/70" aria-live="polite">{{ stopMessage }}</p>
                  </div>
                </div>

                <div class="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    class="btn-sm"
                    :class="stopActive ? 'btn-secondary' : 'btn-primary'"
                    :disabled="stopActive"
                    @click="stopStart"
                  >
                    スタート
                  </button>
                  <button
                    type="button"
                    class="btn-sm"
                    :class="stopActive ? 'btn-primary' : 'btn-secondary'"
                    :disabled="!stopActive"
                    @click="stopStop"
                  >
                    ストップ
                  </button>
                  <button type="button" class="btn-secondary btn-sm" @click="stopReset">リセット</button>
                  <button
                    type="button"
                    class="btn-secondary btn-sm"
                    :disabled="!stopSubmitReady"
                    :aria-busy="stopSubmitState === 'saving' || stopSubmitState === 'reflecting'"
                    @click="submitStopScore"
                  >
                    <span
                      v-if="stopSubmitState === 'saving' || stopSubmitState === 'reflecting'"
                      class="game-spinner game-spinner--sm"
                      aria-hidden="true"
                    ></span>
                    <span>{{ stopSubmitLabel }}</span>
                  </button>
                </div>
                <div class="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/70">
                  <span v-if="stopResultMs !== null" class="score-pill">今回 {{ formatSeconds(stopResultMs) }}s</span>
                </div>
                <p v-if="stopSubmitState === 'error'" class="mt-2 text-xs text-rose-200">
                  {{ stopSubmitNotice || '送信できませんでした' }}
                </p>
              </section>
            </div>
          </div>
        </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useEventData } from '../../composables/useEventData'

type GameId = 'tap10' | 'stop11'

type LeaderboardEntry = {
  id: string
  game: GameId
  name: string
  score: number
  meta?: { timeMs?: number; deltaMs?: number }
  createdAt: number
}

type LeaderboardSnapshot = {
  tap10: LeaderboardEntry[]
  stop11: LeaderboardEntry[]
}

type LeaderboardSubmitResponse = {
  entry: LeaderboardEntry
  snapshot: LeaderboardSnapshot
  rank: number | null
}

type SubmitState = 'idle' | 'saving' | 'reflecting' | 'done' | 'error'

const { displayCouple } = useEventData()

const MAX_NAME_LEN = 12
const NICKNAME_KEY = 'wedding-mini-game-nickname'
const TAP_BEST_KEY = 'wedding-mini-game-tap-best'
const STOP_BEST_KEY = 'wedding-mini-game-stop-best'

const nickname = ref('')
const nicknameError = ref('')
const nicknameCount = computed(() => nickname.value.length)
const hasNickname = computed(() => nickname.value.trim().length > 0)
const activeGame = ref<GameId>('tap10')
const tabOrder: GameId[] = ['tap10', 'stop11']

const cycleTab = (direction: 1 | -1) => {
  const idx = tabOrder.indexOf(activeGame.value)
  const next = (idx + direction + tabOrder.length) % tabOrder.length
  activeGame.value = tabOrder[next]
}

const onNicknameInput = () => {
  if (nickname.value.length > MAX_NAME_LEN) {
    nickname.value = nickname.value.slice(0, MAX_NAME_LEN)
  }
  if (nicknameError.value) nicknameError.value = ''
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(NICKNAME_KEY, nickname.value.trim())
  }
}

const ensureNickname = () => {
  const name = nickname.value.trim()
  if (!name) {
    nicknameError.value = 'ニックネームを入力してください'
    return null
  }
  if (name.length > MAX_NAME_LEN) {
    nicknameError.value = `ニックネームは${MAX_NAME_LEN}文字までです`
    return null
  }
  return name
}

const leaderboard = ref<LeaderboardSnapshot>({ tap10: [], stop11: [] })
const liveConnected = ref(false)
const leaderboardError = ref('')
const leaderboardUpdatedAt = ref<number | null>(null)
const nowTick = ref(Date.now())

const MAX_LEADERBOARD_ENTRIES = 3
const POLL_FAST_MS = 2000
const POLL_SLOW_MS = 6000
const STREAM_STALE_MS = 30000
const RECONNECT_MAX_DELAY_MS = 20000
const REFLECTION_POLL_MS = 200
const REFLECTION_MIN_MS = 1200
const REFLECTION_TIMEOUT_MS = 8000
const RESET_HOLD_MS = 1600
const PENDING_ENTRY_TTL_MS = 12000

const sortTapEntries = (a: LeaderboardEntry, b: LeaderboardEntry) => {
  if (b.score !== a.score) return b.score - a.score
  return a.createdAt - b.createdAt
}

const sortStopEntries = (a: LeaderboardEntry, b: LeaderboardEntry) => {
  if (a.score !== b.score) return a.score - b.score
  return a.createdAt - b.createdAt
}

const limitEntries = (entries: LeaderboardEntry[], game: GameId) => {
  const list = [...entries]
  list.sort(game === 'tap10' ? sortTapEntries : sortStopEntries)
  return list.slice(0, MAX_LEADERBOARD_ENTRIES)
}

const normalizeEntryLike = (payload: unknown): LeaderboardEntry | null => {
  if (!payload || typeof payload !== 'object') return null
  const data = payload as Partial<LeaderboardEntry>
  if (data.game !== 'tap10' && data.game !== 'stop11') return null
  if (typeof data.id !== 'string' || !data.id) return null
  if (typeof data.name !== 'string') return null
  const scoreValue = Number(data.score)
  if (!Number.isFinite(scoreValue)) return null
  const createdAtValue = Number(data.createdAt)
  const createdAt = Number.isFinite(createdAtValue) ? Math.round(createdAtValue) : Date.now()
  const meta = data.meta && typeof data.meta === 'object' ? data.meta : undefined
  return {
    id: data.id,
    game: data.game,
    name: data.name,
    score: Math.max(0, Math.round(scoreValue)),
    meta,
    createdAt
  }
}

const normalizeEntriesList = (payload: unknown) => {
  if (!Array.isArray(payload)) return []
  return payload
    .map((entry) => normalizeEntryLike(entry))
    .filter((entry): entry is LeaderboardEntry => Boolean(entry))
}

const reconcileLeaderboardSnapshot = (snapshot: LeaderboardSnapshot) => ({
  tap10: limitEntries(snapshot.tap10, 'tap10'),
  stop11: limitEntries(snapshot.stop11, 'stop11')
})

const normalizeLeaderboardSnapshot = (payload: unknown): LeaderboardSnapshot | null => {
  if (!payload || typeof payload !== 'object') return null
  const data = payload as Partial<LeaderboardSnapshot>
  if (!Array.isArray(data.tap10) || !Array.isArray(data.stop11)) return null
  return { tap10: normalizeEntriesList(data.tap10), stop11: normalizeEntriesList(data.stop11) }
}

type PendingEntry = { entry: LeaderboardEntry; expiresAt: number }
const pendingEntries = ref<Record<GameId, PendingEntry | null>>({ tap10: null, stop11: null })

const clearPendingEntry = (game: GameId, entryId?: string) => {
  const pending = pendingEntries.value[game]
  if (!pending) return
  if (!entryId || pending.entry.id === entryId) {
    pendingEntries.value[game] = null
  }
}

const setPendingEntry = (game: GameId, entry: LeaderboardEntry) => {
  pendingEntries.value[game] = {
    entry,
    expiresAt: Date.now() + PENDING_ENTRY_TTL_MS
  }
}

const hasEntryInSnapshot = (snapshot: LeaderboardSnapshot, game: GameId, entryId: string) =>
  snapshot[game].some((entry) => entry.id === entryId)

const withEntryInSnapshot = (snapshot: LeaderboardSnapshot, game: GameId, entry: LeaderboardEntry) => ({
  ...snapshot,
  [game]: [...snapshot[game].filter((item) => item.id !== entry.id), entry]
})

const shouldRankEntry = (snapshot: LeaderboardSnapshot, game: GameId, entry: LeaderboardEntry) => {
  const merged = [...snapshot[game].filter((item) => item.id !== entry.id), entry]
  return limitEntries(merged, game).some((item) => item.id === entry.id)
}

const applyLeaderboardSnapshot = (payload: unknown) => {
  const normalized = normalizeLeaderboardSnapshot(payload)
  if (!normalized) return false
  const reconciled = reconcileLeaderboardSnapshot(normalized)
  const merged: LeaderboardSnapshot = { ...reconciled }
  const now = Date.now()
  for (const game of ['tap10', 'stop11'] as GameId[]) {
    const pending = pendingEntries.value[game]
    if (!pending) continue
    if (pending.expiresAt <= now) {
      pendingEntries.value[game] = null
      continue
    }
    if (merged[game].some((entry) => entry.id === pending.entry.id)) {
      clearPendingEntry(game, pending.entry.id)
      continue
    }
    if (shouldRankEntry(reconciled, game, pending.entry)) {
      merged[game] = limitEntries([...merged[game], pending.entry], game)
    }
  }
  leaderboard.value = merged
  leaderboardUpdatedAt.value = Date.now()
  leaderboardError.value = ''
  liveConnected.value = true
  leaderboardSnapshotVersion += 1
  return true
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const getFetchStatus = (err: unknown) => {
  if (!err || typeof err !== 'object') return null
  const anyErr = err as {
    status?: number
    statusCode?: number
    response?: { status?: number; statusCode?: number }
    data?: { statusMessage?: string }
  }
  return anyErr.status ?? anyErr.statusCode ?? anyErr.response?.status ?? anyErr.response?.statusCode ?? null
}

const getFetchStatusMessage = (err: unknown) => {
  if (!err || typeof err !== 'object') return ''
  const anyErr = err as { data?: { statusMessage?: string } }
  return typeof anyErr.data?.statusMessage === 'string' ? anyErr.data.statusMessage : ''
}

const truncate = (value: string, max = 160) => (value.length > max ? `${value.slice(0, max)}…` : value)

const safeStringify = (value: unknown, max = 160) => {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return truncate(value, max)
  try {
    return truncate(JSON.stringify(value), max)
  } catch {
    return ''
  }
}

const isRetryableSubmitError = (err: unknown) => {
  const status = getFetchStatus(err)
  if (!status) return true
  if (status === 408 || status === 425 || status === 429) return true
  return status >= 500
}

const submitRetryDelay = (attempt: number) => Math.min(2000, 500 * (attempt + 1))
const formatSubmitError = (err: unknown) => {
  const status = getFetchStatus(err)
  const message = getFetchStatusMessage(err)
  const anyErr = err as {
    name?: string
    message?: string
    request?: { url?: string } | string
    response?: { url?: string }
    data?: unknown
    cause?: { message?: string } | string
  }
  const name = typeof anyErr?.name === 'string' ? anyErr.name : ''
  const errMessage = typeof anyErr?.message === 'string' ? anyErr.message : ''
  const causeMessage = typeof anyErr?.cause === 'string'
    ? anyErr.cause
    : typeof anyErr?.cause?.message === 'string'
      ? anyErr.cause.message
      : ''
  const url = typeof anyErr?.request === 'string'
    ? anyErr.request
    : typeof anyErr?.request?.url === 'string'
      ? anyErr.request.url
      : typeof anyErr?.response?.url === 'string'
        ? anyErr.response.url
        : ''
  const data = safeStringify(anyErr?.data, 160)
  const detailParts = [name, errMessage, causeMessage].filter(Boolean).join(' ')
  const detailExtras = [
    url ? `url=${url}` : '',
    data ? `data=${data}` : ''
  ].filter(Boolean).join(' ')
  if (status) {
    const statusLine = message ? `${status}: ${message}` : String(status)
    const detail = [detailParts, detailExtras].filter(Boolean).join(' ')
    return detail ? `送信できませんでした（${statusLine} ${detail}）` : `送信できませんでした（${statusLine}）`
  }
  const detail = [detailParts, detailExtras].filter(Boolean).join(' ')
  return detail ? `送信できませんでした（通信エラー: ${detail}）` : '送信できませんでした（通信エラー）'
}
const createEntryId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

const waitForUiPaint = async () => {
  await nextTick()
  if (typeof window !== 'undefined') {
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
  }
}

const waitForLeaderboardReflection = async (
  game: GameId,
  entryId: string | null,
  baselineVersion: number
) => {
  const startedAt = Date.now()
  const requiresEntry = Boolean(entryId)
  while (Date.now() - startedAt < REFLECTION_TIMEOUT_MS) {
    if (entryId && leaderboard.value[game].some((entry) => entry.id === entryId)) break
    if (!requiresEntry && leaderboardSnapshotVersion > baselineVersion) break
    await wait(REFLECTION_POLL_MS)
  }
  const elapsed = Date.now() - startedAt
  if (elapsed < REFLECTION_MIN_MS) {
    await wait(REFLECTION_MIN_MS - elapsed)
  }
}

const formatSeconds = (ms: number) => (ms / 1000).toFixed(2)
const formatDelta = (ms: number) => `${formatSeconds(ms)}s`
const liveIndicator = computed(() => {
  if (liveConnected.value) return true
  if (!leaderboardUpdatedAt.value) return false
  return nowTick.value - leaderboardUpdatedAt.value < STREAM_STALE_MS
})
const leaderboardReflecting = computed(
  () =>
    tapSubmitState.value === 'saving' ||
    tapSubmitState.value === 'reflecting' ||
    stopSubmitState.value === 'saving' ||
    stopSubmitState.value === 'reflecting'
)

let refreshInFlight = false
let leaderboardSnapshotVersion = 0
const resetInFlight = ref(false)
const resetPressTimer = { value: null as ReturnType<typeof setTimeout> | null }

const refreshLeaderboard = async () => {
  if (refreshInFlight) return false
  refreshInFlight = true
  const baselineVersion = leaderboardSnapshotVersion
  if (!leaderboardUpdatedAt.value) {
    leaderboardError.value = '取得中です...'
  } else {
    leaderboardError.value = ''
  }
  try {
    const data = await $fetch<LeaderboardSnapshot>('/api/leaderboard', { cache: 'no-store' })
    if (baselineVersion !== leaderboardSnapshotVersion) {
      return true
    }
    if (!applyLeaderboardSnapshot(data)) {
      if (!leaderboardUpdatedAt.value) {
        leaderboardError.value = '取得中です...'
      }
      return false
    }
    liveConnected.value = true
    return true
  } catch (err) {
    if (!leaderboardUpdatedAt.value) {
      leaderboardError.value = '取得中です...'
    }
    return false
  } finally {
    refreshInFlight = false
  }
}

const resetLeaderboard = async () => {
  if (resetInFlight.value) return
  resetInFlight.value = true
  try {
    await $fetch('/api/leaderboard/reset', { method: 'POST' })
    await refreshLeaderboardWithRetry()
  } catch (err) {
    leaderboardError.value = 'リセットできませんでした'
    setTimeout(() => {
      leaderboardError.value = ''
    }, 1800)
  } finally {
    resetInFlight.value = false
  }
}

const startLeaderboardResetPress = () => {
  if (resetPressTimer.value || resetInFlight.value) return
  resetPressTimer.value = setTimeout(() => {
    resetPressTimer.value = null
    void resetLeaderboard()
  }, RESET_HOLD_MS)
}

const cancelLeaderboardResetPress = () => {
  if (!resetPressTimer.value) return
  clearTimeout(resetPressTimer.value)
  resetPressTimer.value = null
}

const refreshLeaderboardWithRetry = async (attempts = 3) => {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const ok = await refreshLeaderboard()
    if (ok) return true
    await wait(400 * (attempt + 1))
  }
  return false
}

let eventSource: EventSource | null = null
let leaderboardPoller: ReturnType<typeof setInterval> | null = null
let pollIntervalMs = 0
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
let reconnectAttempts = 0
let lastStreamMessageAt = 0
const streamPaused = ref(false)
let pollIntervalBeforePause = 0
let visibilityHandler: (() => void) | null = null
let onlineHandler: (() => void) | null = null
let offlineHandler: (() => void) | null = null

const stopLeaderboardPolling = () => {
  if (!leaderboardPoller) return
  clearInterval(leaderboardPoller)
  leaderboardPoller = null
  pollIntervalMs = 0
}

const startLeaderboardPolling = (intervalMs: number) => {
  if (leaderboardPoller && pollIntervalMs === intervalMs) return
  stopLeaderboardPolling()
  pollIntervalMs = intervalMs
  leaderboardPoller = setInterval(() => {
    nowTick.value = Date.now()
    void refreshLeaderboard()
    if (eventSource && Date.now() - lastStreamMessageAt > STREAM_STALE_MS) {
      reconnectLeaderboardStream()
    }
  }, intervalMs)
  void refreshLeaderboard()
}

const scheduleStreamReconnect = () => {
  if (streamPaused.value) return
  if (reconnectTimer) return
  const delay = Math.min(1000 * 2 ** reconnectAttempts, RECONNECT_MAX_DELAY_MS)
  reconnectAttempts = Math.min(reconnectAttempts + 1, 6)
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null
    connectLeaderboardStream({ force: true })
  }, delay)
}

const reconnectLeaderboardStream = () => {
  if (eventSource) {
    eventSource.close()
    eventSource = null
  }
  liveConnected.value = false
  scheduleStreamReconnect()
}

const connectLeaderboardStream = (options?: { force?: boolean }) => {
  if (typeof window === 'undefined') return
  if (streamPaused.value) return
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
  if (eventSource && !options?.force) return
  if (eventSource) {
    eventSource.close()
    eventSource = null
  }
  eventSource = new EventSource('/api/leaderboard/stream')
  eventSource.onopen = () => {
    liveConnected.value = true
    reconnectAttempts = 0
    lastStreamMessageAt = Date.now()
    nowTick.value = Date.now()
    startLeaderboardPolling(POLL_SLOW_MS)
  }
  eventSource.onmessage = (event) => {
    lastStreamMessageAt = Date.now()
    liveConnected.value = true
    nowTick.value = Date.now()
    try {
      const data = JSON.parse(event.data) as LeaderboardSnapshot
      applyLeaderboardSnapshot(data)
    } catch {
      // Ignore malformed payloads.
    }
  }
  eventSource.onerror = () => {
    startLeaderboardPolling(POLL_FAST_MS)
    reconnectLeaderboardStream()
  }
}

const pauseLeaderboardStream = () => {
  streamPaused.value = true
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
  if (eventSource) {
    eventSource.close()
    eventSource = null
  }
  liveConnected.value = false
}

const resumeLeaderboardStream = () => {
  streamPaused.value = false
  connectLeaderboardStream({ force: true })
}

const pauseLeaderboardUpdates = () => {
  pollIntervalBeforePause = pollIntervalMs
  stopLeaderboardPolling()
  pauseLeaderboardStream()
}

const resumeLeaderboardUpdates = () => {
  resumeLeaderboardStream()
  if (pollIntervalBeforePause) {
    startLeaderboardPolling(pollIntervalBeforePause)
    pollIntervalBeforePause = 0
  }
}

const tapDurationMs = 10000
const tapTimeLeftMs = ref(tapDurationMs)
const tapScore = ref(0)
const tapBest = ref(0)
const tapActive = ref(false)
const tapProgress = computed(() => Math.max(0, Math.min(1, tapTimeLeftMs.value / tapDurationMs)))
const tapTimeLabel = computed(() => formatSeconds(tapTimeLeftMs.value).replace(/\.00$/, ''))
const tapMessage = computed(() => {
  if (tapActive.value) return '連打でスコアアップ！'
  if (tapScore.value === 0) return 'スタートで10秒間タップできます'
  if (tapScore.value >= 40) return '超高速！'
  if (tapScore.value >= 25) return 'ナイス！'
  return 'もう一回挑戦してみよう'
})
const tapCanSubmit = computed(() => !tapActive.value && tapScore.value > 0)
const tapStatusLabel = computed(() => (tapActive.value ? 'プレイ中' : tapScore.value > 0 ? '完了' : '準備'))
const tapStatusClass = computed(() => {
  if (tapActive.value) return 'game-chip--live'
  if (tapScore.value > 0) return 'game-chip--done'
  return 'game-chip--ready'
})

let tapRaf: number | null = null
let tapStartAt = 0

const stopTapRaf = () => {
  if (tapRaf === null) return
  cancelAnimationFrame(tapRaf)
  tapRaf = null
}

const tapTick = (now: number) => {
  const elapsed = now - tapStartAt
  const left = Math.max(0, tapDurationMs - elapsed)
  tapTimeLeftMs.value = left
  if (left <= 0) {
    tapStop()
    return
  }
  tapRaf = requestAnimationFrame(tapTick)
}

const tapStart = () => {
  stopTapRaf()
  tapScore.value = 0
  tapTimeLeftMs.value = tapDurationMs
  tapActive.value = true
  tapStartAt = performance.now()
  tapRaf = requestAnimationFrame(tapTick)
}

const saveTapBest = () => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(TAP_BEST_KEY, String(tapBest.value))
}

const tapStop = () => {
  tapActive.value = false
  stopTapRaf()
  tapTimeLeftMs.value = 0
  if (tapScore.value > tapBest.value) {
    tapBest.value = tapScore.value
    saveTapBest()
  }
}

const tapHit = () => {
  if (!tapActive.value || tapTimeLeftMs.value <= 0) return
  tapScore.value += 1
}

const stopTargetMs = 11110
const stopHideMs = 8000
const stopActive = ref(false)
const stopElapsedMs = ref(0)
const stopResultMs = ref<number | null>(null)
const stopBestDelta = ref<number | null>(null)
const stopDeltaMs = computed(() => {
  if (stopResultMs.value === null) return null
  return Math.abs(stopResultMs.value - stopTargetMs)
})
const stopDisplay = computed(() => {
  if (stopActive.value && stopElapsedMs.value >= stopHideMs) return '??.??'
  return formatSeconds(stopElapsedMs.value)
})
const stopMessage = computed(() => {
  if (stopActive.value) return 'ストップを狙って！'
  if (stopResultMs.value === null) return 'スタートしてタイミングを合わせよう'
  const delta = stopDeltaMs.value ?? 0
  if (delta <= 30) return `ほぼ完璧！差 ${formatDelta(delta)}`
  if (delta <= 120) return `惜しい！差 ${formatDelta(delta)}`
  return `差 ${formatDelta(delta)}`
})
const stopCanSubmit = computed(() => !stopActive.value && stopResultMs.value !== null)
const stopProgress = computed(() => Math.max(0, Math.min(1, stopElapsedMs.value / stopTargetMs)))
const stopProgressVisible = computed(() => !stopActive.value || stopElapsedMs.value < stopHideMs)
const stopStatusLabel = computed(() => (stopActive.value ? 'プレイ中' : stopResultMs.value !== null ? '完了' : '準備'))
const stopStatusClass = computed(() => {
  if (stopActive.value) return 'game-chip--live'
  if (stopResultMs.value !== null) return 'game-chip--done'
  return 'game-chip--ready'
})

let stopRaf: number | null = null
let stopStartAt = 0

const stopStopRaf = () => {
  if (stopRaf === null) return
  cancelAnimationFrame(stopRaf)
  stopRaf = null
}

const stopTick = (now: number) => {
  stopElapsedMs.value = now - stopStartAt
  stopRaf = requestAnimationFrame(stopTick)
}

const saveStopBest = () => {
  if (typeof window === 'undefined' || stopBestDelta.value === null) return
  window.localStorage.setItem(STOP_BEST_KEY, String(stopBestDelta.value))
}

const stopStart = () => {
  stopStopRaf()
  stopElapsedMs.value = 0
  stopResultMs.value = null
  stopActive.value = true
  stopStartAt = performance.now()
  stopRaf = requestAnimationFrame(stopTick)
}

const stopStop = () => {
  if (!stopActive.value) return
  const elapsed = performance.now() - stopStartAt
  const roundedElapsed = Math.round(elapsed)
  stopElapsedMs.value = roundedElapsed
  stopResultMs.value = roundedElapsed
  stopActive.value = false
  stopStopRaf()
  const delta = Math.abs(roundedElapsed - stopTargetMs)
  if (stopBestDelta.value === null || delta < stopBestDelta.value) {
    stopBestDelta.value = Math.round(delta)
    saveStopBest()
  }
}

const stopReset = () => {
  stopStopRaf()
  stopActive.value = false
  stopElapsedMs.value = 0
  stopResultMs.value = null
}

const tapSubmitState = ref<SubmitState>('idle')
const stopSubmitState = ref<SubmitState>('idle')
const tapSubmitNotice = ref('')
const stopSubmitNotice = ref('')
const tapSubmitTimer = { value: null as ReturnType<typeof setTimeout> | null }
const stopSubmitTimer = { value: null as ReturnType<typeof setTimeout> | null }
const tapSubmitBusy = computed(() => tapSubmitState.value === 'saving' || tapSubmitState.value === 'reflecting')
const stopSubmitBusy = computed(() => stopSubmitState.value === 'saving' || stopSubmitState.value === 'reflecting')
const tapSubmitReady = computed(() => tapCanSubmit.value && hasNickname.value && !tapSubmitBusy.value)
const stopSubmitReady = computed(() => stopCanSubmit.value && hasNickname.value && !stopSubmitBusy.value)
const tapSubmitLabel = computed(() => {
  if (tapSubmitState.value === 'saving') return '送信中...'
  if (tapSubmitState.value === 'reflecting') return '送信中...'
  if (!hasNickname.value) return 'ニックネームを入力'
  return 'ランキングに送る'
})
const stopSubmitLabel = computed(() => {
  if (stopSubmitState.value === 'saving') return '送信中...'
  if (stopSubmitState.value === 'reflecting') return '送信中...'
  if (!hasNickname.value) return 'ニックネームを入力'
  return 'ランキングに送る'
})

const setSubmitState = (
  stateRef: typeof tapSubmitState,
  noticeRef: typeof tapSubmitNotice,
  timerRef: { value: ReturnType<typeof setTimeout> | null },
  state: SubmitState,
  message = ''
) => {
  if (timerRef.value) {
    clearTimeout(timerRef.value)
    timerRef.value = null
  }
  stateRef.value = state
  noticeRef.value = message
  if (state === 'done' || state === 'error') {
    timerRef.value = setTimeout(() => {
      stateRef.value = 'idle'
      noticeRef.value = ''
      timerRef.value = null
    }, 1800)
  }
}

const submitScore = async (
  game: GameId,
  score: number,
  meta: { timeMs?: number; deltaMs?: number } | undefined,
  stateRef: typeof tapSubmitState,
  noticeRef: typeof tapSubmitNotice,
  timerRef: { value: ReturnType<typeof setTimeout> | null }
) => {
  const name = ensureNickname()
  if (!name) return
  const baselineVersion = leaderboardSnapshotVersion
  setSubmitState(stateRef, noticeRef, timerRef, 'saving')
  const entryId = createEntryId()
  pauseLeaderboardUpdates()
  try {
    let response: LeaderboardSubmitResponse | null = null
    let lastError: unknown = null
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        response = await $fetch<LeaderboardSubmitResponse>('/api/leaderboard', {
          method: 'POST',
          body: {
            id: entryId,
            game,
            name,
            score,
            meta
          }
        })
        lastError = null
        break
      } catch (err) {
        lastError = err
        if (!isRetryableSubmitError(err) || attempt >= 4) throw err
        await wait(submitRetryDelay(attempt))
      }
    }
    if (!response) throw (lastError ?? new Error('Missing submit response'))
    setSubmitState(stateRef, noticeRef, timerRef, 'reflecting')
    const responseEntry = normalizeEntryLike(response.entry) ?? {
      id: entryId,
      game,
      name,
      score,
      meta,
      createdAt: Date.now()
    }
    const snapshotFromResponse = normalizeLeaderboardSnapshot(response.snapshot)
    const baseSnapshot = snapshotFromResponse ?? leaderboard.value
    const rank = response.rank
    const shouldTrackEntry =
      (typeof rank === 'number' && rank > 0 && rank <= MAX_LEADERBOARD_ENTRIES) ||
      (snapshotFromResponse
        ? hasEntryInSnapshot(snapshotFromResponse, game, responseEntry.id)
        : shouldRankEntry(baseSnapshot, game, responseEntry))
    if (shouldTrackEntry) {
      setPendingEntry(game, responseEntry)
    } else {
      clearPendingEntry(game)
    }
    if (snapshotFromResponse) {
      const snapshotToApply = shouldTrackEntry
        ? withEntryInSnapshot(snapshotFromResponse, game, responseEntry)
        : snapshotFromResponse
      if (!applyLeaderboardSnapshot(snapshotToApply)) {
        await refreshLeaderboardWithRetry()
      }
    } else if (shouldTrackEntry) {
      if (!applyLeaderboardSnapshot(withEntryInSnapshot(baseSnapshot, game, responseEntry))) {
        await refreshLeaderboardWithRetry()
      }
    } else {
      await refreshLeaderboardWithRetry()
    }
    if (shouldTrackEntry && !leaderboard.value[game].some((entry) => entry.id === responseEntry.id)) {
      await refreshLeaderboardWithRetry()
    }
    await waitForLeaderboardReflection(game, shouldTrackEntry ? responseEntry.id : null, baselineVersion)
    await waitForUiPaint()
    setSubmitState(stateRef, noticeRef, timerRef, 'done')
    void refreshLeaderboardWithRetry()
  } catch (err) {
    setSubmitState(stateRef, noticeRef, timerRef, 'error', formatSubmitError(err))
  } finally {
    resumeLeaderboardUpdates()
  }
}

const submitTapScore = () => {
  if (!tapSubmitReady.value) return
  submitScore('tap10', tapScore.value, undefined, tapSubmitState, tapSubmitNotice, tapSubmitTimer)
}

const submitStopScore = () => {
  if (!stopSubmitReady.value || stopResultMs.value === null) return
  const delta = Math.abs(stopResultMs.value - stopTargetMs)
  submitScore(
    'stop11',
    Math.round(delta),
    {
      timeMs: Math.round(stopResultMs.value),
      deltaMs: Math.round(delta)
    },
    stopSubmitState,
    stopSubmitNotice,
    stopSubmitTimer
  )
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    const savedName = window.localStorage.getItem(NICKNAME_KEY)
    if (savedName) nickname.value = savedName.slice(0, MAX_NAME_LEN)
    const savedTapBest = window.localStorage.getItem(TAP_BEST_KEY)
    const savedStopBest = window.localStorage.getItem(STOP_BEST_KEY)
    if (savedTapBest && !Number.isNaN(Number(savedTapBest))) {
      tapBest.value = Number(savedTapBest)
    }
    if (savedStopBest && !Number.isNaN(Number(savedStopBest))) {
      stopBestDelta.value = Number(savedStopBest)
    }
    visibilityHandler = () => {
      if (document.visibilityState !== 'visible') return
      void refreshLeaderboard()
      connectLeaderboardStream({ force: true })
    }
    onlineHandler = () => {
      void refreshLeaderboard()
      connectLeaderboardStream({ force: true })
    }
    offlineHandler = () => {
      liveConnected.value = false
      startLeaderboardPolling(POLL_FAST_MS)
    }
    document.addEventListener('visibilitychange', visibilityHandler)
    window.addEventListener('online', onlineHandler)
    window.addEventListener('offline', offlineHandler)
  }
  void refreshLeaderboard()
  startLeaderboardPolling(POLL_FAST_MS)
  connectLeaderboardStream()
})

onBeforeUnmount(() => {
  stopTapRaf()
  stopStopRaf()
  if (eventSource) {
    eventSource.close()
    eventSource = null
  }
  stopLeaderboardPolling()
  if (reconnectTimer) clearTimeout(reconnectTimer)
  cancelLeaderboardResetPress()
  if (typeof window !== 'undefined') {
    if (visibilityHandler) document.removeEventListener('visibilitychange', visibilityHandler)
    if (onlineHandler) window.removeEventListener('online', onlineHandler)
    if (offlineHandler) window.removeEventListener('offline', offlineHandler)
  }
})

useHead(() => {
  const pageTitle = `Extras | ${displayCouple.value}`
  const desc = '10秒タップと11.11秒ストップのミニゲーム'
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
