import { initializeApp } from "firebase/app";
import dotenv from "dotenv";
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, // Issue #47
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, // Issue #47
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// // Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const database = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
