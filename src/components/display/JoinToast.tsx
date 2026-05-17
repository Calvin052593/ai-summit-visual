'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Attendee } from '@/types/attendee'

interface JoinToastProps {
  newAttendee: Attendee | null
}

export function JoinToast({ newAttendee }: JoinToastProps) {
  const [queue, setQueue] = useState<Attendee[]>([])
  const [current, setCurrent] = useState<Attendee | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Enqueue new arrivals
  useEffect(() => {
    if (newAttendee) {
      setQueue((q) => [...q, newAttendee])
    }
  }, [newAttendee])

  // Drain queue one at a time
  useEffect(() => {
    if (current || queue.length === 0) return
    const [next, ...rest] = queue
    setQueue(rest)
    setCurrent(next)
    timerRef.current = setTimeout(() => setCurrent(null), 4000)
  }, [queue, current])

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  return (
    <div className="absolute bottom-20 left-6 z-30 pointer-events-none">
      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={current.id}
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="flex items-center gap-3 bg-zinc-900/95 border border-zinc-700 rounded-2xl px-5 py-3 shadow-2xl backdrop-blur-sm max-w-xs"
          >
            <span className="text-2xl">👋</span>
            <div>
              <p className="text-white font-bold text-base leading-tight">
                {current.first_name} just joined
              </p>
              <p className="text-brand-orange text-xs font-mono tracking-wide">
                Welcome to Gen AI!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
