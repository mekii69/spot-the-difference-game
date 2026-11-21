// The three scenes. Each painter draws one picture in panel-local
// coordinates (590 by 640) for one side, 'left' or 'right'. The two sides
// are identical except for the level's seven differences, each drawn only
// on its changed side. Scatter uses a fresh seeded RNG per paint call, so
// every frame of a scene is identical except for time-driven animation.

import {
  paintCloud,
  paintFlower,
  paintGlow,
  paintHills,
  paintMoon,
  paintPine,
  paintSea,
  paintStars,
  verticalGradient,
} from './art.js';
import { mulberry32, sway } from './rng.js';

function gull(ctx, x, y, scale, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2 * scale;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 9 * scale, y);
  ctx.quadraticCurveTo(x - 4 * scale, y - 6 * scale, x, y);
  ctx.quadraticCurveTo(x + 4 * scale, y - 6 * scale, x + 9 * scale, y);
  ctx.stroke();
  ctx.restore();
}

function sailboat(ctx, x, y, sailColor, striped) {
  ctx.save();
  ctx.fillStyle = '#5a3a22';
  ctx.beginPath();
  ctx.moveTo(x - 34, y);
  ctx.lineTo(x + 34, y);
  ctx.lineTo(x + 24, y + 14);
  ctx.lineTo(x - 24, y + 14);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#3c2716';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y - 52);
  ctx.stroke();
  ctx.fillStyle = sailColor;
  ctx.beginPath();
  ctx.moveTo(x + 4, y - 50);
  ctx.lineTo(x + 4, y - 8);
  ctx.lineTo(x + 30, y - 8);
  ctx.closePath();
  ctx.fill();
  if (striped) {
    ctx.strokeStyle = '#c23b2e';
    ctx.lineWidth = 4;
    for (let i = 0; i < 3; i++) {
      const yy = y - 42 + i * 12;
      ctx.beginPath();
      ctx.moveTo(x + 6, yy);
      ctx.lineTo(x + 24 - i * 6, yy);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function lighthouse(ctx, x, baseY, lampOn, timeMs) {
  ctx.save();
  ctx.fillStyle = '#3a3f4a';
  ctx.beginPath();
  ctx.moveTo(x - 46, baseY);
  ctx.lineTo(x - 30, baseY - 22);
  ctx.lineTo(x + 30, baseY - 22);
  ctx.lineTo(x + 46, baseY);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#e8e2d4';
  ctx.beginPath();
  ctx.moveTo(x - 18, baseY - 20);
  ctx.lineTo(x - 13, baseY - 168);
  ctx.lineTo(x + 13, baseY - 168);
  ctx.lineTo(x + 18, baseY - 20);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#c23b2e';
  ctx.fillRect(x - 16, baseY - 92, 32, 22);
  ctx.fillRect(x - 14, baseY - 140, 28, 20);
  ctx.fillStyle = '#2c3140';
  ctx.fillRect(x - 16, baseY - 178, 32, 12);
  ctx.fillStyle = lampOn ? '#ffe9a3' : '#4a5162';
  ctx.fillRect(x - 11, baseY - 192, 22, 13);
  if (lampOn) {
    paintGlow(ctx, x, baseY - 185, 46, 'rgba(255, 224, 130, 0.75)');
    const angle = -0.5 + sway(timeMs, 9000, 0) * 0.9;
    ctx.save();
    ctx.translate(x, baseY - 185);
    ctx.rotate(angle);
    const beam = ctx.createLinearGradient(0, 0, 190, 0);
    beam.addColorStop(0, 'rgba(255, 236, 170, 0.5)');
    beam.addColorStop(1, 'rgba(255, 236, 170, 0)');
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(190, -26);
    ctx.lineTo(190, 26);
    ctx.lineTo(0, 6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

export function paintCove(ctx, side, timeMs) {
  const rng = mulberry32(11);
  verticalGradient(ctx, 0, 0, 590, 640, [
    [0, '#171f45'],
    [0.45, '#4b3a6e'],
    [0.62, '#a86a7e'],
    [0.66, '#e8a06a'],
    [1, '#2a1e33'],
  ]);
  paintStars(ctx, rng, 0, 0, 590, 300, 70, timeMs);
  if (side === 'left') {
    ctx.save();
    ctx.strokeStyle = '#fff6c8';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    const sx = 522;
    const sy = 58;
    ctx.beginPath();
    ctx.moveTo(sx - 14, sy);
    ctx.lineTo(sx + 14, sy);
    ctx.moveTo(sx, sy - 14);
    ctx.lineTo(sx, sy + 14);
    ctx.stroke();
    ctx.fillStyle = '#fff6c8';
    ctx.beginPath();
    ctx.arc(sx, sy, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  paintMoon(ctx, 92, 82, 26, 'rgba(255, 236, 180, 0.5)');
  paintCloud(ctx, 200, 96, 1.1, 'rgba(70, 60, 110, 0.85)', 0.9);
  paintCloud(ctx, 400, 60, 0.8, 'rgba(60, 52, 100, 0.8)', 0.9);
  gull(ctx, 105, 122, 1, '#e8e4da');
  gull(ctx, 182, 72, 0.85, '#e8e4da');
  if (side === 'left') gull(ctx, 140, 92, 1, '#e8e4da');
  // Headland with a cottage.
  ctx.fillStyle = '#241d33';
  ctx.beginPath();
  ctx.moveTo(0, 400);
  ctx.lineTo(0, 330);
  ctx.quadraticCurveTo(90, 300, 170, 330);
  ctx.quadraticCurveTo(230, 352, 260, 400);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#4d3b2c';
  ctx.fillRect(58, 300, 68, 44);
  ctx.fillStyle = '#6e3b2e';
  ctx.beginPath();
  ctx.moveTo(50, 302);
  ctx.lineTo(92, 272);
  ctx.lineTo(134, 302);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = side === 'left' ? '#ffd97a' : '#2e3444';
  ctx.fillRect(84, 314, 16, 16);
  if (side === 'left') paintGlow(ctx, 92, 322, 26, 'rgba(255, 210, 110, 0.5)');
  paintSea(ctx, 0, 400, 590, 240, '#1c2c52', '#3d5a8c', timeMs);
  lighthouse(ctx, 300, 404, side === 'left', timeMs);
  // Pier with lanterns.
  ctx.save();
  ctx.fillStyle = '#4a3524';
  ctx.fillRect(0, 512, 262, 10);
  ctx.fillRect(20, 522, 10, 40);
  ctx.fillRect(120, 522, 10, 40);
  ctx.fillRect(230, 522, 10, 40);
  for (const lx of [38, 182, 248]) {
    ctx.fillStyle = '#2e2118';
    ctx.fillRect(lx - 3, 492, 6, 22);
  }
  for (const lx of [38, 248]) {
    ctx.fillStyle = '#ffd97a';
    ctx.beginPath();
    ctx.arc(lx, 488, 7, 0, Math.PI * 2);
    ctx.fill();
    paintGlow(ctx, lx, 488, 22, 'rgba(255, 210, 110, 0.45)');
  }
  const midLit = side === 'left';
  ctx.fillStyle = midLit ? '#ffd97a' : '#3a4152';
  ctx.beginPath();
  ctx.arc(182, 488, 7, 0, Math.PI * 2);
  ctx.fill();
  if (midLit) paintGlow(ctx, 182, 488, 22, 'rgba(255, 210, 110, 0.45)');
  ctx.restore();
  sailboat(ctx, 432, 462, side === 'left' ? '#f2ede2' : '#e8e2d4', side === 'right');
  if (side === 'left') {
    ctx.fillStyle = '#c23b2e';
    ctx.beginPath();
    ctx.arc(502, 556, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#7e2318';
    ctx.fillRect(499, 542, 6, 10);
    const blink = Math.sin(timeMs / 300) > 0;
    if (blink) {
      ctx.fillStyle = '#ff5a4a';
      ctx.beginPath();
      ctx.arc(502, 540, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function cottage(ctx, x, y) {
  ctx.save();
  ctx.fillStyle = '#f0e6cc';
  ctx.fillRect(x - 70, y, 140, 84);
  ctx.fillStyle = '#b04a38';
  ctx.beginPath();
  ctx.moveTo(x - 82, y + 2);
  ctx.lineTo(x, y - 58);
  ctx.lineTo(x + 82, y + 2);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#7a3b2a';
  ctx.fillRect(x + 44, y - 78, 22, 46);
  ctx.fillStyle = '#6e3b2e';
  ctx.fillRect(x - 14, y + 34, 28, 50);
  ctx.fillStyle = '#ffd97a';
  ctx.beginPath();
  ctx.arc(x - 14 + 28, y + 52, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function paintCottage(ctx, side, timeMs) {
  const rng = mulberry32(29);
  verticalGradient(ctx, 0, 0, 590, 640, [
    [0, '#7ec3ee'],
    [0.55, '#bfe6f5'],
    [0.72, '#e8f6d8'],
    [1, '#7fae56'],
  ]);
  ctx.save();
  ctx.fillStyle = '#fff3b0';
  ctx.beginPath();
  ctx.arc(500, 84, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 227, 120, 0.8)';
  ctx.lineWidth = 4;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + timeMs / 20000;
    ctx.beginPath();
    ctx.moveTo(500 + Math.cos(a) * 44, 84 + Math.sin(a) * 44);
    ctx.lineTo(500 + Math.cos(a) * 58, 84 + Math.sin(a) * 58);
    ctx.stroke();
  }
  ctx.restore();
  paintCloud(ctx, 110, 84, 1.2, 'rgba(255,255,255,0.95)', 1);
  paintCloud(ctx, 330, 56, 0.85, 'rgba(255,255,255,0.9)', 1);
  paintHills(ctx, 0, 180, 590, 300, rng, '#8fbf6a', '#6da34e');
  // Oak tree.
  ctx.fillStyle = '#5a3d24';
  ctx.fillRect(78, 250, 22, 130);
  ctx.fillStyle = '#3f7a34';
  ctx.beginPath();
  ctx.arc(88, 220, 62, 0, Math.PI * 2);
  ctx.arc(48, 258, 44, 0, Math.PI * 2);
  ctx.arc(132, 258, 44, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#4c8a3e';
  ctx.beginPath();
  ctx.arc(70, 200, 30, 0, Math.PI * 2);
  ctx.arc(112, 236, 26, 0, Math.PI * 2);
  ctx.fill();
  cottage(ctx, 300, 300);
  // Round window curtain.
  ctx.save();
  ctx.beginPath();
  ctx.arc(300, 282, 20, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = side === 'left' ? '#9fd4ef' : '#7a5a40';
  ctx.fillRect(280, 262, 40, 40);
  if (side === 'left') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(286, 262, 7, 40);
    ctx.fillRect(307, 262, 7, 40);
  }
  ctx.restore();
  ctx.strokeStyle = '#7a3b2a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(300, 282, 20, 0, Math.PI * 2);
  ctx.stroke();
  // Chimney smoke, only on the left.
  if (side === 'left') {
    ctx.fillStyle = 'rgba(240, 240, 240, 0.75)';
    for (let i = 0; i < 3; i++) {
      const drift = sway(timeMs, 4000, i * 2.1) * 14;
      const yy = 128 - i * 26 - ((timeMs / 60 + i * 30) % 26);
      ctx.beginPath();
      ctx.arc(418 + drift, yy, 12 + i * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  if (side === 'left') {
    ctx.fillStyle = '#2c2c34';
    ctx.beginPath();
    ctx.arc(392, 100, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(386, 96);
    ctx.lineTo(382, 88);
    ctx.lineTo(390, 93);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(398, 96);
    ctx.lineTo(402, 88);
    ctx.lineTo(394, 93);
    ctx.closePath();
    ctx.fill();
  }
  // Path stones.
  ctx.fillStyle = '#cbb98f';
  for (const [px, py, pr] of [[300, 400, 16], [286, 436, 15], [312, 470, 16], [296, 506, 15], [306, 542, 16], [298, 580, 15]]) {
    ctx.beginPath();
    ctx.ellipse(px, py, pr, pr * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // Fence.
  ctx.save();
  ctx.strokeStyle = '#8a6a44';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(16, 452);
  ctx.lineTo(574, 452);
  ctx.moveTo(16, 478);
  ctx.lineTo(574, 478);
  ctx.stroke();
  ctx.fillStyle = '#a87f52';
  for (let px = 30; px <= 560; px += 44) {
    if (side === 'right' && px === 118) continue;
    ctx.beginPath();
    ctx.moveTo(px - 8, 496);
    ctx.lineTo(px - 8, 436);
    ctx.lineTo(px, 428);
    ctx.lineTo(px + 8, 436);
    ctx.lineTo(px + 8, 496);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  // Flower meadow.
  const petalColors = ['#e86a8a', '#f2d24b', '#ffffff', '#b07fe8', '#ef7d4a'];
  for (let i = 0; i < 46; i++) {
    const fx = 16 + rng() * 558;
    const fy = 500 + rng() * 124;
    if (fx > 250 && fx < 350 && fy < 600) continue;
    paintFlower(ctx, fx, fy, petalColors[Math.floor(rng() * petalColors.length)], '#f2b63d');
  }
  // Cat, only on the left.
  if (side === 'left') {
    ctx.fillStyle = '#33333c';
    ctx.beginPath();
    ctx.ellipse(200, 492, 20, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(200, 470, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(191, 462);
    ctx.lineTo(189, 452);
    ctx.lineTo(196, 459);
    ctx.closePath();
    ctx.moveTo(209, 462);
    ctx.lineTo(211, 452);
    ctx.lineTo(204, 459);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#33333c';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(218, 494);
    ctx.quadraticCurveTo(234, 488, 230, 474);
    ctx.stroke();
  }
  // Sunflower, only on the left.
  if (side === 'left') {
    ctx.strokeStyle = '#3f7a34';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(500, 500);
    ctx.lineTo(500, 402);
    ctx.stroke();
    ctx.fillStyle = '#f2b63d';
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      ctx.beginPath();
      ctx.ellipse(500 + Math.cos(a) * 16, 392 + Math.sin(a) * 16, 9, 5, a, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#6b4423';
    ctx.beginPath();
    ctx.arc(500, 392, 12, 0, Math.PI * 2);
    ctx.fill();
  }
  // Butterfly, only on the left.
  if (side === 'left') {
    const flap = Math.sin(timeMs / 130) * 0.7;
    const bx = 150 + Math.sin(timeMs / 900) * 8;
    const by = 382 + Math.cos(timeMs / 700) * 6;
    ctx.save();
    ctx.translate(bx, by);
    ctx.fillStyle = '#e86ab0';
    for (const dir of [-1, 1]) {
      ctx.save();
      ctx.rotate(dir * flap * 0.5);
      ctx.beginPath();
      ctx.ellipse(dir * 8, 0, 9, 6, dir * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = '#33333c';
    ctx.fillRect(-1, -6, 2, 12);
    ctx.restore();
  }
}

export function paintCamp(ctx, side, timeMs) {
  const rng = mulberry32(47);
  verticalGradient(ctx, 0, 0, 590, 640, [
    [0, '#0a1230'],
    [0.5, '#16224f'],
    [0.72, '#1d2f56'],
    [1, '#0c1526'],
  ]);
  // Milky way band.
  ctx.save();
  for (let i = 0; i < 90; i++) {
    const t = rng();
    ctx.globalAlpha = 0.12 + rng() * 0.25;
    ctx.fillStyle = '#dfe8ff';
    ctx.beginPath();
    ctx.arc(40 + t * 520, 30 + t * 260 + (rng() - 0.5) * 70, 0.8 + rng() * 1.4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  paintStars(ctx, rng, 0, 0, 590, 330, 80, timeMs);
  // Shooting star, only on the left.
  if (side === 'left') {
    const streak = ctx.createLinearGradient(522, 70, 452, 116);
    streak.addColorStop(0, 'rgba(255,255,255,0.95)');
    streak.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.strokeStyle = streak;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(522, 70);
    ctx.lineTo(452, 116);
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(522, 70, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.save();
  ctx.fillStyle = '#f4ecd0';
  ctx.beginPath();
  ctx.arc(80, 74, 24, 0.6, Math.PI * 1.5);
  ctx.arc(92, 74, 22, Math.PI * 1.45, Math.PI * 0.55, true);
  ctx.fill();
  ctx.restore();
  // Back pines and hills.
  paintHills(ctx, 0, 190, 590, 300, rng, '#12233c', '#0e1c30');
  for (let i = 0; i < 9; i++) {
    paintPine(ctx, 24 + i * 66, 330 + (i % 3) * 8, 90 + ((i * 37) % 40), '#13273f');
  }
  // String lights between two pines.
  ctx.save();
  ctx.strokeStyle = '#0a0f1a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(150, 92);
  ctx.quadraticCurveTo(300, 168, 480, 96);
  ctx.stroke();
  for (let i = 0; i < 6; i++) {
    const t = i / 5;
    const bx = 150 + (480 - 150) * t;
    const by = 92 + (96 - 92) * t + Math.sin(t * Math.PI) * 52;
    const dark = side === 'right' && i === 4;
    if (!dark) paintGlow(ctx, bx, by + 8, 18, 'rgba(255, 210, 110, 0.5)');
    ctx.fillStyle = dark ? '#3a4152' : '#ffd97a';
    ctx.beginPath();
    ctx.arc(bx, by + 8, 6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  // Owl branch, owl only on the left.
  ctx.save();
  ctx.strokeStyle = '#2a1e14';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(58, 168);
  ctx.lineTo(168, 150);
  ctx.stroke();
  if (side === 'left') {
    ctx.fillStyle = '#5a4632';
    ctx.beginPath();
    ctx.ellipse(110, 136, 15, 19, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(110, 118, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffd97a';
    ctx.beginPath();
    ctx.arc(105, 117, 3, 0, Math.PI * 2);
    ctx.arc(115, 117, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  // Ground.
  ctx.fillStyle = '#16281c';
  ctx.fillRect(0, 430, 590, 210);
  ctx.fillStyle = '#1d3324';
  ctx.beginPath();
  ctx.moveTo(0, 470);
  ctx.quadraticCurveTo(200, 440, 400, 466);
  ctx.quadraticCurveTo(500, 478, 590, 462);
  ctx.lineTo(590, 640);
  ctx.lineTo(0, 640);
  ctx.closePath();
  ctx.fill();
  for (let i = 0; i < 7; i++) {
    paintPine(ctx, 30 + i * 88, 446 + (i % 2) * 6, 66 + ((i * 29) % 26), '#1c3a26');
  }
  if (side === 'left') paintPine(ctx, 80, 448, 46, '#22452c');
  // Tent.
  ctx.save();
  ctx.fillStyle = '#c25a3a';
  ctx.beginPath();
  ctx.moveTo(238, 452);
  ctx.lineTo(300, 344);
  ctx.lineTo(362, 452);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#a34a2e';
  ctx.beginPath();
  ctx.moveTo(300, 344);
  ctx.lineTo(362, 452);
  ctx.lineTo(300, 452);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = side === 'left' ? '#ffd97a' : '#241a12';
  ctx.beginPath();
  ctx.moveTo(284, 452);
  ctx.lineTo(300, 402);
  ctx.lineTo(316, 452);
  ctx.closePath();
  ctx.fill();
  if (side === 'left') paintGlow(ctx, 300, 436, 40, 'rgba(255, 210, 110, 0.35)');
  ctx.restore();
  // Campfire.
  ctx.save();
  ctx.fillStyle = '#3a3f4a';
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(300 + Math.cos(a) * 22, 534 + Math.sin(a) * 6, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = '#4a3220';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(284, 540);
  ctx.lineTo(314, 524);
  ctx.moveTo(316, 540);
  ctx.lineTo(286, 524);
  ctx.stroke();
  if (side === 'left') {
    const flick = sway(timeMs, 340, 0) * 10;
    ctx.fillStyle = '#ff8c2e';
    ctx.beginPath();
    ctx.moveTo(288, 528);
    ctx.quadraticCurveTo(300, 486 - flick, 312, 528);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffd97a';
    ctx.beginPath();
    ctx.moveTo(293, 528);
    ctx.quadraticCurveTo(300, 500 - flick, 307, 528);
    ctx.closePath();
    ctx.fill();
    paintGlow(ctx, 300, 512, 52, 'rgba(255, 160, 60, 0.4)');
    ctx.fillStyle = '#ffcf7a';
    for (let i = 0; i < 5; i++) {
      const rise = (timeMs / 14 + i * 47) % 70;
      ctx.globalAlpha = 1 - rise / 70;
      ctx.beginPath();
      ctx.arc(292 + ((i * 13) % 18), 516 - rise, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  } else {
    ctx.fillStyle = '#ff7a3c';
    ctx.beginPath();
    ctx.arc(294, 530, 4, 0, Math.PI * 2);
    ctx.arc(306, 531, 3, 0, Math.PI * 2);
    ctx.fill();
    paintGlow(ctx, 300, 528, 22, 'rgba(255, 140, 60, 0.3)');
  }
  ctx.restore();
  // Lake with reflections.
  ctx.save();
  ctx.fillStyle = '#16283e';
  ctx.fillRect(0, 556, 590, 84);
  ctx.fillStyle = 'rgba(244, 236, 208, 0.35)';
  ctx.fillRect(70, 560, 20, 3);
  ctx.fillRect(76, 570, 12, 3);
  ctx.strokeStyle = 'rgba(180, 210, 255, 0.25)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 4; i++) {
    const yy = 570 + i * 14;
    ctx.beginPath();
    ctx.moveTo(180 + Math.sin(timeMs / 800 + i) * 6, yy);
    ctx.lineTo(260 + Math.sin(timeMs / 800 + i) * 6, yy);
    ctx.stroke();
  }
  if (side === 'left') {
    ctx.fillStyle = '#2c2118';
    ctx.beginPath();
    ctx.moveTo(446, 566);
    ctx.lineTo(514, 566);
    ctx.lineTo(502, 578);
    ctx.lineTo(458, 578);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#2c2118';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(516, 560);
    ctx.lineTo(528, 548);
    ctx.stroke();
  }
  ctx.restore();
}

export function paintScene(ctx, level, side, timeMs) {
  if (level.id === 'cove') paintCove(ctx, side, timeMs);
  else if (level.id === 'cottage') paintCottage(ctx, side, timeMs);
  else paintCamp(ctx, side, timeMs);
}
