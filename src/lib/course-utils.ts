/**
 * Course Content Utilities
 * 
 * Functions for managing course modules, resources, and student progress
 */

import { db } from './firebase/config'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  writeBatch,
} from 'firebase/firestore'
import type {
  CourseModule,
  CourseResource,
  StudentProgress,
  Quiz,
  QuizAttempt,
  Certificate,
} from './course-types'

/**
 * Get all modules for a course
 */
export async function getCourseModules(courseType: 'ai' | 'dropshipping'): Promise<CourseModule[]> {
  try {
    const modulesQuery = query(
      collection(db, 'courseModules'),
      where('courseType', '==', courseType),
      where('status', '==', 'published'),
      orderBy('order', 'asc')
    )

    const snapshot = await getDocs(modulesQuery)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as CourseModule[]
  } catch (error) {
    console.error('Error getting course modules:', error)
    return []
  }
}

/**
 * Get resources for a module
 */
export async function getModuleResources(moduleId: string): Promise<CourseResource[]> {
  try {
    const resourcesQuery = query(
      collection(db, 'courseResources'),
      where('moduleId', '==', moduleId),
      orderBy('order', 'asc')
    )

    const snapshot = await getDocs(resourcesQuery)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as CourseResource[]
  } catch (error) {
    console.error('Error getting module resources:', error)
    return []
  }
}

/**
 * Get student progress
 */
export async function getStudentProgress(
  userId: string,
  enrollmentId: string
): Promise<StudentProgress | null> {
  try {
    const progressQuery = query(
      collection(db, 'studentProgress'),
      where('userId', '==', userId),
      where('enrollmentId', '==', enrollmentId)
    )

    const snapshot = await getDocs(progressQuery)

    if (snapshot.empty) {
      return null
    }

    return {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data(),
    } as StudentProgress
  } catch (error) {
    console.error('Error getting student progress:', error)
    return null
  }
}

/**
 * Initialize student progress for new enrollment
 */
