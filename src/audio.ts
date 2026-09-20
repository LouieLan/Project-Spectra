// Web Audio API procedural sound system for Spectra

class SoundSystem {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isMusicPlaying = false;
  private ambientInterval: number | null = null;

  public masterVolume = 0.8;
  public sfxVolume = 0.8;
  public musicVolume = 0;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.masterVolume;
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.sfxVolume;
      this.sfxGain.connect(this.masterGain);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = this.musicVolume;
      this.musicGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public updateVolumes(master: number, sfx: number, music: number) {
    this.masterVolume = master;
    this.sfxVolume = sfx;
    this.musicVolume = music;

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(master, this.ctx.currentTime, 0.05);
    }
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setTargetAtTime(sfx, this.ctx.currentTime, 0.05);
    }
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(music, this.ctx.currentTime, 0.05);
    }
  }

  public playHover() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio fallback
    }
  }

  public playSelect() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, this.ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(1046.5, this.ctx.currentTime + 0.12); // C6

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch {
      // Audio fallback
    }
  }

  public playJump(color: string = 'white') {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      let baseFreq = 220;
      if (color === 'red') baseFreq = 180;
      if (color === 'green') baseFreq = 260;
      if (color === 'blue') baseFreq = 330;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.4, this.ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch {
      // Audio fallback
    }
  }

  public playLand() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(130, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch {
      // Audio fallback
    }
  }

  public playPortalEnter(color: string) {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;

      const now = this.ctx.currentTime;
      // Synthesize a sweeping resonant filter whoosh
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      let f1 = 261.63; // C4
      let f2 = 392.0;  // G4
      if (color === 'red') { f1 = 220; f2 = 330; }
      else if (color === 'green') { f1 = 293.66; f2 = 440; }
      else if (color === 'blue') { f1 = 349.23; f2 = 523.25; }

      osc1.type = 'sawtooth';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(f1, now);
      osc1.frequency.exponentialRampToValueAtTime(f1 * 2, now + 0.35);

      osc2.frequency.setValueAtTime(f2, now);
      osc2.frequency.exponentialRampToValueAtTime(f2 * 1.5, now + 0.35);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(3200, now + 0.2);
      filter.frequency.exponentialRampToValueAtTime(600, now + 0.4);
      filter.Q.setValueAtTime(5, now);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.45);
      osc2.stop(now + 0.45);
    } catch {
      // Audio fallback
    }
  }

  public playSynthesis() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;

      const now = this.ctx.currentTime;
      // Rich luminous white light synthesis chord (Frequencies merging into octave harmony)
      const freqs = [329.63, 440.0, 554.37, 659.25, 880.0];
      freqs.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * 0.9, now);
        osc.frequency.exponentialRampToValueAtTime(freq, now + 0.15);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.16 / (idx + 1), now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.6);
      });
    } catch {
      // Audio fallback
    }
  }

  public playMismatch() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.setValueAtTime(140, now + 0.06);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Audio fallback
    }
  }

  public playCollectBall(index: number = 0) {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;

      const now = this.ctx.currentTime;
      // High-pitched crystal harmonic chime
      const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.51];
      const baseFreq = freqs[Math.min(index, freqs.length - 1)];

      [baseFreq, baseFreq * 1.5, baseFreq * 2].forEach((freq, i) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);

        gain.gain.setValueAtTime(0.18 / (i + 1), now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.45);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.5);
      });
    } catch {
      // Audio fallback
    }
  }

  public playStageComplete() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;

      const now = this.ctx.currentTime;
      // Triumphant ascending harmonic sweep (Cmaj9 arpeggio: C4, E4, G4, B4, D5, E5)
      const chord = [261.63, 329.63, 392.0, 493.88, 587.33, 659.25];
      chord.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        gain.gain.setValueAtTime(0.2, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.8);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.85);
      });
    } catch {
      // Audio fallback
    }
  }

  public play(name: string) {
    switch (name) {
      case 'jump':
        this.playJump();
        break;
      case 'land':
        this.playLand();
        break;
      case 'portal':
        this.playPortalEnter('white');
        break;
      case 'recombine':
        this.playSynthesis();
        break;
      case 'collect':
        this.playCollectBall(0);
        break;
      case 'collision':
        this.playMismatch();
        break;
      case 'level_clear':
      case 'finish':
        this.playStageComplete();
        break;
      default:
        this.playSelect();
        break;
    }
  }

  public startAmbientMusic() {
    // Ambient music removed per user specification
    this.stopAmbientMusic();
  }

  public stopAmbientMusic() {
    this.isMusicPlaying = false;
    if (this.ambientInterval !== null) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
  }
}

export const sound = new SoundSystem();
