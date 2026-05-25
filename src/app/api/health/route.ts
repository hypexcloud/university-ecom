import { NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { sql } from 'drizzle-orm'

export async function GET() {
  const checks: Record<string, 'ok' | 'fail'> = {}

  // Postgres ping
  let dbError = ''
  try {
    await db.execute(sql`SELECT 1`)
    checks.postgres = 'ok'
  } catch (e: unknown) {
    checks.postgres = 'fail'
    if (e instanceof Error) {
      const rec = e as unknown as Record<string, unknown>
      dbError = `${e.message} | cause: ${String(rec['cause'] ?? 'none')} | code: ${String(rec['code'] ?? 'none')}`
    } else {
      dbError = String(e)
    }
  }

  // Stripe key configured
  checks.stripe = process.env.STRIPE_SECRET_KEY ? 'ok' : 'fail'

  // Resend key configured
  checks.resend = process.env.RESEND_API_KEY ? 'ok' : 'fail'

  // Supabase configured
  checks.supabase = process.env.NEXT_PUBLIC_SUPABASE_URL ? 'ok' : 'fail'

  const allOk = Object.values(checks).every((v) => v === 'ok')

  return NextResponse.json(
    { status: allOk ? 'ok' : 'degraded', checks, dbError: dbError || undefined, dbUrl: process.env.DATABASE_URL?.replace(/:[^@]+@/, ':***@'), dbUser: process.env.DATABASE_URL?.match(/\/\/([^:]+):/)?.[1], timestamp: new Date().toISOString() },
    { status: allOk ? 200 : 503, headers: { 'Cache-Control': 'no-store' } },
  )
}
