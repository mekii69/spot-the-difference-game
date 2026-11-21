// Tiny synthesized sounds: no audio files, everything is an oscillator
// through the Web Audio API, created on the first user gesture.

let context = null;
let muted = false;
let master = null;

function ensureContext() {
  if (context) return context;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  context = new AudioContext();
  master = context.createGain();
  master.gain.value = 0.16;
  master.connect(context.destination);
  return context;
}

function tone(freq, start, length, type, slideTo) {
  const ctx = ensureContext();
  if (!ctx || muted) return;
  if (ctx.state === 'suspended') void ctx.resume();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, ctx.currentTime + start + length);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(1, ctx.currentTime + start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + length);
  osc.connect(gain);
  gain.connect(master);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + length + 0.05);
}

export const sounds = {
  unlock() {
    ensureContext();
  },
  click() {
    tone(720, 0, 0.06, 'triangle');
  },
  found() {
    tone(659.25, 0, 0.14, 'sine');
    tone(880, 0.09, 0.2, 'sine');
  },
  miss() {
    tone(160, 0, 0.16, 'square', 110);
  },
  hint() {
    tone(520, 0, 0.1, 'sine');
    tone(780, 0.08, 0.12, 'sine');
  },
  clear() {
    tone(523.25, 0, 0.14, 'sine');
    tone(659.25, 0.11, 0.14, 'sine');
    tone(783.99, 0.22, 0.16, 'sine');
    tone(1046.5, 0.33, 0.3, 'sine');
  },
  win() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5];
    notes.forEach((freq, i) => tone(freq, i * 0.13, 0.22, 'triangle'));
  },
  toggleMute() {
    muted = !muted;
    return muted;
  },
  isMuted() {
    return muted;
  },
};
