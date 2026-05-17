'use client'

import type { Attendee } from '@/types/attendee'
import { timeAgo } from '@/lib/utils'

interface TickerBarProps {
  attendees: Attendee[]
}

export function TickerBar({ attendees }: TickerBarProps) {
  const recent = [...attendees].reverse().slice(0, 30)

  if (recent.length === 0) return (
    <div className="h-[60px] bg-zinc-900 border-t border-zinc-800 flex items-center px-6">
      <span className="font-mono text-zinc-500 text-sm tracking-widest">AWAITING ATTENDEES…</span>
    </div>
  )

  const items = [...recent, ...recent] // double for seamless loop

  return (
    <div className="h-[60px] bg-zinc-900 border-t border-zinc-800 flex items-center overflow-hidden shrink-0">
      <div className="flex animate-marquee whitespace-nowrap">
        {items.map((a, i) => (
          <span key={`${a.id}-${i}`} className="inline-flex items-center gap-2 mr-8">
            <span className="text-brand-orange font-mono text-sm">🤖</span>
            <span className="font-bold text-white text-sm">{a.first_name}</span>
            {a.last_name && (
              <span className="text-zinc-500 text-sm">{a.last_name}</span>
            )}
            <span className="text-zinc-600 text-xs">{timeAgo(a.checked_in_at)}</span>
            <span className="text-zinc-700 mx-2">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
