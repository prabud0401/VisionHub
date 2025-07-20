
import * as admin from 'firebase-admin';

// Check if the app is already initialized
if (!admin.apps.length) {
    // In a deployed environment, initialize with Application Default Credentials.
    try {
        admin.initializeApp({
            storageBucket: "visionhub-8337b.firebasestorage.app",
        });
        console.log("Firebase Admin SDK initialized with Application Default Credentials.");
    } catch (e) {
        console.error("Failed to initialize Firebase Admin SDK in deployed environment:", e);
    }
}

export const firestore = admin.apps.length ? admin.firestore() : null;
export const storage = admin.apps.length ? admin.storage().bucket() : null;
