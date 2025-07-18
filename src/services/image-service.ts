
'use server';

import { firestore, storage } from '@/lib/firebase-admin';
import type { GeneratedImage } from '@/lib/types';
import { getAuth } from 'firebase-admin/auth';

if (!firestore || !storage) {
  console.warn(
    'Firestore or Storage is not initialized. Image service will not work.'
  );
}

export async function saveImageMetadata(
  imageData: Omit<GeneratedImage, 'id'> & { userId: string }
): Promise<GeneratedImage> {
  if (!firestore) throw new Error('Firestore is not initialized.');
  
  const docRef = await firestore.collection('images').add({
    ...imageData,
    createdAt: new Date().toISOString(),
  });

  return {
    id: docRef.id,
    ...imageData,
    createdAt: new Date().toISOString(),
  };
}

export async function uploadImageFromDataUri(
  dataUri: string,
  fileName: string
): Promise<string> {
    if (!storage) throw new Error('Firebase Storage is not initialized.');

    const mimeType = dataUri.match(/data:(.*);base64,/)?.[1];
    if (!mimeType) {
        throw new Error('Invalid data URI: MIME type not found.');
    }

    const base64Data = dataUri.split(',')[1];
    const imageBuffer = Buffer.from(base64Data, 'base64');

    const file = storage.file(`generated-images/${fileName}`);

    await file.save(imageBuffer, {
        metadata: {
            contentType: mimeType,
        },
    });

    // Make the file public and get the URL
    await file.makePublic();
    return file.publicUrl();
}

export async function shareImageToCommunity(image: GeneratedImage, userId: string): Promise<void> {
  if (!firestore) throw new Error('Firestore not initialized.');

  // Optional: Check if the image is already shared to prevent duplicates
  const communityRef = firestore.collection('community');
  const existingShare = await communityRef.where('originalImageId', '==', image.id).limit(1).get();
  if (!existingShare.empty) {
    console.log("Image already shared.");
    return;
  }
  
  await communityRef.add({
    userId: userId,
    originalImageId: image.id,
    url: image.url,
    prompt: image.prompt,
    model: image.model,
    createdAt: new Date().toISOString(),
  });
}

export async function getCommunityImages(): Promise<any[]> {
    if (!firestore) throw new Error('Firestore not initialized');
    
    const communitySnapshot = await firestore.collection('community').orderBy('createdAt', 'desc').get();
    const images = communitySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const userIds = [...new Set(images.map(img => img.userId))];
    if (userIds.length === 0) return images;

    // Fetch user details in batches
    const auth = getAuth();
    const userPromises = userIds.map(uid => auth.getUser(uid).catch(() => null));
    const userResults = await Promise.all(userPromises);

    const usersMap: Record<string, any> = {};

    const userDocs = await Promise.all(
        userIds.map(id => firestore.collection('users').doc(id).get())
    );

    userDocs.forEach(doc => {
        if (doc.exists) {
            const data = doc.data();
            usersMap[doc.id] = {
                username: data?.username,
                displayName: data?.displayName,
                photoURL: data?.photoURL,
            }
        }
    });

    return images.map(image => ({
        ...image,
        user: usersMap[image.userId] || null
    }));
}
