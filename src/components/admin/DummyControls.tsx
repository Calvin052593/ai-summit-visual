'use client'

import { useState, useEffect } from 'react'
import { Bot } from 'lucide-react'

interface DummyConfig {
  enabled: boolean
  interval: number
  count: number
  event_id?: string
}

function loadConfig(): DummyConfig {
  if (typeof window === 'undefined') return { enabled: true, interval: 5, count: 2 }
  try { return { enabled: true, interval: 5, count: 2, ...JSON.parse(localStorage.getItem('dummy_config') ?? '{}') } }
  catch { return { enabled: true, interval: 5, count: 2 } }
}

export function DummyControls({ eventId }: { eventId?: string }) {
  const [cfg, setCfg] = useState<DummyConfig>(loadConfig)
  const [generating, setGenerating] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const toSave = eventId ? { ...cfg, event_id: eventId } : cfg
    localStorage.setItem('dummy_config', JSON.stringify(toSave))
  }, [cfg, eventId])

  const generateNow = async () => {
    setGenerating(true)
    setMsg('')
    try {
      const res = await fetch('/api/dummy/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: cfg.count, event_id: eventId ?? null }),
      })
      const data = await res.json()
      setMsg(`Inserted ${data.inserted} dummy attendees`)
    } catch {
      setMsg('Error generating dummies')
    } finally {
      setGenerating(false)
    }
  }

  const clearAll = async () => {
    if (!confirm('Delete all dummy attendees?')) return
    const res = await fetch('/api/dummy/clear', { method: 'DELETE' })
    const data = await res.json()
    setMsg(`Deleted ${data.deleted} dummy attendees`)
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Bot size={18} className="text-brand-cyan" />
        <h2 className="text-white font-bold">Dummy Generator</h2>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-zinc-300">Auto-generate dummies</span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={cfg.enabled}
            onChange={(e) => setCfg((c) => ({ ...c, enabled: e.target.checked }))}
          />
          <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:bg-brand-orange transition-colors" />
          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-zinc-400 text-sm block mb-1">Interval (minutes)</span>
          <input
            type="number"
            min={1}
            max={60}
            value={cfg.interval}
            onChange={(e) => setCfg((c) => ({ ...c, interval: parseInt(e.target.value) || 5 }))}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white font-mono"
          />
        </label>
        <label className="block">
          <span className="text-zinc-400 text-sm block mb-1">Count per batch</span>
          <input
            type="number"
            min={1}
            max={20}
            value={cfg.count}
            onChange={(e) => setCfg((c) => ({ ...c, count: parseInt(e.target.value) || 2 }))}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white font-mono"
          />
        </label>
      </div>

      <div className="flex gap-3">
        <button
          onClick={generateNow}
          disabled={generating}
          className="flex-1 py-2 rounded-xl bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 hover:bg-brand-cyan/30 text-sm font-bold transition-colors disabled:opacity-50"
        >
          {generating ? 'Generating…' : `Generate ${cfg.count} now`}
        </button>
        <button
          onClick={clearAll}
          className="flex-1 py-2 rounded-xl bg-red-900/30 text-red-400 border border-red-800/30 hover:bg-red-900/50 text-sm font-bold transition-colors"
        >
          Clear all dummies
        </button>
      </div>

      {msg && <p className="text-zinc-400 text-sm">{msg}</p>}
    </div>
  )
}
