
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBXLnz3KKO5WWgmkP_hbqb9L1cSySBbhis",
  authDomain: "visionhub-8337b.firebaseapp.com",
  projectId: "visionhub-8337b",
  storageBucket: "visionhub-8337b.firebasestorage.app",
  messagingSenderId: "186862385892",
  appId: "1:186862385892:web:467b5fe845b492a960caf1",
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
