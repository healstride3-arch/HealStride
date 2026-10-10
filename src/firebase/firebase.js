import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";
import { getStorage } from "firebase/storage";

const rawApiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const isConfiguredApiKey =
  typeof rawApiKey === "string" &&
  rawApiKey.trim().length > 10 &&
  !rawApiKey.includes("your_");

const firebaseConfig = {
  apiKey: isConfiguredApiKey
    ? rawApiKey
    : "AIzaSyDummyKeyForStaticWebsiteMode00",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "stride-64470.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "stride-64470",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "stride-64470.appspot.com",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1234567890",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID || "1:1234567890:web:1234567890abcdef",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let app;
try {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
} catch (e) {
  console.warn("[Firebase] initializeApp warning:", e?.message);
  app = getApps().length ? getApp() : initializeApp(firebaseConfig, "fallbackApp");
}

let db;
try {
  db = getFirestore(app);
} catch (e) {
  console.warn("[Firebase] getFirestore warning:", e?.message);
}

let auth;
try {
  auth = getAuth(app);
} catch (e) {
  console.warn("[Firebase] getAuth warning:", e?.message);
}

export const googleProvider = new GoogleAuthProvider();

let storage;
try {
  storage = getStorage(app);
} catch (e) {
  console.warn("[Firebase] getStorage warning:", e?.message);
}

export { db, auth, storage };
export default app;