
import * as admin from 'firebase-admin';

// IMPORTANT: Your service account key JSON must be updated for your new project.
// This is a security risk. It is strongly recommended to use environment variables.
const serviceAccountKey = "PASTE_YOUR_NEW_FIREBASE_SERVICE_ACCOUNT_KEY_JSON_HERE";

// Check if the app is already initialized
if (!admin.apps.length) {
    try {
        const serviceAccount = JSON.parse(serviceAccountKey);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: "visionhub-d7qr5.firebasestorage.app",
        });
        console.log("Firebase Admin SDK initialized with hardcoded service account key.");
    } catch (e) {
        console.error("Failed to parse or use hardcoded Firebase service account key. Please ensure it is a valid JSON object:", e);
    }
}

export const firestore = admin.apps.length ? admin.firestore() : null;
export const storage = admin.apps.length ? admin.storage().bucket() : null;
