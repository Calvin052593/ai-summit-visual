'use client'

import { useState } from 'react'
import { Radio } from 'lucide-react'

interface EventToggleProps {
  isLive: boolean
  onToggle: (live: boolean) => void
}

export function EventToggle({ isLive, onToggle }: EventToggleProps) {
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/event', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_live: !isLive }),
      })
      const data = await res.json()
      onToggle(data.event.is_live)
    } catch {
      alert('Failed to update event status')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 ${
        isLive
          ? 'bg-green-900/30 text-green-400 border border-green-800/30 hover:bg-green-900/50'
          : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700'
      }`}
    >
      <Radio size={16} />
      {isLive ? '● LIVE — Click to Pause' : '○ PAUSED — Click to Go Live'}
    </button>
  )
}
