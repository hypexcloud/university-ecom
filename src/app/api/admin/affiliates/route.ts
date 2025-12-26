import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase/config'
import { collection, getDocs, query, where } from 'firebase/firestore'

export async function GET(request: NextRequest) {
  try {
    // Get all affiliates (users with affiliate role)
    const usersQuery = query(
      collection(db, 'users'),
      where('role', '==', 'affiliate')
    )
    const usersSnapshot = await getDocs(usersQuery)
    const affiliates = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // Get all applications
    const applicationsSnapshot = await getDocs(collection(db, 'affiliateApplications'))
    const applications = applicationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // Get all commissions
    const commissionsSnapshot = await getDocs(collection(db, 'commissions'))
    const commissions = commissionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json({
      affiliates,
      applications,
      commissions
    })
  } catch (error: any) {
    console.error('Error getting affiliate data:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
