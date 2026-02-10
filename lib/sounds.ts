// Sound effects for call interactions

export class CallSounds {
  private audioContext: AudioContext | null = null;
  private currentRinging: OscillatorNode | null = null;
  private ringingGain: GainNode | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  // MS Teams-like ringing sound (two-tone beep pattern)
  startRinging(): void {
    if (!this.audioContext) return;

    // Stop any existing ringing
    this.stopRinging();

    const playRingTone = () => {
      if (!this.audioContext) return;

      // First tone (higher)
      const osc1 = this.audioContext.createOscillator();
      const gain1 = this.audioContext.createGain();
      
      osc1.frequency.value = 480; // Hz
      osc1.type = 'sine';
      gain1.gain.value = 0.3;
      
      osc1.connect(gain1);
      gain1.connect(this.audioContext.destination);
      
      osc1.start();
      gain1.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
      osc1.stop(this.audioContext.currentTime + 0.4);

      // Second tone (lower) - slightly delayed
      setTimeout(() => {
        if (!this.audioContext) return;
        
        const osc2 = this.audioContext.createOscillator();
        const gain2 = this.audioContext.createGain();
        
        osc2.frequency.value = 440; // Hz
        osc2.type = 'sine';
        gain2.gain.value = 0.3;
        
        osc2.connect(gain2);
        gain2.connect(this.audioContext.destination);
        
        osc2.start();
        gain2.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
        osc2.stop(this.audioContext.currentTime + 0.4);
      }, 400);
    };

    // Play ring tone initially and then every 3 seconds
    playRingTone();
    const interval = setInterval(playRingTone, 3000);
    
    // Store interval ID to clear later
    (this as any).ringingInterval = interval;
  }

  stopRinging(): void {
    if ((this as any).ringingInterval) {
      clearInterval((this as any).ringingInterval);
      (this as any).ringingInterval = null;
    }
    
    if (this.currentRinging) {
      try {
        this.currentRinging.stop();
      } catch (e) {
        // Already stopped
      }
      this.currentRinging = null;
    }
    
    if (this.ringingGain) {
      this.ringingGain.disconnect();
      this.ringingGain = null;
    }
  }

  // MS Teams-like call drop sound (descending tone)
  playCallEndSound(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.audioContext) {
        resolve();
        return;
      }

      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.frequency.value = 400;
      osc.type = 'sine';
      gain.gain.value = 0.4;
      
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      
      // Descending frequency (400Hz to 200Hz)
      osc.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
      
      osc.start();
      osc.stop(this.audioContext.currentTime + 0.5);
      
      setTimeout(resolve, 500);
    });
  }

  // Call connected sound (positive beep)
  playCallConnectedSound(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.audioContext) {
        resolve();
        return;
      }

      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.frequency.value = 800;
      osc.type = 'sine';
      gain.gain.value = 0.3;
      
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      
      gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
      
      osc.start();
      osc.stop(this.audioContext.currentTime + 0.2);
      
      setTimeout(resolve, 200);
    });
  }

  cleanup(): void {
    this.stopRinging();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
