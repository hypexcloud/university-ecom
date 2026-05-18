/**
 * Order Processing Utilities
 *
 * TODO: Rebuild in Phase 3 (Payments hardened) with Drizzle.
 * Currently stubbed to remove Firebase dependency.
 */

export async function processOrder(): Promise<void> {
  throw new Error('Order processing not yet migrated to Supabase — see Phase 3')
}

export async function createKundeAccount(): Promise<void> {
  throw new Error('Account creation handled by Supabase Auth — see /api/auth/register')
}
