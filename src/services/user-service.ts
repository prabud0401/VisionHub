import { firestore } from '@/lib/firebase-admin';

if (!firestore) {
  console.warn('Firestore is not initialized. User service will not work.');
}

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
}
