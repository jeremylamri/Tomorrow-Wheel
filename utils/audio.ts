// Premium Cinematic Audio Engine

let audioCtx: AudioContext | null = null;
let droneNode: OscillatorNode | null = null;
let droneGain: GainNode | null = null;

const getCtx = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

// --- HELPER: NOISE BUFFER ---
const createNoiseBuffer = (ctx: AudioContext) => {
  const bufferSize = ctx.sampleRate * 2; // 2 seconds of noise
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
};

// --- AMBIANCE ---
export const toggleDrone = (play: boolean) => {
    try {
        const ctx = getCtx();
        if (play) {
            if (ctx.state === 'suspended') ctx.resume();
            if (droneNode) return;

            droneNode = ctx.createOscillator();
            droneGain = ctx.createGain();
            
            // Deep subtle sub-bass
            droneNode.type = 'sine';
            droneNode.frequency.value = 40; 
            
            droneGain.gain.setValueAtTime(0, ctx.currentTime);
            droneGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 2); // Fade in

            droneNode.connect(droneGain);
            droneGain.connect(ctx.destination);
            droneNode.start();
        } else {
            if (droneNode && droneGain) {
                droneGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
                droneNode.stop(ctx.currentTime + 1);
                droneNode = null;
                droneGain = null;
            }
        }
    } catch (e) {}
};

// --- MECHANICAL CLICK (The Wheel) ---
export const playTick = () => {
  try {
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;

    // 1. Wood/Plastic Impact (Filter Noise)
    const noiseBuffer = createNoiseBuffer(ctx);
    const noiseSrc = ctx.createBufferSource();
    noiseSrc.buffer = noiseBuffer;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(800, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(100, now + 0.1);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    noiseSrc.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseSrc.start(now);

    // 2. High Mechanical Click (Sine transient)
    const osc = ctx.createOscillator();
    osc.frequency.setValueAtTime(2000, now);
    osc.frequency.exponentialRampToValueAtTime(1000, now + 0.02);
    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.1, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
    
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);

  } catch (e) {
    console.error("Audio error", e);
  }
};

// --- LOCK SOUND (Number Draw) ---
export const playLock = () => {
    try {
        const ctx = getCtx();
        const now = ctx.currentTime;
        
        // Heavy metallic clank
        const osc = ctx.createOscillator();
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);

    } catch(e) {}
};

// --- VICTORY REVEAL ---
export const playWin = () => {
  try {
    const ctx = getCtx();
    if (ctx.state === 'suspended') ctx.resume();
    const now = ctx.currentTime;

    // 1. Lush Chord (C Major 7 Add 9)
    const freqs = [261.63, 329.63, 392.00, 493.88, 587.33];
    
    freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = f;
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.1 + (i*0.05)); // Staggered entry
        gain.gain.exponentialRampToValueAtTime(0.001, now + 3); // Long tail
        
        // Panning for width
        const panner = ctx.createStereoPanner();
        panner.pan.value = (i / freqs.length) * 2 - 1; // -1 to 1

        osc.connect(gain);
        gain.connect(panner);
        panner.connect(ctx.destination);
        
        osc.start(now);
        osc.stop(now + 3);
    });

    // 2. Swoosh (Filtered Noise)
    const noise = ctx.createBufferSource();
    noise.buffer = createNoiseBuffer(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(5000, now + 0.5); // Filter sweep up
    
    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(0.2, now);
    nGain.gain.linearRampToValueAtTime(0, now + 1);

    noise.connect(filter);
    filter.connect(nGain);
    nGain.connect(ctx.destination);
    noise.start(now);

  } catch (e) {
    console.error("Audio error", e);
  }
};