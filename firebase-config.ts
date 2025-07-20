
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyADeCv7wpYrCu6gbiHHQ_YUFOzkmnVvA8I",
  authDomain: "visionhub-d7qr5.firebaseapp.com",
  projectId: "visionhub-d7qr5",
  storageBucket: "visionhub-d7qr5.firebasestorage.app",
  messagingSenderId: "35792305008",
  appId: "1:35792305008:web:YOUR_WEB_APP_ID_HERE",
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
