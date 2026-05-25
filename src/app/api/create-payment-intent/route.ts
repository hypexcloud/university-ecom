import { NextRequest, NextResponse } from 'next/server'
import { createPaymentIntent } from '@/lib/stripe-server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { calculateTotal } from '@/lib/stripe'
import { db } from '@/lib/server/db'
import { plans, products, customers } from '@/lib/server/db/schema'
import { eq, and } from 'drizzle-orm'
import crypto from 'crypto'

const SLUG_MAP: Record<string, string> = {
  ai: 'ai-kurs',
  dropshipping: 'dropshipping-kurs',
  'tiktok-creator': 'tiktok-creator',
  'youtube-creator': 'youtube-creator',
}

async function resolvePlanId(courseType: string, planType: string): Promise<string> {
  const productSlug = SLUG_MAP[courseType] || courseType
  try {
    const [plan] = await db
      .select({ id: plans.id })
      .from(plans)
      .innerJoin(products, eq(plans.productId, products.id))
      .where(and(eq(products.slug, productSlug), eq(plans.code, planType)))
      .limit(1)
    return plan?.id || ''
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    throw new Error(
      `Konnte Plan nicht auflösen (product=${productSlug}, plan=${planType}): ${msg}. ` +
      'Wurden die Tabellen erstellt (db:push) und der Seed ausgeführt?'
    )
  }
}

/**
 * Ensure a customer account exists for the given email.
 * If the user is logged in, returns their uid.
 * If not, looks up an existing customer by email or creates a new Supabase Auth user + customer row.
 * Returns { customerUid, isNewUser, tempPassword? }
 */
async function ensureCustomerAccount(
  loggedInUserId: string | undefined,
  email: string,
  firstName: string,
  lastName: string,
  phone?: string,
  discord?: string,
): Promise<{ customerUid: string; isNewUser: boolean; tempPassword?: string }> {
  // 1. Already logged in
  if (loggedInUserId) {
    return { customerUid: loggedInUserId, isNewUser: false }
  }

  // 2. Check if customer already exists by email
  const [existing] = await db
    .select({ uid: customers.uid })
    .from(customers)
    .where(eq(customers.email, email))
    .limit(1)

  if (existing) {
    return { customerUid: existing.uid, isNewUser: false }
  }

  // 3. Create new account via Supabase Admin API
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase-Konfiguration fehlt für Account-Erstellung')
  }

  const admin = createAdminClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const tempPassword = crypto.randomBytes(12).toString('base64url')

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
    user_metadata: { first_name: firstName, last_name: lastName },
  })

  if (authError || !authData.user) {
    throw new Error(`Account-Erstellung fehlgeschlagen: ${authError?.message || 'Unbekannter Fehler'}`)
  }

  // 4. Create customer row
  await db.insert(customers).values({
    uid: authData.user.id,
    email,
    firstName,
    lastName,
    discordUsername: discord || null,
    whatsapp: phone || null,
    status: 'active',
  }).onConflictDoNothing()

  return { customerUid: authData.user.id, isNewUser: true, tempPassword }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, metadata, customerEmail } = body

    if (!amount || !currency || !customerEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Ensure customer account exists (auto-create if guest checkout)
    const firstName = metadata?.name?.split(' ')[0] || ''
    const lastName = metadata?.name?.split(' ').slice(1).join(' ') || ''
    const { customerUid, isNewUser, tempPassword } = await ensureCustomerAccount(
      user?.id,
      customerEmail,
      firstName,
      lastName,
      metadata?.phone,
      metadata?.discord,
    )

    // Resolve plan IDs — support both single item and cart
    const cartItems: { course: string; plan: string }[] = body.cartItems || []
    let planIds: string[] = []

    if (cartItems.length > 0) {
      planIds = await Promise.all(cartItems.map((i) => resolvePlanId(i.course, i.plan)))
      planIds = planIds.filter(Boolean)
    } else {
      // Legacy single-item path
      let planId = metadata?.planId || ''
      if (!planId && metadata?.courseType && metadata?.planType) {
        planId = await resolvePlanId(metadata.courseType, metadata.planType)
      }
      if (planId) planIds = [planId]
    }

    // Save billing address
    if (body.billingAddress) {
      const addr = body.billingAddress
      await db
        .update(customers)
        .set({
          billing: {
            street: addr.street || '',
            zipCode: addr.zipCode || '',
            city: addr.city || '',
            country: addr.country || 'Deutschland',
            companyName: addr.companyName || '',
            vatId: addr.vatId || '',
          },
          updatedAt: new Date(),
        })
        .where(eq(customers.uid, customerUid))
    }

    const affiliateCode = request.cookies.get('affiliate_ref')?.value || null
    const totalAmount = calculateTotal(amount)

    const paymentIntent = await createPaymentIntent({
      amount: totalAmount,
      currency: currency || 'EUR',
      metadata: {
        ...metadata,
        customerUid,
        isNewUser: String(isNewUser),
        tempPassword: tempPassword || '',
        planId: planIds[0] || '',
        planIds: JSON.stringify(planIds),
        affiliateCode: affiliateCode || '',
      },
      customerEmail,
      description: `University Ecom - ${planIds.length} Produkt${planIds.length > 1 ? 'e' : ''}`,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      isNewUser,
      tempPassword: tempPassword || undefined,
      customerEmail,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
