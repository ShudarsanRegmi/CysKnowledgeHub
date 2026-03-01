import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBDSnTCWxutMSiHNq-RDn0X_y9OosJcWuw",
  authDomain: "dept-website-a74ec.firebaseapp.com",
  projectId: "dept-website-a74ec",
  storageBucket: "dept-website-a74ec.firebasestorage.app",
  messagingSenderId: "795784809428",
  appId: "1:795784809428:web:e8545ddc44910781c16441",
  measurementId: "G-2Z8FKH6Y0L"
};


// Prevent duplicate initialization in strict mode / HMR
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
