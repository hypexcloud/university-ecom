// Create admin user script
// Run this once to create an admin user for testing

import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore'

// Your Firebase config
const firebaseConfig = {
  // Add your config here
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

async function createAdminUser() {
  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      'admin@university-ecom.com', 
      'admin123'
    )
    
    const user = userCredential.user
    
    // Create Firestore user document with admin role
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      displayName: 'Admin User',
      photoURL: '',
      role: 'admin',
      profile: {
        firstName: 'Admin',
        lastName: 'User',
        company: 'University Ecom',
        industry: 'Education',
        experience: 'advanced',
        goals: ['admin'],
        timeZone: 'Europe/Berlin',
        country: 'DE',
        marketingConsent: false,
        communicationPreferences: {
          email: true,
          whatsapp: false,
          discord: false,
        },
      },
      lastLoginAt: Timestamp.now(),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    
    console.log('Admin user created successfully!')
    console.log('Email: admin@university-ecom.com')
    console.log('Password: admin123')
    
  } catch (error) {
    console.error('Error creating admin user:', error)
  }
}

// Uncomment to run: createAdminUser()
