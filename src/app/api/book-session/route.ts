import { NextResponse } from 'next/server'

// Replaced by /api/admin/sessions (POST) for admin-created sessions
// Customers request sessions via /student/support (ticket)
export async function POST() {
  return NextResponse.json({ error: 'Use /api/admin/sessions POST or create a support ticket' }, { status: 301 })
}
