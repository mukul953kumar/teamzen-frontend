// Web Audio API Synthesized Audio Notifications (Zero external asset dependency)

class SoundController {
  constructor() {
    this.audioCtx = null
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass()
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume()
    }
    return this.audioCtx
  }

  // Soft notification chime for incoming messages / toasts
  playChime() {
    try {
      const ctx = this.getAudioContext()
      if (!ctx) return

      const now = ctx.currentTime
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()

      osc1.type = 'sine'
      osc2.type = 'sine'

      osc1.frequency.setValueAtTime(587.33, now) // D5
      osc2.frequency.setValueAtTime(880, now + 0.08) // A5

      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)

      osc1.connect(gain)
      osc2.connect(gain)
      gain.connect(ctx.destination)

      osc1.start(now)
      osc1.stop(now + 0.15)
      osc2.start(now + 0.08)
      osc2.stop(now + 0.3)
    } catch (_) {
      // Audio playback silently guarded
    }
  }

  // Upbeat invite / success chime
  playInviteSound() {
    try {
      const ctx = this.getAudioContext()
      if (!ctx) return

      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(523.25, now) // C5
      osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.18) // C6

      gain.gain.setValueAtTime(0.1, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.25)
    } catch (_) {
      // Guarded
    }
  }

  // Heart / like pop sound
  playLikeSound() {
    try {
      const ctx = this.getAudioContext()
      if (!ctx) return

      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(600, now)
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1)

      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.15)
    } catch (_) {
      // Guarded
    }
  }
}

export const soundManager = new SoundController()
