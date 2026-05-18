import { NextResponse } from 'next/server'

// Replaced by PATCH /api/sessions/[id] with action: 'reject'
export async function POST() {
  return NextResponse.json({ error: 'Use PATCH /api/sessions/[id] with action reject' }, { status: 301 })
}
