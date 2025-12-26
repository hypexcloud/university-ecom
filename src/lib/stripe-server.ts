/**
 * Server-side Stripe Instance
 * 
 * This file initializes and exports the Stripe instance for server-side use only.
 * DO NOT import this in client-side code - use lib/stripe.ts instead.
 */

import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

/**
 * Stripe instance for server-side operations
 * Configured with API version 2024-12-18.acacia
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
  appInfo: {
    name: 'University Ecom',
    version: '1.0.0',
    url: 'https://university-ecom.com'
  }
})

/**
 * Create a payment intent for a course purchase
 */
export async function createPaymentIntent(params: {
  amount: number // in cents
  currency: string
  metadata: Record<string, string>
  customerEmail?: string
  description?: string
}): Promise<Stripe.PaymentIntent> {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(params.amount * 100), // Convert to cents
      currency: params.currency.toLowerCase(),
      metadata: params.metadata,
      receipt_email: params.customerEmail,
      description: params.description || 'University Ecom Course Purchase',
      automatic_payment_methods: {
        enabled: true
      }
    })
    
    return paymentIntent
  } catch (error) {
    console.error('Error creating payment intent:', error)
    throw error
  }
}

/**
 * Retrieve a payment intent
 */
export async function retrievePaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  try {
    return await stripe.paymentIntents.retrieve(paymentIntentId)
  } catch (error) {
    console.error('Error retrieving payment intent:', error)
    throw error
  }
}

/**
 * Create or retrieve a Stripe customer
 */
export async function createOrRetrieveCustomer(params: {
  email: string
  name?: string
  phone?: string
  metadata?: Record<string, string>
}): Promise<Stripe.Customer> {
  try {
    // Try to find existing customer by email
    const existingCustomers = await stripe.customers.list({
      email: params.email,
      limit: 1
    })
    
    if (existingCustomers.data.length > 0) {
      return existingCustomers.data[0]
    }
    
    // Create new customer if not found
    return await stripe.customers.create({
      email: params.email,
      name: params.name,
      phone: params.phone,
      metadata: params.metadata || {}
    })
  } catch (error) {
    console.error('Error creating/retrieving customer:', error)
    throw error
  }
}

/**
 * Create a refund for a payment
 */
export async function createRefund(
  paymentIntentId: string,
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
): Promise<Stripe.Refund> {
  try {
    return await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason
    })
  } catch (error) {
    console.error('Error creating refund:', error)
    throw error
  }
}

/**
 * Construct webhook event from request
 * Used to verify webhook signatures
 */
export async function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Promise<Stripe.Event> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  
  if (!webhookSecret) {
    throw new Error('Missing STRIPE_WEBHOOK_SECRET')
  }
  
  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  } catch (error) {
    console.error('Error constructing webhook event:', error)
    throw error
  }
}
