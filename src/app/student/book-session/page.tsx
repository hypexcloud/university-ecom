import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/lib/server/db'
import { availability, customers } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { Calendar } from 'lucide-react'
import Link from 'next/link'

export default async function BookSessionPage() {
  await requireAuth()

  // Get all mentors' availability
  const slots = await db
    .select({
      mentorUid: availability.mentorUid,
      dayOfWeek: availability.dayOfWeek,
      startTime: availability.startTime,
      endTime: availability.endTime,
      mentorFirstName: customers.firstName,
      mentorLastName: customers.lastName,
    })
    .from(availability)
    .innerJoin(customers, eq(availability.mentorUid, customers.uid))
    .where(eq(availability.isActive, true))

  const mentors = [...new Map(slots.map((s) => [s.mentorUid, { uid: s.mentorUid, name: `${s.mentorFirstName} ${s.mentorLastName}` }])).values()]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Session buchen</h1>

      {mentors.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
            <p className="text-muted-foreground">Aktuell sind keine Termine verfügbar.</p>
            <p className="text-sm text-muted-foreground mt-2">Bitte kontaktiere den <Link href="/student/support" className="text-primary hover:underline">Support</Link>.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <p className="text-muted-foreground">Verfügbare Mentoren und ihre Zeiten:</p>

          {mentors.map((mentor) => {
            const mentorSlots = slots.filter((s) => s.mentorUid === mentor.uid)
            const days = [...new Set(mentorSlots.map((s) => s.dayOfWeek))]

            return (
              <Card key={mentor.uid}>
                <CardHeader>
                  <CardTitle>{mentor.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 md:grid-cols-3">
                    {days.map((day) => {
                      const daySlots = mentorSlots.filter((s) => s.dayOfWeek === day)
                      return (
                        <div key={day} className="border rounded-lg p-3">
                          <p className="font-medium capitalize mb-1">{day}</p>
                          {daySlots.map((s, i) => (
                            <p key={i} className="text-sm text-muted-foreground">{s.startTime} – {s.endTime}</p>
                          ))}
                        </div>
                      )
                    })}
                  </div>
                  <p className="text-sm text-muted-foreground mt-3">
                    Um einen Termin zu buchen, erstelle bitte ein <Link href="/student/support" className="text-primary hover:underline">Support-Ticket</Link> mit deinem Wunschtermin.
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </>
      )}
    </div>
  )
}
