#!/usr/bin/env node
require("dotenv").config({ path: ".env.local" });
require("ts-node").register({ transpileOnly: true });

console.log("🔥 Testing Firebase connection...");
require("../src/lib/firebase/config.ts"); // loads and initializes
console.log("✅ Firebase connected successfully!");
console.log(`📊 Project ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`);
