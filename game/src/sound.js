// Tiny WebAudio sound effects, synthesised — the game ships no audio files.

let ctx = null;

function tone(freq, at, dur, type = "sine", gain = 0.12) {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  const t0 = ctx.currentTime + at;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  amp.gain.setValueAtTime(gain, t0);
  amp.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
  osc.connect(amp).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur);
}

export function playFind() {
  tone(660, 0, 0.12);
  tone(990, 0.09, 0.18);
}

export function playMiss() {
  tone(140, 0, 0.16, "square", 0.05);
}

export function playWin() {
  tone(523, 0, 0.14);
  tone(659, 0.12, 0.14);
  tone(784, 0.24, 0.14);
  tone(1047, 0.36, 0.26);
}
