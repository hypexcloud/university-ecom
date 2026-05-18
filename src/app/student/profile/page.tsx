import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { db } from '@/lib/server/db'
import { customers } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { User, Mail, Shield, Download, Trash2 } from 'lucide-react'
import { ProfileEditForm } from './profile-edit-form'

export default async function ProfilePage() {
  const user = await requireAuth()

  const [customer] = await db
    .select()
    .from(customers)
    .where(eq(customers.uid, user.uid))
    .limit(1)

  if (!customer) return null

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Mein Profil</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Persönliche Daten</CardTitle>
        </CardHeader>
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
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" /> Kontoinformationen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">E-Mail</span>
            <span>{customer.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <Badge variant="default">{customer.status}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Discord ID</span>
            <span>{customer.discordUserId || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Registriert</span>
            <span>{customer.createdAt.toLocaleDateString('de-DE')}</span>
          </div>
        </CardContent>
      </Card>

      {/* Discord linking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Discord</CardTitle>
        </CardHeader>
        <CardContent>
          {customer.discordUserId ? (
            <p className="text-sm text-muted-foreground">Discord verbunden: <strong>{customer.discordUsername}</strong></p>
          ) : (
            <Button asChild variant="outline">
              <a href="/api/auth/discord">Discord verbinden</a>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* DSGVO actions */}
      <Card>
        <CardHeader><CardTitle>Datenschutz</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Button asChild variant="outline" size="sm">
            <a href="/api/student/data-export"><Download className="h-4 w-4 mr-2" /> Meine Daten exportieren</a>
          </Button>
          <DeletionButton />
        </CardContent>
      </Card>
    </div>
  )
}

function DeletionButton() {
  return (
    <form action="/api/student/deletion-request" method="POST">
      <Button variant="destructive" size="sm" type="submit">
        <Trash2 className="h-4 w-4 mr-2" /> Konto löschen beantragen
      </Button>
    </form>
  )
}
