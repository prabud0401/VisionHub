
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";

let firebaseApp: FirebaseApp | null = null;

async function initializeClientApp() {
    const apps = getApps();
    if (apps.length > 0) {
        return getApp();
    }

    try {
        // This fetch is successful on the client-side in a Firebase Hosting environment
        const response = await fetch('/__/firebase/init.json');
        const firebaseConfig = await response.json();
        return initializeApp(firebaseConfig);
    } catch (e) {
        console.error("Could not fetch Firebase config from /__/firebase/init.json. This is expected in a local environment. Falling back to environment variables.");
        // Fallback for local development
        const firebaseConfig = {
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        };

        if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'YOUR_API_KEY') {
            return initializeApp(firebaseConfig);
        } else {
             console.warn("Firebase configuration is missing or incomplete. Authentication and Firebase services will be disabled.");
             return null;
        }
    }
}


// IIFE to initialize app and handle the async nature
(async () => {
    firebaseApp = await initializeClientApp();
})();


export { firebaseApp };
