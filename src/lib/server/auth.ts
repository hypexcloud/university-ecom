import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/server/db'
import { customers, adminPermissions, mentors } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'

export type Permissions = {
  customers: boolean
  products: boolean
  payments: boolean
  affiliate: boolean
  tickets: boolean
  videos: boolean
  analytics: boolean
}

const PERMISSION_KEYS: (keyof Permissions)[] = [
  'customers', 'products', 'payments', 'affiliate',
  'tickets', 'videos', 'analytics',
]

export type AuthenticatedUser = {
  uid: string
  email: string
  customer: typeof customers.$inferSelect
}

export type AdminUser = AuthenticatedUser & {
  permissions: Permissions
}

/**
 * Verify the Supabase JWT from cookies and return the customer row.
 * Throws a Response with 401 if unauthenticated.
 */
export async function requireAuth(): Promise<AuthenticatedUser> {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Response(JSON.stringify({ error: 'Nicht authentifiziert' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const customerRows = await db
    .select()
    .from(customers)
    .where(eq(customers.uid, user.id))
  const customer = customerRows[0]

  if (!customer) {
    throw new Response(JSON.stringify({ error: 'Kundenprofil nicht gefunden' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const email = user.email
  if (!email) {
    throw new Response(JSON.stringify({ error: 'E-Mail nicht verifiziert' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return { uid: user.id, email, customer }
}

/**
 * Verify admin status, MFA (AAL2), and a specific permission flag.
 * Throws 403 if the user is not an admin, hasn't completed 2FA, or lacks the permission.
 */
export async function requireAdmin(perm: keyof Permissions): Promise<AdminUser> {
  const supabase = await createClient()

  // Verify MFA — admins MUST have completed TOTP challenge (AAL2)
  const { data: mfaData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
  if (!mfaData || mfaData.currentLevel !== 'aal2') {
    throw new Response(
      JSON.stringify({ error: '2FA erforderlich. Bitte TOTP-Verifizierung abschließen.' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const authed = await requireAuth()

  const adminPermRows = await db
    .select()
    .from(adminPermissions)
    .where(eq(adminPermissions.uid, authed.uid))
  const adminPerm = adminPermRows[0]

  if (!adminPerm) {
    throw new Response(JSON.stringify({ error: 'Kein Admin-Zugang' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Validate perms JSONB strictly — each key must be boolean true
  const rawPerms = adminPerm.perms as Record<string, unknown>
  const perms = {} as Permissions
  for (const key of PERMISSION_KEYS) {
    perms[key] = rawPerms[key] === true
  }

  if (!perms[perm]) {
    throw new Response(
      JSON.stringify({ error: `Fehlende Berechtigung: ${perm}` }),
      { status: 403, headers: { 'Content-Type': 'application/json' } },
    )
  }

  return { ...authed, permissions: perms }
}

/**
 * Verify the caller is an active mentor.
 * Mentors are separate from admins — they can manage sessions but not admin features.
 */
export async function requireMentor(): Promise<AuthenticatedUser> {
  const authed = await requireAuth()

  const mentorRows = await db
    .select()
    .from(mentors)
    .where(eq(mentors.uid, authed.uid))
  const mentor = mentorRows[0]

  if (!mentor || !mentor.isActive) {
    throw new Response(JSON.stringify({ error: 'Kein Mentor-Zugang' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return authed
}
