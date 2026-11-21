// Game state: which scene is open, what has been found, the clock, the
// misses, and the overlays. Pure data plus small transitions; rendering
// and input live in their own files.

import { LEVELS } from './levels.js';

export function createState() {
  return {
    screen: 'menu', // menu | playing | levelClear | allClear
    levelIndex: 0,
    found: new Set(),
    misses: 0,
    startedAt: 0,
    elapsedMs: 0,
    levelTimesMs: [],
    totalMisses: 0,
    hinted: null, // { diffId, untilMs } while a hint ring shows
    flashes: [], // { x, y, panel, kind, bornMs } miss ripples and found pops
    cursor: { x: 300, y: 330, panel: 'left', visible: false },
    lastFoundAt: 0,
  };
}

export function currentLevel(state) {
  return LEVELS[state.levelIndex];
}

export function remainingCount(state) {
  return currentLevel(state).diffs.length - state.found.size;
}

export function startLevel(state, index, nowMs) {
  state.levelIndex = index;
  state.found = new Set();
  state.misses = 0;
  state.startedAt = nowMs;
  state.elapsedMs = 0;
  state.hinted = null;
  state.flashes = [];
  state.screen = 'playing';
  state.cursor = { x: 300, y: 330, panel: 'left', visible: false };
}

export function tickClock(state, nowMs) {
  if (state.screen === 'playing') state.elapsedMs = nowMs - state.startedAt;
}

export function formatTime(ms) {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function applyFound(state, diffId, nowMs) {
  if (state.found.has(diffId)) return false;
  state.found.add(diffId);
  state.lastFoundAt = nowMs;
  if (state.found.size === currentLevel(state).diffs.length) {
    state.levelTimesMs.push(state.elapsedMs);
    state.totalMisses += state.misses;
    state.screen = state.levelIndex === LEVELS.length - 1 ? 'allClear' : 'levelClear';
  }
  return true;
}

export function applyMiss(state) {
  state.misses += 1;
}

export function applyHint(state, nowMs) {
  const level = currentLevel(state);
  const unfound = level.diffs.filter((d) => !state.found.has(d.id));
  if (unfound.length === 0) return null;
  const diff = unfound[Math.floor(Math.random() * unfound.length)];
  state.hinted = { diffId: diff.id, untilMs: nowMs + 1400 };
  state.startedAt -= 5000; // a hint costs five seconds on the clock
  return diff;
}

export function totalTimeMs(state) {
  return state.levelTimesMs.reduce((n, t) => n + t, 0);
}

export function foundLabels(state) {
  const level = currentLevel(state);
  return level.diffs.filter((d) => state.found.has(d.id)).map((d) => d.label);
}
