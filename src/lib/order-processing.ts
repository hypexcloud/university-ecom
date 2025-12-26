/**
 * Order Processing Utilities
 * 
 * Handles order creation, kunde account creation, and post-payment processing
 */

import { db, auth } from './firebase/config'
import { 
  collection, 
  addDoc, 
  doc, 
  setDoc, 
  getDoc,
  updateDoc,
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import type { Order, User, Enrollment } from './types'
import { CourseType, PlanType } from './stripe'

interface CreateOrderParams {
  // Customer info
  email: string
  firstName: string
  lastName: string
  phone: string
  address: {
    street: string
    zipCode: string
    city: string
    country: string
  }
  
  // Course info
  course: CourseType
  plan: PlanType
  
  // Payment info
  paymentIntentId: string
  amount: number
  currency: string
  
  // Optional
  discord?: string
  birthDate?: string
  leadSource?: string
  affiliateId?: string
  acceptNewsletter?: boolean
}

/**
 * Generate order number
 */
function generateOrderNumber(): string {
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `UE-${timestamp.slice(-8)}${random}`
}

/**
 * Generate temporary password
 */
function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let password = ''
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

/**
 * Create or get existing user
 */
async function createOrGetUser(params: CreateOrderParams): Promise<{ userId: string; isNewUser: boolean; tempPassword?: string }> {
  try {
    // Check if user exists
    const usersRef = collection(db, 'users')
    const userSnapshot = await getDoc(doc(usersRef, params.email))
    
    if (userSnapshot.exists()) {
      return { 
        userId: userSnapshot.id, 
        isNewUser: false 
      }
    }
    
    // Create new user account
    const tempPassword = generateTempPassword()
    
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        params.email,
        tempPassword
      )
      
      const userId = userCredential.user.uid
      
      // Create user document
      const userData: Partial<User> = {
        uid: userId,
        email: params.email,
        role: 'kunde',
        firstName: params.firstName,
        lastName: params.lastName,
        phone: params.phone,
        discord: params.discord,
        address: params.address,
        birthDate: params.birthDate ? Timestamp.fromDate(new Date(params.birthDate)) : undefined,
        kundeData: {
          enrolledCourses: [],
          totalSpent: params.amount,
          preferences: {
            language: 'de',
            notifications: {
              email: true,
              whatsapp: true,
              discord: !!params.discord
            }
          }
        },
        leadSource: params.leadSource ? {
          type: params.leadSource as any,
          affiliateId: params.affiliateId,
          timestamp: Timestamp.now(),
        } : undefined,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        version: 1
      }
      
      await setDoc(doc(db, 'users', userId), userData)
      
      return { 
        userId, 
        isNewUser: true,
        tempPassword 
      }
    } catch (authError: any) {
      // If user already exists in auth but not in Firestore
      if (authError.code === 'auth/email-already-in-use') {
        // Get user from auth
        const usersSnapshot = await getDoc(doc(usersRef, params.email))
        if (usersSnapshot.exists()) {
          return { 
            userId: usersSnapshot.id, 
            isNewUser: false 
          }
        }
      }
      throw authError
    }
  } catch (error) {
    console.error('Error creating/getting user:', error)
    throw error
  }
}

/**
 * Create order in Firestore
 */
