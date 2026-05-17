'use client'

import { useEffect } from 'react'

export function useDummyGenerator(enabled: boolean, intervalMin: number, count: number, eventId?: string) {
  useEffect(() => {
    if (!enabled) return

    const generate = async () => {
      try {
        const cfg = typeof window !== 'undefined'
          ? (() => { try { return JSON.parse(localStorage.getItem('dummy_config') ?? '{}') } catch { return {} } })()
          : {}
        await fetch('/api/dummy/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ count, event_id: eventId ?? cfg.event_id ?? null }),
        })
      } catch {
        // Network error — will retry on next interval
      }
    }

    const id = setInterval(generate, intervalMin * 60 * 1000)
    return () => clearInterval(id)
  }, [enabled, intervalMin, count, eventId])
}
