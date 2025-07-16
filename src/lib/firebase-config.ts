
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: "visionhub-ai-s813r.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let firebaseApp: FirebaseApp | null = null;
let firebaseInitializationPromise: Promise<FirebaseApp | null> | null = null;

function initializeFirebase() {
  // Prevent re-initialization
  if (firebaseApp || firebaseInitializationPromise) {
    return;
  }

  firebaseInitializationPromise = (async () => {
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'YOUR_API_KEY') {
        console.warn("Firebase configuration is missing or incomplete. Firebase services will be disabled.");
        return null;
    }

    if (!getApps().length) {
        firebaseApp = initializeApp(firebaseConfig);
    } else {
        firebaseApp = getApp();
    }
    return firebaseApp;
  })();
}

// Initialize Firebase as soon as this file is loaded
initializeFirebase();

// Asynchronous getter for the initialized app
export const getFirebaseApp = async (): Promise<FirebaseApp | null> => {
  if (firebaseApp) return firebaseApp;
  return firebaseInitializationPromise;
};

// Export the app instance for legacy imports if needed, though getFirebaseApp is preferred
export { firebaseApp };
