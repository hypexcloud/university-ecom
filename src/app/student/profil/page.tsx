import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/server/db'
import { customers } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { ProfileEditForm } from './profile-edit-form'

export default async function ProfilPage() {
  const user = await requireAuth()
  const [customer] = await db.select().from(customers).where(eq(customers.uid, user.uid)).limit(1)
  if (!customer) return null

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Persönliche Daten</CardTitle></CardHeader>
        <CardContent>
          <ProfileEditForm customer={{
            firstName: customer.firstName,
            lastName: customer.lastName,
            discordUsername: customer.discordUsername || '',
            whatsapp: customer.whatsapp || '',
          }} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Kontoinformationen</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">E-Mail</span><span>{customer.email}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="capitalize">{customer.status}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Registriert</span><span>{customer.createdAt.toLocaleDateString('de-DE')}</span></div>
        </CardContent>
      </Card>
    </div>
  )
}
