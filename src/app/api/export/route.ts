import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createServiceClient()

  const { data, error } = await supabase
    .from('attendees')
    .select('first_name, last_name, email, phone, country_code, checked_in_at, display_consent')
    .eq('is_active', true)
    .eq('is_dummy', false)
    .order('checked_in_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const header = 'First Name,Last Name,Email,Phone,Country Code,Checked In At,Display Consent\n'
  const rows = (data ?? []).map((a) => {
    const cols = [
      csvEscape(a.first_name),
      csvEscape(a.last_name ?? ''),
      csvEscape(a.email),
      csvEscape(a.phone),
      csvEscape(a.country_code),
      csvEscape(a.checked_in_at),
      a.display_consent ? 'Yes' : 'No',
    ]
    return cols.join(',')
  })

  const csv = header + rows.join('\n')
  const date = new Date().toISOString().slice(0, 10)

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="attendees-${date}.csv"`,
    },
  })
}

function csvEscape(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}
