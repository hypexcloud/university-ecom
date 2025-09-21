import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase/config'
import { collection, getDocs } from 'firebase/firestore'
import { COLLECTIONS } from '@/lib/types'

export function useFirebaseTest() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function testConnection() {
      try {
        // Try to read from courses collection
        const coursesRef = collection(db, COLLECTIONS.COURSES)
        const snapshot = await getDocs(coursesRef)
        
        setStatus('success')
        setMessage(`Firebase connected! Found ${snapshot.size} courses.`)
      } catch (error) {
        setStatus('error')
        setMessage(`Firebase connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    testConnection()
  }, [])

  return { status, message }
}
