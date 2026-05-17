'use client'

import { Users, Bot, UserCheck, Gauge } from 'lucide-react'

interface StatsCardsProps {
  total: number
  real: number
  dummy: number
  capacity: number
}

export function StatsCards({ total, real, dummy, capacity }: StatsCardsProps) {
  const pct = ((total / capacity) * 100).toFixed(1)

  const cards = [
    { label: 'Total Check-ins', value: total, icon: Users, color: 'text-brand-orange' },
    { label: 'Real Attendees', value: real, icon: UserCheck, color: 'text-green-400' },
    { label: 'Dummy (Filler)', value: dummy, icon: Bot, color: 'text-brand-cyan' },
    { label: 'Capacity Fill', value: `${pct}%`, icon: Gauge, color: 'text-brand-gold' },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-zinc-400 text-sm">{c.label}</span>
            <c.icon size={18} className={c.color} />
          </div>
          <p className={`font-mono text-3xl font-bold ${c.color}`}>{c.value.toLocaleString()}</p>
        </div>
      ))}
    </div>
  )
}
