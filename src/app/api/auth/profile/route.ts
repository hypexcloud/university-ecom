import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { customers } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  const uid = request.nextUrl.searchParams.get('uid')
  if (!uid) {
    return NextResponse.json({ error: 'uid required' }, { status: 400 })
  }

  const [customer] = await db
    .select({
      uid: customers.uid,
      email: customers.email,
      firstName: customers.firstName,
      lastName: customers.lastName,
      discordUsername: customers.discordUsername,
      whatsapp: customers.whatsapp,
      status: customers.status,
    })
    .from(customers)
    .where(eq(customers.uid, uid))
    .limit(1)

  if (!customer) {
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }

  return NextResponse.json(customer)
}
