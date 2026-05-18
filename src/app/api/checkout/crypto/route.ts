import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { orders, orderItems, plans } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { z } from 'zod'

const cryptoSchema = z.object({
  planId: z.string().uuid(),
})

// Wallet addresses from env (configured by admin)
const CRYPTO_WALLETS = {
  btc: process.env.CRYPTO_WALLET_BTC || '',
  eth: process.env.CRYPTO_WALLET_ETH || '',
  usdt_erc20: process.env.CRYPTO_WALLET_USDT_ERC20 || '',
  usdt_trc20: process.env.CRYPTO_WALLET_USDT_TRC20 || '',
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyCsrf(request)) {
      return NextResponse.json({ error: 'CSRF check failed' }, { status: 403 })
    }
    const user = await requireAuth()
    const { planId } = cryptoSchema.parse(await request.json())

    const [plan] = await db
      .select()
      .from(plans)
      .where(eq(plans.id, planId))
      .limit(1)

    if (!plan) {
      return NextResponse.json({ error: 'Plan nicht gefunden' }, { status: 404 })
    }

    // Create order in awaiting_crypto status
    const [order] = await db.insert(orders).values({
      customerUid: user.uid,
      totalCents: plan.priceCents,
      currency: 'EUR',
      status: 'awaiting_crypto',
      provider: 'crypto',
      providerRef: null,
    }).returning()

    await db.insert(orderItems).values({
      orderId: order.id,
      planId,
      priceCents: plan.priceCents,
    })

    return NextResponse.json({
      orderId: order.id,
      totalCents: plan.priceCents,
      wallets: CRYPTO_WALLETS,
      instructions: 'Bitte überweisen Sie den Betrag an eine der angegebenen Adressen und teilen Sie uns die Transaktions-ID mit.',
    }, { status: 201 })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Ungültige Eingabedaten' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
