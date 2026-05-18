import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { db } from '@/lib/server/db'
import { customers } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { MessageCircle } from 'lucide-react'

export default async function DiscordPage() {
  const user = await requireAuth()
  const [customer] = await db.select().from(customers).where(eq(customers.uid, user.uid)).limit(1)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Discord</h1>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><MessageCircle className="h-5 w-5" /> Discord-Verknüpfung</CardTitle></CardHeader>
        <CardContent>
          {customer?.discordUserId ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Badge variant="default">Verbunden</Badge>
                <span className="font-medium">{customer.discordUsername}</span>
              </div>
              <p className="text-sm text-muted-foreground">Deine Discord-Rollen werden automatisch synchronisiert.</p>
              <Button variant="outline" size="sm" asChild><a href="/api/auth/discord">Erneut verbinden</a></Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Verbinde dein Discord-Konto, um automatisch deine Rollen im Server zu erhalten und Benachrichtigungen per DM zu bekommen.</p>
              <Button asChild><a href="/api/auth/discord">Discord verbinden</a></Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
