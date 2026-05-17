import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function DELETE() {
  const supabase = createServiceClient()

  const { error, count } = await supabase
    .from('attendees')
    .delete({ count: 'exact' })
    .eq('is_dummy', true)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ deleted: count ?? 0 })
}
