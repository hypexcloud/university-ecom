/**
 * Scheduled Email Jobs
 * 
 * Functions to be run on a schedule (e.g., via cron job or Vercel Cron)
 */

import { db } from './firebase/config'
import { collection, query, where, getDocs, getDoc, doc, Timestamp } from 'firebase/firestore'
import { sendSessionReminderEmail } from './email-utils'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'

/**
 * Send session reminders for sessions 24 hours from now
 * Should be run daily
 */
export async function sendSessionReminders() {
  try {
    console.log('🔔 Running session reminder job...')

    // Calculate tomorrow's date range
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    const dayAfterTomorrow = new Date(tomorrow)
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1)

    // Query sessions for tomorrow
    const sessionsQuery = query(
      collection(db, 'sessions'),
      where('startTime', '>=', Timestamp.fromDate(tomorrow)),
      where('startTime', '<', Timestamp.fromDate(dayAfterTomorrow)),
      where('status', '==', 'scheduled')
    )

    const sessionsSnapshot = await getDocs(sessionsQuery)

    if (sessionsSnapshot.empty) {
      console.log('No sessions to remind for tomorrow')
      return { sent: 0 }
    }

    let sent = 0
    let failed = 0

    for (const sessionDoc of sessionsSnapshot.docs) {
      const session = sessionDoc.data()

      try {
        // Get user data
        const userDoc = await getDoc(doc(db, 'users', session.userId))
        const user = userDoc.data()

        if (!user || !user.email) {
          console.warn('User not found or no email:', session.userId)
          failed++
          continue
        }

        // Get mentor data
        const mentorDoc = await getDoc(doc(db, 'users', session.mentorId))
        const mentor = mentorDoc.data()

        if (!mentor) {
          console.warn('Mentor not found:', session.mentorId)
          failed++
          continue
        }

        const mentorName = `${mentor.firstName || ''} ${mentor.lastName || ''}`.trim()

        // Format date and time
        const sessionDate = session.startTime.toDate()
        const dateStr = format(sessionDate, 'd. MMMM yyyy', { locale: de })
        const timeStr = format(sessionDate, 'HH:mm', { locale: de })
        const endTimeStr = format(
          new Date(sessionDate.getTime() + 60 * 60 * 1000),
          'HH:mm',
          { locale: de }
        )

        // Send reminder
        await sendSessionReminderEmail({
          email: user.email,
          firstName: user.firstName || 'Teilnehmer',
          mentorName,
          date: dateStr,
          time: `${timeStr} - ${endTimeStr}`,
          meetingLink: session.meetingLink,
          meetingType: session.meetingType || 'online',
        })

        sent++
        console.log(`✅ Reminder sent to ${user.email}`)
      } catch (error) {
        console.error('Error sending reminder for session:', sessionDoc.id, error)
        failed++
      }
    }

    console.log(`✅ Session reminder job complete. Sent: ${sent}, Failed: ${failed}`)
    return { sent, failed }
  } catch (error) {
    console.error('Error in session reminder job:', error)
    throw error
  }
}

/**
 * Send follow-up emails for completed sessions
 * Should be run daily
 */
export async function sendSessionFollowups() {
  try {
    console.log('📧 Running session follow-up job...')

    // Get sessions completed yesterday that haven't had follow-up sent
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(0, 0, 0, 0)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const sessionsQuery = query(
      collection(db, 'sessions'),
      where('status', '==', 'completed'),
      where('completedAt', '>=', Timestamp.fromDate(yesterday)),
      where('completedAt', '<', Timestamp.fromDate(today)),
      where('followupSent', '==', false)
    )

    const sessionsSnapshot = await getDocs(sessionsQuery)

    console.log(`Found ${sessionsSnapshot.size} sessions for follow-up`)

    // TODO: Implement follow-up email template and sending logic

    return { sent: 0 }
  } catch (error) {
    console.error('Error in session follow-up job:', error)
    throw error
  }
}
