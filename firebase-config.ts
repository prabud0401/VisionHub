
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

if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'YOUR_API_KEY') {
    if (!getApps().length) {
        firebaseApp = initializeApp(firebaseConfig);
    } else {
        firebaseApp = getApp();
    }
} else {
    console.warn("Firebase configuration is missing or incomplete. Authentication will be disabled.");
}


export default firebaseApp;
