// Deterministic seeded random numbers, so every scene paints exactly the
// same way on every load. The game never uses Math.random for layout.

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function range(rng, min, max) {
  return min + rng() * (max - min);
}

export function pick(rng, items) {
  return items[Math.floor(rng() * items.length) % items.length];
}

// A gentle 0..1 wobble driven by time only, so animation is smooth and
// repeatable for any given moment.
export function sway(timeMs, periodMs, phase) {
  return 0.5 + 0.5 * Math.sin((timeMs / periodMs) * Math.PI * 2 + phase);
}
