import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { db } from '@/lib/server/db'
import { customers } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { CreatorBriefingForm } from '../briefing-form'
import { FileText } from 'lucide-react'

export default async function BriefingPage() {
  const user = await requireAuth()

  const [customer] = await db
    .select({ billing: customers.billing })
    .from(customers)
    .where(eq(customers.uid, user.uid))
    .limit(1)

  const briefing = (customer?.billing as Record<string, unknown>)?.creatorBriefing as Record<string, string> | null

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold">Briefing</h1>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Creator-Briefing</CardTitle>
            {briefing && <Badge variant="default">Eingereicht</Badge>}
          </div>
        </CardHeader>
        <CardContent>
          {briefing ? (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-muted-foreground">Name</span><p className="font-medium">{briefing.vorname} {briefing.nachname}</p></div>
                <div><span className="text-muted-foreground">Social Link</span><p className="font-medium break-all">{briefing.socialLink}</p></div>
                <div><span className="text-muted-foreground">Nische</span><p className="font-medium">{briefing.nische}</p></div>
                <div><span className="text-muted-foreground">Follower</span><p className="font-medium">{briefing.follower}</p></div>
                <div><span className="text-muted-foreground">Views</span><p className="font-medium">{briefing.views}</p></div>
              </div>
              <div><span className="text-muted-foreground">Ziele</span><p>{briefing.ziele}</p></div>
              <div><span className="text-muted-foreground">Probleme</span><p>{briefing.probleme}</p></div>
              <div><span className="text-muted-foreground">Erfahrungen</span><p>{briefing.erfahrungen}</p></div>
              <p className="text-xs text-muted-foreground">Eingereicht am: {briefing.submittedAt}</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                Bitte fülle das Briefing aus, damit wir uns optimal auf dein erstes Gespräch vorbereiten können.
              </p>
              <CreatorBriefingForm />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
