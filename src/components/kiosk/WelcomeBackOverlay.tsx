'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { generateAvatarSvg, avatarSvgToDataUrl } from '@/lib/avatar'
import type { Attendee } from '@/types/attendee'

interface WelcomeBackOverlayProps {
  attendee: Attendee | null
  onDone: () => void
}

export function WelcomeBackOverlay({ attendee, onDone }: WelcomeBackOverlayProps) {
  if (!attendee) return null

  const svgDataUrl = avatarSvgToDataUrl(generateAvatarSvg(attendee.avatar_seed))

  return (
    <AnimatePresence>
      {attendee && (
        <motion.div
          key={attendee.id + '-back'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-black"
          onClick={onDone}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,184,0,0.02) 2px, rgba(255,184,0,0.02) 4px)',
            }}
          />

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
            transition={{ duration: 0.5 }}
            className="absolute w-56 h-56 rounded-full border-2 border-brand-gold"
            style={{ boxShadow: '0 0 40px #FFB800, 0 0 80px rgba(255,184,0,0.3)' }}
          />

          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 mb-6"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={svgDataUrl}
              alt={attendee.first_name}
              className="w-32 h-32"
              style={{ filter: `drop-shadow(0 0 16px #FFB800)` }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-center z-10 px-8"
          >
            <p className="text-brand-gold font-mono text-sm tracking-widest uppercase mb-2">
              RECONNECTING UNIT
            </p>
            <h1 className="font-heading text-5xl font-bold text-brand-white mb-3">
              Welcome back, {attendee.first_name}!
            </h1>
            <p className="text-zinc-400 text-xl">Good to see you again at AI Summit</p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-12 text-zinc-600 text-sm"
          >
            Tap anywhere to continue
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
