'use client'

import { useState } from 'react'
import { COUNTRY_CODES } from '@/lib/country-codes'
import { cn } from '@/lib/utils'

interface PhoneFieldProps {
  value: string
  countryCode: string
  onValueChange: (v: string) => void
  onCountryChange: (c: string) => void
  onFocus?: () => void
  className?: string
}

export function PhoneField({
  value,
  countryCode,
  onValueChange,
  onCountryChange,
  onFocus,
  className,
}: PhoneFieldProps) {
  const [showDrop, setShowDrop] = useState(false)
  const selected = COUNTRY_CODES.find((c) => c.code === countryCode) ?? COUNTRY_CODES[0]

  return (
    <div className={cn('relative flex gap-2', className)}>
      {/* Country code selector */}
      <button
        type="button"
        onClick={() => setShowDrop((v) => !v)}
        className="flex items-center gap-2 min-w-[100px] px-4 py-4 rounded-2xl bg-zinc-800 border-2 border-zinc-700 text-xl font-bold text-white"
      >
        <span>{selected.flag}</span>
        <span className="font-mono text-base">{selected.code}</span>
      </button>

      {/* Dropdown */}
      {showDrop && (
        <div className="absolute top-full left-0 z-50 mt-2 w-72 max-h-72 overflow-y-auto rounded-2xl bg-zinc-800 border border-zinc-700 shadow-2xl">
          {COUNTRY_CODES.map((c) => (
            <button
              key={c.code}
              type="button"
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-zinc-700 text-white"
              onClick={() => {
                onCountryChange(c.code)
                setShowDrop(false)
              }}
            >
              <span className="text-2xl">{c.flag}</span>
              <span className="text-base font-mono">{c.code}</span>
              <span className="text-sm text-zinc-400">{c.country}</span>
            </button>
          ))}
        </div>
      )}

      {/* Phone number input (read-only — uses NumPad) */}
      <div
        className="flex-1 px-5 py-4 rounded-2xl bg-zinc-800 border-2 border-zinc-700 text-xl font-mono text-white cursor-pointer min-h-[64px] flex items-center"
        onClick={onFocus}
        onFocus={onFocus}
        tabIndex={0}
      >
        {value || <span className="text-zinc-500">Phone number</span>}
      </div>
    </div>
  )
}
