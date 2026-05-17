'use client'

interface CapacityBarProps {
  count: number
  capacity: number
}

export function CapacityBar({ count, capacity }: CapacityBarProps) {
  const pct = Math.min((count / capacity) * 100, 100)

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-white font-bold">Capacity</span>
        <span className="font-mono text-brand-orange font-bold">
          {count.toLocaleString()} / {capacity.toLocaleString()} ({pct.toFixed(1)}%)
        </span>
      </div>
      <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-orange rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
