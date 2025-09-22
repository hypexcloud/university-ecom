import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  Query,
  CollectionReference
} from 'firebase/firestore'
import { db } from './config'
import { COLLECTIONS, CollectionName } from '../types'

// Generic Firestore service class
export class FirestoreService {
  
  // Create a new document with auto-generated ID
  static async create<T>(collectionName: CollectionName, data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const now = Timestamp.now()
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: now,
        updatedAt: now,
      })
      return docRef.id
    } catch (error) {
      console.error(`Error creating document in ${collectionName}:`, error)
      throw error
    }
  }

  // Create a document with a specific ID
  static async createWithId<T>(
    collectionName: CollectionName, 
    id: string, 
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  ) {
    try {
      const now = Timestamp.now()
      const docRef = doc(db, collectionName, id)
      await setDoc(docRef, {
        ...data,
        createdAt: now,
        updatedAt: now,
      })
      return id
    } catch (error) {
      console.error(`Error creating document ${id} in ${collectionName}:`, error)
      throw error
    }
  }

  // Get a document by ID
  static async getById<T>(collectionName: CollectionName, id: string): Promise<T | null> {
    try {
      const docRef = doc(db, collectionName, id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T
      }
      return null
    } catch (error) {
      console.error(`Error getting document ${id} from ${collectionName}:`, error)
      throw error
    }
  }

  // Update a document
  static async update<T>(collectionName: CollectionName, id: string, data: Partial<T>) {
    try {
      const docRef = doc(db, collectionName, id)
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      console.error(`Error updating document ${id} in ${collectionName}:`, error)
      throw error
    }
  }

  // Delete a document
  static async delete(collectionName: CollectionName, id: string) {
    try {
      const docRef = doc(db, collectionName, id)
      await deleteDoc(docRef)
    } catch (error) {
      console.error(`Error deleting document ${id} from ${collectionName}:`, error)
      throw error
    }
  }

  // Get all documents in a collection
  static async getAll<T>(collectionName: CollectionName): Promise<T[]> {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName))
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as T))
    } catch (error) {
      console.error(`Error getting all documents from ${collectionName}:`, error)
      throw error
    }
  }

  // Query documents with conditions
  static async query<T>(
    collectionName: CollectionName,
    conditions: {
      field: string
      operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'array-contains-any' | 'in' | 'not-in'
      value: any
    }[],
    orderByField?: string,
    orderDirection: 'asc' | 'desc' = 'desc',
    limitCount?: number
  ): Promise<T[]> {
    try {
      let q: Query | CollectionReference = collection(db, collectionName)
      
      // Add where conditions
      conditions.forEach(condition => {
        q = query(q, where(condition.field, condition.operator, condition.value))
      })

      // Add ordering
      if (orderByField) {
        q = query(q, orderBy(orderByField, orderDirection))
      }

      // Add limit
      if (limitCount) {
        q = query(q, limit(limitCount))
      }

      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as T))
    } catch (error) {
      console.error(`Error querying ${collectionName}:`, error)
      throw error
    }
  }

  // Paginated query
  static async paginatedQuery<T>(
    collectionName: CollectionName,
    conditions: {
      field: string
      operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'array-contains-any' | 'in' | 'not-in'
      value: any
    }[] = [],
    orderByField: string = 'createdAt',
    orderDirection: 'asc' | 'desc' = 'desc',
    limitCount: number = 10,
    lastDoc?: QueryDocumentSnapshot
  ): Promise<{ data: T[], lastDoc: QueryDocumentSnapshot | null, hasMore: boolean }> {
    try {
      let q: Query | CollectionReference = collection(db, collectionName)
      
      // Add where conditions
      conditions.forEach(condition => {
        q = query(q, where(condition.field, condition.operator, condition.value))
      })

      // Add ordering
      q = query(q, orderBy(orderByField, orderDirection))

      // Add pagination
      if (lastDoc) {
        q = query(q, startAfter(lastDoc))
      }

      // Add limit + 1 to check if there are more documents
      q = query(q, limit(limitCount + 1))

      const querySnapshot = await getDocs(q)
      const docs = querySnapshot.docs

      // Check if there are more documents
      const hasMore = docs.length > limitCount
      const data = docs.slice(0, limitCount).map(doc => ({
        id: doc.id,
        ...doc.data()
      } as T))

      const newLastDoc = data.length > 0 ? docs[data.length - 1] : null

      return {
        data,
        lastDoc: newLastDoc,
        hasMore
      }
    } catch (error) {
      console.error(`Error in paginated query for ${collectionName}:`, error)
      throw error
    }
  }
}

// Specific service functions for common operations

