
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBXLnz3KKO5WWgmkP_hbqb9L1cSySBbhis",
  authDomain: "visionhub-8337b.firebaseapp.com",
  projectId: "visionhub-8337b",
  storageBucket: "visionhub-8337b.appspot.com",
  messagingSenderId: "186862385892",
  appId: "1:186862385892:web:467b5fe845b492a960caf1",
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
