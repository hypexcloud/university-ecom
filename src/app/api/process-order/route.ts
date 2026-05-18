import { NextResponse } from 'next/server'

// This endpoint is deprecated. Order fulfillment now happens via:
// 1. Stripe webhook (payment_intent.succeeded) → src/lib/server/order-processing.ts
// 2. Admin crypto confirmation → /api/admin/payments/[id]
export async function POST() {
  return NextResponse.json(
    { error: 'Deprecated. Orders are now fulfilled via Stripe webhook or admin crypto confirmation.' },
    { status: 410 },
  )
}
