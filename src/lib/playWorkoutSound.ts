let sharedCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  const AC = typeof window !== 'undefined' && (window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
  if (!AC) return null;
  if (!sharedCtx || sharedCtx.state === 'closed') {
    sharedCtx = new AC();
  }
  return sharedCtx;
}

/** Call after a user gesture so iOS allows playback. */
export function primeWorkoutAudio(): void {
  const ctx = getCtx();
  if (ctx?.state === 'suspended') {
    void ctx.resume();
  }
}

export function playSetCompleteChime(): void {
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === 'suspended') void ctx.resume();

  const now = ctx.currentTime;
  const freqs = [523.25, 659.25];
  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.connect(g);
    g.connect(ctx.destination);
    const t0 = now + i * 0.06;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.12, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.35);
    osc.start(t0);
    osc.stop(t0 + 0.36);
  });
}

export function playWorkoutSavedChime(): void {
  const ctx = getCtx();
  if (!ctx) return;
  if (ctx.state === 'suspended') void ctx.resume();

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(392, now);
  osc.frequency.exponentialRampToValueAtTime(523.25, now + 0.12);
  osc.connect(g);
  g.connect(ctx.destination);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(0.1, now + 0.03);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
  osc.start(now);
  osc.stop(now + 0.46);
}
