// Pointer and keyboard input. Clicks land on the canvas, are mapped into
// panel-local coordinates, and hit-tested against the level's difference
// circles in either picture. The keyboard drives a crosshair cursor so the
// whole game plays without a mouse.

import { PANEL } from './levels.js';
import { applyFound, applyMiss, currentLevel } from './state.js';

export function canvasPoint(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) / rect.width) * canvas.width,
    y: ((clientY - rect.top) / rect.height) * canvas.height,
  };
}

function panelAt(point) {
  if (
    point.x >= PANEL.leftX &&
    point.x < PANEL.leftX + PANEL.w &&
    point.y >= PANEL.y &&
    point.y < PANEL.y + PANEL.h
  ) {
    return { panel: 'left', x: point.x - PANEL.leftX, y: point.y - PANEL.y };
  }
  if (
    point.x >= PANEL.rightX &&
    point.x < PANEL.rightX + PANEL.w &&
    point.y >= PANEL.y &&
    point.y < PANEL.y + PANEL.h
  ) {
    return { panel: 'right', x: point.x - PANEL.rightX, y: point.y - PANEL.y };
  }
  return null;
}

export function hitDifference(level, local) {
  for (const diff of level.diffs) {
    const dx = local.x - diff.x;
    const dy = local.y - diff.y;
    if (dx * dx + dy * dy <= diff.r * diff.r) return diff;
  }
  return null;
}

export function attachInput(canvas, state, hooks) {
  const { onFound, onMiss, onAnyGesture } = hooks;

  function attempt(local, panel, nowMs) {
    const level = currentLevel(state);
    const diff = hitDifference(level, local);
    if (diff && !state.found.has(diff.id)) {
      state.flashes.push({ x: local.x, y: local.y, panel, kind: 'found', bornMs: nowMs });
      if (applyFound(state, diff.id, nowMs)) onFound(diff);
    } else if (diff && state.found.has(diff.id)) {
      // Clicking an already-found difference is harmless: no penalty.
    } else {
      state.flashes.push({ x: local.x, y: local.y, panel, kind: 'miss', bornMs: nowMs });
      applyMiss(state);
      onMiss(local);
    }
  }

  canvas.addEventListener('pointerdown', (event) => {
    onAnyGesture();
    if (state.screen !== 'playing') return;
    const point = canvasPoint(canvas, event.clientX, event.clientY);
    const hit = panelAt(point);
    if (!hit) return;
    state.cursor = { x: hit.x, y: hit.y, panel: hit.panel, visible: false };
    attempt(hit, hit.panel, performance.now());
  });

  canvas.addEventListener('pointermove', (event) => {
    const point = canvasPoint(canvas, event.clientX, event.clientY);
    const hit = panelAt(point);
    if (hit) state.cursor = { x: hit.x, y: hit.y, panel: hit.panel, visible: false };
  });

  window.addEventListener('keydown', (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
    const nowMs = performance.now();
    const step = event.shiftKey ? 8 : 26;
    const cursor = state.cursor;
    if (state.screen === 'playing' && event.key.startsWith('Arrow')) {
      event.preventDefault();
      onAnyGesture();
      cursor.visible = true;
      if (event.key === 'ArrowLeft') cursor.x -= step;
      if (event.key === 'ArrowRight') cursor.x += step;
      if (event.key === 'ArrowUp') cursor.y -= step;
      if (event.key === 'ArrowDown') cursor.y += step;
      cursor.x = Math.max(0, Math.min(PANEL.w, cursor.x));
      cursor.y = Math.max(0, Math.min(PANEL.h, cursor.y));
      if (cursor.x >= PANEL.w && cursor.panel === 'left') {
        cursor.panel = 'right';
        cursor.x = 0;
      } else if (cursor.x <= 0 && cursor.panel === 'right') {
        cursor.panel = 'left';
        cursor.x = PANEL.w;
      }
      return;
    }
    if (state.screen === 'playing' && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onAnyGesture();
      cursor.visible = true;
      attempt({ x: cursor.x, y: cursor.y }, cursor.panel, nowMs);
    }
  });
}
