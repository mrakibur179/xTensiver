// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "xtensiver.firebaseapp.com",
  projectId: "xtensiver",
  storageBucket: "xtensiver.firebasestorage.app",
  messagingSenderId: "961034803695",
  appId: "1:961034803695:web:32b29ae943b6ac76ecbe1a",
  measurementId: "G-F2ZXY6J4F2",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
