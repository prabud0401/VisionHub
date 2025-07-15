'use server';

import { firestore, storage } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

if (!firestore || !storage) {
  console.warn(
    'Firestore or Storage is not initialized. Payment service will not work.'
  );
}

interface PlanDetails {
  id: string;
  name: string;
  price: string;
  credits: number;
  billing: 'monthly' | 'annually';
}

interface PaymentSubmissionData {
    userId: string;
    userEmail: string | null;
    userDisplayName: string | null;
    plan: PlanDetails;
    paymentSlipUrl: string;
}

export async function submitPaymentForReview(data: PaymentSubmissionData): Promise<string> {
    if (!firestore) throw new Error('Firestore is not initialized.');
    
    const submission = {
        ...data,
        approved: false,
        createdAt: new Date().toISOString(),
    };

    const docRef = await firestore.collection('payments').add(submission);
    return docRef.id;
}


export async function uploadPaymentSlip(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> {
  if (!storage) throw new Error('Firebase Storage is not initialized.');
  
  const file = storage.file(`payment-slips/${fileName}`);

  await file.save(fileBuffer, {
    metadata: {
      contentType: mimeType,
    },
  });

  await file.makePublic();
  return file.publicUrl();
}

export async function getPaymentSubmissions() {
    if (!firestore) throw new Error('Firestore is not initialized.');
    const snapshot = await firestore.collection('payments').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function approvePaymentAndAddCredits(paymentId: string, userId: string, creditsToAdd: number) {
    if (!firestore) throw new Error('Firestore is not initialized.');

    const paymentRef = firestore.collection('payments').doc(paymentId);
    const userRef = firestore.collection('users').doc(userId);

    const batch = firestore.batch();

    // Mark payment as approved
    batch.update(paymentRef, { approved: true });

    // Add credits to the user
    batch.update(userRef, { credits: FieldValue.increment(creditsToAdd) });

    await batch.commit();
}
