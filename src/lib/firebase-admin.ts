
import * as admin from 'firebase-admin';

// Check if the app is already initialized
if (!admin.apps.length) {
    try {
        // This will work in a deployed Firebase/Google Cloud environment
        // where Application Default Credentials are automatically available.
        admin.initializeApp({
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "visionhub-ai-s813r.firebasestorage.app",
        });
        console.log("Firebase Admin SDK initialized with Application Default Credentials.");
    } catch (error) {
        console.warn("Application Default Credentials not found. Falling back to service account key for local development.");
        // Fallback for local development using a service account key
        const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        if (serviceAccountKey) {
            try {
                const serviceAccount = JSON.parse(serviceAccountKey);
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "visionhub-ai-s813r.firebasestorage.app",
                });
                console.log("Firebase Admin SDK initialized with service account key.");
            } catch (e) {
                console.error("Failed to parse Firebase service account key or initialize app:", e);
            }
        } else {
            console.error("FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. Firebase Admin SDK could not be initialized.");
        }
    }
}

export const firestore = admin.apps.length ? admin.firestore() : null;
export const storage = admin.apps.length ? admin.storage().bucket() : null;
