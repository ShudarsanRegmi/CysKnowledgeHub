import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:5000';

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = 'student' | 'author' | 'admin';

export interface DbUser {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
}

export interface AuthContextValue {
  user: User | null;
  dbUser: DbUser | null;
  role: UserRole | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshDbUser: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Backend helpers ──────────────────────────────────────────────────────────

async function syncUserWithBackend(user: User): Promise<DbUser | null> {
  try {
    const idToken = await user.getIdToken();
    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` },
    });
    const data = await res.json();
    return data.user ?? null;
  } catch (err) {
    console.warn('[Auth] Could not sync user with backend:', err);
    return null;
  }
}

async function fetchDbUser(user: User): Promise<DbUser | null> {
  try {
    const idToken = await user.getIdToken();
    const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${idToken}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user ?? null;
  } catch {
    return null;
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshDbUser = useCallback(async () => {
    if (!user) return;
    const du = await fetchDbUser(user);
    setDbUser(du);
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const du = await fetchDbUser(firebaseUser);
        setDbUser(du);
      } else {
        setDbUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const du = await syncUserWithBackend(result.user);
    setDbUser(du);
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const du = await syncUserWithBackend(result.user);
    setDbUser(du);
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string, displayName: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    // Force a token refresh so the new displayName is included in the JWT `name`
    // claim. Without this, the cached token (minted before updateProfile) reaches
    // the backend with name=undefined and displayName is stored as null.
    await result.user.getIdToken(/* forceRefresh */ true);
    const du = await syncUserWithBackend(result.user);
    setDbUser(du);
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    setDbUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, dbUser, role: dbUser?.role ?? null, loading,
      signInWithGoogle, signInWithEmail, signUpWithEmail, signOut, refreshDbUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

export default AuthContext;
