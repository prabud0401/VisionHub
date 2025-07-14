'use server';

import { firestore } from '@/lib/firebase-admin';

interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    createdAt?: string;
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
      await userRef.set({
        email: userData.email,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        createdAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Error in createUserProfile: ", error);
    // Depending on the use case, you might want to throw the error
    // so the client can handle it.
  }
}
