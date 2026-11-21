// Shared painters: the small pieces every scene reuses — sky, stars, sea,
// hills, pines, clouds and glows. All drawing is procedural canvas work;
// the game ships no image or sound files at all.

export function verticalGradient(ctx, x, y, w, h, stops) {
  const g = ctx.createLinearGradient(x, y, x, y + h);
  for (const [at, color] of stops) g.addColorStop(at, color);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
}

export function paintStars(ctx, rng, x, y, w, h, count, timeMs) {
  ctx.save();
  for (let i = 0; i < count; i++) {
    const sx = x + rng() * w;
    const sy = y + rng() * h;
    const r = 0.7 + rng() * 1.5;
    const tw = 0.45 + 0.55 * Math.abs(Math.sin(timeMs / 900 + i * 1.7));
    ctx.globalAlpha = tw;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function paintMoon(ctx, x, y, r, glowColor) {
  ctx.save();
  const glow = ctx.createRadialGradient(x, y, r * 0.4, x, y, r * 3.2);
  glow.addColorStop(0, glowColor);
  glow.addColorStop(1, 'rgba(255, 236, 180, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(x, y, r * 3.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fdf6d8';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(214, 205, 170, 0.55)';
  ctx.beginPath();
  ctx.arc(x - r * 0.3, y - r * 0.2, r * 0.22, 0, Math.PI * 2);
  ctx.arc(x + r * 0.35, y + r * 0.3, r * 0.16, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function paintCloud(ctx, x, y, scale, color, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 26 * scale, 0, Math.PI * 2);
  ctx.arc(x + 30 * scale, y - 8 * scale, 30 * scale, 0, Math.PI * 2);
  ctx.arc(x + 64 * scale, y, 24 * scale, 0, Math.PI * 2);
  ctx.arc(x + 32 * scale, y + 8 * scale, 30 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function paintPine(ctx, x, y, h, color) {
  ctx.save();
  ctx.fillStyle = '#4a3220';
  ctx.fillRect(x - 4, y - 12, 8, 14);
  ctx.fillStyle = color;
  for (let i = 0; i < 3; i++) {
    const tierW = 46 - i * 10;
    const tierY = y - 8 - i * (h / 3.4);
    const tierH = h / 2.4;
    ctx.beginPath();
    ctx.moveTo(x - tierW / 2, tierY);
    ctx.lineTo(x, tierY - tierH);
    ctx.lineTo(x + tierW / 2, tierY);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

export function paintHills(ctx, x, y, w, h, rng, farColor, nearColor) {
  ctx.save();
  ctx.fillStyle = farColor;
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.55);
  for (let px = 0; px <= w; px += 20) {
    ctx.lineTo(x + px, y + h * 0.42 + Math.sin(px / 90 + 1.3) * 16 + rng() * 4);
  }
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = nearColor;
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.72);
  for (let px = 0; px <= w; px += 20) {
    ctx.lineTo(x + px, y + h * 0.66 + Math.sin(px / 70 + 4.1) * 12 + rng() * 4);
  }
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function paintSea(ctx, x, y, w, h, deep, shallow, timeMs) {
  verticalGradient(ctx, x, y, w, h, [[0, shallow], [1, deep]]);
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
  ctx.lineWidth = 1.5;
  for (let row = 0; row < 5; row++) {
    const yy = y + 16 + row * ((h - 24) / 4);
    for (let i = 0; i < 4; i++) {
      const xx = x + 30 + i * (w / 4) + Math.sin(timeMs / 700 + row * 2 + i) * 8;
      const len = 26 + 10 * Math.sin(timeMs / 900 + i * 3 + row);
      ctx.beginPath();
      ctx.moveTo(xx, yy);
      ctx.lineTo(xx + len, yy);
      ctx.stroke();
    }
  }
  ctx.restore();
}

export function paintGlow(ctx, x, y, r, color) {
  const g = ctx.createRadialGradient(x, y, 1, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, 'rgba(255, 200, 90, 0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

export function paintFlower(ctx, x, y, petal, center) {
  ctx.save();
  ctx.fillStyle = petal;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(x + Math.cos(a) * 6, y + Math.sin(a) * 6, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = center;
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
