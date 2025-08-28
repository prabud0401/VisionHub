
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDHNPNcQ98-iU0H-_EAzmeiRblkrVPzU64",
    authDomain: "visionhub-uffkz.firebaseapp.com",
    projectId: "visionhub-uffkz",
    storageBucket: "visionhub-uffkz.firebasestorage.app",
    messagingSenderId: "681384400332",
    appId: "1:681384400332:web:c841e16a92b6c33a25f969"
};

// Singleton pattern to initialize Firebase app
let firebaseApp: FirebaseApp;

if (getApps().length === 0) {
  if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes('YOUR_API_KEY')) {
    console.error("Firebase configuration is missing or incomplete. Firebase services will be disabled.");
  }
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

export const getFirebaseApp = () => {
    return firebaseApp;
}