// User Services
export const UserService = {
  // Create user with their UID as the document ID
  async createUser(userData: any) {
    // Extract uid from userData and use it as document ID
    const { uid, ...dataWithoutUid } = userData
    if (!uid) {
      throw new Error('User UID is required for user creation')
    }
    return FirestoreService.createWithId(COLLECTIONS.USERS, uid, dataWithoutUid)
  },

  async getUserById(uid: string) {
    return FirestoreService.getById(COLLECTIONS.USERS, uid)
  },

  async updateUser(uid: string, userData: any) {
    return FirestoreService.update(COLLECTIONS.USERS, uid, userData)
  },

  async getUserByEmail(email: string) {
    const users = await FirestoreService.query(
      COLLECTIONS.USERS,
      [{ field: 'email', operator: '==', value: email }],
      'createdAt',
      'desc',
      1
    )
    return users.length > 0 ? users[0] : null
  }
}

// Enrollment Services
export const EnrollmentService = {
  async createEnrollment(enrollmentData: any) {
    return FirestoreService.create(COLLECTIONS.ENROLLMENTS, enrollmentData)
  },

  async getUserEnrollments(userId: string) {
    return FirestoreService.query(
      COLLECTIONS.ENROLLMENTS,
      [{ field: 'userId', operator: '==', value: userId }],
      'createdAt',
      'desc'
    )
  },

  async getActiveEnrollments(userId: string) {
    return FirestoreService.query(
      COLLECTIONS.ENROLLMENTS,
      [
        { field: 'userId', operator: '==', value: userId },
        { field: 'status', operator: '==', value: 'active' }
      ],
      'createdAt',
      'desc'
    )
  },

  async updateProgress(enrollmentId: string, progress: any) {
    return FirestoreService.update(COLLECTIONS.ENROLLMENTS, enrollmentId, { progress })
  }
}

// Course Services
export const CourseService = {
  async getAllCourses() {
    return FirestoreService.query(
      COLLECTIONS.COURSES,
      [{ field: 'isActive', operator: '==', value: true }],
      'createdAt',
      'asc'
    )
  },

  async getCourseByType(courseType: string) {
    const courses = await FirestoreService.query(
      COLLECTIONS.COURSES,
      [
        { field: 'type', operator: '==', value: courseType },
        { field: 'isActive', operator: '==', value: true }
      ],
      'createdAt',
      'desc',
      1
    )
    return courses.length > 0 ? courses[0] : null
  }
}

// Support Services
export const SupportService = {
  async createTicket(ticketData: any) {
    return FirestoreService.create(COLLECTIONS.SUPPORT_TICKETS, ticketData)
  },

  async getUserTickets(userId: string) {
    return FirestoreService.query(
      COLLECTIONS.SUPPORT_TICKETS,
      [{ field: 'userId', operator: '==', value: userId }],
      'createdAt',
      'desc'
    )
  },

  async getOpenTickets() {
    return FirestoreService.query(
      COLLECTIONS.SUPPORT_TICKETS,
      [{ field: 'status', operator: 'in', value: ['open', 'in_progress'] }],
      'createdAt',
      'asc'
    )
  },

  async updateTicketStatus(ticketId: string, status: string, assignedTo?: string) {
    const updateData: any = { status }
    if (assignedTo) updateData.assignedTo = assignedTo
    if (status === 'resolved') updateData.resolvedAt = Timestamp.now()
    
    return FirestoreService.update(COLLECTIONS.SUPPORT_TICKETS, ticketId, updateData)
  }
}

// Intake Services
export const IntakeService = {
  async createIntakeResponse(responseData: any) {
    return FirestoreService.create(COLLECTIONS.INTAKE_RESPONSES, responseData)
  },

  async getPendingIntakes() {
    return FirestoreService.query(
      COLLECTIONS.INTAKE_RESPONSES,
      [{ field: 'status', operator: '==', value: 'pending' }],
      'createdAt',
      'asc'
    )
  },

  async updateIntakeStatus(intakeId: string, status: string, reviewNotes?: string, reviewedBy?: string) {
    const updateData: any = { status }
    if (reviewNotes) updateData.reviewNotes = reviewNotes
    if (reviewedBy) updateData.reviewedBy = reviewedBy
    
    return FirestoreService.update(COLLECTIONS.INTAKE_RESPONSES, intakeId, updateData)
  }
}

// Payment Services
export const PaymentService = {
  async createPayment(paymentData: any) {
    return FirestoreService.create(COLLECTIONS.PAYMENTS, paymentData)
  },

  async updatePaymentStatus(paymentId: string, status: string, metadata?: any) {
    const updateData: any = { status }
    if (metadata) updateData.metadata = { ...updateData.metadata, ...metadata }
    if (status === 'completed') updateData.completedAt = Timestamp.now()
    if (status === 'refunded') updateData.refundedAt = Timestamp.now()
    
    return FirestoreService.update(COLLECTIONS.PAYMENTS, paymentId, updateData)
  },

  async getUserPayments(userId: string) {
    return FirestoreService.query(
      COLLECTIONS.PAYMENTS,
      [{ field: 'userId', operator: '==', value: userId }],
      'createdAt',
      'desc'
    )
  }
}
