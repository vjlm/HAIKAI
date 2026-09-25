// Procedural Web Audio Ambient Soundscape for Haikai: The Sea of Ash
// Generates gentle ocean wave swells, cold low coastal wind, and subsonic oceanic depth rumble

class HaikaiAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private waveGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private rumbleGain: GainNode | null = null;
  private waveInterval: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.setupGenerators();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private createNoiseBuffer(): AudioBuffer {
    if (!this.ctx) throw new Error('No context');
    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds of pink/brownish noise
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Brown noise integration
      lastOut = (lastOut + 0.02 * white) / 1.02;
      data[i] = lastOut * 3.5;
    }
    return buffer;
  }

  private setupGenerators() {
    if (!this.ctx || !this.masterGain) return;

    const noiseBuffer = this.createNoiseBuffer();

    // 1. Ocean Waves Generator (Filtered brown noise modulated in slow periodic swells)
    const waveSource = this.ctx.createBufferSource();
    waveSource.buffer = noiseBuffer;
    waveSource.loop = true;

    const waveFilter = this.ctx.createBiquadFilter();
    waveFilter.type = 'lowpass';
    waveFilter.frequency.setValueAtTime(260, this.ctx.currentTime);
    waveFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    this.waveGain = this.ctx.createGain();
    this.waveGain.gain.setValueAtTime(0.05, this.ctx.currentTime);

    waveSource.connect(waveFilter);
    waveFilter.connect(this.waveGain);
    this.waveGain.connect(this.masterGain);
    waveSource.start();

    // Swell cycle: gentle rise and fall of waves every 8 seconds
    const modulateWave = () => {
      if (!this.ctx || !this.waveGain || !this.isPlaying) return;
      const now = this.ctx.currentTime;
      this.waveGain.gain.cancelScheduledValues(now);
      this.waveGain.gain.setValueAtTime(this.waveGain.gain.value, now);
      // Inhale swell
      this.waveGain.gain.linearRampToValueAtTime(0.18, now + 3.8);
      // Exhale back to ocean murmur
      this.waveGain.gain.exponentialRampToValueAtTime(0.04, now + 8.0);
    };

    modulateWave();
    this.waveInterval = window.setInterval(modulateWave, 8000);

    // 2. Cold Night Wind (Bandpass filtered whisper)
    const windSource = this.ctx.createBufferSource();
    windSource.buffer = noiseBuffer;
    windSource.loop = true;

    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.setValueAtTime(320, this.ctx.currentTime);
    windFilter.Q.setValueAtTime(3.0, this.ctx.currentTime);

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(0.06, this.ctx.currentTime);

    windSource.connect(windFilter);
    windFilter.connect(this.windGain);
    this.windGain.connect(this.masterGain);
    windSource.start();

    // 3. Oceanic Subsonic Depth Rumble (Low sine drone at 48Hz)
    const rumbleOsc = this.ctx.createOscillator();
    rumbleOsc.type = 'sine';
    rumbleOsc.frequency.setValueAtTime(48, this.ctx.currentTime);

    this.rumbleGain = this.ctx.createGain();
    this.rumbleGain.gain.setValueAtTime(0.07, this.ctx.currentTime);

    rumbleOsc.connect(this.rumbleGain);
    this.rumbleGain.connect(this.masterGain);
    rumbleOsc.start();
  }

  public toggle(): boolean {
    if (!this.isPlaying) {
      this.play();
      return true;
    } else {
      this.pause();
      return false;
    }
  }

  public play() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    this.isPlaying = true;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.linearRampToValueAtTime(0.35, now + 2.5); // Smooth cinematic fade in
  }

  public pause() {
    if (!this.ctx || !this.masterGain) return;
    this.isPlaying = false;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 1.2); // Gentle fade out
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const soundManager = new HaikaiAudioEngine();
