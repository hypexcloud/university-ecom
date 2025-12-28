import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase/config'
import { deleteDoc, doc } from 'firebase/firestore'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resourceId = params.id

    await deleteDoc(doc(db, 'courseResources', resourceId))

    return NextResponse.json({
      success: true,
      message: 'Resource deleted',
    })
  } catch (error: any) {
    console.error('Error deleting course resource:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
