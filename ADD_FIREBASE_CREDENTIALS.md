# ⚠️ IMPORTANT - Add Firebase Credentials

## 🔴 Current Status

The error you're seeing is **EXPECTED** - you need to add your Firebase credentials!

---

## ✅ What I Just Created

1. **`/src/lib/firebase.ts`** ← Firebase configuration file
2. **`.env.local`** ← Environment variables template

---

## 🔧 Fix The Error - 2 Steps

### Step 1: Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click ⚙️ **Settings** → **Project settings**
4. Scroll to **"Your apps"** section
5. Find your web app or create one
6. Click **Config** button
7. Copy the configuration values

You'll see something like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxx"
};
```

### Step 2: Add to `.env.local`

Open **`.env.local`** and replace the placeholder values:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:xxxxx
```

**Save the file!**

---

## 🚀 Restart Dev Server

After adding credentials:

1. **Stop** your dev server (Ctrl+C)
2. **Restart** it:
   ```bash
   npm run dev
   ```

The error should be gone!

---

## 🎯 What Happens Next

After adding credentials, the pages will try to fetch from Firebase.

**If you see "Noch keine Kurse":**
- This is normal! You need to create course data in Firestore
- See `QUICK_START_FIREBASE.md` for sample data

**If you see an error about missing collections:**
- You need to create the Firestore collections
- See `FIREBASE_INTEGRATION_GUIDE.md` for full structure

---

## 📋 Quick Checklist

- [ ] Added Firebase credentials to `.env.local`
- [ ] Restarted dev server
- [ ] Error gone
- [ ] Ready to create Firestore data

---

## 🆘 Still Getting Errors?

### Error: "Failed to fetch"
**Cause**: No data in Firestore yet
**Fix**: Create sample course and enrollment (see guides)

### Error: "Permission denied"
**Cause**: Firestore security rules
**Fix**: Update rules in Firebase Console (see `FIREBASE_INTEGRATION_GUIDE.md`)

### Error: "App not initialized"
**Cause**: Missing or incorrect credentials
**Fix**: Double-check `.env.local` values

---

**Add your Firebase credentials and restart the server!** 🔥
