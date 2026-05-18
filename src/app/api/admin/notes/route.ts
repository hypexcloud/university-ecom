import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { adminNotes, auditLog } from '@/lib/server/db/schema'
import { requireAdmin } from '@/lib/server/auth'

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAdmin('customers')
    const { customerUid, body: noteBody } = await request.json()

    if (!customerUid || !noteBody) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const [note] = await db.insert(adminNotes).values({
      customerUid,
      authorUid: admin.uid,
      body: noteBody,
    }).returning()

    await db.insert(auditLog).values({
      actorUid: admin.uid,
      action: 'note.create',
      targetType: 'customer',
      targetId: customerUid,
      after: { noteId: note.id, body: noteBody },
    })

    return NextResponse.json({ success: true, id: note.id })
  } catch (error) {
    if (error instanceof Response) return error
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
