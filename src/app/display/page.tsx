'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { TopBar } from '@/components/display/TopBar'
import { PixiStage } from '@/components/display/PixiStage'
import { TickerBar } from '@/components/display/TickerBar'
import { JoinToast } from '@/components/display/JoinToast'
import { useRealtimeAttendees } from '@/hooks/useRealtimeAttendees'
import { useWakeLock } from '@/hooks/useWakeLock'
import { useDummyGenerator } from '@/hooks/useDummyGenerator'
import { playCheckin, setMuted, unlockAudio, isUnlocked } from '@/lib/sound'
import type { Attendee } from '@/types/attendee'
import type { Event } from '@/types/event'
import { Volume2, VolumeX } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const DEFAULT_EVENT_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'

function readDummyCfg() {
  if (typeof window === 'undefined') return { enabled: true, interval: 5, count: 2 }
  try { return { enabled: true, interval: 5, count: 2, ...JSON.parse(localStorage.getItem('dummy_config') ?? '{}') } }
  catch { return { enabled: true, interval: 5, count: 2 } }
}

function DisplayContent() {
  useWakeLock()
  const searchParams = useSearchParams()
  const eventId = searchParams.get('event') ?? DEFAULT_EVENT_ID

  const [eventData, setEventData] = useState<Event | null>(null)
  const [initialAttendees, setInitialAttendees] = useState<Attendee[]>([])
  const [loaded, setLoaded] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [audioUnlocked, setAudioUnlocked] = useState(false)
  const [showUnlockBanner, setShowUnlockBanner] = useState(false)
  const [dummyCfg] = useState(readDummyCfg)

  useDummyGenerator(dummyCfg.enabled, dummyCfg.interval, dummyCfg.count, eventId)

  // Independent fetches — event name/capacity loads even if attendees query is slow
  useEffect(() => {
    setLoaded(false)
    setInitialAttendees([])
    setEventData(null)

    // 1. Fetch event info immediately
    fetch(`/api/event?id=${eventId}`)
      .then((r) => r.json())
      .then(({ event }) => { if (event) setEventData(event) })
      .catch(console.error)

    // 2. Fetch initial attendees for this event
    const supabase = createClient()
    const timeout = setTimeout(() => setLoaded(true), 6000) // safety net
    supabase
      .from('attendees')
      .select('*')
      .eq('is_active', true)
      .eq('event_id', eventId)
      .order('checked_in_at', { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error('Attendees fetch error:', error)
        setInitialAttendees((data as Attendee[]) ?? [])
        setLoaded(true)
        clearTimeout(timeout)
      })
      .catch((err) => {
        console.error('Attendees fetch failed:', err)
        setLoaded(true)
        clearTimeout(timeout)
      })

    return () => clearTimeout(timeout)
  }, [eventId])

  const { attendees, latestNew } = useRealtimeAttendees(initialAttendees, eventId)

  const capacity = eventData?.capacity ?? 3000

  useEffect(() => {
    if (!latestNew) return
    if (!audioUnlocked) { setShowUnlockBanner(true); return }
    playCheckin()
  }, [latestNew, audioUnlocked])

  const handleUnlock = useCallback(async () => {
    await unlockAudio()
    setAudioUnlocked(true)
    setShowUnlockBanner(false)
    playCheckin()
  }, [])

  useEffect(() => {
    if (audioUnlocked) return
    const handler = async () => {
      if (isUnlocked()) return
      await unlockAudio()
      setAudioUnlocked(true)
      setShowUnlockBanner(false)
    }
    window.addEventListener('click', handler, { once: true })
    return () => window.removeEventListener('click', handler)
  }, [audioUnlocked])

  const toggleMute = () => {
    const next = !soundEnabled
    setSoundEnabled(next)
    setMuted(!next)
  }

  return (
    <div
      className="flex flex-col w-full h-full bg-brand-black relative"
      onClick={!audioUnlocked ? handleUnlock : undefined}
    >
      <TopBar count={attendees.length} capacity={capacity} eventName={eventData?.name} />

      <div className="relative flex-1">
        {loaded && (
          <PixiStage initialAttendees={initialAttendees} newAttendee={latestNew} />
        )}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <JoinToast newAttendee={latestNew} />

        {/* Audio unlock banner */}
        {showUnlockBanner && !audioUnlocked && (
          <div
            className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 cursor-pointer"
            onClick={handleUnlock}
          >
            <div className="bg-zinc-900/95 border border-brand-orange/50 rounded-2xl px-8 py-4 text-center shadow-2xl backdrop-blur-sm flex items-center gap-4">
              <span className="text-3xl">🔊</span>
              <div>
                <p className="text-white font-bold">Click anywhere to enable sound</p>
                <p className="text-zinc-400 text-sm">Chime plays on every check-in</p>
              </div>
            </div>
          </div>
        )}

        {/* Sound toggle */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleMute() }}
          className="absolute bottom-20 right-6 z-20 flex items-center gap-2 bg-zinc-900/80 border border-zinc-700 rounded-xl px-4 py-2 text-white text-sm backdrop-blur-sm hover:bg-zinc-800 transition-colors"
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          {soundEnabled ? 'Sound on' : 'Muted'}
        </button>
      </div>

      <TickerBar attendees={attendees} />
    </div>
  )
}

export default function DisplayPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center w-full h-full bg-brand-black">
        <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <DisplayContent />
    </Suspense>
  )
}
