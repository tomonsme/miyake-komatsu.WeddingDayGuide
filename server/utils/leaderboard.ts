import { randomUUID } from 'node:crypto'
import { readFileSync, promises as fs } from 'node:fs'
import { join } from 'node:path'
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3'
import { getS3Client, getS3Config, normalizePrefix } from './s3'

export type GameId = 'tap10' | 'stop11'

export type LeaderboardEntry = {
  id: string
  game: GameId
  name: string
  score: number
  meta?: { timeMs?: number; deltaMs?: number }
  createdAt: number
}

export type LeaderboardSnapshot = {
  tap10: LeaderboardEntry[]
  stop11: LeaderboardEntry[]
}

type Listener = (snapshot: LeaderboardSnapshot) => void

type LeaderboardState = {
  entries: LeaderboardEntry[]
  listeners: Set<Listener>
}

const MAX_ENTRIES = 200
const TOP_LIMIT = 3
const MAX_ENTRY_AGE_MS = 24 * 60 * 60 * 1000
const STORAGE_DIR = join(process.cwd(), '.data')
const STORAGE_FILE = join(STORAGE_DIR, 'leaderboard.json')
const STORAGE_SYNC_INTERVAL_MS = 3000
const STORAGE_WRITE_ATTEMPTS = 4

const globalState = globalThis as typeof globalThis & {
  __weddingLeaderboard?: LeaderboardState
}

const existingState = globalState.__weddingLeaderboard
const state: LeaderboardState = existingState ?? {
  entries: [],
  listeners: new Set()
}

globalState.__weddingLeaderboard = state

let lastSerialized = ''
let lastSyncAt = 0
let syncInFlight: Promise<void> | null = null
let syncTimer: ReturnType<typeof setInterval> | null = null
let writeQueue: Promise<void> = Promise.resolve()
let cachedS3Config: ReturnType<typeof getS3Config> | null | undefined

const getS3ConfigSafe = () => {
  if (cachedS3Config !== undefined) return cachedS3Config
  try {
    cachedS3Config = getS3Config()
  } catch {
    cachedS3Config = null
  }
  return cachedS3Config
}

const getStorageKey = (config: ReturnType<typeof getS3Config>) => {
  const prefix = normalizePrefix(config.prefix || '')
  return prefix ? `${prefix}/leaderboard.json` : 'leaderboard.json'
}

const sanitizeName = (name: string) => name.trim().slice(0, 12)

const sanitizeNumber = (value: unknown) => {
  const num = Number(value)
  if (!Number.isFinite(num)) return null
  return num
}

const sanitizeMeta = (meta?: { timeMs?: number; deltaMs?: number }) => {
  if (!meta) return undefined
  const clean: { timeMs?: number; deltaMs?: number } = {}
  const timeMs = sanitizeNumber(meta.timeMs)
  const deltaMs = sanitizeNumber(meta.deltaMs)
  if (timeMs !== null) clean.timeMs = Math.max(0, Math.round(timeMs))
  if (deltaMs !== null) clean.deltaMs = Math.max(0, Math.round(deltaMs))
  return Object.keys(clean).length ? clean : undefined
}

const normalizeEntry = (input: any): LeaderboardEntry | null => {
  if (!input || typeof input !== 'object') return null
  if (input.game !== 'tap10' && input.game !== 'stop11') return null
  const name = typeof input.name === 'string' ? sanitizeName(input.name) : ''
  if (!name) return null
  const scoreValue = sanitizeNumber(input.score)
  if (scoreValue === null) return null
  const createdAtValue = sanitizeNumber(input.createdAt)
  const createdAt = createdAtValue !== null ? Math.max(0, Math.round(createdAtValue)) : Date.now()
  return {
    id: typeof input.id === 'string' && input.id ? input.id : randomUUID(),
    game: input.game,
    name,
    score: Math.max(0, Math.round(scoreValue)),
    meta: sanitizeMeta(input.meta),
    createdAt
  }
}

const pruneEntriesList = (entries: LeaderboardEntry[]) => {
  const cutoff = Date.now() - MAX_ENTRY_AGE_MS
  const filtered = entries.filter((entry) => entry.createdAt >= cutoff)
  if (filtered.length > MAX_ENTRIES) {
    return filtered.slice(filtered.length - MAX_ENTRIES)
  }
  return filtered
}

const mergeEntries = (...groups: LeaderboardEntry[][]) => {
  const merged = new Map<string, LeaderboardEntry>()
  for (const group of groups) {
    for (const entry of group) {
      const existing = merged.get(entry.id)
      if (!existing || entry.createdAt > existing.createdAt) {
        merged.set(entry.id, entry)
      }
    }
  }
  return Array.from(merged.values()).sort((a, b) => a.createdAt - b.createdAt)
}

