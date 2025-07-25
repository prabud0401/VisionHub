'use client';

import { createContext, useContext, useEffect, ReactNode, useCallback, useState } from 'react';
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
  sendPasswordResetEmail,
  sendEmailVerification,
} from 'firebase/auth';
import { getFirebaseApp } from '@/lib/firebase-config';
import { createUserProfile, getUserByUid, getUserByUsername } from '@/services/user-service';
import { ChooseUsernameModal } from '@/components/choose-username-modal';
import { useAppStore } from '@/stores/app-store';
import { useErrorHandler } from '@/components/error-boundary';
import { useState } from 'react';

interface AppUser extends User {
  username?: string;
  credits?: number;
  showAds?: boolean;
  storageLimit?: number;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signInWithUsername: (username: string, pass: string) => Promise<void>;
  updateUserPassword: (newPass: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (isOpen: boolean) => void;
  sendPasswordReset: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const googleProvider = new GoogleAuthProvider();

export function ImprovedAuthProvider({ children }: { children: ReactNode }) {
  const { user, loading, setUser, setLoading, ui, setAuthModalOpen } = useAppStore();
  const { setError } = useErrorHandler();
  
  // Local state for auth-specific UI
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [auth, setAuth] = useState<Auth | null>(null);

  // Initialize Firebase Auth
  useEffect(() => {
    let mounted = true;
    
    getFirebaseApp().then(app => {
      if (app && mounted) {
        setAuth(getAuth(app));
      } else if (mounted) {
        setLoading(false);
      }
    }).catch(error => {
      if (mounted) {
        setError('Failed to initialize Firebase Auth');
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [setLoading, setError]);

  const refreshUserData = useCallback(async () => {
    if (auth?.currentUser) {
      try {
        const profile = await getUserByUid(auth.currentUser.uid);
        setUser({ ...auth.currentUser, ...profile });
      } catch (error) {
        setError('Failed to refresh user data');
      }
    }
  }, [auth, setUser, setError]);

  // Auth state listener
  useEffect(() => {
    if (!auth) {
      return;
    }

    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!mounted) return;

      try {
        if (firebaseUser) {
          const profile = await getUserByUid(firebaseUser.uid);
          const enhancedUser = { ...firebaseUser, ...profile };
          setUser(enhancedUser);

          // Show username modal for new users
          if (!profile?.username && mounted) {
            setIsUsernameModalOpen(true);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        setError('Authentication error occurred');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [auth, setUser, setLoading, setError]);

  const signInWithGoogle = useCallback(async () => {
    if (!auth) throw new Error("Firebase is not configured. Cannot sign in.");
    
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      if (user) {
        if (!user.emailVerified) {
          await sendEmailVerification(user);
        }
        await createUserProfile({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
        });
      }
    } catch (error) {
      setError('Failed to sign in with Google');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [auth, setLoading, setError]);

  const signInWithEmail = useCallback(async (email: string, pass: string) => {
    if (!auth) throw new Error("Firebase is not configured. Cannot sign in.");
    
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      setError('Failed to sign in with email');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [auth, setLoading, setError]);

  const signInWithUsername = useCallback(async (username: string, pass: string) => {
    try {
      const userProfile = await getUserByUsername(username);
      if (!userProfile?.email) {
        throw new Error("User not found.");
      }
      return signInWithEmail(userProfile.email, pass);
    } catch (error) {
      setError('Failed to sign in with username');
      throw error;
    }
  }, [signInWithEmail, setError]);

  const updateUserPassword = useCallback(async (newPass: string) => {
    if (!auth?.currentUser) throw new Error("No user is currently signed in.");
    
    try {
      await updatePassword(auth.currentUser, newPass);
    } catch (error) {
      setError('Failed to update password');
      throw error;
    }
  }, [auth, setError]);

  const sendPasswordReset = useCallback(async (email: string) => {
    if (!auth) throw new Error("Firebase is not configured.");
    
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setError('Failed to send password reset email');
      throw error;
    }
  }, [auth, setError]);

  const sendVerificationEmail = useCallback(async () => {
    if (!auth?.currentUser) throw new Error("No user is currently signed in.");
    
    try {
      await sendEmailVerification(auth.currentUser);
    } catch (error) {
      setError('Failed to send verification email');
      throw error;
    }
  }, [auth, setError]);

  const signOut = useCallback(async () => {
    if (!auth) {
      setError("Firebase is not configured. Cannot sign out.");
      return;
    }
    
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      setError('Failed to sign out');
    }
  }, [auth, setUser, setError]);

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signInWithUsername,
    updateUserPassword,
    signOut,
    isAuthModalOpen: ui.isAuthModalOpen,
    setAuthModalOpen,
    sendPasswordReset,
    sendVerificationEmail,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {user && (
        <ChooseUsernameModal 
          isOpen={isUsernameModalOpen} 
          onOpenChange={setIsUsernameModalOpen} 
          onSave={refreshUserData} 
        />
      )}
    </AuthContext.Provider>
  );
}

export function useImprovedAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useImprovedAuth must be used within an ImprovedAuthProvider');
  }
  return context;
}

// Keep backward compatibility
export { useImprovedAuth as useAuth }; 