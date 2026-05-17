'use client'

let wakeLock: WakeLockSentinel | null = null

export async function acquireWakeLock(): Promise<void> {
  if (typeof window === 'undefined') return
  if (!('wakeLock' in navigator)) return
  try {
    wakeLock = await navigator.wakeLock.request('screen')
    wakeLock.addEventListener('release', () => { wakeLock = null })
  } catch {
    // WakeLock only works on HTTPS; silently fail on localhost
  }
}

export function releaseWakeLock(): void {
  wakeLock?.release()
  wakeLock = null
}
