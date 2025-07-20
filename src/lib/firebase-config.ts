
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyADeCv7wpYrCu6gbiHHQ_YUFOzkmnVvA8I",
  authDomain: "visionhub-d7qr5.firebaseapp.com",
  projectId: "visionhub-d7qr5",
  storageBucket: "visionhub-d7qr5.firebasestorage.app",
  messagingSenderId: "35792305008",
  appId: "1:35792305008:web:2368097c39f7cca720adb5",
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
