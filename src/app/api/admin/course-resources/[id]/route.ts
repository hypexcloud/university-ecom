import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase/config'
import { deleteDoc, doc } from 'firebase/firestore'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: resourceId } = await params

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
