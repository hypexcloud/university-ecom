import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { db } from '@/lib/server/db'
import { customers } from '@/lib/server/db/schema'
import { ilike, or, desc } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>
}

export default async function BenutzerPage({ searchParams }: Props) {
  await requireAdmin('customers')
  const { q, page } = await searchParams
  const currentPage = parseInt(page || '1', 10)
  const perPage = 25
  const offset = (currentPage - 1) * perPage

  const whereClause = q
    ? or(
        ilike(customers.email, `%${q}%`),
        ilike(customers.firstName, `%${q}%`),
        ilike(customers.lastName, `%${q}%`),
        ilike(customers.discordUsername, `%${q}%`),
      )
    : undefined

  const rows = await db
    .select()
    .from(customers)
    .where(whereClause)
    .orderBy(desc(customers.createdAt))
    .limit(perPage)
    .offset(offset)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Benutzer</h1>
      </div>

      <form className="max-w-md">
        <Input
          name="q"
          placeholder="Suche nach E-Mail, Name, Discord..."
          defaultValue={q || ''}
        />
      </form>

      <Card>
        <CardHeader>
          <CardTitle>Kundenliste</CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-muted-foreground">Keine Kunden gefunden.</p>
          ) : (
            <div className="space-y-2">
              {rows.map((row) => (
                <Link
                  key={row.uid}
                  href={`/admin/benutzer/${row.uid}`}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium">
                      {row.firstName} {row.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{row.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {row.discordUsername && (
                      <span className="text-xs text-muted-foreground">
                        {row.discordUsername}
                      </span>
                    )}
                    <Badge variant={row.status === 'active' ? 'default' : 'destructive'}>
                      {row.status}
                    </Badge>
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
