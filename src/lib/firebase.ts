// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBM0y7Ns-pmQPohdfa02jYMV7Qt09PFcnw",
  authDomain: "accountmanagement-42375.firebaseapp.com",
  projectId: "accountmanagement-42375",
  storageBucket: "accountmanagement-42375.firebasestorage.app",
  messagingSenderId: "421676153467",
  appId: "1:421676153467:web:156e63e368a861c16380de",
  measurementId: "G-NL7GTPKB2N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics (only in browser)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;