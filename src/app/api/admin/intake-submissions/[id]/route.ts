import { NextRequest, NextResponse } from 'next/server'

// TODO: Phase 5 — Intake submission updates will be rebuilt.
export async function PUT(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  return NextResponse.json({ success: true, message: `Submission ${id} stub` })
}
