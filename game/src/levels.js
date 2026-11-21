// Level data: each scene's name, seed and its seven differences. A
// difference's x/y/r live in panel-local coordinates (the panel is 590 by
// 640); the same spot is checked in both pictures, so a click on either
// side finds it. Labels name what changed, for the clear-screen recap.

export const PANEL = { w: 590, h: 640, leftX: 20, rightX: 630, y: 20 };

export const LEVELS = [
  {
    id: 'cove',
    name: 'Lantern Cove',
    seed: 11,
    hint: 'A harbour at dusk. The lighthouse keeper just lit the lamps.',
    diffs: [
      { id: 'gull', x: 140, y: 92, r: 26, label: 'the extra gull' },
      { id: 'lamp', x: 300, y: 208, r: 30, label: 'the lighthouse lamp' },
      { id: 'sail', x: 432, y: 468, r: 30, label: 'the boat sail' },
      { id: 'pier-lamp', x: 182, y: 522, r: 24, label: 'the pier lantern' },
      { id: 'buoy', x: 502, y: 560, r: 22, label: 'the red buoy' },
      { id: 'star', x: 522, y: 58, r: 18, label: 'the bright star' },
      { id: 'window', x: 92, y: 302, r: 24, label: 'the cottage window' },
    ],
  },
  {
    id: 'cottage',
    name: 'Mossy Cottage',
    seed: 29,
    hint: 'A cottage garden in the morning sun. Something stirs by the fence.',
    diffs: [
      { id: 'smoke', x: 418, y: 128, r: 26, label: 'the chimney smoke' },
      { id: 'cat', x: 200, y: 482, r: 26, label: 'the cat on the path' },
      { id: 'sunflower', x: 500, y: 430, r: 24, label: 'the tall sunflower' },
      { id: 'curtain', x: 300, y: 282, r: 26, label: 'the round-window curtain' },
      { id: 'butterfly', x: 150, y: 382, r: 20, label: 'the butterfly' },
      { id: 'picket', x: 92, y: 470, r: 22, label: 'the fence picket' },
      { id: 'roof-bird', x: 392, y: 104, r: 18, label: 'the bird on the roof' },
    ],
  },
  {
    id: 'camp',
    name: 'Starlight Camp',
    seed: 47,
    hint: 'A lakeside camp under the stars. The fire is crackling.',
    diffs: [
      { id: 'owl', x: 110, y: 150, r: 24, label: 'the owl on the branch' },
      { id: 'fire', x: 300, y: 520, r: 30, label: 'the campfire flames' },
      { id: 'bulb', x: 430, y: 120, r: 20, label: 'the string-light bulb' },
      { id: 'canoe', x: 480, y: 560, r: 26, label: 'the canoe' },
      { id: 'tent-glow', x: 300, y: 400, r: 26, label: 'the tent glow' },
      { id: 'shooting-star', x: 522, y: 70, r: 22, label: 'the shooting star' },
      { id: 'sapling', x: 80, y: 430, r: 24, label: 'the little pine' },
    ],
  },
];

export function totalDifferences() {
  return LEVELS.reduce((n, level) => n + level.diffs.length, 0);
}
