import { firestore, storage } from '@/lib/firebase-admin';
import type { GeneratedImage } from '@/lib/types';

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
