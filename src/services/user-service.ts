
'use server';

import { firestore } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    emailVerified: boolean;
    createdAt?: string;
    username?: string;
    credits?: number;
}

async function generateUniqueUsername(email: string | null): Promise<string> {
    if (!firestore) throw new Error('Firestore not initialized');
    if (!email) throw new Error('Email is required to generate a username');
    
    const namePart = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').slice(0, 4);
    
    let username = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
        const randomNumbers = Math.floor(1000 + Math.random() * 9000).toString();
        username = `${namePart}${randomNumbers}`;
        
        const usernameSnapshot = await firestore.collection('users').where('username', '==', username).limit(1).get();
        if (usernameSnapshot.empty) {
            isUnique = true;
        }
        attempts++;
    }

    if (!isUnique) {
        // Fallback to a more random username if we can't find a unique one
        return `user${Date.now().toString().slice(-6)}`;
    }
    
    return username;
}

export async function createUserProfile(userData: UserProfile): Promise<void> {
  if (!firestore) {
    console.error('Firestore is not initialized. Cannot create user profile.');
    return;
  };

  try {
    const userRef = firestore.collection('users').doc(userData.uid);
    const doc = await userRef.get();
  
    if (!doc.exists) {
      const username = await generateUniqueUsername(userData.email);
      await userRef.set({
        username,
        email: userData.email,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        emailVerified: userData.emailVerified,
        createdAt: new Date().toISOString(),
        credits: 5, // Start with 5 free credits
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

export async function getUserByUsername(identifier: string, isUid: boolean = false): Promise<UserProfile | null> {
    if (!firestore) {
        console.error('Firestore not initialized');
        return null;
    }
    try {
        let querySnapshot;
        if (isUid) {
            const doc = await firestore.collection('users').doc(identifier).get();
            if (!doc.exists) return null;
            return { uid: doc.id, ...doc.data() } as UserProfile;
        } else {
             querySnapshot = await firestore.collection('users').where('username', '==', identifier).limit(1).get();
        }

        if (querySnapshot.empty) {
            return null;
        }

        const userDoc = querySnapshot.docs[0];
        return { uid: userDoc.id, ...userDoc.data() } as UserProfile;

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
