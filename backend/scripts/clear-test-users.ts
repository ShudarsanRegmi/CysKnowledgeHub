/**
 * clear-test-users.ts
 *
 * Removes the three test accounts created by seed-test-users.ts
 * from both Firebase Auth and MongoDB.
 *
 *   cd backend
 *   npm run clear:test-users
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

// ─── Bootstrap Firebase Admin ──────────────────────────────────────────────

const serviceAccountPath = path.resolve(
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH ?? './config/cysknowledgehub-firebase-adminsdk-fbsvc-840d1ddb86.json'
);

if (!fs.existsSync(serviceAccountPath)) {
  console.error(`[clear] Service account key not found at: ${serviceAccountPath}`);
  process.exit(1);
}

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

// ─── Bootstrap MongoDB ─────────────────────────────────────────────────────

function buildMongoURI(): string {
  if (process.env.MONGO_URI) return process.env.MONGO_URI;
  const username = process.env.MONGODB_USERNAME;
  const password = process.env.MONGODB_PASSWORD;
  const database = process.env.MONGODB_DATABASE ?? 'cybershield';
  if (username && password) {
    const cluster = process.env.MONGODB_CLUSTER ?? 'cysknowledgehub.sxc3yvo.mongodb.net';
    return `mongodb+srv://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${cluster}/${database}?appName=Cysknowledgehub`;
  }
  return `mongodb://localhost:27017/${database}`;
}

const MONGO_URI = buildMongoURI();

// ─── Emails to remove ─────────────────────────────────────────────────────

const TEST_EMAILS = [
  'admin@cys-test.local',
  'author@cys-test.local',
  'student@cys-test.local',
];

// ─── Clear ─────────────────────────────────────────────────────────────────

async function clear() {
  await mongoose.connect(MONGO_URI);
  console.log(`[clear] MongoDB connected → ${MONGO_URI}\n`);

  const db = mongoose.connection.db!;
  const usersCollection = db.collection('users');

  for (const email of TEST_EMAILS) {
    // 1. Remove from Firebase Auth
    try {
      const fbUser = await admin.auth().getUserByEmail(email);
      await admin.auth().deleteUser(fbUser.uid);
      console.log(`[clear] Deleted Firebase user: ${email} (uid: ${fbUser.uid})`);
    } catch (err: any) {
      if (err?.errorInfo?.code === 'auth/user-not-found') {
        console.log(`[clear] Firebase user not found (skipping): ${email}`);
      } else {
        console.warn(`[clear] Firebase error for ${email}:`, err?.message ?? err);
      }
    }

    // 2. Remove from MongoDB
    const result = await usersCollection.deleteOne({ email });
    if (result.deletedCount > 0) {
      console.log(`[clear] Deleted MongoDB document:  ${email}\n`);
    } else {
      console.log(`[clear] MongoDB document not found (skipping): ${email}\n`);
    }
  }

  await mongoose.disconnect();
  console.log('[clear] Done.');
}

clear().catch((err) => {
  console.error('[clear] Error:', err);
  process.exit(1);
});
