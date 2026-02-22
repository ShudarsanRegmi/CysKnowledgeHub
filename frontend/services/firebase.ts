import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDRumE2KxLyipItpRlRIocsPsR3HhraC2o",
  authDomain: "dept-website-dev.firebaseapp.com",
  projectId: "dept-website-dev",
  storageBucket: "dept-website-dev.firebasestorage.app",
  messagingSenderId: "581598090188",
  appId: "1:581598090188:web:3c46bb442b441fd5730369",
  measurementId: "G-8N0B25GFC7",
};

// Prevent duplicate initialization in strict mode / HMR
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
