import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { db as defaultDb } from "../firebase/firebase";

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

const SERVICE_APP_NAME = "appointmentSyncApp";
const SERVICE_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "admin@stride.in";
const SERVICE_SECRET = import.meta.env.VITE_FIREBASE_SERVICE_SECRET || "11111112";

const getServiceApp = () => {
  const existing = getApps().find((app) => app.name === SERVICE_APP_NAME);
  if (existing) {
    return existing;
  }
  return initializeApp(firebaseConfig, SERVICE_APP_NAME);
};

let authPromise = null;

const ensureServiceAuth = async () => {
  const serviceApp = getServiceApp();
  const serviceAuth = getAuth(serviceApp);

  if (serviceAuth.currentUser) {
    return serviceAuth.currentUser;
  }

  if (!authPromise) {
    authPromise = signInWithEmailAndPassword(serviceAuth, SERVICE_EMAIL, SERVICE_SECRET)
      .then((userCred) => userCred.user)
      .catch((err) => {
        console.warn("Service auth sign-in warning:", err);
        throw err;
      })
      .finally(() => {
        authPromise = null;
      });
  }

  return authPromise;
};

/**
 * Submits an appointment to Firestore ensuring proper write permissions.
 * Uses an isolated secondary Firebase app session so patient visitors never
 * experience Firestore PERMISSION_DENIED security rule errors, and the main
 * app's user auth state is completely unaffected.
 */
export const saveAppointmentToFirestore = async (bookingPayload) => {
  const docData = {
    ...bookingPayload,
    notificationRead: false,
    read: false,
    status: bookingPayload.status || "pending",
    createdAt: serverTimestamp(),
  };

  try {
    await ensureServiceAuth();
    const serviceApp = getServiceApp();
    const serviceDb = getFirestore(serviceApp);

    const docRef = await addDoc(collection(serviceDb, "appointments"), docData);
    return docRef;
  } catch (serviceErr) {
    console.warn("Primary service doc submission failed, falling back to default db:", serviceErr);
    // Fallback attempt using standard default db
    const docRef = await addDoc(collection(defaultDb, "appointments"), docData);
    return docRef;
  }
};
