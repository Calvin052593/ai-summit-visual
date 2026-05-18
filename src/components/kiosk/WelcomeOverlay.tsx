'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { getCharacterPath } from '@/lib/character-pool'
import type { Attendee } from '@/types/attendee'

interface WelcomeOverlayProps {
  attendee: Attendee | null
  count: number
  onDone: () => void
}

export function WelcomeOverlay({ attendee, count, onDone }: WelcomeOverlayProps) {
  if (!attendee) return null

  const gender = attendee.gender ?? 'male'
  const characterId = attendee.character_id ?? 0
  const avatarPath = getCharacterPath(gender as 'male' | 'female', characterId)

  return (
    <AnimatePresence>
      {attendee && (
        <motion.div
          key={attendee.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-black"
          onClick={onDone}
        >
          {/* Subtle dark scanlines */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
            }}
          />

          {/* Orange glow ring */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 0.7] }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="absolute w-72 h-72 rounded-full border-2 border-brand-orange"
            style={{ boxShadow: '0 0 60px #FF4F00, 0 0 120px rgba(255,79,0,0.25)' }}
          />

          {/* Secondary gold ring */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.6, 1.1], opacity: [0, 0.5, 0] }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
            className="absolute w-72 h-72 rounded-full border border-[#FFB800]"
          />

          {/* Character avatar */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 mb-6"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarPath}
              alt={attendee.first_name}
              className="w-52 h-52 object-contain"
              style={{ filter: 'drop-shadow(0 0 24px rgba(255,79,0,0.6))' }}
            />
          </motion.div>

          {/* Welcome text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="text-center z-10 px-8"
          >
            <h1 className="font-heading text-5xl font-bold text-brand-white mb-3">
              Welcome, {attendee.first_name}!
            </h1>
            <div className="inline-flex items-center gap-2 bg-brand-orange rounded-full px-6 py-2">
              <span className="text-white font-bold text-xl">🤖 You&apos;re Gen AI #{count}</span>
            </div>
            <p className="text-zinc-400 mt-4 text-lg">{`"You're not Gen X, not Gen Y — You're Gen AI"`}</p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-12 text-zinc-600 text-sm"
          >
            Tap anywhere to continue
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