const normalizeEntriesPayload = (payload: unknown) => {
  if (!Array.isArray(payload)) return []
  const normalized = payload
    .map((entry) => normalizeEntry(entry))
    .filter((entry): entry is LeaderboardEntry => Boolean(entry))
  return pruneEntriesList(normalized)
}

const loadStoredEntriesSync = (): LeaderboardEntry[] => {
  try {
    const raw = readFileSync(STORAGE_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    return normalizeEntriesPayload(parsed)
  } catch {
    return []
  }
}

const loadStoredEntriesFromDisk = async (): Promise<LeaderboardEntry[]> => {
  try {
    const raw = await fs.readFile(STORAGE_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    return normalizeEntriesPayload(parsed)
  } catch {
    return []
  }
}

const persistEntriesToDisk = async (entries: LeaderboardEntry[]) => {
  try {
    await fs.mkdir(STORAGE_DIR, { recursive: true })
    await fs.writeFile(STORAGE_FILE, JSON.stringify(entries), 'utf8')
  } catch {
    // Ignore persistence failures (e.g., read-only filesystem).
  }
}

const readBodyToString = async (body: any) => {
  if (!body) return ''
  if (typeof body === 'string') return body
  if (Buffer.isBuffer(body)) return body.toString('utf8')
  if (typeof body.text === 'function') return await body.text()
  if (typeof body.transformToString === 'function') return await body.transformToString()
  if (typeof body[Symbol.asyncIterator] === 'function') {
    const chunks: Uint8Array[] = []
    for await (const chunk of body as AsyncIterable<Uint8Array>) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : Buffer.from(chunk))
    }
    return Buffer.concat(chunks).toString('utf8')
  }
  return ''
}

const isNotFoundError = (err: any) => {
  const status = err?.$metadata?.httpStatusCode
  return status === 404 || err?.name === 'NoSuchKey'
}

const isPreconditionFailed = (err: any) => {
  const status = err?.$metadata?.httpStatusCode
  return status === 412 || err?.name === 'PreconditionFailed'
}

const loadStoredEntriesFromS3 = async (config: ReturnType<typeof getS3Config>) => {
  const s3 = getS3Client(config)
  const key = getStorageKey(config)
  try {
    const response = await s3.send(new GetObjectCommand({
      Bucket: config.bucket,
      Key: key
    }))
    const raw = await readBodyToString(response.Body)
    const parsed = raw ? JSON.parse(raw) : []
    const entries = normalizeEntriesPayload(parsed)
    return { entries, etag: response.ETag ?? null }
  } catch (err: any) {
    if (isNotFoundError(err)) {
      return { entries: [], etag: null }
    }
    throw err
  }
}

const writeEntriesToS3 = async (
  config: ReturnType<typeof getS3Config>,
  entries: LeaderboardEntry[],
  etag?: string | null
) => {
  const s3 = getS3Client(config)
  const key = getStorageKey(config)
  const params: any = {
    Bucket: config.bucket,
    Key: key,
    Body: JSON.stringify(entries),
    ContentType: 'application/json'
  }
  if (etag) {
    params.IfMatch = etag
  }
  const response = await s3.send(new PutObjectCommand(params))
  return response.ETag ?? null
}

const updateStateEntries = (entries: LeaderboardEntry[], broadcastChanges = true) => {
  const pruned = pruneEntriesList(entries)
  const serialized = JSON.stringify(pruned)
  if (serialized === lastSerialized) return false
  state.entries = pruned
  lastSerialized = serialized
  if (broadcastChanges) broadcast()
  return true
}

if (!existingState) {
  state.entries = loadStoredEntriesSync()
}
state.entries = pruneEntriesList(state.entries)
lastSerialized = JSON.stringify(state.entries)

const sortTap = (a: LeaderboardEntry, b: LeaderboardEntry) => {
  if (b.score !== a.score) return b.score - a.score
  return a.createdAt - b.createdAt
}

const sortStop = (a: LeaderboardEntry, b: LeaderboardEntry) => {
  if (a.score !== b.score) return a.score - b.score
  return a.createdAt - b.createdAt
}

const buildSnapshot = (): LeaderboardSnapshot => {
  const pruned = pruneEntriesList(state.entries)
  state.entries = pruned
  lastSerialized = JSON.stringify(pruned)
  const tap10 = pruned
    .filter((entry) => entry.game === 'tap10')
    .sort(sortTap)
    .slice(0, TOP_LIMIT)
  const stop11 = pruned
    .filter((entry) => entry.game === 'stop11')
    .sort(sortStop)
    .slice(0, TOP_LIMIT)
  return { tap10, stop11 }
}

const broadcast = () => {
  const snapshot = buildSnapshot()
  state.listeners.forEach((listener) => listener(snapshot))
}

