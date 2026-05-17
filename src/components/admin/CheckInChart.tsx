'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { groupByHour } from '@/lib/utils'
import type { Attendee } from '@/types/attendee'

interface CheckInChartProps {
  attendees: Attendee[]
}

export function CheckInChart({ attendees }: CheckInChartProps) {
  const data = groupByHour(attendees)

  if (data.length === 0) return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center text-zinc-500 h-64 flex items-center justify-center">
      No check-in data yet
    </div>
  )

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
      <h2 className="text-white font-bold mb-4">Check-ins per Hour</h2>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 4, right: 16, left: -10, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
          <XAxis
            dataKey="hour"
            tick={{ fill: '#71717a', fontSize: 11 }}
            tickFormatter={(v: string) => v.slice(11, 16)}
          />
          <YAxis tick={{ fill: '#71717a', fontSize: 11 }} allowDecimals={false} />
          <Tooltip
            contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: 8, color: '#fff' }}
            labelStyle={{ color: '#a1a1aa' }}
          />
          <Legend wrapperStyle={{ color: '#a1a1aa', fontSize: 12 }} />
          <Bar dataKey="real" name="Real" fill="#FF4F00" radius={[4, 4, 0, 0]} />
          <Bar dataKey="dummy" name="Dummy" fill="#00E5FF" radius={[4, 4, 0, 0]} opacity={0.6} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
