import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/lib/server/db'
import { giftcards } from '@/lib/server/db/schema'
import { eq, or } from 'drizzle-orm'
import { requireAuth } from '@/lib/server/auth'
import { GiftcardCode } from '@/components/dashboard/giftcard-code'
import { EmptyState } from '@/components/dashboard/empty-state'
import { Gift } from 'lucide-react'

export default async function StudentGiftcardsPage() {
  const user = await requireAuth()

  const cards = await db
    .select()
    .from(giftcards)
    .where(eq(giftcards.buyerUid, user.uid))

  const active = cards.filter((c) => c.status === 'active' && c.balanceCents > 0)
  const used = cards.filter((c) => c.status !== 'active' || c.balanceCents === 0)

  if (cards.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Meine Gutscheine</h1>
        <EmptyState icon={Gift} title="Keine Gutscheine" description="Du hast noch keine Gutscheine." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Meine Gutscheine</h1>
      {active.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Aktive Gutscheine</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {active.map((c) => (
              <GiftcardCode key={c.id} code={c.code} balanceCents={c.balanceCents} initialCents={c.initialCents} status={c.status || 'active'} />
            ))}
          </CardContent>
        </Card>
      )}
      {used.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Eingelöste Gutscheine</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {used.map((c) => (
              <GiftcardCode key={c.id} code={c.code} balanceCents={c.balanceCents} initialCents={c.initialCents} status={c.status || 'redeemed'} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
