import { NextResponse } from 'next/server'

// Replaced by /api/affiliate/track?ref=CODE
export async function GET() {
  return NextResponse.json({ error: 'Use /api/affiliate/track?ref=CODE instead' }, { status: 301 })
}
export async function POST() {
  return NextResponse.json({ error: 'Use /api/affiliate/track?ref=CODE instead' }, { status: 301 })
}
