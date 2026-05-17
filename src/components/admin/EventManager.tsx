'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Check, X, ChevronDown, Radio } from 'lucide-react'
import type { Event } from '@/types/event'

interface EventManagerProps {
  selectedEventId: string
  onEventChange: (id: string, event: Event) => void
}

const DEFAULT_EVENT_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'

export function EventManager({ selectedEventId, onEventChange }: EventManagerProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showDropdown, setShowDropdown] = useState(false)
  const [editField, setEditField] = useState<'name' | 'capacity' | null>(null)
  const [editValue, setEditValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCapacity, setNewCapacity] = useState('3000')
  const [newStartsAt, setNewStartsAt] = useState('')
  const [newEndsAt, setNewEndsAt] = useState('')
  const [creating, setCreating] = useState(false)

  const selected = events.find((e) => e.id === selectedEventId)

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events')
      const data = await res.json()
      setEvents(data.events ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchEvents() }, [])

  const startEdit = (field: 'name' | 'capacity') => {
    if (!selected) return
    setEditField(field)
    setEditValue(field === 'name' ? selected.name : String(selected.capacity))
  }

  const cancelEdit = () => { setEditField(null); setEditValue('') }

  const saveEdit = async () => {
    if (!selected || !editField) return
    setSaving(true)
    try {
      const value = editField === 'capacity' ? Number(editValue) : editValue.trim()
      if (!value) return
      const res = await fetch(`/api/event?id=${selectedEventId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [editField]: value }),
      })
      const data = await res.json()
      setEvents((prev) => prev.map((e) => (e.id === selectedEventId ? data.event : e)))
      onEventChange(selectedEventId, data.event)
      setEditField(null)
    } catch {
      alert('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const toggleLive = async () => {
    if (!selected) return
    const res = await fetch(`/api/event?id=${selectedEventId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_live: !selected.is_live }),
    })
    const data = await res.json()
    setEvents((prev) => prev.map((e) => (e.id === selectedEventId ? data.event : e)))
    onEventChange(selectedEventId, data.event)
  }

  const createEvent = async () => {
    if (!newName.trim() || !newCapacity) return
    setCreating(true)
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName.trim(),
          capacity: Number(newCapacity),
          starts_at: newStartsAt || null,
          ends_at: newEndsAt || null,
        }),
      })
      const data = await res.json()
      if (data.error) { alert(data.error); return }
      setEvents((prev) => [data.event, ...prev])
      onEventChange(data.event.id, data.event)
      setShowCreate(false)
      setNewName('')
      setNewCapacity('3000')
      setNewStartsAt('')
      setNewEndsAt('')
    } catch {
      alert('Failed to create event')
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-zinc-500">Loading events…</div>
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-lg">Event</h2>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-orange text-white text-sm font-bold hover:bg-orange-600 transition-colors"
        >
          <Plus size={15} />
          New Event
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="bg-zinc-800 rounded-xl p-4 space-y-3">
          <p className="text-zinc-300 text-sm font-semibold">Create New Event</p>
          <input
            type="text"
            placeholder="Event name *"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-zinc-700 border border-zinc-600 text-white placeholder-zinc-500 text-sm outline-none focus:border-brand-orange"
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-500 text-xs mb-1 block">Max Capacity *</label>
              <input
                type="number"
                min={1}
                value={newCapacity}
                onChange={(e) => setNewCapacity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-700 border border-zinc-600 text-white text-sm outline-none focus:border-brand-orange font-mono"
              />
            </div>
            <div />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-500 text-xs mb-1 block">Start date & time</label>
              <input
                type="datetime-local"
                value={newStartsAt}
                onChange={(e) => setNewStartsAt(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-700 border border-zinc-600 text-white text-sm outline-none focus:border-brand-orange"
              />
            </div>
            <div>
              <label className="text-zinc-500 text-xs mb-1 block">End date & time</label>
              <input
                type="datetime-local"
                value={newEndsAt}
                onChange={(e) => setNewEndsAt(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-700 border border-zinc-600 text-white text-sm outline-none focus:border-brand-orange"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setShowCreate(false)}
              className="px-4 py-2 rounded-lg bg-zinc-700 text-zinc-300 text-sm hover:bg-zinc-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={createEvent}
              disabled={creating || !newName.trim()}
              className="px-4 py-2 rounded-lg bg-brand-orange text-white text-sm font-bold hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {creating ? 'Creating…' : 'Create Event'}
            </button>
          </div>
        </div>
      )}

      {/* Event selector */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white hover:bg-zinc-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span
              className={`w-2 h-2 rounded-full ${selected?.is_live ? 'bg-green-400' : 'bg-zinc-500'}`}
            />
            <span className="font-medium">{selected?.name ?? 'Select event…'}</span>
          </div>
          <ChevronDown size={16} className="text-zinc-400" />
        </button>

        {showDropdown && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden z-20 shadow-xl">
            {events.map((ev) => (
              <button
                key={ev.id}
                onClick={() => { onEventChange(ev.id, ev); setShowDropdown(false) }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-700 transition-colors ${
                  ev.id === selectedEventId ? 'bg-zinc-700' : ''
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${ev.is_live ? 'bg-green-400' : 'bg-zinc-500'}`} />
                <div>
                  <p className="text-white text-sm font-medium">{ev.name}</p>
                  <p className="text-zinc-500 text-xs">Capacity: {ev.capacity.toLocaleString()}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected event details — editable */}
      {selected && (
        <div className="grid grid-cols-3 gap-3">
          {/* Name */}
          <div className="col-span-2 bg-zinc-800 rounded-xl px-4 py-3">
            <p className="text-zinc-500 text-xs mb-1">Event Name</p>
            {editField === 'name' ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit() }}
                  className="flex-1 bg-zinc-700 text-white rounded-lg px-2 py-1 text-sm outline-none focus:ring-1 ring-brand-orange"
                />
                <button onClick={saveEdit} disabled={saving} className="text-green-400 hover:text-green-300">
                  <Check size={16} />
                </button>
                <button onClick={cancelEdit} className="text-zinc-500 hover:text-zinc-300">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-white font-medium text-sm">{selected.name}</span>
                <button onClick={() => startEdit('name')} className="text-zinc-600 hover:text-zinc-300 ml-2">
                  <Pencil size={13} />
                </button>
              </div>
            )}
          </div>

          {/* Capacity */}
          <div className="bg-zinc-800 rounded-xl px-4 py-3">
            <p className="text-zinc-500 text-xs mb-1">Capacity</p>
            {editField === 'capacity' ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  type="number"
                  min={1}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit() }}
                  className="flex-1 bg-zinc-700 text-white rounded-lg px-2 py-1 text-sm outline-none focus:ring-1 ring-brand-orange font-mono w-20"
                />
                <button onClick={saveEdit} disabled={saving} className="text-green-400 hover:text-green-300">
                  <Check size={16} />
                </button>
                <button onClick={cancelEdit} className="text-zinc-500 hover:text-zinc-300">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-white font-mono text-sm">{selected.capacity.toLocaleString()}</span>
                <button onClick={() => startEdit('capacity')} className="text-zinc-600 hover:text-zinc-300 ml-2">
                  <Pencil size={13} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Live toggle for selected event */}
      {selected && (
        <button
          onClick={toggleLive}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
            selected.is_live
              ? 'bg-green-900/30 text-green-400 border border-green-800/30 hover:bg-green-900/50'
              : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700'
          }`}
        >
          <Radio size={14} />
          {selected.is_live ? '● LIVE — click to pause' : '○ PAUSED — click to go live'}
        </button>
      )}
    </div>
  )
}
