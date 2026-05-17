import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') ?? '1', 10)
  const limit = parseInt(searchParams.get('limit') ?? '100', 10)
  const isDummy = searchParams.get('is_dummy')
  const eventId = searchParams.get('event_id')

  const supabase = createServiceClient()

  let query = supabase
    .from('attendees')
    .select('*', { count: 'exact' })
    .eq('is_active', true)
    .order('checked_in_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (isDummy === 'true') query = query.eq('is_dummy', true)
  if (isDummy === 'false') query = query.eq('is_dummy', false)
  if (eventId) query = query.eq('event_id', eventId)

  const { data, error, count } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Return real vs dummy counts, scoped to event if provided
  let realQuery = supabase
    .from('attendees')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
    .eq('is_dummy', false)
  let dummyQuery = supabase
    .from('attendees')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)
    .eq('is_dummy', true)

  if (eventId) {
    realQuery = realQuery.eq('event_id', eventId)
    dummyQuery = dummyQuery.eq('event_id', eventId)
  }

  const { count: realCount } = await realQuery
  const { count: dummyCount } = await dummyQuery

  return NextResponse.json({
    attendees: data,
    total: count ?? 0,
    real_count: realCount ?? 0,
    dummy_count: dummyCount ?? 0,
    page,
    limit,
  })
}
