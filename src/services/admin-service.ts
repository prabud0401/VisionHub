
'use server';

import { firestore, storage } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import type { GeneratedImage } from '@/lib/types';
import { subDays, format, startOfDay } from 'date-fns';

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  createdAt: string;
  username: string;
  credits: number;
  showAds?: boolean;
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

export async function updateUserCredits(uid: string, credits: number): Promise<void> {
  if (!firestore) throw new Error('Firestore not initialized');
  if (typeof credits !== 'number' || credits < 0) {
    throw new Error('Invalid credit amount.');
  }
  const userRef = firestore.collection('users').doc(uid);
  await userRef.update({ credits });
}

export async function updateUserAdStatus(uid: string, showAds: boolean): Promise<void> {
    if (!firestore) throw new Error('Firestore not initialized');
    const userRef = firestore.collection('users').doc(uid);
    await userRef.update({ showAds });
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

export async function deleteImage(imageId: string, imageUrl: string): Promise<void> {
  if (!firestore || !storage) throw new Error('Firestore or Storage not initialized');
  
  // 1. Delete the document from Firestore
  await firestore.collection('images').doc(imageId).delete();

  // 2. Delete the file from Firebase Storage
  try {
    // Extract the file path from the public URL
    // Example URL: https://storage.googleapis.com/your-bucket-name/generated-images/image-name.png
    const url = new URL(imageUrl);
    // Pathname will be /your-bucket-name/generated-images/image-name.png
    // We need to remove the leading slash and the bucket name.
    const pathParts = url.pathname.split('/');
    const filePath = pathParts.slice(2).join('/'); // Skips bucket name, joins the rest

    if (filePath) {
      await storage.file(filePath).delete();
      console.log(`Successfully deleted ${filePath} from Storage.`);
    }
  } catch (error) {
    console.error(`Failed to delete image file from Storage for imageId ${imageId}. It might have already been deleted or the URL was malformed.`, error);
    // We don't re-throw the error, as the primary goal (deleting from DB) was successful.
    // The link is now broken anyway.
  }
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


export async function getImageGenerationStats(): Promise<{ name: string; total: number }[]> {
  if (!firestore) throw new Error('Firestore not initialized');

  const days = 7;
  const endDate = startOfDay(new Date());
  const startDate = subDays(endDate, days - 1);

  // Create a map to hold counts for each day in the last week
  const dailyCounts: { [key: string]: number } = {};
  for (let i = 0; i < days; i++) {
    const date = format(subDays(endDate, i), 'MMM d');
    dailyCounts[date] = 0;
  }

  // Query for images created in the last 7 days
  const imagesSnapshot = await firestore
    .collection('images')
    .where('createdAt', '>=', startDate.toISOString())
    .get();

  imagesSnapshot.forEach(doc => {
    const data = doc.data();
    if (data.createdAt) {
      const creationDate = startOfDay(new Date(data.createdAt));
      if (creationDate >= startDate && creationDate <= endDate) {
        const dateKey = format(creationDate, 'MMM d');
        if (dateKey in dailyCounts) {
          dailyCounts[dateKey]++;
        }
      }
    }
  });

  // Format the data for the chart, sorting by date
  return Object.entries(dailyCounts)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
}
