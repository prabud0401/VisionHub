
'use server';

import { firestore } from '@/lib/firebase-admin';

if (!firestore) {
  throw new Error('Firestore is not initialized.');
}

/**
 * Checks if a username is available in the system.
 * @param username The username to check.
 * @returns A boolean indicating if the username is available.
 */
export async function checkUsernameAvailability(username: string): Promise<boolean> {
  if (!username || username.length < 3) {
    return false; // Or throw an error, depending on desired behavior
  }
  const usernameSnapshot = await firestore.collection('users').where('username', '==', username).limit(1).get();
  return usernameSnapshot.empty;
}

/**
 * Sets the username for a given user UID.
 * This should only be called once per user.
 * @param uid The user's unique ID.
 * @param username The desired username.
 */
export async function setUsernameForUser(uid: string, username: string): Promise<void> {
  const isAvailable = await checkUsernameAvailability(username);
  if (!isAvailable) {
    throw new Error('Username is already taken.');
  }

  if (username.length < 3) {
    throw new Error('Username must be at least 3 characters long.');
  }

  const userRef = firestore.collection('users').doc(uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    throw new Error('User profile does not exist.');
  }
  
  if (userDoc.data()?.username) {
    throw new Error('Username has already been set for this user.');
  }

  await userRef.update({ username: username });
}
