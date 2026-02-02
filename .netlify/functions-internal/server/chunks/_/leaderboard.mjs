import { randomUUID } from 'node:crypto';
import { promises, readFileSync } from 'node:fs';
import { join } from 'node:path';

const MAX_ENTRIES = 200;
const TOP_LIMIT = 10;
const MAX_ENTRY_AGE_MS = 24 * 60 * 60 * 1e3;
const STORAGE_DIR = join(process.cwd(), ".data");
const STORAGE_FILE = join(STORAGE_DIR, "leaderboard.json");
const globalState = globalThis;
const existingState = globalState.__weddingLeaderboard;
const state = existingState != null ? existingState : {
  entries: [],
  listeners: /* @__PURE__ */ new Set()
};
globalState.__weddingLeaderboard = state;
const sanitizeName = (name) => name.trim().slice(0, 12);
const sanitizeNumber = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return null;
  return num;
};
const sanitizeMeta = (meta) => {
  if (!meta) return void 0;
  const clean = {};
  const timeMs = sanitizeNumber(meta.timeMs);
  const deltaMs = sanitizeNumber(meta.deltaMs);
  if (timeMs !== null) clean.timeMs = Math.max(0, Math.round(timeMs));
  if (deltaMs !== null) clean.deltaMs = Math.max(0, Math.round(deltaMs));
  return Object.keys(clean).length ? clean : void 0;
};
const normalizeEntry = (input) => {
  if (!input || typeof input !== "object") return null;
  if (input.game !== "tap10" && input.game !== "stop11") return null;
  const name = typeof input.name === "string" ? sanitizeName(input.name) : "";
  if (!name) return null;
  const scoreValue = sanitizeNumber(input.score);
  if (scoreValue === null) return null;
  const createdAtValue = sanitizeNumber(input.createdAt);
  const createdAt = createdAtValue !== null ? Math.max(0, Math.round(createdAtValue)) : Date.now();
  return {
    id: typeof input.id === "string" && input.id ? input.id : randomUUID(),
    game: input.game,
    name,
    score: Math.max(0, Math.round(scoreValue)),
    meta: sanitizeMeta(input.meta),
    createdAt
  };
};
const loadStoredEntries = () => {
  try {
    const raw = readFileSync(STORAGE_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const now = Date.now();
    const normalized = parsed.map((entry) => normalizeEntry(entry)).filter((entry) => Boolean(entry)).filter((entry) => now - entry.createdAt <= MAX_ENTRY_AGE_MS);
    if (normalized.length > MAX_ENTRIES) {
      return normalized.slice(normalized.length - MAX_ENTRIES);
    }
    return normalized;
  } catch {
    return [];
  }
};
const persistEntries = async () => {
  try {
    await promises.mkdir(STORAGE_DIR, { recursive: true });
    await promises.writeFile(STORAGE_FILE, JSON.stringify(state.entries), "utf8");
  } catch {
  }
};
const pruneEntries = () => {
  const cutoff = Date.now() - MAX_ENTRY_AGE_MS;
  const next = state.entries.filter((entry) => entry.createdAt >= cutoff);
  if (next.length === state.entries.length) return;
  state.entries = next;
  void persistEntries();
};
if (!existingState) {
  state.entries = loadStoredEntries();
}
const sortTap = (a, b) => {
  if (b.score !== a.score) return b.score - a.score;
  return a.createdAt - b.createdAt;
};
const sortStop = (a, b) => {
  if (a.score !== b.score) return a.score - b.score;
  return a.createdAt - b.createdAt;
};
const buildSnapshot = () => {
  pruneEntries();
  const tap10 = state.entries.filter((entry) => entry.game === "tap10").sort(sortTap).slice(0, TOP_LIMIT);
  const stop11 = state.entries.filter((entry) => entry.game === "stop11").sort(sortStop).slice(0, TOP_LIMIT);
  return { tap10, stop11 };
};
const broadcast = () => {
  const snapshot = buildSnapshot();
  state.listeners.forEach((listener) => listener(snapshot));
};
const addEntry = (input) => {
  pruneEntries();
  const name = sanitizeName(input.name);
  const score = Math.max(0, Math.round(input.score));
  const meta = sanitizeMeta(input.meta);
  const entry = {
    id: randomUUID(),
    game: input.game,
    name,
    score,
    meta,
    createdAt: Date.now()
  };
  state.entries.push(entry);
  if (state.entries.length > MAX_ENTRIES) {
    state.entries.splice(0, state.entries.length - MAX_ENTRIES);
  }
  void persistEntries();
  broadcast();
  return entry;
};
const getLeaderboardSnapshot = () => buildSnapshot();
const subscribe = (listener) => {
  state.listeners.add(listener);
  return () => {
    state.listeners.delete(listener);
  };
};

export { addEntry as a, getLeaderboardSnapshot as g, subscribe as s };
//# sourceMappingURL=leaderboard.mjs.map
