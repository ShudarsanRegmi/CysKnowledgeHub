/**
 * seed-test-users.ts
 *
 * Creates three test accounts in Firebase Auth AND MongoDB with preset roles.
 * Run once after setting up the project:
 *
 *   cd backend
 *   npm run seed:test-users
 *
 * Test credentials (all roles):
 *   admin@cys-test.local   / CysTest@Admin1
 *   author@cys-test.local  / CysTest@Author1
 *   student@cys-test.local / CysTest@Student1
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

// ─── Bootstrap Firebase Admin ──────────────────────────────────────────────

const serviceAccountPath = path.resolve(
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH ??
  './config/cysknowledgehub-firebase-adminsdk-fbsvc-840d1ddb86.json'
);

if (!fs.existsSync(serviceAccountPath)) {
  console.error(`[seed] Service account key not found at: ${serviceAccountPath}`);
  console.error('  Download it from Firebase Console → Project Settings → Service Accounts');
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

import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  provider: string;
  role: 'student' | 'author' | 'admin';
  createdAt: Date;
  lastLoginAt: Date;
}

const UserSchema = new Schema<IUser>({
  uid:          { type: String, required: true, unique: true, index: true },
  email:        { type: String, required: true, unique: true },
  displayName:  { type: String },
  photoURL:     { type: String },
  provider:     { type: String, required: true, default: 'password' },
  role:         { type: String, enum: ['student', 'author', 'admin'], default: 'student' },
  createdAt:    { type: Date, default: Date.now },
  lastLoginAt:  { type: Date, default: Date.now },
});

const User = mongoose.models.User ?? model<IUser>('User', UserSchema);

// ─── Test user definitions ─────────────────────────────────────────────────

const TEST_USERS = [
  {
    email: 'admin@cys-test.local',
    password: 'CysTest@Admin1',
    displayName: 'Test Admin',
    role: 'admin' as const,
  },
  {
    email: 'author@cys-test.local',
    password: 'CysTest@Author1',
    displayName: 'Test Author',
    role: 'author' as const,
  },
  {
    email: 'student@cys-test.local',
    password: 'CysTest@Student1',
    displayName: 'Test Student',
    role: 'student' as const,
  },
];

// ─── Seed ──────────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log(`[seed] MongoDB connected → ${MONGO_URI}\n`);

  for (const u of TEST_USERS) {
    // 1. Create or fetch Firebase Auth user
    let firebaseUser: admin.auth.UserRecord;
    try {
      firebaseUser = await admin.auth().getUserByEmail(u.email);
      // Always reset password + displayName so credentials stay in sync with this file
      await admin.auth().updateUser(firebaseUser.uid, {
        password: u.password,
        displayName: u.displayName,
        emailVerified: true,
      });
      console.log(`[seed] Firebase user updated:        ${u.email} (uid: ${firebaseUser.uid})`);
    } catch {
      firebaseUser = await admin.auth().createUser({
        email: u.email,
        password: u.password,
        displayName: u.displayName,
        emailVerified: true,
      });
      console.log(`[seed] Created Firebase user:       ${u.email} (uid: ${firebaseUser.uid})`);
    }

    // 2. Upsert MongoDB document with the correct role.
    // Match by email (stable) so a re-created Firebase user (new uid) doesn't
    // cause a duplicate-key error on the uid index.
    await User.findOneAndUpdate(
      { email: u.email },
      {
        uid: firebaseUser.uid,
        email: u.email,
        displayName: u.displayName,
        provider: 'password',
        role: u.role,
        lastLoginAt: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`[seed] MongoDB upserted:             ${u.email} → role: ${u.role}\n`);
  }

  console.log('─────────────────────────────────────────────────');
  console.log('Test credentials:');
  console.log('  Role    │ Email                    │ Password');
  console.log('  ────────┼──────────────────────────┼────────────────────');
  for (const u of TEST_USERS) {
    const role  = u.role.padEnd(7);
    const email = u.email.padEnd(24);
    console.log(`  ${role} │ ${email} │ ${u.password}`);
  }
  console.log('─────────────────────────────────────────────────');

  await mongoose.disconnect();
  console.log('\n[seed] Done.');
}

seed().catch((err) => {
  console.error('[seed] Error:', err);
  process.exit(1);
});
