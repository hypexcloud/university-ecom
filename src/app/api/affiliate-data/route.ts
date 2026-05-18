import { NextResponse } from 'next/server'

// Replaced by /api/affiliate/stats
export async function GET() {
  return NextResponse.json({ error: 'Use /api/affiliate/stats instead' }, { status: 301 })
}
