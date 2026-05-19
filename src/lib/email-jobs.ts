/**
 * Scheduled Email Jobs
 *
 * TODO: Rebuild with Drizzle queries in Phase 4 (Notifications).
 * Currently stubbed.
 */

export async function sendSessionReminders(): Promise<{ sent: number; errors: number }> {
  // TODO: query sessions table for sessions 24h from now, send reminders
  return { sent: 0, errors: 0 }
}

export async function sendFollowUpEmails(): Promise<{ sent: number; errors: number }> {
  return { sent: 0, errors: 0 }
}
