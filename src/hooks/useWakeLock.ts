'use client'

import { useEffect } from 'react'
import { acquireWakeLock } from '@/lib/wake-lock'

export function useWakeLock() {
  useEffect(() => {
    acquireWakeLock()

    // Re-acquire when tab becomes visible (lock releases automatically on hide)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        acquireWakeLock()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])
}
