import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { db } from '@/lib/server/db'
import { notifications } from '@/lib/server/db/schema'
import { eq, desc } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { Bell } from 'lucide-react'
import Link from 'next/link'

export default async function NotificationsFullPage() {
  const user = await requireAuth()

  const items = await db
    .select()
    .from(notifications)
    .where(eq(notifications.recipientUid, user.uid))
    .orderBy(desc(notifications.createdAt))
    .limit(50)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Benachrichtigungen</h1>
      <Card>
        <CardHeader><CardTitle>Alle Benachrichtigungen ({items.length})</CardTitle></CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
              <p className="text-muted-foreground">Keine Benachrichtigungen.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((n) => (
                <Link key={n.id} href={n.link || '#'} className={`block border rounded-lg p-3 hover:bg-accent transition-colors ${!n.readAt ? 'bg-blue-50/50 border-blue-200' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium">{n.title}</p>
                      {n.body && <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      {!n.readAt && <Badge variant="default" className="text-xs">Neu</Badge>}
                      <span className="text-xs text-muted-foreground">{n.createdAt.toLocaleDateString('de-DE')}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
