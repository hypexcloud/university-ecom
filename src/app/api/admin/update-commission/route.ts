import { NextRequest, NextResponse } from 'next/server'
import { updateCommissionStatus } from '@/lib/affiliate-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { commissionId, affiliateId, amount, status } = body

    if (!commissionId || !affiliateId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const result = await updateCommissionStatus(
      commissionId,
      status,
      affiliateId,
      amount
    )

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Commission updated'
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to update commission' },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Error updating commission:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
