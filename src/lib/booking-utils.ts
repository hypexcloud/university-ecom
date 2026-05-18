/**
 * Booking System Types & Utilities
 *
 * Session management is now handled via:
 * - /api/sessions (customer-facing)
 * - /api/admin/sessions (admin/mentor)
 * - Schema: src/lib/server/db/schema/sessions.ts
 *
 * These types are kept for backward compatibility with legacy components.
 */

export interface SessionSlot {
  date: string
  startTime: string
  endTime: string
}

export interface TimeSlot {
  time: string
  available: boolean
}

export type MeetingType = 'zoom' | 'meet' | 'discord'
export type SessionType = 'coaching' | 'mentoring' | 'creator'

export const MEETING_TYPES: Record<MeetingType, string> = {
  zoom: 'Zoom',
  meet: 'Google Meet',
  discord: 'Discord',
}

export const SESSION_TYPES: Record<SessionType, string> = {
  coaching: 'Coaching',
  mentoring: 'Mentoring',
  creator: 'Creator Call',
}

export const SESSION_STATUS = {
  pending: 'Ausstehend',
  accepted: 'Bestätigt',
  rejected: 'Abgelehnt',
  completed: 'Abgeschlossen',
  missed: 'Verpasst',
  cancelled: 'Storniert',
} as const

export interface Session {
  id: string
  customerUid: string
  mentorUid: string
  type: MeetingType
  status: keyof typeof SESSION_STATUS
  scheduledAt: Date
  notes?: string
  meetingUrl?: string
}

export function getMeetingTypeLabel(type: MeetingType): string {
  return MEETING_TYPES[type] || type
}

export function getSessionTypeLabel(type: SessionType): string {
  return SESSION_TYPES[type] || type
}

export async function getAvailableSlots(_mentorUid: string, _date: string): Promise<SessionSlot[]> {
  return []
}

export async function bookSession(
  _customerUid: string,
  _mentorUid: string,
  _slot: SessionSlot,
): Promise<string> {
  throw new Error('Use /api/sessions POST instead')
}

// Legacy exports for backward compatibility with old components
export async function getAvailableTimeSlots(_mentorUid: string, _date: string): Promise<TimeSlot[]> {
  return []
}

export async function canBookSession(): Promise<boolean> {
  return true
}

export async function createSessionBooking(): Promise<string> {
  throw new Error('Use /api/sessions POST instead')
}

export async function cancelSession(): Promise<void> {
  throw new Error('Use /api/sessions/[id] PATCH instead')
}