const syncFromStorage = async (force = false) => {
  const now = Date.now()
  if (!force && now - lastSyncAt < STORAGE_SYNC_INTERVAL_MS) return
  if (syncInFlight) return syncInFlight
  syncInFlight = (async () => {
    lastSyncAt = Date.now()
    try {
      const s3Config = getS3ConfigSafe()
      const storedEntries = s3Config
        ? (await loadStoredEntriesFromS3(s3Config)).entries
        : await loadStoredEntriesFromDisk()
      const merged = mergeEntries(state.entries, storedEntries)
      updateStateEntries(merged)
    } catch {
      // Ignore storage sync failures.
    }
  })()
  try {
    await syncInFlight
  } finally {
    syncInFlight = null
  }
}

const startSyncLoop = () => {
  if (syncTimer) return
  syncTimer = setInterval(() => {
    void syncFromStorage()
  }, STORAGE_SYNC_INTERVAL_MS)
}

const stopSyncLoop = () => {
  if (!syncTimer) return
  clearInterval(syncTimer)
  syncTimer = null
}

const queueWrite = async <T>(task: () => Promise<T>): Promise<T> => {
  const result = writeQueue.then(task, task)
  writeQueue = result.then(() => undefined, () => undefined)
  return result
}

export const addEntry = async (input: {
  id?: string
  game: GameId
  name: string
  score: number
  meta?: { timeMs?: number; deltaMs?: number }
}): Promise<LeaderboardEntry> => {
  if (input.game !== 'tap10' && input.game !== 'stop11') {
    throw new Error('Invalid game')
  }
  const name = sanitizeName(input.name)
  const score = Math.max(0, Math.round(input.score))
  const meta = sanitizeMeta(input.meta)

  const id = typeof input.id === 'string' && input.id.trim()
    ? input.id.trim().slice(0, 64)
    : randomUUID()

  const entry: LeaderboardEntry = {
    id,
    game: input.game,
    name,
    score,
    meta,
    createdAt: Date.now()
  }

  return queueWrite(async () => {
    const s3Config = getS3ConfigSafe()
    if (s3Config) {
      let lastError: unknown = null
      for (let attempt = 0; attempt < STORAGE_WRITE_ATTEMPTS; attempt += 1) {
        const { entries: storedEntries, etag } = await loadStoredEntriesFromS3(s3Config)
        const merged = mergeEntries(storedEntries, state.entries, [entry])
        const nextEntries = pruneEntriesList(merged)
        try {
          await writeEntriesToS3(s3Config, nextEntries, etag)
          updateStateEntries(nextEntries)
          return entry
        } catch (err) {
          lastError = err
          if (isPreconditionFailed(err)) continue
          throw err
        }
      }
      // Fallback to an unconditional write when the store does not support ETags.
      try {
        const { entries: storedEntries } = await loadStoredEntriesFromS3(s3Config)
        const merged = mergeEntries(storedEntries, state.entries, [entry])
        const nextEntries = pruneEntriesList(merged)
        await writeEntriesToS3(s3Config, nextEntries, null)
        updateStateEntries(nextEntries)
        return entry
      } catch (err) {
        throw (lastError ?? err) as Error
      }
    }

    const storedEntries = await loadStoredEntriesFromDisk()
    const merged = mergeEntries(storedEntries, state.entries, [entry])
    const nextEntries = pruneEntriesList(merged)
    updateStateEntries(nextEntries)
    await persistEntriesToDisk(state.entries)
    return entry
  })
}

export const getLeaderboardSnapshot = () => buildSnapshot()

export const getLeaderboardSnapshotFresh = async () => {
  await syncFromStorage(true)
  return buildSnapshot()
}

export const clearLeaderboard = async () => {
  return queueWrite(async () => {
    const s3Config = getS3ConfigSafe()
    if (s3Config) {
      let lastError: unknown = null
      for (let attempt = 0; attempt < STORAGE_WRITE_ATTEMPTS; attempt += 1) {
        try {
          const { etag } = await loadStoredEntriesFromS3(s3Config)
          await writeEntriesToS3(s3Config, [], etag)
          updateStateEntries([])
          return
        } catch (err) {
          lastError = err
          if (isPreconditionFailed(err)) continue
          throw err
        }
      }
      try {
        await writeEntriesToS3(s3Config, [], null)
        updateStateEntries([])
        return
      } catch (err) {
        throw (lastError ?? err) as Error
      }
    }

    updateStateEntries([])
    await persistEntriesToDisk([])
  })
}

export const subscribe = (listener: Listener) => {
  state.listeners.add(listener)
  if (state.listeners.size === 1) startSyncLoop()
  return () => {
    state.listeners.delete(listener)
    if (state.listeners.size === 0) stopSyncLoop()
  }
}
