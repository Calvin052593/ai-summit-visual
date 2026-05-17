'use client'

import { formatCount } from '@/lib/utils'

interface LiveCounterProps {
  count: number
  capacity: number
}

export function LiveCounter({ count, capacity }: LiveCounterProps) {
  const pct = Math.min((count / capacity) * 100, 100)

  return (
    <div className="flex flex-col items-center gap-1 min-w-[400px]">
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-5xl font-bold text-brand-white tabular-nums">{formatCount(count)}</span>
        <span className="text-zinc-500 text-xl font-mono">/</span>
        <span className="font-mono text-2xl text-zinc-400 tabular-nums">{formatCount(capacity)}</span>
        <span className="text-zinc-400 text-lg ml-1">Gen AI in the room</span>
      </div>
      <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-orange rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
