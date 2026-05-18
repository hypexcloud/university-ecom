/**
 * Booking System Utilities
 *
 * TODO: Rebuild in Phase 5 (Sessions & Creator) with Drizzle.
 * Currently stubbed to remove Firebase dependency.
 */

export interface SessionSlot {
  date: string
  startTime: string
  endTime: string
}

export async function getAvailableSlots(_mentorUid: string, _date: string): Promise<SessionSlot[]> {
  return []
}

export async function bookSession(
  _customerUid: string,
  _mentorUid: string,
  _slot: SessionSlot,
): Promise<string> {
  throw new Error('Booking not yet migrated to Supabase — see Phase 5')
}
