
'use server';

import { firestore } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
    createdAt?: string;
    username?: string;
    credits?: number;
    showAds?: boolean;
    storageLimit?: number;
}


export async function createUserProfile(userData: Omit<UserProfile, 'uid'> & { uid: string }): Promise<void> {
  if (!firestore) {
    console.error('Firestore is not initialized. Cannot create user profile.');
    return;
  };

  try {
    const userRef = firestore.collection('users').doc(userData.uid);
    const doc = await userRef.get();
  
    if (!doc.exists) {
      // Don't generate a username here. It will be chosen by the user.
      await userRef.set({
        email: userData.email,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        emailVerified: userData.emailVerified,
        createdAt: new Date().toISOString(),
        credits: 500, // Start with 500 free credits
        showAds: true, // Show ads for new users by default
        storageLimit: 50, // 50 images for new users
        username: null, // Explicitly set to null initially
      });
    } else {
       await userRef.update({
         emailVerified: userData.emailVerified
       });
    }
  } catch (error) {
    console.error("Error in createUserProfile: ", error);
  }
}

export async function getUserByUid(uid: string): Promise<UserProfile | null> {
    if (!firestore) {
        console.error('Firestore not initialized');
        return null;
    }
    try {
        const doc = await firestore.collection('users').doc(uid).get();
        if (!doc.exists) return null;
        return { uid: doc.id, ...doc.data() } as UserProfile;
    } catch (error) {
        console.error("Error getting user by UID:", error);
        return null;
    }
}

export async function getUserByUsername(username: string): Promise<UserProfile | null> {
    if (!firestore) {
        console.error('Firestore not initialized');
        return null;
    }
    try {
        const snapshot = await firestore.collection('users').where('username', '==', username).limit(1).get();
        if (snapshot.empty) return null;
        const doc = snapshot.docs[0];
        return { uid: doc.id, ...doc.data() } as UserProfile;
    } catch (error) {
        console.error("Error getting user by username:", error);
        return null;
    }
}


export async function deductUserCredit(userId: string, amount: number = 1): Promise<void> {
    if (!firestore) throw new Error('Firestore not initialized');
    const userRef = firestore.collection('users').doc(userId);
    
    try {
        await userRef.update({
            credits: FieldValue.increment(-amount)
        });
    } catch (error) {
        console.error(`Failed to deduct ${amount} credit(s) for user ${userId}:`, error);
        throw new Error('Failed to update user credits.');
    }
}
