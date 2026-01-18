import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import Constants from 'expo-constants';

let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;

/**
 * Initialize Firebase with configuration from environment variables
 * This should be called once at app startup
 */
export const initializeFirebase = (): void => {
  if (firebaseApp) {
    return; // Already initialized
  }

  const firebaseConfig = {
    apiKey: Constants.expoConfig?.extra?.firebaseApiKey || process.env.FIREBASE_API_KEY,
    authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain || process.env.FIREBASE_AUTH_DOMAIN,
    projectId: Constants.expoConfig?.extra?.firebaseProjectId || process.env.FIREBASE_PROJECT_ID,
    storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket || process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId || process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: Constants.expoConfig?.extra?.firebaseAppId || process.env.FIREBASE_APP_ID,
  };

  try {
    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
    firestore = getFirestore(firebaseApp);
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
};

/**
 * Get Firebase Auth instance
 */
export const getFirebaseAuth = (): Auth => {
  if (!auth) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return auth;
};

/**
 * Get Firestore instance
 */
export const getFirebaseFirestore = (): Firestore => {
  if (!firestore) {
    throw new Error('Firebase not initialized. Call initializeFirebase() first.');
  }
  return firestore;
};

/**
 * Check if Firebase is initialized
 */
export const isFirebaseInitialized = (): boolean => {
  return firebaseApp !== null;
};

