import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  // TODO: This below causes an error (Issue #47)
  // projectId: process.env.FIREBASE_PROJECT_ID,
  projectId: "qubepay-succery",
  // TODO: This below causes an error
  // storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  storageBucket: "qubepay-succery.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
// const firebaseApp = initializeApp(firebaseConfig);

// export { firebaseApp }

// ===========================================================================

// import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyBjPHE5ESFSd_GhwFzUaE2mTUyqm9sVedo",
//   authDomain: "qube-development-d6811.firebaseapp.com",
//   projectId: "qube-development-d6811",
//   storageBucket: "qube-development-d6811.appspot.com",
//   messagingSenderId: "308534632877",
//   appId: "1:308534632877:web:23ef644fd3ec5873a70124",
// };

// // Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const database = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
