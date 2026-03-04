/**
 * fix-admin-role.ts
 * Patches admin@cys-test.local → role:'admin' and syncs the uid with Firebase.
 * Run once: npm run fix:admin-role
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

// ─── Firebase Admin ──────────────────────────────────────────────────────────
const serviceAccountPath = path.resolve(
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH ??
  './config/cysknowledgehub-firebase-adminsdk-fbsvc-840d1ddb86.json'
);
if (!fs.existsSync(serviceAccountPath)) {
  console.error('Service account key not found:', serviceAccountPath);
  process.exit(1);
}
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'))) });
}

// ─── MongoDB ─────────────────────────────────────────────────────────────────
function buildMongoURI(): string {
  if (process.env.MONGO_URI) return process.env.MONGO_URI;
  const u = process.env.MONGODB_USERNAME;
  const p = process.env.MONGODB_PASSWORD;
  const database = process.env.MONGODB_DATABASE ?? 'cybershield';
  if (u && p) {
    const cluster = process.env.MONGODB_CLUSTER ?? 'cysknowledgehub.sxc3yvo.mongodb.net';
    return `mongodb+srv://${encodeURIComponent(u)}:${encodeURIComponent(p)}@${cluster}/${database}?appName=Cysknowledgehub`;
  }
  return `mongodb://localhost:27017/${database}`;
}

import { Schema, model, Document } from 'mongoose';
interface IUser extends Document { uid: string; email: string; role: string; }
const UserSchema = new Schema<IUser>({ uid: String, email: String, role: String }, { strict: false });
const User = model<IUser>('User', UserSchema);

async function run() {
  await mongoose.connect(buildMongoURI());

  const PATCHES: { email: string; role: string }[] = [
    { email: 'admin@cys-test.local',   role: 'admin'   },
    { email: 'author@cys-test.local',  role: 'author'  },
    { email: 'student@cys-test.local', role: 'student' },
  ];

  for (const p of PATCHES) {
    // Get the real UID from Firebase
    let fbUid: string | null = null;
    try {
      const fbUser = await admin.auth().getUserByEmail(p.email);
      fbUid = fbUser.uid;
    } catch {
      console.warn(`[fix] Firebase user not found for ${p.email}`);
    }

    const update: Record<string, unknown> = { role: p.role };
    if (fbUid) update.uid = fbUid;

    const doc = await User.findOneAndUpdate({ email: p.email }, { $set: update }, { new: true });
    if (doc) {
      console.log(`[fix] ${p.email}  →  role: ${doc.role}  uid: ${doc.uid}`);
    } else {
      console.log(`[fix] No document found for ${p.email}`);
    }
  }

  await mongoose.disconnect();
  console.log('\nDone. Sign out and sign back in to pick up the new role.');
}

run().catch((err) => { console.error(err); process.exit(1); });
