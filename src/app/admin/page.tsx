'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { StatsCards } from '@/components/admin/StatsCards'
import { CheckInChart } from '@/components/admin/CheckInChart'
import { CapacityBar } from '@/components/admin/CapacityBar'
import { DummyControls } from '@/components/admin/DummyControls'
import { ExportButton } from '@/components/admin/ExportButton'
import { EventManager } from '@/components/admin/EventManager'
import { QRCodePanel } from '@/components/admin/QRCodePanel'
import type { Attendee } from '@/types/attendee'
import type { Event } from '@/types/event'

const DEFAULT_EVENT_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
const POLL_MS = 30_000

export default function AdminPage() {
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  // Auth guard — redirect to login if no session
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/admin/login')
      } else {
        setUserEmail(session.user.email ?? null)
        setAuthChecked(true)
      }
    })
  }, [router])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/admin/login')
  }

  const [selectedEventId, setSelectedEventId] = useState<string>(() => {
    if (typeof window === 'undefined') return DEFAULT_EVENT_ID
    return localStorage.getItem('admin_selected_event') ?? DEFAULT_EVENT_ID
  })
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [realCount, setRealCount] = useState(0)
  const [dummyCount, setDummyCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const capacity = selectedEvent?.capacity ?? 3000

  const fetchData = useCallback(async () => {
    try {
      const [attendeesRes, eventRes] = await Promise.all([
        fetch(`/api/attendees?limit=5000&event_id=${selectedEventId}`),
        fetch(`/api/event?id=${selectedEventId}`),
      ])
      const attendeesData = await attendeesRes.json()
      const eventData = await eventRes.json()

      setAttendees(attendeesData.attendees ?? [])
      setRealCount(attendeesData.real_count ?? 0)
      setDummyCount(attendeesData.dummy_count ?? 0)
      if (eventData.event) setSelectedEvent(eventData.event)
      setLastUpdated(new Date())
    } catch {
      // retain stale data on network error
    } finally {
      setLoading(false)
    }
  }, [selectedEventId])

  useEffect(() => {
    fetchData()
    const id = setInterval(fetchData, POLL_MS)
    return () => clearInterval(id)
  }, [fetchData])

  const handleEventChange = (id: string, event: Event) => {
    setSelectedEventId(id)
    setSelectedEvent(event)
    localStorage.setItem('admin_selected_event', id)
    setLoading(true)
  }

  const total = realCount + dummyCount

  // Show blank while checking auth (prevents flash of content)
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-black text-white p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-zinc-500 text-sm mt-1">AI Summit</p>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-zinc-600 text-xs font-mono">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={fetchData}
              className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 text-sm transition-colors"
            >
              Refresh
            </button>
            <ExportButton />
            <div className="flex items-center gap-2 pl-3 border-l border-zinc-800">
              <span className="text-zinc-500 text-xs">{userEmail}</span>
              <button
                onClick={handleSignOut}
                className="px-3 py-2 rounded-xl bg-zinc-800 text-zinc-400 hover:bg-red-900/40 hover:text-red-400 text-sm transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>

        {/* Event management + QR code */}
        <div className="grid grid-cols-2 gap-6">
          <EventManager selectedEventId={selectedEventId} onEventChange={handleEventChange} />
          <QRCodePanel
            eventId={selectedEventId}
            eventName={selectedEvent?.name ?? 'Loading…'}
          />
        </div>

        {loading ? (
          <div className="text-center py-24 text-zinc-500">Loading…</div>
        ) : (
          <>
            <StatsCards total={total} real={realCount} dummy={dummyCount} capacity={capacity} />
            <CapacityBar count={total} capacity={capacity} />
            <CheckInChart attendees={attendees} />
            <DummyControls eventId={selectedEventId} />

            {/* Recent check-ins table */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
              <h2 className="text-white font-bold mb-4">
                Recent Check-ins
                {selectedEvent && (
                  <span className="ml-2 text-zinc-500 font-normal text-sm">— {selectedEvent.name}</span>
                )}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-zinc-500 border-b border-zinc-800">
                      <th className="text-left py-2 pr-4">Name</th>
                      <th className="text-left py-2 pr-4">Email</th>
                      <th className="text-left py-2 pr-4">Phone</th>
                      <th className="text-left py-2 pr-4">Checked In</th>
                      <th className="text-left py-2">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendees.slice(0, 50).map((a) => (
                      <tr key={a.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30">
                        <td className="py-2 pr-4 text-white font-medium">
                          {a.first_name} {a.last_name}
                        </td>
                        <td className="py-2 pr-4 text-zinc-400">{a.email}</td>
                        <td className="py-2 pr-4 text-zinc-400 font-mono">
                          {a.country_code} {a.phone}
                        </td>
                        <td className="py-2 pr-4 text-zinc-400 font-mono text-xs">
                          {new Date(a.checked_in_at).toLocaleString()}
                        </td>
                        <td className="py-2">
                          {a.is_dummy ? (
                            <span className="text-brand-cyan text-xs font-mono bg-brand-cyan/10 px-2 py-0.5 rounded-full">
                              DUMMY
                            </span>
                          ) : (
                            <span className="text-green-400 text-xs font-mono bg-green-400/10 px-2 py-0.5 rounded-full">
                              REAL
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {attendees.length > 50 && (
                  <p className="text-zinc-600 text-xs mt-3 text-center">
                    Showing 50 of {attendees.length} — export CSV for full list
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
