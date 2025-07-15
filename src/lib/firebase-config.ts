
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";

// --- Dual-Environment Firebase Configuration ---

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: "visionhub-ai-s813r.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function getFirebaseConfig() {
  // In a deployed Firebase environment, this endpoint is automatically available.
  const hostingConfigUrl = `/__/firebase/init.json`;
  
  try {
    const response = await fetch(hostingConfigUrl);
    if (response.ok) {
      const config = await response.json();
      console.log("Successfully fetched Firebase config from hosting URL.");
      return config;
    }
  } catch (error) {
    // This will typically fail in a local dev environment.
    // That's expected, so we'll fall back to environment variables.
  }

  console.log("Could not fetch Firebase config from hosting. Falling back to environment variables.");
  // If the fetch fails, it means we are likely in a local or non-Firebase environment.
  // We fall back to the manually configured environment variables.
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'YOUR_API_KEY') {
    return firebaseConfig;
  }
  
  return null;
}


let firebaseApp: FirebaseApp | null = null;
let firebaseInitializationPromise: Promise<FirebaseApp | null> | null = null;

async function initializeFirebase() {
    if (firebaseApp) return firebaseApp;
    if (firebaseInitializationPromise) return firebaseInitializationPromise;

    firebaseInitializationPromise = (async () => {
        const config = await getFirebaseConfig();

        if (!config || !config.apiKey) {
            console.warn("Firebase configuration is missing or incomplete. Firebase services will be disabled.");
            return null;
        }

        if (getApps().length) {
            firebaseApp = getApp();
        } else {
            firebaseApp = initializeApp(config);
        }
        return firebaseApp;
    })();

    return firebaseInitializationPromise;
}

// We don't export the app directly, but a promise that resolves to it.
// This ensures that any part of the app trying to use Firebase
// will wait until initialization is complete.
export const getFirebaseApp = () => {
    return initializeFirebase();
};

// For components that need direct access (though getFirebaseApp is preferred)
if (typeof window !== 'undefined') {
    initializeFirebase();
}

export { firebaseApp };
