// Web Audio API generator for ambient soundscapes & focus chimes
let audioCtx: AudioContext | null = null;
let activeSourceNode: AudioNode | null = null;
let activeGainNode: GainNode | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export type SoundscapeType = 'none' | 'white-noise' | 'theta-waves' | 'binaural-focus' | 'calm-stream';

export function playAmbientSound(type: SoundscapeType, volume: number = 0.25) {
  stopAmbientSound();
  if (type === 'none') return;

  try {
    const ctx = getAudioContext();
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
    gainNode.connect(ctx.destination);
    activeGainNode = gainNode;

    if (type === 'white-noise') {
      // Create filtered pink/white noise
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.15;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Low pass filter for soothing rain/hum
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      whiteNoise.start();
      activeSourceNode = whiteNoise;
    } else if (type === 'theta-waves') {
      // Deep 40Hz Gamma / 6Hz Theta modulated tone
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, ctx.currentTime);

      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(6, ctx.currentTime);

      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.3, ctx.currentTime);

      lfo.connect(lfoGain.gain);
      osc.connect(gainNode);

      osc.start();
      lfo.start();
      activeSourceNode = osc;
    } else if (type === 'binaural-focus') {
      // 40Hz focus binaural simulation
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.connect(gainNode);
      osc.start();
      activeSourceNode = osc;
    } else if (type === 'calm-stream') {
      // Modulated brownian noise
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }
      const streamSource = ctx.createBufferSource();
      streamSource.buffer = noiseBuffer;
      streamSource.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);
      filter.Q.setValueAtTime(1.5, ctx.currentTime);

      streamSource.connect(filter);
      filter.connect(gainNode);
      streamSource.start();
      activeSourceNode = streamSource;
    }
  } catch (e) {
    console.warn('Audio context error:', e);
  }
}

export function stopAmbientSound() {
  if (activeSourceNode) {
    try {
      (activeSourceNode as any).stop?.();
      activeSourceNode.disconnect();
    } catch {}
    activeSourceNode = null;
  }
  if (activeGainNode) {
    try {
      activeGainNode.disconnect();
    } catch {}
    activeGainNode = null;
  }
}

export function setAmbientVolume(volume: number) {
  if (activeGainNode && audioCtx) {
    activeGainNode.gain.setValueAtTime(volume * 0.3, audioCtx.currentTime);
  }
}

export function playCompletionChime() {
  try {
    const ctx = getAudioContext();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);

      gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.1);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + idx * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.1 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.1);
      osc.stop(ctx.currentTime + idx * 0.1 + 0.7);
    });
  } catch {}
}
