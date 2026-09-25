// Background Soundtrack Engine for HAIKAI — The Sea of Ash
// Plays the official cinematic theme in continuous loop by default
// Provides mute / unmute controls

type AudioStateListener = (isMuted: boolean) => void;

class HaikaiAudioEngine {
  private audio: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private hasUserInteracted: boolean = false;
  private isInitialized: boolean = false;
  private listeners: Set<AudioStateListener> = new Set();
  private audioSrc: string = '/audio/haikai-theme.mp3';

  constructor() {
    // Only initialize in browser environment
    if (typeof window !== 'undefined') {
      // Defer init slightly to avoid blocking initial render
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.init(), { once: true });
      } else {
        setTimeout(() => this.init(), 100);
      }
    }
  }

  public init() {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    try {
      this.audio = new Audio(this.audioSrc);
      this.audio.loop = true;
      this.audio.preload = 'auto';
      this.audio.volume = 0.45; // Balanced cinematic listening level

      // Continuous loop reinforcement
      this.audio.addEventListener('ended', () => {
        if (!this.isMuted && this.audio) {
          this.audio.currentTime = 0;
          this.audio.play().catch(() => {});
        }
      });

      // Try autoplaying by default
      const playPromise = this.audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isMuted = false;
            this.notifyListeners();
          })
          .catch(() => {
            // Autoplay blocked by browser policy without user gesture.
            // Listen for first interaction anywhere on page to automatically start.
            this.setupFirstInteractionListener();
          });
      }
    } catch {
      // In case of audio constructor errors, fallback gracefully
      this.setupFirstInteractionListener();
    }
  }

  private setupFirstInteractionListener() {
    if (this.hasUserInteracted || typeof window === 'undefined') return;

    const handleFirstGesture = () => {
      if (this.hasUserInteracted) return;
      this.hasUserInteracted = true;

      // Remove gesture listeners
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('scroll', handleFirstGesture);

      if (!this.audio) {
        this.audio = new Audio(this.audioSrc);
        this.audio.loop = true;
        this.audio.preload = 'auto';
        this.audio.volume = 0.45;
      }

      // If user hasn't explicitly clicked mute, start playing
      if (!this.isMuted && this.audio) {
        this.audio.muted = false;
        this.audio.play().catch(() => {});
        this.notifyListeners();
      }
    };

    window.addEventListener('pointerdown', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('click', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true, passive: true });
    window.addEventListener('scroll', handleFirstGesture, { once: true, passive: true });
  }

  public toggle(): boolean {
    if (!this.isInitialized) {
      this.init();
    }

    if (this.isMuted) {
      this.unmute();
      return true; // Now unmuted / playing
    } else {
      this.mute();
      return false; // Now muted
    }
  }

  public play() {
    this.unmute();
  }

  public pause() {
    this.mute();
  }

  public unmute() {
    this.isMuted = false;
    this.hasUserInteracted = true;

    if (!this.audio) {
      this.init();
    }

    if (this.audio) {
      this.audio.muted = false;
      this.audio.play().catch(() => {});
    }

    this.notifyListeners();
  }

  public mute() {
    this.isMuted = true;
    if (this.audio) {
      this.audio.muted = true;
      this.audio.pause();
    }
    this.notifyListeners();
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getStatus(): boolean {
    return !this.isMuted;
  }

  public subscribe(listener: AudioStateListener): () => void {
    this.listeners.add(listener);
    // Notify immediately with current state
    listener(this.isMuted);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    for (const listener of this.listeners) {
      try {
        listener(this.isMuted);
      } catch {
        // Safe guard against listener errors
      }
    }
  }
}

export const soundManager = new HaikaiAudioEngine();

