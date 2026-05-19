import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/server/db'
import { products, plans } from '@/lib/server/db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '@/lib/server/auth'
import { verifyCsrf } from '@/lib/server/csrf'
import { z } from 'zod'

export async function GET() {
  try {
    await requireAdmin('products')

    const allProducts = await db.select().from(products)
    const allPlans = await db.select().from(plans)

    const result = allProducts.map((p) => ({
      ...p,
      plans: allPlans.filter((pl) => pl.productId === p.id),
    }))

    return NextResponse.json({ products: result })
  } catch (error) {
    if (error instanceof Response) return error
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

const createSchema = z.object({
  kind: z.enum(['course', 'creator', 'giftcard', 'addon']),
  slug: z.string().min(1).max(50),
  title: z.string().min(1).max(200),
})

export async function POST(request: NextRequest) {
  try {
    if (!verifyCsrf(request)) return NextResponse.json({ error: 'CSRF' }, { status: 403 })
    await requireAdmin('products')
    const data = createSchema.parse(await request.json())

    const [product] = await db.insert(products).values({
      kind: data.kind,
      slug: data.slug,
      title: data.title,
    }).returning()

    return NextResponse.json({ success: true, product }, { status: 201 })
  } catch (error) {
    if (error instanceof Response) return error
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Ungültige Eingabedaten' }, { status: 400 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
