'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { generateAvatarSvg, avatarSvgToDataUrl } from '@/lib/avatar'
import type { Attendee } from '@/types/attendee'

interface WelcomeOverlayProps {
  attendee: Attendee | null
  count: number
  onDone: () => void
}

export function WelcomeOverlay({ attendee, count, onDone }: WelcomeOverlayProps) {
  if (!attendee) return null

  const svgDataUrl = avatarSvgToDataUrl(generateAvatarSvg(attendee.avatar_seed))

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
          {/* Scan-line overlay for futuristic feel */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,229,255,0.02) 2px, rgba(0,229,255,0.02) 4px)',
            }}
          />

          {/* Glow ring */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute w-64 h-64 rounded-full border-2 border-brand-cyan"
            style={{ boxShadow: '0 0 40px #00E5FF, 0 0 80px rgba(0,229,255,0.3)' }}
          />

          {/* Robot avatar */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 mb-6"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={svgDataUrl}
              alt={attendee.first_name}
              className="w-40 h-40"
              style={{ filter: `drop-shadow(0 0 20px ${attendee.avatar_color ?? '#FF4F00'})` }}
            />
          </motion.div>

          {/* Welcome text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="text-center z-10 px-8"
          >
            <p className="text-brand-cyan font-mono text-sm tracking-widest uppercase mb-2">
              RENDERING №{count.toString().padStart(3, '0')}
            </p>
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
