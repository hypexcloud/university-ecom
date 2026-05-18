import { NextRequest, NextResponse } from 'next/server'

// TODO: Phase 5/9 — Intake form submission will be rebuilt with a proper
// intake_submissions table and lead scoring. For now, stub.
export async function POST(request: NextRequest) {
  const body = await request.json()
  return NextResponse.json({ success: true, id: 'stub', data: body })
}
