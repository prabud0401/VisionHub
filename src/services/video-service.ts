'use server';

import { firestore, storage } from '@/lib/firebase-admin';
import type { GeneratedVideo } from '@/lib/types';
import fetch from 'node-fetch';


if (!firestore || !storage) {
  console.warn(
    'Firestore or Storage is not initialized. Video service will not work.'
  );
}

export async function saveVideoMetadata(
  videoData: Omit<GeneratedVideo, 'id'> & { userId: string }
): Promise<GeneratedVideo> {
  if (!firestore) throw new Error('Firestore is not initialized.');
  
  const docRef = await firestore.collection('videos').add({
    ...videoData,
    createdAt: new Date().toISOString(),
  });

  return {
    id: docRef.id,
    ...videoData,
    createdAt: new Date().toISOString(),
  };
}


export async function uploadVideoFromUrl(
  videoUrl: string,
  fileName: string
): Promise<string> {
    if (!storage) throw new Error('Firebase Storage is not initialized.');

    const response = await fetch(videoUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch video from URL: ${response.statusText}`);
    }
    const videoBuffer = await response.buffer();
    const mimeType = response.headers.get('content-type') || 'video/mp4';
    
    const file = storage.file(`generated-videos/${fileName}`);

    await file.save(videoBuffer, {
        metadata: {
            contentType: mimeType,
        },
    });

    await file.makePublic();
    return file.publicUrl();
}
