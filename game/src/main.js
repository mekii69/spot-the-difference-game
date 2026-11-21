// Bootstrap: wires the canvas loop, the header stats, the buttons and the
// overlay cards together, and exposes the game's live state for automated
// play-testing under window.__spot.

import { sounds } from './audio.js';
import { attachInput } from './input.js';
import { drawFrame } from './render.js';
import { LEVELS } from './levels.js';
import {
  applyHint,
  createState,
  currentLevel,
  formatTime,
  foundLabels,
  remainingCount,
  startLevel,
  tickClock,
  totalTimeMs,
} from './state.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const overlayCard = document.getElementById('overlay-card');
const statusLine = document.getElementById('status');

const el = {
  levelName: document.getElementById('level-name'),
  remaining: document.getElementById('remaining-count'),
  found: document.getElementById('found-count'),
  time: document.getElementById('time-value'),
  misses: document.getElementById('miss-count'),
  hint: document.getElementById('btn-hint'),
  sound: document.getElementById('btn-sound'),
  restart: document.getElementById('btn-restart'),
  menu: document.getElementById('btn-menu'),
};

const state = createState();

window.__spot = {
  state,
  levels: LEVELS,
  startLevel: (index) => startLevel(state, index, performance.now()),
};

function announce(message) {
  statusLine.textContent = message;
}

function syncHud() {
  const level = currentLevel(state);
  el.levelName.textContent = level.name;
  el.remaining.textContent = String(remainingCount(state));
  el.found.textContent = `${state.found.size} / ${level.diffs.length}`;
  el.time.textContent = formatTime(state.elapsedMs);
  el.misses.textContent = String(state.misses);
  el.hint.disabled = state.screen !== 'playing' || remainingCount(state) === 0;
  el.restart.disabled = state.screen === 'menu';
}

function showMenu() {
  state.screen = 'menu';
  overlay.hidden = false;
  overlayCard.innerHTML = '';
  const title = document.createElement('h2');
  title.textContent = 'Lantern Cove';
  const intro = document.createElement('p');
  intro.className = 'big';
  intro.textContent = 'Two pictures hang side by side. Seven little things differ — find them all.';
  const hint = document.createElement('p');
  hint.textContent = 'Three hand-drawn scenes, seven differences each. Click with the mouse or steer the crosshair with the arrow keys and press Enter. A hint costs five seconds.';
  const picks = document.createElement('div');
  picks.className = 'scene-pick';
  LEVELS.forEach((level, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = index === 0 ? 'primary' : '';
    button.textContent = `${index + 1}. ${level.name}`;
    button.addEventListener('click', () => {
      sounds.unlock();
      sounds.click();
      overlay.hidden = true;
      startLevel(state, index, performance.now());
      announce(`${level.name}. Find ${level.diffs.length} differences.`);
      syncHud();
    });
    picks.appendChild(button);
  });
  overlayCard.append(title, intro, hint, picks);
  syncHud();
}

function showLevelClear() {
  const level = currentLevel(state);
  overlay.hidden = false;
  overlayCard.innerHTML = '';
  const title = document.createElement('h2');
  title.textContent = 'Scene complete!';
  const line = document.createElement('p');
  line.className = 'score-line';
  line.textContent = `You found all ${level.diffs.length} differences in ${level.name} — ${formatTime(state.elapsedMs)} with ${state.misses} miss${state.misses === 1 ? '' : 'es'}.`;
  const found = document.createElement('p');
  found.className = 'found-list';
  found.textContent = `Found: ${foundLabels(state).join(', ')}.`;
  const row = document.createElement('div');
  row.className = 'row';
  const again = document.createElement('button');
  again.type = 'button';
  again.textContent = 'Play this scene again';
  again.addEventListener('click', () => {
    sounds.click();
    overlay.hidden = true;
    startLevel(state, state.levelIndex, performance.now());
    syncHud();
  });
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'primary';
  next.textContent = `Next scene: ${LEVELS[state.levelIndex + 1].name}`;
  next.addEventListener('click', () => {
    sounds.click();
    overlay.hidden = true;
    startLevel(state, state.levelIndex + 1, performance.now());
    announce(`${LEVELS[state.levelIndex].name}. Find 7 differences.`);
    syncHud();
  });
  row.append(again, next);
  overlayCard.append(title, line, found, row);
  syncHud();
}

