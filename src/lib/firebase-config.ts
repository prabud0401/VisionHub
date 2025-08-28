
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

function initializeFirebaseApp() {
  if (getApps().length === 0) {
    if (firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('YOUR_API_KEY')) {
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      console.error("Firebase configuration is missing or incomplete. Firebase services will be disabled.");
    }
  } else {
    firebaseApp = getApp();
  }
}

// Initialize the app
initializeFirebaseApp();

export function getFirebaseApp() {
    if (!firebaseApp) {
        console.error("Firebase App has not been initialized.");
        // Attempt to re-initialize if it hasn't been set.
        initializeFirebaseApp();
    }
    return firebaseApp;
}
