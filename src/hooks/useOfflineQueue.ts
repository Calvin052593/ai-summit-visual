'use client'

import { useEffect } from 'react'
import { readQueue, removeFromQueue } from '@/lib/offline-queue'

export function useOfflineQueue() {
  useEffect(() => {
    const drainQueue = async () => {
      if (typeof navigator !== 'undefined' && !navigator.onLine) return
      const queue = readQueue()
      for (const item of queue) {
        try {
          const res = await fetch('/api/checkin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.payload),
          })
          // 201 = success, 200 = welcome back, 409 = duplicate — all remove from queue
          if (res.ok || res.status === 409) {
            removeFromQueue(item.id)
          }
        } catch {
          // Network still down — will retry on next 'online' event
        }
      }
    }

    window.addEventListener('online', drainQueue)
    drainQueue() // also try immediately on mount

    return () => window.removeEventListener('online', drainQueue)
  }, [])
}
