
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDHNPNcQ98-iU0H-_EAzmeiRblkrVPzU64",
    authDomain: "visionhub-uffkz.firebaseapp.com",
    projectId: "visionhub-uffkz",
    storageBucket: "visionhub-uffkz.firebasestorage.app",
    messagingSenderId: "681384400332",
    appId: "1:681384400332:web:c841e16a92b6c33a25f969"
};

let firebaseApp: FirebaseApp | null = null;

/**
 * Initializes and returns the Firebase app instance, ensuring it's only created once.
 * @returns The FirebaseApp instance, or null if configuration is missing.
 */
export function getFirebaseApp(): FirebaseApp | null {
    if (firebaseApp) {
        return firebaseApp;
    }

    if (!getApps().length) {
        if (firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('YOUR_API_KEY')) {
            try {
                firebaseApp = initializeApp(firebaseConfig);
            } catch (e) {
                console.error("Firebase initialization error:", e);
                return null;
            }
        } else {
            console.warn("Firebase configuration is missing or incomplete. Firebase services will be disabled.");
            return null;
        }
    } else {
        firebaseApp = getApp();
    }
    
    return firebaseApp;
}
