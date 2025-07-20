
import * as admin from 'firebase-admin';

// Check if the app is already initialized
if (!admin.apps.length) {
    // The GOOGLE_CLOUD_PROJECT environment variable is set automatically in deployed Google Cloud environments.
    // Checking for its existence is a reliable way to determine if we're in a deployed environment.
    if (process.env.GOOGLE_CLOUD_PROJECT) {
        // In a deployed environment, initialize with Application Default Credentials.
        try {
            admin.initializeApp({
                storageBucket: "visionhub-77e32.firebasestorage.app",
            });
            console.log("Firebase Admin SDK initialized with Application Default Credentials.");
        } catch (e) {
            console.error("Failed to initialize Firebase Admin SDK in deployed environment:", e);
        }
    } else {
        // In a local environment, fall back to a service account key.
        const serviceAccountKey = process.env.SERVICE_ACCOUNT_KEY;
        if (serviceAccountKey) {
            try {
                const serviceAccount = JSON.parse(serviceAccountKey);
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                    storageBucket: "visionhub-77e32.firebasestorage.app",
                });
                console.log("Firebase Admin SDK initialized for local development with service account key.");
            } catch (e) {
                console.error("Failed to parse Firebase service account key or initialize app for local development:", e);
            }
        } else {
            console.error("SERVICE_ACCOUNT_KEY environment variable is not set. Firebase Admin SDK could not be initialized for local development.");
        }
    }
}

export const firestore = admin.apps.length ? admin.firestore() : null;
export const storage = admin.apps.length ? admin.storage().bucket() : null;
