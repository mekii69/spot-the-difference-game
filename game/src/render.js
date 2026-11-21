// Frame rendering: the two pictures, the gold rings on found differences,
// miss ripples, the hint pulse and the keyboard crosshair. Panels are
// clipped to rounded rectangles; everything else draws on top.

import { PANEL } from './levels.js';
import { currentLevel } from './state.js';
import { paintScene } from './scenes.js';

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawPanel(ctx, state, panelX, side, timeMs) {
  ctx.save();
  roundRectPath(ctx, panelX, PANEL.y, PANEL.w, PANEL.h, 12);
  ctx.clip();
  ctx.translate(panelX, PANEL.y);
  paintScene(ctx, currentLevel(state), side, timeMs);
  ctx.restore();
  ctx.save();
  roundRectPath(ctx, panelX, PANEL.y, PANEL.w, PANEL.h, 12);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
  // Corner tag naming the picture.
  ctx.save();
  ctx.fillStyle = 'rgba(10, 15, 26, 0.72)';
  roundRectPath(ctx, panelX + 12, PANEL.y + 12, 74, 28, 8);
  ctx.fill();
  ctx.fillStyle = '#eef2f8';
  ctx.font = '700 14px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(side === 'left' ? 'PICTURE 1' : 'PICTURE 2', panelX + 49, PANEL.y + 27);
  ctx.restore();
}

function drawMarker(ctx, panelX, diff, timeMs, fresh) {
  const cx = panelX + diff.x;
  const cy = PANEL.y + diff.y;
  const pop = fresh ? 1 + 0.45 * Math.max(0, 1 - (timeMs - fresh) / 260) : 1;
  const r = diff.r * 0.92 * pop;
  ctx.save();
  ctx.strokeStyle = '#ffc857';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255, 200, 87, 0.35)';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(cx, cy, r + 5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#ffe9a3';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.42, cy + r * 0.05);
  ctx.lineTo(cx - r * 0.1, cy + r * 0.38);
  ctx.lineTo(cx + r * 0.45, cy - r * 0.32);
  ctx.stroke();
  ctx.restore();
}

function drawFlashes(ctx, state, timeMs) {
  state.flashes = state.flashes.filter((f) => timeMs - f.bornMs < 550);
  for (const flash of state.flashes) {
    const age = (timeMs - flash.bornMs) / 550;
    const panelX = flash.panel === 'left' ? PANEL.leftX : PANEL.rightX;
    const cx = panelX + flash.x;
    const cy = PANEL.y + flash.y;
    ctx.save();
    ctx.globalAlpha = 1 - age;
    if (flash.kind === 'miss') {
      ctx.strokeStyle = '#ff7a7a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, 8 + age * 26, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 9, cy - 9);
      ctx.lineTo(cx + 9, cy + 9);
      ctx.moveTo(cx + 9, cy - 9);
      ctx.lineTo(cx - 9, cy + 9);
      ctx.stroke();
    } else {
      ctx.strokeStyle = '#ffc857';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, 10 + age * 30, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }
}

function drawCursor(ctx, state) {
  if (!state.cursor.visible || state.screen !== 'playing') return;
  const panelX = state.cursor.panel === 'left' ? PANEL.leftX : PANEL.rightX;
  const cx = panelX + state.cursor.x;
  const cy = PANEL.y + state.cursor.y;
  ctx.save();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, 14, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx - 22, cy);
  ctx.lineTo(cx - 8, cy);
  ctx.moveTo(cx + 8, cy);
  ctx.lineTo(cx + 22, cy);
  ctx.moveTo(cx, cy - 22);
  ctx.lineTo(cx, cy - 8);
  ctx.moveTo(cx, cy + 8);
  ctx.lineTo(cx, cy + 22);
  ctx.stroke();
  ctx.restore();
}

export function drawFrame(ctx, state, timeMs) {
  ctx.clearRect(0, 0, 1240, 700);
  ctx.fillStyle = '#0a0f1a';
  ctx.fillRect(0, 0, 1240, 700);
  drawPanel(ctx, state, PANEL.leftX, 'left', timeMs);
  drawPanel(ctx, state, PANEL.rightX, 'right', timeMs);
  const level = currentLevel(state);
  for (const diff of level.diffs) {
    if (!state.found.has(diff.id)) continue;
    const isFresh = timeMs - state.lastFoundAt < 260;
    drawMarker(ctx, PANEL.leftX, diff, timeMs, isFresh ? state.lastFoundAt : 0);
    drawMarker(ctx, PANEL.rightX, diff, timeMs, isFresh ? state.lastFoundAt : 0);
  }
  if (state.hinted && timeMs < state.hinted.untilMs) {
    const diff = level.diffs.find((d) => d.id === state.hinted.diffId);
    if (diff) {
      const pulse = 1 + 0.18 * Math.sin(timeMs / 90);
      for (const panelX of [PANEL.leftX, PANEL.rightX]) {
        ctx.save();
        ctx.strokeStyle = 'rgba(123, 228, 149, 0.95)';
        ctx.lineWidth = 4;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.arc(panelX + diff.x, PANEL.y + diff.y, diff.r * pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }
  } else if (state.hinted && timeMs >= state.hinted.untilMs) {
    state.hinted = null;
  }
  drawFlashes(ctx, state, timeMs);
  drawCursor(ctx, state);
}
