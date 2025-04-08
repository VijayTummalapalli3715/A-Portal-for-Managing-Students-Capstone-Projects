

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional

// const {
//     VITE_FIREBASE_API_KEY,
//     VITE_FIREBASE_AUTH_DOMAIN,
//     VITE_FIREBASE_PROJECT_ID,
//     VITE_FIREBASE_STORAGE_BUCKET,
//     VITE_FIREBASE_MESSAGING_SENDER_ID,
//     VITE_FIREBASE_APP_ID,
//   } = import.meta.env;

// const firebaseConfig = {
//   apiKey:  VITE_FIREBASE_API_KEY,
//   authDomain:  VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: VITE_FIREBASE_PROJECT_ID,
//   storageBucket:  VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId:VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId:   VITE_FIREBASE_APP_ID,
// };

// setPersistence(auth, browserLocalPersistence)
//   .then(() => {
//     console.log("Auth persistence set to local");
//   })
//   .catch((error) => {
//     console.error("Failed to set auth persistence", error);
//   });

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);


// export const auth = getAuth(app);

// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

// Load environment variables
const {
  VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID,
} = import.meta.env;

// Firebase configuration
const firebaseConfig = {
  apiKey: VITE_FIREBASE_API_KEY,
  authDomain: VITE_FIREBASE_AUTH_DOMAIN,
  projectId: VITE_FIREBASE_PROJECT_ID,
  storageBucket: VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set auth persistence
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Auth persistence set to local");
  })
  .catch((error) => {
    console.error("Failed to set auth persistence", error);
  });

export { auth };
