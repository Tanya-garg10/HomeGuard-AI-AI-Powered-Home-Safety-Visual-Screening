import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { ScanResult } from '../types';

// Firebase config - will be fetched from server
let firebaseConfig: any = null;
let app: any = null;
let db: any = null;
let auth: any = null;
let googleProvider: any = null;

// Fetch Firebase config from server
async function fetchFirebaseConfig() {
  try {
    const response = await fetch('/api/firebase-config');
    if (!response.ok) {
      throw new Error('Failed to fetch Firebase config');
    }
    firebaseConfig = await response.json();
    
    // Initialize Firebase
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
    
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    
    return true;
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    return false;
  }
}

// Initialize Firebase on load
let initPromise: Promise<boolean> | null = null;
export function initializeFirebase() {
  if (!initPromise) {
    initPromise = fetchFirebaseConfig();
  }
  return initPromise;
}

// Get Firebase instances (will be null until initialized)
export function getFirebaseApp() {
  if (!app) {
    console.warn('Firebase not initialized. Call initializeFirebase() first.');
  }
  return app;
}

export function getFirebaseDB() {
  if (!db) {
    console.warn('Firebase not initialized. Call initializeFirebase() first.');
  }
  return db;
}

export function getFirebaseAuth() {
  if (!auth) {
    console.warn('Firebase not initialized. Call initializeFirebase() first.');
  }
  return auth;
}

export function getFirebaseProvider() {
  if (!googleProvider) {
    console.warn('Firebase not initialized. Call initializeFirebase() first.');
  }
  return googleProvider;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const authInstance = getFirebaseAuth();
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: authInstance?.currentUser?.uid,
      email: authInstance?.currentUser?.email,
      emailVerified: authInstance?.currentUser?.emailVerified,
      isAnonymous: authInstance?.currentUser?.isAnonymous,
      tenantId: authInstance?.currentUser?.tenantId,
      providerInfo:
        authInstance?.currentUser?.providerData?.map((provider: any) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot
export async function testFirestoreConnection(): Promise<boolean> {
  const dbInstance = getFirebaseDB();
  if (!dbInstance) {
    console.warn('Firebase not initialized, skipping connection test');
    return false;
  }
  try {
    await getDocFromServer(doc(dbInstance, 'test', 'connection'));
    console.log('Firestore connection verified successfully.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore client is offline, using local storage cache.');
    } else {
      console.log('Firestore connection check completed (default test doc empty or restricted).');
    }
    return false;
  }
}

// Auth helpers
export async function signInWithGoogle(): Promise<User | null> {
  const authInstance = getFirebaseAuth();
  const providerInstance = getFirebaseProvider();
  if (!authInstance || !providerInstance) {
    console.error('Firebase not initialized');
    return null;
  }
  try {
    const result = await signInWithPopup(authInstance, providerInstance);
    return result.user;
  } catch (err) {
    console.error('Google Sign-In Error:', err);
    return null;
  }
}

export async function logOut(): Promise<void> {
  const authInstance = getFirebaseAuth();
  if (!authInstance) {
    console.error('Firebase not initialized');
    return;
  }
  await signOut(authInstance);
}

// Firestore CRUD operations for Scans
const SCANS_COLLECTION = 'scans';

export async function fetchScansFromFirestore(): Promise<ScanResult[]> {
  const dbInstance = getFirebaseDB();
  if (!dbInstance) {
    console.warn('Firebase not initialized, returning empty array');
    return [];
  }
  try {
    const snapshot = await getDocs(collection(dbInstance, SCANS_COLLECTION));
    const items: ScanResult[] = [];
    snapshot.forEach((d) => {
      items.push(d.data() as ScanResult);
    });
    // Sort descending by createdAt
    return items.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, SCANS_COLLECTION);
  }
}

export async function saveScanToFirestore(scan: ScanResult): Promise<void> {
  const dbInstance = getFirebaseDB();
  if (!dbInstance) {
    console.warn('Firebase not initialized, skipping save');
    return;
  }
  const path = `${SCANS_COLLECTION}/${scan.id}`;
  try {
    // If imageUrl is huge base64, keep a compact reference or preview to stay within document size limit
    const cleanScan: ScanResult = {
      ...scan,
      imageUrl:
        scan.imageUrl && scan.imageUrl.length > 2500
          ? 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80'
          : scan.imageUrl,
    };
    await setDoc(doc(dbInstance, SCANS_COLLECTION, scan.id), cleanScan);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteScanFromFirestore(scanId: string): Promise<void> {
  const dbInstance = getFirebaseDB();
  if (!dbInstance) {
    console.warn('Firebase not initialized, skipping delete');
    return;
  }
  const path = `${SCANS_COLLECTION}/${scanId}`;
  try {
    await deleteDoc(doc(dbInstance, SCANS_COLLECTION, scanId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeToScans(
  onUpdate: (scans: ScanResult[]) => void,
  onError?: (err: any) => void
) {
  const dbInstance = getFirebaseDB();
  if (!dbInstance) {
    console.warn('Firebase not initialized, skipping subscription');
    return () => {};
  }
  return onSnapshot(
    collection(dbInstance, SCANS_COLLECTION),
    (snapshot) => {
      const items: ScanResult[] = [];
      snapshot.forEach((d) => {
        items.push(d.data() as ScanResult);
      });
      items.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      onUpdate(items);
    },
    (error) => {
      console.warn('Firestore snapshot error:', error);
      if (onError) onError(error);
    }
  );
}
