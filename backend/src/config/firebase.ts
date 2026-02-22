import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

const serviceAccountPath = path.resolve(
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './config/serviceAccountKey.json'
);

if (!admin.apps.length) {
  if (!fs.existsSync(serviceAccountPath)) {
    console.warn(
      `[Firebase Admin] Service account key not found at ${serviceAccountPath}.\n` +
      `  Download it from: Firebase Console → Project Settings → Service Accounts → Generate new private key\n` +
      `  Then save it to backend/serviceAccountKey.json`
    );
  } else {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('[Firebase Admin] Initialized');
  }
}

export default admin;
