'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'

export function ExportButton() {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/export')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = res.headers.get('Content-Disposition')?.match(/filename="(.+)"/)?.[1] ?? 'attendees.csv'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      alert('Export failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 px-5 py-3 bg-brand-orange hover:bg-orange-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
    >
      <Download size={16} />
      {loading ? 'Exporting…' : 'Export CSV'}
    </button>
  )
}
