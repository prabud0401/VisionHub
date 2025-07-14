'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  User, 
  signOut as firebaseSignOut, 
  Auth,
  signInWithEmailAndPassword,
  updatePassword,
} from 'firebase/auth';
import firebaseApp from '@/lib/firebase-config';
import { createUserProfile } from '@/services/user-service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  updateUserPassword: (newPass: string) => Promise<void>;
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
      if (user) {
        createUserProfile({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) throw new Error("Firebase is not configured. Cannot sign in.");
    
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
       if (user) {
        await createUserProfile({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      }
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error;
    } finally {
        setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    if (!auth) throw new Error("Firebase is not configured. Cannot sign in.");
    setLoading(true);
    try {
        await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
        console.error("Error signing in with email", error);
        throw error;
    } finally {
        setLoading(false);
    }
  }

  const updateUserPassword = async (newPass: string) => {
    if (!auth?.currentUser) throw new Error("No user is currently signed in.");
    try {
        await updatePassword(auth.currentUser, newPass);
    } catch (error) {
        console.error("Error updating password", error);
        throw error;
    }
  }

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
    signInWithEmail,
    updateUserPassword,
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