export async function initializeStudentProgress(
  userId: string,
  enrollmentId: string,
  courseId: string,
  courseType: 'ai' | 'dropshipping'
): Promise<string> {
  try {
    const progressData: Omit<StudentProgress, 'id'> = {
      userId,
      enrollmentId,
      courseId,
      courseType,
      overallCompletion: 0,
      currentWeek: 1,
      modulesCompleted: [],
      modulesInProgress: [],
      modulesUnlocked: [],
      resourcesCompleted: [],
      videosWatched: [],
      sessionsCompleted: 0,
      totalSessions: courseType === 'ai' ? 6 : 4, // Default totals
      quizzesCompleted: [],
      quizScores: [],
      startedAt: Timestamp.now(),
      lastAccessedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    const docRef = await addDoc(collection(db, 'studentProgress'), progressData)
    return docRef.id
  } catch (error) {
    console.error('Error initializing student progress:', error)
    throw error
  }
}

/**
 * Update student progress
 */
export async function updateStudentProgress(
  progressId: string,
  updates: Partial<StudentProgress>
): Promise<void> {
  try {
    await updateDoc(doc(db, 'studentProgress', progressId), {
      ...updates,
      updatedAt: Timestamp.now(),
      lastAccessedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error('Error updating student progress:', error)
    throw error
  }
}

/**
 * Mark module as completed
 */
export async function completeModule(
  progressId: string,
  moduleId: string,
  currentProgress: StudentProgress
): Promise<void> {
  try {
    const modulesCompleted = [...currentProgress.modulesCompleted]
    if (!modulesCompleted.includes(moduleId)) {
      modulesCompleted.push(moduleId)
    }

    const modulesInProgress = currentProgress.modulesInProgress.filter(id => id !== moduleId)

    // Get all modules to calculate completion
    const modules = await getCourseModules(currentProgress.courseType)
    const overallCompletion = Math.round((modulesCompleted.length / modules.length) * 100)

    await updateStudentProgress(progressId, {
      modulesCompleted,
      modulesInProgress,
      overallCompletion,
    })
  } catch (error) {
    console.error('Error completing module:', error)
    throw error
  }
}

/**
 * Mark resource as completed
 */
export async function completeResource(
  progressId: string,
  resourceId: string,
  currentProgress: StudentProgress
): Promise<void> {
  try {
    const resourcesCompleted = [...currentProgress.resourcesCompleted]
    if (!resourcesCompleted.includes(resourceId)) {
      resourcesCompleted.push(resourceId)
    }

    await updateStudentProgress(progressId, {
      resourcesCompleted,
    })
  } catch (error) {
    console.error('Error completing resource:', error)
    throw error
  }
}

/**
 * Update video watch progress
 */
export async function updateVideoProgress(
  progressId: string,
  resourceId: string,
  watchedSeconds: number,
  totalSeconds: number,
  currentProgress: StudentProgress
): Promise<void> {
  try {
    const videosWatched = [...currentProgress.videosWatched]
    const existingIndex = videosWatched.findIndex(v => v.resourceId === resourceId)

    const videoProgress = {
      resourceId,
      watchedSeconds,
      totalSeconds,
      completed: watchedSeconds >= totalSeconds * 0.9, // 90% watched = completed
      lastWatchedAt: Timestamp.now(),
    }

    if (existingIndex >= 0) {
      videosWatched[existingIndex] = videoProgress
    } else {
      videosWatched.push(videoProgress)
    }

    await updateStudentProgress(progressId, {
      videosWatched,
    })
  } catch (error) {
    console.error('Error updating video progress:', error)
    throw error
  }
}

/**
 * Check if module should be unlocked
 */
export async function checkModuleUnlock(
  moduleId: string,
  currentProgress: StudentProgress
): Promise<boolean> {
  try {
    const moduleDoc = await getDoc(doc(db, 'courseModules', moduleId))
    if (!moduleDoc.exists()) return false

    const module = moduleDoc.data() as CourseModule

    // First module is always unlocked
    if (module.week === 1) return true

    // Check if already unlocked
    if (currentProgress.modulesUnlocked.includes(moduleId)) return true

    // Check unlock conditions
    if (module.unlockConditions?.previousModulesCompleted) {
      const allPreviousCompleted = module.unlockConditions.previousModulesCompleted.every(prevId =>
        currentProgress.modulesCompleted.includes(prevId)
      )
      if (!allPreviousCompleted) return false
    }

    if (module.unlockConditions?.sessionCompleted) {
      // Check if previous week's session was completed
      // This would need session data lookup
    }

    return true
  } catch (error) {
    console.error('Error checking module unlock:', error)
    return false
  }
}

/**
 * Unlock module for student
 */
export async function unlockModule(
  progressId: string,
  moduleId: string,
  currentProgress: StudentProgress
): Promise<void> {
  try {
    const modulesUnlocked = [...currentProgress.modulesUnlocked]
    if (!modulesUnlocked.includes(moduleId)) {
      modulesUnlocked.push(moduleId)
    }

    await updateStudentProgress(progressId, {
      modulesUnlocked,
    })
  } catch (error) {
    console.error('Error unlocking module:', error)
    throw error
  }
}

/**
 * Submit quiz attempt
 */
export async function submitQuizAttempt(
  quizId: string,
  userId: string,
  enrollmentId: string,
  answers: QuizAttempt['answers'],
  timeSpent: number
): Promise<QuizAttempt> {
  try {
    // Get quiz to calculate score
    const quizDoc = await getDoc(doc(db, 'quizzes', quizId))
    if (!quizDoc.exists()) throw new Error('Quiz not found')

    const quiz = quizDoc.data() as Quiz

    // Calculate score
    let score = 0
    let maxScore = 0
    quiz.questions.forEach(q => {
      maxScore += q.points
      const answer = answers.find(a => a.questionId === q.id)
      if (answer?.correct) {
        score += q.points
      }
    })

    const passed = (score / maxScore) * 100 >= quiz.passingScore

    // Get attempt number
    const previousAttemptsQuery = query(
      collection(db, 'quizAttempts'),
      where('quizId', '==', quizId),
      where('userId', '==', userId)
    )
    const previousAttempts = await getDocs(previousAttemptsQuery)

    const attemptData: Omit<QuizAttempt, 'id'> = {
      quizId,
      userId,
      enrollmentId,
      attemptNumber: previousAttempts.size + 1,
      startedAt: Timestamp.now(),
      submittedAt: Timestamp.now(),
      timeSpent,
      score,
      maxScore,
      passed,
      answers,
    }

    const docRef = await addDoc(collection(db, 'quizAttempts'), attemptData)

    return {
      id: docRef.id,
      ...attemptData,
    }
  } catch (error) {
    console.error('Error submitting quiz attempt:', error)
    throw error
  }
}

/**
 * Generate certificate
 */
export async function generateCertificate(
  userId: string,
  enrollmentId: string,
  progress: StudentProgress
): Promise<Certificate> {
  try {
    // Get user data
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (!userDoc.exists()) throw new Error('User not found')

    const user = userDoc.data()
    const studentName = `${user.firstName} ${user.lastName}`

    // Get course name
    const courseNames = {
      ai: 'KI Automation Kurs',
      dropshipping: 'EU Dropshipping Kurs',
    }

    // Generate unique certificate number
    const certificateNumber = `UE-${progress.courseType.toUpperCase()}-${Date.now()}`

    // Generate verification code
    const verificationCode = Math.random().toString(36).substring(2, 15).toUpperCase()

    const certificateData: Omit<Certificate, 'id'> = {
      userId,
      enrollmentId,
      courseId: progress.courseId,
      courseType: progress.courseType,
      certificateNumber,
      studentName,
      courseName: courseNames[progress.courseType],
      completionDate: progress.completedAt || Timestamp.now(),
      issuedDate: Timestamp.now(),
      overallCompletion: progress.overallCompletion,
      sessionsCompleted: progress.sessionsCompleted,
      verificationCode,
      isVerified: true,
      createdAt: Timestamp.now(),
    }

    const docRef = await addDoc(collection(db, 'certificates'), certificateData)

    // Update progress to mark certificate as issued
    await updateStudentProgress(progress.id, {
      certificateIssued: true,
      certificateIssuedAt: Timestamp.now(),
    })

    return {
      id: docRef.id,
      ...certificateData,
    }
  } catch (error) {
    console.error('Error generating certificate:', error)
    throw error
  }
}

/**
 * Create course module (admin)
 */
export async function createCourseModule(
  moduleData: Omit<CourseModule, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    const data = {
      ...moduleData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    const docRef = await addDoc(collection(db, 'courseModules'), data)
    return docRef.id
  } catch (error) {
    console.error('Error creating course module:', error)
    throw error
  }
}

/**
 * Create course resource (admin)
 */
export async function createCourseResource(
  resourceData: Omit<CourseResource, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  try {
    const data = {
      ...resourceData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }

    const docRef = await addDoc(collection(db, 'courseResources'), data)
    return docRef.id
  } catch (error) {
    console.error('Error creating course resource:', error)
    throw error
  }
}

/**
 * Update course module (admin)
 */
export async function updateCourseModule(
  moduleId: string,
  updates: Partial<CourseModule>
): Promise<void> {
  try {
    await updateDoc(doc(db, 'courseModules', moduleId), {
      ...updates,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error('Error updating course module:', error)
    throw error
  }
}

/**
 * Delete course module (admin)
 */
export async function deleteCourseModule(moduleId: string): Promise<void> {
  try {
    // Delete associated resources first
    const resourcesQuery = query(
      collection(db, 'courseResources'),
      where('moduleId', '==', moduleId)
    )
    const resources = await getDocs(resourcesQuery)

    const batch = writeBatch(db)
    resources.docs.forEach(doc => {
      batch.delete(doc.ref)
    })

    // Delete module
    batch.delete(doc(db, 'courseModules', moduleId))

    await batch.commit()
  } catch (error) {
    console.error('Error deleting course module:', error)
    throw error
  }
}
