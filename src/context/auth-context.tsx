'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User, signOut as firebaseSignOut, Auth } from 'firebase/auth';
import firebaseApp from '@/lib/firebase-config';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (isOpen: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let auth: Auth | null = null;
if (firebaseApp) {
  auth = getAuth(firebaseApp);
}

const googleProvider = new GoogleAuthProvider();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) {
      console.error("Firebase is not configured. Cannot sign in.");
      return;
    }
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    } finally {
        setLoading(false);
    }
  };

  const signOut = async () => {
    if (!auth) {
      console.error("Firebase is not configured. Cannot sign out.");
      return;
    }
    try {
        await firebaseSignOut(auth);
    } catch (error) {
        console.error("Error signing out", error);
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signOut,
    isAuthModalOpen,
    setAuthModalOpen,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
