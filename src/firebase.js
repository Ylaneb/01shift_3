// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBrREI4wCLtug8fkOFPsT8wmXJX9pGEkdU",
  authDomain: "shift-eden.firebaseapp.com",
  projectId: "shift-eden",
  storageBucket: "shift-eden.firebasestorage.app",
  messagingSenderId: "604701536267",
  appId: "1:604701536267:web:c6db089bba61578f7a970e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);