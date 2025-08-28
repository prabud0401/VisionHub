
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDHNPNcQ98-iU0H-_EAzmeiRblkrVPzU64",
    authDomain: "visionhub-uffkz.firebaseapp.com",
    projectId: "visionhub-uffkz",
    storageBucket: "visionhub-uffkz.firebasestorage.app",
    messagingSenderId: "681384400332",
    appId: "1:681384400332:web:c841e16a92b6c33a25f969"
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
    
    // Initialize messaging if in a browser environment
    if (typeof window !== 'undefined') {
        getMessaging(firebaseApp);
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
