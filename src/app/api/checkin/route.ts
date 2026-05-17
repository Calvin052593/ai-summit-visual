import { NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { createServiceClient } from '@/lib/supabase/server'
import { randomAvatarColor } from '@/lib/brand'
import type { CheckInPayload } from '@/types/attendee'

export async function POST(req: Request) {
  let body: CheckInPayload
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { first_name, last_name, email, phone, country_code, display_consent, event_id } = body as CheckInPayload & { event_id?: string }

  if (!first_name?.trim() || !email?.trim() || !phone?.trim()) {
    return NextResponse.json({ error: 'first_name, email, and phone are required' }, { status: 400 })
  }

  const supabase = createServiceClient()

  // Check for total count (for "You're Gen AI #N" display)
  const { count: totalCount } = await supabase
    .from('attendees')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  // Check duplicate by email
  const { data: existing } = await supabase
    .from('attendees')
    .select('*')
    .eq('email', email.trim().toLowerCase())
    .single()

  if (existing) {
    // Update check-in time
    await supabase
      .from('attendees')
      .update({ checked_in_at: new Date().toISOString() })
      .eq('id', existing.id)

    return NextResponse.json({
      type: 'welcome_back',
      attendee: existing,
      total_count: totalCount ?? 0,
    }, { status: 200 })
  }

  const avatar_seed = `bot-${nanoid(10)}`
  const avatar_color = randomAvatarColor()

  const { data, error } = await supabase
    .from('attendees')
    .insert({
      first_name: first_name.trim(),
      last_name: last_name?.trim() || null,
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      country_code: country_code ?? '+60',
      avatar_seed,
      avatar_color,
      is_dummy: false,
      display_consent: display_consent ?? false,
      is_active: true,
      event_id: event_id ?? null,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      // Race condition duplicate — treat as welcome back
      return NextResponse.json({ type: 'welcome_back', total_count: totalCount ?? 0 }, { status: 409 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    type: 'new',
    attendee: data,
    total_count: (totalCount ?? 0) + 1,
  }, { status: 201 })
}
