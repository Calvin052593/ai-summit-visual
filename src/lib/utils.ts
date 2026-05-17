import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCount(n: number): string {
  return n.toLocaleString('en-MY')
}

export function formatClock(date: Date): string {
  return date.toLocaleTimeString('en-MY', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kuala_Lumpur',
  })
}

export function formatEventDay(date: Date): string {
  const aug8 = new Date('2026-08-08T00:00:00+08:00')
  const aug9 = new Date('2026-08-09T00:00:00+08:00')
  const d = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' }))
  const aug8Local = new Date(aug8.toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' }))
  const aug9Local = new Date(aug9.toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' }))

  if (d >= aug9Local) return 'Day 2 · Sun Aug 9, 2026'
  if (d >= aug8Local) return 'Day 1 · Sat Aug 8, 2026'
  return 'Day 1 · Sat Aug 8, 2026'
}

export function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const secs = Math.floor(diff / 1000)
  if (secs < 60) return 'just now'
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  return `${hrs}h ago`
}

export function groupByHour(
  items: { checked_in_at: string; is_dummy: boolean }[]
): { hour: string; real: number; dummy: number }[] {
  const map = new Map<string, { real: number; dummy: number }>()
  for (const item of items) {
    const d = new Date(item.checked_in_at)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:00`
    const entry = map.get(key) ?? { real: 0, dummy: 0 }
    if (item.is_dummy) { entry.dummy++ } else { entry.real++ }
    map.set(key, entry)
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([hour, counts]) => ({ hour, ...counts }))
}
