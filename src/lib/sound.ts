'use client'

let ctx: AudioContext | null = null
let enabled = true
let unlocked = false

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  }
  return ctx
}

export async function unlockAudio(): Promise<void> {
  const c = getCtx()
  if (!c) return
  if (c.state === 'suspended') await c.resume()
  unlocked = true
}

export function isUnlocked(): boolean {
  return unlocked
}

export function playCheckin(): void {
  if (!enabled) return
  const c = getCtx()
  if (!c) return

  const now = c.currentTime

  // Two-tone pleasant chime: C6 → G5
  const freqs = [1046.5, 784]
  freqs.forEach((freq, i) => {
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.connect(gain)
    gain.connect(c.destination)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, now + i * 0.12)

    gain.gain.setValueAtTime(0, now + i * 0.12)
    gain.gain.linearRampToValueAtTime(0.25, now + i * 0.12 + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.5)

    osc.start(now + i * 0.12)
    osc.stop(now + i * 0.12 + 0.55)
  })
}

export function setMuted(mute: boolean) {
  enabled = !mute
}

export function isMuted() {
  return !enabled
}
