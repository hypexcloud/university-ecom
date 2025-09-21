#!/usr/bin/env node

/**
 * Firebase Setup Script
 *
 * This script helps you set up Firebase for University Ecom.
 * Run with: npm run setup:firebase
 */

// Load environment variables
require("dotenv").config({ path: ".env.local" });

// Configure ts-node for TypeScript support
require("ts-node").register({
  transpileOnly: true,
  compilerOptions: {
    module: "commonjs",
    target: "es2020",
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    moduleResolution: "node",
  },
});

async function setupFirebase() {
  console.log("🔥 University Ecom - Firebase Setup");
  console.log("===================================\n");

  // Check environment variables
  const requiredEnvVars = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID",
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingVars.length > 0) {
    console.log("❌ Missing required environment variables:");
    missingVars.forEach((varName) => {
      console.log(`   - ${varName}`);
    });
    console.log(
      "\n📝 Please update your .env.local file with Firebase configuration."
    );
    console.log(
      "💡 Get these values from Firebase Console > Project Settings > General > Web Apps"
    );
    process.exit(1);
  }

  console.log("✅ All required environment variables found");
  console.log(`📊 Project ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`);
  console.log(
    `🌐 Auth Domain: ${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}\n`
  );

  try {
    console.log("🌱 Seeding database with initial data...");

    // Dynamically import the TypeScript seed module
    const { seedDatabase } = require("../src/lib/firebase/seed.ts");
    await seedDatabase();

    console.log("✅ Database seeding completed!\n");

    console.log("🎉 Firebase setup complete!");
    console.log("📋 Next steps:");
    console.log(
      "   1. Deploy Firestore rules: firebase deploy --only firestore:rules"
    );
    console.log("   2. Set up authentication providers in Firebase Console");
    console.log("   3. Configure security rules for Storage if needed");
    console.log("   4. Run: npm run dev to start development server\n");
  } catch (error) {
    console.error("💥 Setup failed:", error);
    console.log("\n🔧 Troubleshooting:");
    console.log("   1. Verify Firebase project exists and is active");
    console.log("   2. Check that Firestore is enabled in Firebase Console");
    console.log("   3. Ensure service account has proper permissions");
    console.log("   4. Verify environment variables are correct\n");
    process.exit(1);
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupFirebase();
}

module.exports = { setupFirebase };
