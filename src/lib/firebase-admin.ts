import * as admin from 'firebase-admin';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : null;

if (!admin.apps.length) {
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: "visionhub-ai-s813r.firebasestorage.app",
    });
  } else {
    console.warn(
      'Firebase Admin SDK service account is not available. Firebase-dependent services will not be initialized.'
    );
  }
}

export const firestore = serviceAccount ? admin.firestore() : null;
export const storage = serviceAccount ? admin.storage().bucket() : null;
