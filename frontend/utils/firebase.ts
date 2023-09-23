import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_API_KEY,
//   authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//   // TODO: This below causes an error (Issue #47)
//   // projectId: process.env.FIREBASE_PROJECT_ID,
//   projectId: "qubepay-succery",
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
//   measurementId: process.env.FIREBASE_MEASUREMENT_ID
// };

// Initialize Firebase
// const firebaseApp = initializeApp(firebaseConfig);

// export { firebaseApp }

// ===========================================================================

// import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyC1_eonnzMBmwDtkbTA_KgPbI7eLeeQ1eU",
  authDomain: "succery-qube-dev.firebaseapp.com",
  projectId: "succery-qube-dev",
  storageBucket: "succery-qube-dev.appspot.com",
  messagingSenderId: "832806209613",
  appId: "1:832806209613:web:514dde77a7ff8854ab3404",
};

// // Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const database = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
export const functions = getFunctions(firebaseApp);
export const auth = getAuth(firebaseApp);