async function createOrder(params: CreateOrderParams, userId: string): Promise<string> {
  try {
    const orderNumber = generateOrderNumber()
    
    const orderData: Partial<Order> = {
      orderNumber,
      userId,
      items: [{
        type: 'course',
        courseId: params.course,
        planId: params.plan,
        name: `${params.course === 'ai' ? 'AI Automatisierung' : 'EU Dropshipping'} - ${params.plan}`,
        quantity: 1,
        price: params.amount
      }],
      subtotal: params.amount,
      tax: params.amount * 0.19, // 19% VAT
      total: params.amount * 1.19,
      currency: params.currency.toUpperCase() as 'EUR',
      paymentMethod: 'stripe',
      paymentStatus: 'completed',
      paymentId: params.paymentIntentId,
      invoiceGenerated: false,
      billingAddress: params.address,
      affiliateId: params.affiliateId,
      commissionDue: params.affiliateId ? params.amount * 0.1 : 0, // 10% default
      commissionRate: params.affiliateId ? 0.1 : 0,
      commissionPaid: false,
      erstgespraechRequested: true,
      status: 'confirmed',
      accessGranted: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
    
    const orderRef = await addDoc(collection(db, 'orders'), orderData)
    
    return orderRef.id
  } catch (error) {
    console.error('Error creating order:', error)
    throw error
  }
}

/**
 * Create course enrollment
 */
async function createEnrollment(
  userId: string, 
  orderId: string,
  course: CourseType,
  plan: PlanType,
  amount: number
): Promise<string> {
  try {
    const duration = course === 'ai' ? 90 : 60 // days
    const startDate = Timestamp.now()
    const endDate = Timestamp.fromDate(
      new Date(Date.now() + duration * 24 * 60 * 60 * 1000)
    )
    
    const enrollmentData: Partial<Enrollment> = {
      userId,
      courseId: course,
      courseType: course,
      planType: plan,
      orderId,
      status: 'active',
      progress: {
        currentWeek: 1,
        currentModule: 0,
        completedModules: [],
        totalProgress: 0,
        lastAccessedAt: Timestamp.now()
      },
      startDate,
      endDate,
      purchaseDetails: {
        amount,
        currency: 'EUR',
        paymentMethod: 'stripe',
        transactionId: orderId,
        purchaseDate: Timestamp.now()
      },
      accessDetails: {
        whatsappAccess: true,
        discordAccess: true,
        mentoringSessionsRemaining: plan === 'fast' ? 0 : plan === 'business' ? 3 : 999
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    }
    
    const enrollmentRef = await addDoc(collection(db, 'enrollments'), enrollmentData)
    
    // Update user's enrolled courses
    await updateDoc(doc(db, 'users', userId), {
      'kundeData.enrolledCourses': [enrollmentRef.id],
      'kundeData.lastPurchaseDate': Timestamp.now(),
      updatedAt: Timestamp.now()
    })
    
    return enrollmentRef.id
  } catch (error) {
    console.error('Error creating enrollment:', error)
    throw error
  }
}

/**
 * Send welcome email (placeholder - implement with your email service)
 */
async function sendWelcomeEmail(
  email: string,
  firstName: string,
  tempPassword?: string
): Promise<void> {
  try {
    // TODO: Implement email sending with SendGrid/Resend
    console.log('Sending welcome email to:', email)
    console.log('Temporary password:', tempPassword)
    
    // For now, just log
    // In production, integrate with email service
  } catch (error) {
    console.error('Error sending welcome email:', error)
    // Don't throw - email failure shouldn't fail the order
  }
}

/**
 * Main function: Process complete order
 */
export async function processOrder(params: CreateOrderParams): Promise<{
  success: boolean
  orderId: string
  userId: string
  enrollmentId: string
  isNewUser: boolean
  tempPassword?: string
  error?: string
}> {
  try {
    // 1. Create or get user
    const { userId, isNewUser, tempPassword } = await createOrGetUser(params)
    
    // 2. Create order
    const orderId = await createOrder(params, userId)
    
    // 3. Create enrollment
    const enrollmentId = await createEnrollment(
      userId,
      orderId,
      params.course,
      params.plan,
      params.amount
    )
    
    // 4. Update order with enrollment ID
    await updateDoc(doc(db, 'orders', orderId), {
      courseEnrollmentId: enrollmentId,
      accessGranted: true,
      accessGrantedAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    })
    
    // 5. Send welcome email
    await sendWelcomeEmail(params.email, params.firstName, tempPassword)
    
    // 6. TODO: Generate invoice PDF
    // 7. TODO: Add to WhatsApp/Discord groups
    
    return {
      success: true,
      orderId,
      userId,
      enrollmentId,
      isNewUser,
      tempPassword: isNewUser ? tempPassword : undefined
    }
  } catch (error: any) {
    console.error('Error processing order:', error)
    return {
      success: false,
      orderId: '',
      userId: '',
      enrollmentId: '',
      isNewUser: false,
      error: error.message
    }
  }
}
