import { NextRequest, NextResponse } from 'next/server'
import { createPaymentIntent } from '@/lib/stripe-server'
import { calculateTotal } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, metadata, customerEmail } = body

    if (!amount || !currency) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, currency' },
        { status: 400 }
      )
    }

    // Calculate total with VAT
    const totalAmount = calculateTotal(amount)

    // Create payment intent
    const paymentIntent = await createPaymentIntent({
      amount: totalAmount,
      currency: currency || 'EUR',
      metadata: metadata || {},
      customerEmail,
      description: `University Ecom - ${metadata?.courseName} - ${metadata?.planName}`
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    })
  } catch (error: any) {
    console.error('Error creating payment intent:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