function showAllClear() {
  overlay.hidden = false;
  overlayCard.innerHTML = '';
  const title = document.createElement('h2');
  title.textContent = 'All three scenes complete!';
  const line = document.createElement('p');
  line.className = 'score-line';
  line.textContent = `Every difference found — 21 in all — in ${formatTime(totalTimeMs(state))} with ${state.totalMisses} miss${state.totalMisses === 1 ? '' : 'es'} in total.`;
  const sub = document.createElement('p');
  sub.textContent = 'Thanks for playing Lantern Cove. Play again and beat your time, or try a scene on its own.';
  const row = document.createElement('div');
  row.className = 'row';
  const again = document.createElement('button');
  again.type = 'button';
  again.className = 'primary';
  again.textContent = 'Play again from scene 1';
  again.addEventListener('click', () => {
    sounds.click();
    overlay.hidden = true;
    startLevel(state, 0, performance.now());
    syncHud();
  });
  const menu = document.createElement('button');
  menu.type = 'button';
  menu.textContent = 'Back to scenes';
  menu.addEventListener('click', () => {
    sounds.click();
    showMenu();
  });
  row.append(again, menu);
  overlayCard.append(title, line, sub, row);
  syncHud();
}

let lastScreen = state.screen;

function frame(nowMs) {
  tickClock(state, nowMs);
  if (state.screen === 'playing') overlay.hidden = true;
  drawFrame(ctx, state, nowMs);
  if (state.screen !== lastScreen) {
    if (state.screen === 'levelClear') {
      sounds.clear();
      showLevelClear();
    } else if (state.screen === 'allClear') {
      sounds.win();
      showAllClear();
    }
    lastScreen = state.screen;
  }
  syncHud();
  requestAnimationFrame(frame);
}

attachInput(canvas, state, {
  onFound: () => {
    sounds.found();
    announce(`${state.found.size} of ${currentLevel(state).diffs.length} found. ${remainingCount(state)} remaining.`);
  },
  onMiss: () => {
    sounds.miss();
  },
  onAnyGesture: () => {
    sounds.unlock();
  },
});

el.hint.addEventListener('click', () => {
  if (state.screen !== 'playing') return;
  const diff = applyHint(state, performance.now());
  if (diff) {
    sounds.hint();
    announce(`Hint: look near ${diff.label}. Five seconds added.`);
  }
  syncHud();
});

el.sound.addEventListener('click', () => {
  const isMuted = sounds.toggleMute();
  el.sound.textContent = isMuted ? 'Sound: Off' : 'Sound: On';
});

el.restart.addEventListener('click', () => {
  if (state.screen === 'menu') return;
  sounds.click();
  overlay.hidden = true;
  startLevel(state, state.levelIndex, performance.now());
  announce(`${currentLevel(state).name}. Find 7 differences.`);
  syncHud();
});

el.menu.addEventListener('click', () => {
  sounds.click();
  showMenu();
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'h' || event.key === 'H') {
    if (state.screen === 'playing') el.hint.click();
  } else if (event.key === 'r' || event.key === 'R') {
    if (state.screen !== 'menu') el.restart.click();
  } else if (event.key === 'm' || event.key === 'M') {
    el.sound.click();
  } else if (event.key === 'Enter' && state.screen !== 'playing' && !overlay.hidden) {
    const primary = overlayCard.querySelector('button.primary');
    if (primary) primary.click();
  }
});

showMenu();
requestAnimationFrame(frame);
