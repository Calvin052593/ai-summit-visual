'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Attendee } from '@/types/attendee'

export function useRealtimeAttendees(initialAttendees: Attendee[], eventId?: string) {
  const [attendees, setAttendees] = useState<Attendee[]>(initialAttendees)
  const [latestNew, setLatestNew] = useState<Attendee | null>(null)
  const supabase = useRef(createClient()).current

  useEffect(() => {
    setAttendees(initialAttendees)
  }, [initialAttendees])

  useEffect(() => {
    const channelName = eventId ? `attendees-live-${eventId}` : 'attendees-live-all'

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'attendees',
          ...(eventId ? { filter: `event_id=eq.${eventId}` } : {}),
        },
        (payload) => {
          const newAttendee = payload.new as Attendee
          if (!newAttendee.is_active) return
          if (eventId && newAttendee.event_id !== eventId) return
          setAttendees((prev) => [...prev, newAttendee])
          setLatestNew(newAttendee)
          setTimeout(() => setLatestNew(null), 100)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, eventId])

  return { attendees, latestNew }
}
