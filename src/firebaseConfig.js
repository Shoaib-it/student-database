// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDWmz9UngKDkkhZipJ54mwYOiY235IhOA",
  authDomain: "real-estate-e47df.firebaseapp.com",
  projectId: "real-estate-e47df",
  storageBucket: "real-estate-e47df.firebasestorage.app",
  messagingSenderId: "732169465561",
  appId: "1:732169465561:web:5757a07a63149a2b5b98c8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore instance
const db = getFirestore(app);

export { db };
