import { NextRequest, NextResponse } from 'next/server'
import { getStudentProgress, completeResource, completeModule } from '@/lib/course-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { progressId, resourceId, moduleId } = body

    if (!progressId || !resourceId) {
      return NextResponse.json(
        { error: 'Progress ID and resource ID are required' },
        { status: 400 }
      )
    }

    // Get current progress
    const { db } = await import('@/lib/firebase/config')
    const { doc, getDoc } = await import('firebase/firestore')
    
    const progressDoc = await getDoc(doc(db, 'studentProgress', progressId))
    
    if (!progressDoc.exists()) {
      return NextResponse.json(
        { error: 'Progress not found' },
        { status: 404 }
      )
    }

    const currentProgress = {
      id: progressDoc.id,
      ...progressDoc.data(),
    } as any

    // Mark resource as completed
    await completeResource(progressId, resourceId, currentProgress)

    // Check if all required resources in the module are completed
    if (moduleId) {
      const { getModuleResources } = await import('@/lib/course-utils')
      const resources = await getModuleResources(moduleId)
      const requiredResources = resources.filter(r => r.isRequired)
      
      const allRequiredCompleted = requiredResources.every(r => 
        currentProgress.resourcesCompleted.includes(r.id) || r.id === resourceId
      )

      // If all required resources are completed, mark module as completed
      if (allRequiredCompleted && !currentProgress.modulesCompleted.includes(moduleId)) {
        await completeModule(progressId, moduleId, currentProgress)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Resource marked as completed',
    })
  } catch (error: any) {
    console.error('Error completing resource:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
