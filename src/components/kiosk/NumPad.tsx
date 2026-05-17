'use client'

import { Delete } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NumPadProps {
  onDigit: (d: string) => void
  onBackspace: () => void
  onDone: () => void
  className?: string
}

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '0', '⌫']

export function NumPad({ onDigit, onBackspace, onDone, className }: NumPadProps) {
  const handleKey = (key: string) => {
    if (key === '⌫') onBackspace()
    else onDigit(key)
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="grid grid-cols-3 gap-3">
        {KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onPointerDown={(e) => { e.preventDefault(); handleKey(key) }}
            className={cn(
              'h-16 rounded-2xl text-2xl font-bold transition-all active:scale-95',
              key === '⌫'
                ? 'bg-zinc-700 text-white flex items-center justify-center'
                : 'bg-zinc-800 text-white hover:bg-zinc-700'
            )}
          >
            {key === '⌫' ? <Delete size={22} /> : key}
          </button>
        ))}
      </div>
      <button
        type="button"
        onPointerDown={(e) => { e.preventDefault(); onDone() }}
        className="h-14 w-full rounded-2xl bg-brand-orange text-white text-xl font-bold transition-all active:scale-95 hover:bg-orange-600"
      >
        Done
      </button>
    </div>
  )
}
