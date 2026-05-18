import { NextResponse } from 'next/server'

// TODO: Phase 5 — Intake submissions will be rebuilt with a proper
// intake_submissions table. For now, return empty array so the admin page loads.
export async function GET() {
  return NextResponse.json({ submissions: [] })
}
