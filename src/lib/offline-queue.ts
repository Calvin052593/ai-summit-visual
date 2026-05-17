import type { CheckInPayload } from '@/types/attendee'

const QUEUE_KEY = 'kiosk_offline_queue'

export interface QueuedCheckIn {
  id: string
  payload: CheckInPayload
  queuedAt: number
  attempts: number
}

function nanoidSync(): string {
  return Math.random().toString(36).slice(2, 12)
}

export function enqueue(payload: CheckInPayload): void {
  const queue = readQueue()
  queue.push({ id: nanoidSync(), payload, queuedAt: Date.now(), attempts: 0 })
  try {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
  } catch { /* storage full */ }
}

export function readQueue(): QueuedCheckIn[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? '[]')
  } catch {
    return []
  }
}

export function removeFromQueue(id: string): void {
  const queue = readQueue().filter((item) => item.id !== id)
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
}

export function queueSize(): number {
  return readQueue().length
}
