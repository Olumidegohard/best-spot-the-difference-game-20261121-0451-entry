// Tiny WebAudio sounds, synthesised on the spot — no audio files, no
// network. The context is created on the first user gesture, so browsers
// never block it, and M silences it.

let context = null;

function ensureContext() {
  if (context === null) {
    try {
      const AudioContext = window.AudioContext ?? window.webkitAudioContext;
      if (AudioContext === undefined) return null;
      context = new AudioContext();
    } catch {
      return null;
    }
  }
  if (context.state === 'suspended') void context.resume();
  return context;
}

function tone(when, frequency, duration, type, gainValue) {
  const ctx = ensureContext();
  if (ctx === null) return;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(gainValue, when + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(when);
  oscillator.stop(when + duration + 0.05);
}

export function createSound() {
  let muted = false;
  return {
    get muted() {
      return muted;
    },
    toggleMuted() {
      muted = !muted;
      return muted;
    },
    unlock() {
      ensureContext();
    },
    found() {
      if (muted) return;
      const now = ensureContext()?.currentTime;
      if (now === undefined) return;
      tone(now, 660, 0.12, 'sine', 0.12);
      tone(now + 0.09, 880, 0.18, 'sine', 0.12);
    },
    wrong() {
      if (muted) return;
      const now = ensureContext()?.currentTime;
      if (now === undefined) return;
      tone(now, 160, 0.18, 'sawtooth', 0.06);
    },
    win() {
      if (muted) return;
      const now = ensureContext()?.currentTime;
      if (now === undefined) return;
      [523, 659, 784, 1047].forEach((frequency, i) => tone(now + i * 0.11, frequency, 0.22, 'triangle', 0.12));
    },
    hint() {
      if (muted) return;
      const now = ensureContext()?.currentTime;
      if (now === undefined) return;
      tone(now, 990, 0.1, 'sine', 0.07);
    },
  };
}
