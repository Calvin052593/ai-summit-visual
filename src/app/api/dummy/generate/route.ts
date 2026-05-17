import { NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { createServiceClient } from '@/lib/supabase/server'
import { randomAvatarColor } from '@/lib/brand'
import { randomDummyName, randomDummyEmail, randomDummyCountryCode } from '@/lib/dummy-names'

export async function POST(req: Request) {
  let count = 2
  let eventId: string | null = null
  try {
    const body = await req.json()
    count = Math.min(Math.max(1, parseInt(body.count ?? '2', 10)), 20)
    eventId = body.event_id ?? null
  } catch { /* use default */ }

  const supabase = createServiceClient()

  const rows = Array.from({ length: count }, () => {
    const { first_name, last_name } = randomDummyName()
    return {
      first_name,
      last_name,
      email: randomDummyEmail(first_name, last_name),
      phone: `01${Math.floor(10000000 + Math.random() * 90000000)}`,
      country_code: randomDummyCountryCode(),
      avatar_seed: `bot-${nanoid(10)}`,
      avatar_color: randomAvatarColor(),
      gender: Math.random() < 0.5 ? 'male' : 'female',
      is_dummy: true,
      display_consent: true,
      is_active: true,
      event_id: eventId,
    }
  })

  const { data, error } = await supabase
    .from('attendees')
    .insert(rows)
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ inserted: data?.length ?? 0, attendees: data }, { status: 201 })
}
