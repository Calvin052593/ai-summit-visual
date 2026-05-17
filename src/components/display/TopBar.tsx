'use client'

import { LiveCounter } from './LiveCounter'
import { LiveDot } from './LiveDot'
import { useClock } from '@/hooks/useClock'
import { formatClock, formatEventDay } from '@/lib/utils'

interface TopBarProps {
  count: number
  capacity: number
  eventName?: string
}

export function TopBar({ count, capacity, eventName }: TopBarProps) {
  const now = useClock()

  return (
    <div className="flex items-center justify-between px-8 h-[90px] bg-brand-black border-b border-zinc-800 shrink-0">
      {/* Left: Logo */}
      <div className="flex items-center gap-3 min-w-[280px]">
        {/* REPLACE: drop final logo PNG/SVG here — max height 60px */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg bg-brand-orange flex items-center justify-center text-xl font-bold text-white"
            aria-label="Gen AI Summit Asia 2026 logo"
          >
            🤖
          </div>
          <div>
            <div className="font-heading font-bold text-brand-white text-lg leading-tight">
              {eventName ?? 'Gen AI Summit Asia'}
            </div>
            <div className="font-mono text-brand-orange text-xs tracking-widest">GEN AI SUMMIT ASIA 2026</div>
          </div>
        </div>
      </div>

      {/* Center: Live counter */}
      <LiveCounter count={count} capacity={capacity} />

      {/* Right: Clock + day + LIVE */}
      <div className="flex flex-col items-end gap-1 min-w-[280px]">
        <div className="flex items-center gap-3">
          <span className="font-mono text-zinc-400 text-sm">{formatEventDay(now)}</span>
          <LiveDot />
        </div>
        <span className="font-mono text-brand-white text-2xl font-bold tracking-widest tabular-nums">
          {formatClock(now)}
        </span>
      </div>
    </div>
  )
}
