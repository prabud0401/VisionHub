
'use server';

import { firestore } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import type { GeneratedImage } from '@/lib/types';

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  createdAt: string;
  username: string;
}

export interface AdminImage extends GeneratedImage {
  user?: {
    displayName: string | null;
    email: string | null;
  };
}

export async function verifyAdmin(email: string, secretCode: string): Promise<{ success: boolean, message: string }> {
  if (email !== 'prabud0401@gmail.com') {
    return { success: false, message: 'Unauthorized email address.' };
  }
  
  const serverSecret = process.env.ADMIN_SECRET_CODE;
  if (!serverSecret) {
    console.error("ADMIN_SECRET_CODE is not set in environment variables.");
    return { success: false, message: 'Server configuration error.' };
  }

  if (secretCode !== serverSecret) {
    return { success: false, message: 'Invalid secret code.' };
  }

  return { success: true, message: 'Admin verified.' };
}

export async function getAllUsers(): Promise<AdminUser[]> {
  if (!firestore) throw new Error('Firestore not initialized');
  const usersSnapshot = await firestore.collection('users').orderBy('createdAt', 'desc').get();
  return usersSnapshot.docs.map(doc => ({
    uid: doc.id,
    ...doc.data()
  } as AdminUser));
}

export async function deleteUser(uid: string): Promise<void> {
    if (!firestore) throw new Error('Firestore not initialized');
    const auth = getAuth();
    
    // Deleting user from Firebase Auth
    await auth.deleteUser(uid);
    
    // Deleting user document from Firestore
    await firestore.collection('users').doc(uid).delete();

    // Optionally, delete user's generated images (batch delete for efficiency)
    const imagesSnapshot = await firestore.collection('images').where('userId', '==', uid).get();
    if (!imagesSnapshot.empty) {
        const batch = firestore.batch();
        imagesSnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();
    }
}

export async function getAllImages(): Promise<AdminImage[]> {
  if (!firestore) throw new Error('Firestore not initialized');

  const imagesSnapshot = await firestore.collection('images').orderBy('createdAt', 'desc').get();
  const images = imagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GeneratedImage));

  // Fetch user data for each image to display owner info
  const userIds = [...new Set(images.map(img => img.userId))];
  const users: Record<string, { displayName: string | null, email: string | null }> = {};
  
  // Batch fetch user documents for efficiency
  if (userIds.length > 0) {
      const userDocs = await Promise.all(
          userIds.map(id => firestore.collection('users').doc(id).get())
      );
      userDocs.forEach(doc => {
          if (doc.exists) {
              const data = doc.data() as AdminUser;
              users[doc.id] = { displayName: data.displayName, email: data.email };
          }
      });
  }
  
  return images.map(image => ({
    ...image,
    user: users[image.userId]
  }));
}

export async function deleteImage(imageId: string): Promise<void> {
  if (!firestore) throw new Error('Firestore not initialized');
  await firestore.collection('images').doc(imageId).delete();
  // Note: This does not delete the image file from Firebase Storage.
  // A complete implementation would also include a Cloud Function to handle file deletion from Storage.
}

export async function getAdminStats(): Promise<{ userCount: number; imageCount: number }> {
    if (!firestore) throw new Error('Firestore not initialized');
    const usersPromise = firestore.collection('users').get();
    const imagesPromise = firestore.collection('images').get();

    const [usersSnapshot, imagesSnapshot] = await Promise.all([usersPromise, imagesPromise]);

    return {
        userCount: usersSnapshot.size,
        imageCount: imagesSnapshot.size,
    };
}
