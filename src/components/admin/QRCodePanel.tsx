'use client'

import { useState, useEffect } from 'react'
import { QrCode, Copy, Check, ExternalLink, Monitor, Smartphone, Pencil } from 'lucide-react'
import { QRCodeCanvas } from '@/components/QRCodeCanvas'

interface QRCodePanelProps {
  eventId: string
  eventName: string
}

type Tab = 'checkin' | 'display'

export function QRCodePanel({ eventId, eventName }: QRCodePanelProps) {
  const [baseUrl, setBaseUrl] = useState('')
  const [editingUrl, setEditingUrl] = useState(false)
  const [draftUrl, setDraftUrl] = useState('')
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('checkin')

  // Fetch local LAN IP so phones on the same WiFi can reach the server
  useEffect(() => {
    const stored = localStorage.getItem('qr_base_url')
    if (stored) { setBaseUrl(stored); return }

    fetch('/api/local-ip')
      .then((r) => r.json())
      .then(({ ip }) => {
        const url = `http://${ip}:3000`
        setBaseUrl(url)
      })
      .catch(() => setBaseUrl(window.location.origin))
  }, [])

  const checkinUrl = baseUrl ? `${baseUrl}/checkin?event=${eventId}` : ''
  const displayUrl = baseUrl ? `${baseUrl}/display?event=${eventId}` : ''
  const activeUrl = tab === 'checkin' ? checkinUrl : displayUrl

  const copy = async (url: string) => {
    await navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  const saveUrl = () => {
    const cleaned = draftUrl.replace(/\/$/, '')
    setBaseUrl(cleaned)
    localStorage.setItem('qr_base_url', cleaned)
    setEditingUrl(false)
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <QrCode size={18} className="text-brand-cyan" />
          <h2 className="text-white font-bold">QR Codes</h2>
        </div>

        {/* Editable base URL */}
        <div className="flex items-center gap-2">
          {editingUrl ? (
            <>
              <input
                autoFocus
                value={draftUrl}
                onChange={(e) => setDraftUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') saveUrl(); if (e.key === 'Escape') setEditingUrl(false) }}
                placeholder="http://192.168.x.x:3000"
                className="text-xs bg-zinc-800 border border-zinc-600 rounded-lg px-2 py-1 text-white outline-none focus:border-brand-orange w-52"
              />
              <button onClick={saveUrl} className="text-xs text-green-400 hover:text-green-300 font-bold">Save</button>
              <button onClick={() => setEditingUrl(false)} className="text-xs text-zinc-500 hover:text-zinc-300">✕</button>
            </>
          ) : (
            <button
              onClick={() => { setDraftUrl(baseUrl); setEditingUrl(true) }}
              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <Pencil size={11} />
              {baseUrl ? baseUrl.replace(/^https?:\/\//, '') : 'set URL…'}
            </button>
          )}
        </div>
      </div>

      {/* Tab selector */}
      <div className="flex gap-1 bg-zinc-800 rounded-xl p-1">
        <button
          onClick={() => setTab('checkin')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'checkin' ? 'bg-brand-orange text-white' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Smartphone size={14} />
          Attendee Check-in
        </button>
        <button
          onClick={() => setTab('display')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'display' ? 'bg-brand-orange text-white' : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Monitor size={14} />
          LED Display
        </button>
      </div>

      <div className="flex gap-5 items-start">
        {/* QR */}
        <div className="shrink-0 bg-white rounded-xl p-3 shadow-lg">
          {activeUrl ? (
            <QRCodeCanvas value={activeUrl} size={148} darkColor="#0a0a0a" lightColor="#ffffff" />
          ) : (
            <div className="w-[148px] h-[148px] bg-zinc-100 rounded-lg animate-pulse" />
          )}
        </div>

        {/* Details */}
        <div className="flex-1 space-y-3 min-w-0">
          <div>
            <p className="text-zinc-500 text-xs mb-1">Event</p>
            <p className="text-white text-sm font-medium truncate">{eventName}</p>
          </div>

          <div>
            <p className="text-zinc-500 text-xs mb-1">
              {tab === 'checkin' ? 'Check-in URL (scan with phone)' : 'Display URL (open on LED screen)'}
            </p>
            <div className="flex items-center gap-2">
              <code className="text-brand-cyan text-xs bg-zinc-800 px-2 py-1.5 rounded-lg flex-1 truncate block">
                {activeUrl || '—'}
              </code>
              <button
                onClick={() => copy(activeUrl)}
                className="shrink-0 p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
              >
                {copiedUrl === activeUrl ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
              </button>
              {activeUrl && (
                <a
                  href={activeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                >
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>

          <p className="text-zinc-600 text-xs leading-relaxed">
            {tab === 'checkin'
              ? 'Attendees scan with their phone to check in. Both phone and kiosk must be on the same WiFi network.'
              : 'Open this URL in Chrome on the LED display PC. Each event has a separate display.'}
          </p>
        </div>
      </div>
    </div>
  )
}
