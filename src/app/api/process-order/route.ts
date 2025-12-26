import { NextRequest, NextResponse } from 'next/server'
import { retrievePaymentIntent } from '@/lib/stripe-server'
import { processOrder } from '@/lib/order-processing'
import { getAffiliateByCode } from '@/lib/affiliate-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { paymentIntentId, customerData, affiliateCode } = body
    
    if (!paymentIntentId || !customerData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Verify payment intent was successful
    const paymentIntent = await retrievePaymentIntent(paymentIntentId)
    
    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json(
        { error: 'Payment not successful' },
        { status: 400 }
      )
    }
    
    // Get affiliate ID if code provided
    let affiliateId: string | undefined
    if (affiliateCode) {
      try {
        const affiliate = await getAffiliateByCode(affiliateCode)
        if (affiliate) {
          affiliateId = affiliate.id
        }
      } catch (error) {
        console.error('Error getting affiliate:', error)
        // Don't fail order if affiliate lookup fails
      }
    }
    
    // Process the order
    const result = await processOrder({
      ...customerData,
      paymentIntentId,
      amount: paymentIntent.amount / 100, // Convert from cents
      currency: paymentIntent.currency,
      affiliateId // Include affiliate ID
    })
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        orderId: result.orderId,
        userId: result.userId,
        enrollmentId: result.enrollmentId,
        isNewUser: result.isNewUser,
        tempPassword: result.tempPassword
      })
    } else {
      return NextResponse.json(
        { error: result.error || 'Order processing failed' },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Error processing order:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
