import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase' // You'll need to create this
import { Course, Enrollment, Session, CourseModule } from './types'

// Convert Firestore Timestamp to Date
const timestampToDate = (timestamp: any): Date => {
  if (timestamp?.toDate) {
    return timestamp.toDate()
  }
  if (timestamp instanceof Date) {
    return timestamp
  }
  return new Date(timestamp)
}

/**
 * Get all active courses
 */
export async function getCourses(): Promise<Course[]> {
  try {
    const coursesRef = collection(db, 'courses')
    const q = query(coursesRef, where('isActive', '==', true))
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        ...data,
        id: doc.id,
        createdAt: timestampToDate(data.createdAt),
        updatedAt: timestampToDate(data.updatedAt),
      } as Course
    })
  } catch (error) {
    console.error('Error fetching courses:', error)
    throw error
  }
}

/**
 * Get a single course by ID
 */
export async function getCourse(courseId: string): Promise<Course | null> {
  try {
    const courseRef = doc(db, 'courses', courseId)
    const courseDoc = await getDoc(courseRef)
    
    if (!courseDoc.exists()) {
      return null
    }
    
    const data = courseDoc.data()
    return {
      ...data,
      id: courseDoc.id,
      createdAt: timestampToDate(data.createdAt),
      updatedAt: timestampToDate(data.updatedAt),
    } as Course
  } catch (error) {
    console.error('Error fetching course:', error)
    throw error
  }
}

/**
 * Get all enrollments for a user
 */
export async function getUserEnrollments(userId: string): Promise<Enrollment[]> {
  try {
    const enrollmentsRef = collection(db, 'enrollments')
    const q = query(
      enrollmentsRef,
      where('userId', '==', userId),
      where('status', '==', 'active'),
      orderBy('enrolledDate', 'desc')
    )
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        ...data,
        id: doc.id,
        enrolledDate: timestampToDate(data.enrolledDate),
        lastAccessed: data.lastAccessed ? timestampToDate(data.lastAccessed) : undefined,
        estimatedCompletionDate: data.estimatedCompletionDate ? timestampToDate(data.estimatedCompletionDate) : undefined,
        completedAt: data.completedAt ? timestampToDate(data.completedAt) : undefined,
        nextSessionDate: data.nextSessionDate ? timestampToDate(data.nextSessionDate) : undefined,
      } as Enrollment
    })
  } catch (error) {
    console.error('Error fetching enrollments:', error)
    throw error
  }
}

/**
 * Get a specific enrollment by ID
 */
export async function getEnrollment(enrollmentId: string): Promise<Enrollment | null> {
  try {
    const enrollmentRef = doc(db, 'enrollments', enrollmentId)
    const enrollmentDoc = await getDoc(enrollmentRef)
    
    if (!enrollmentDoc.exists()) {
      return null
    }
    
    const data = enrollmentDoc.data()
    return {
      ...data,
      id: enrollmentDoc.id,
      enrolledDate: timestampToDate(data.enrolledDate),
      lastAccessed: data.lastAccessed ? timestampToDate(data.lastAccessed) : undefined,
      estimatedCompletionDate: data.estimatedCompletionDate ? timestampToDate(data.estimatedCompletionDate) : undefined,
      completedAt: data.completedAt ? timestampToDate(data.completedAt) : undefined,
      nextSessionDate: data.nextSessionDate ? timestampToDate(data.nextSessionDate) : undefined,
    } as Enrollment
  } catch (error) {
    console.error('Error fetching enrollment:', error)
    throw error
  }
}

/**
 * Get enrollment with course data combined
 */
export async function getEnrollmentWithCourse(enrollmentId: string) {
  try {
    const enrollment = await getEnrollment(enrollmentId)
    if (!enrollment) {
      return null
    }
    
    const course = await getCourse(enrollment.courseId)
    if (!course) {
      return null
    }
    
    return {
      enrollment,
      course
    }
  } catch (error) {
    console.error('Error fetching enrollment with course:', error)
    throw error
  }
}

/**
 * Get all enrollments with their course data for a user
 */
export async function getUserEnrollmentsWithCourses(userId: string) {
  try {
    const enrollments = await getUserEnrollments(userId)
    
    // Fetch all courses for these enrollments
    const coursePromises = enrollments.map(enrollment => 
      getCourse(enrollment.courseId)
    )
    const courses = await Promise.all(coursePromises)
    
    // Combine enrollment with course data
    return enrollments.map((enrollment, index) => ({
      enrollment,
      course: courses[index]
    })).filter(item => item.course !== null)
  } catch (error) {
    console.error('Error fetching enrollments with courses:', error)
    throw error
  }
}

/**
 * Get course modules
 */
export async function getCourseModules(courseId: string): Promise<CourseModule[]> {
  try {
    const modulesRef = collection(db, 'courses', courseId, 'modules')
    const q = query(modulesRef, orderBy('moduleNumber', 'asc'))
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    } as CourseModule))
  } catch (error) {
    console.error('Error fetching modules:', error)
    throw error
  }
}

/**
 * Get sessions for an enrollment
 */
export async function getEnrollmentSessions(enrollmentId: string): Promise<Session[]> {
  try {
    const sessionsRef = collection(db, 'sessions')
    const q = query(
      sessionsRef,
      where('enrollmentId', '==', enrollmentId),
      orderBy('date', 'asc')
    )
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        ...data,
        id: doc.id,
        date: timestampToDate(data.date),
        createdAt: timestampToDate(data.createdAt),
        updatedAt: timestampToDate(data.updatedAt),
      } as Session
    })
  } catch (error) {
    console.error('Error fetching sessions:', error)
    throw error
  }
}

/**
 * Check if a module is unlocked for an enrollment
 * Business Plan: Modules unlock based on completed sessions
 * Fast Plan: All modules unlocked
 * Infinity Plan: All modules unlocked
 */
export async function isModuleUnlocked(
  enrollment: Enrollment,
  moduleId: string,
  course: Course
): Promise<boolean> {
  // Fast and Infinity plans: all modules unlocked
  if (enrollment.planType === 'fast' || enrollment.planType === 'infinity') {
    return true
  }
  
  // Business plan: check unlock logic
  if (enrollment.planType === 'business') {
    // First few modules always unlocked
    const module = course.modules.find(m => m.id === moduleId)
    if (!module) return false
    
    // Example: First 3 modules always unlocked, then 1 module per session
    const alwaysUnlockedCount = 3
    if (module.moduleNumber <= alwaysUnlockedCount) {
      return true
    }
    
    // Additional modules unlock based on sessions
    const completedSessions = enrollment.completedSessions || 0
    const unlockedModules = alwaysUnlockedCount + completedSessions
    
    return module.moduleNumber <= unlockedModules
  }
  
  return false
}
