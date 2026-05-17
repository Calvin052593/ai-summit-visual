'use client'

export function LiveDot() {
  return (
    <span className="inline-flex items-center gap-1.5 text-red-500 font-mono font-bold text-sm tracking-wider">
      <span className="w-2 h-2 rounded-full bg-red-500 animate-live-pulse inline-block" />
      LIVE
    </span>
  )
}
