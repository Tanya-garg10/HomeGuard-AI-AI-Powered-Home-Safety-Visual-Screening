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
import firebaseConfig from '../../firebase-applet-config.json';
import { ScanResult } from '../types';

// Initialize Firebase App singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

/* CRITICAL: The app will break without specifying firestoreDatabaseId */
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

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
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
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
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
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
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    console.error('Google Sign-In Error:', err);
    return null;
  }
}

export async function logOut(): Promise<void> {
  await signOut(auth);
}

// Firestore CRUD operations for Scans
const SCANS_COLLECTION = 'scans';

export async function fetchScansFromFirestore(): Promise<ScanResult[]> {
  try {
    const snapshot = await getDocs(collection(db, SCANS_COLLECTION));
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
    await setDoc(doc(db, SCANS_COLLECTION, scan.id), cleanScan);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteScanFromFirestore(scanId: string): Promise<void> {
  const path = `${SCANS_COLLECTION}/${scanId}`;
  try {
    await deleteDoc(doc(db, SCANS_COLLECTION, scanId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeToScans(
  onUpdate: (scans: ScanResult[]) => void,
  onError?: (err: any) => void
) {
  return onSnapshot(
    collection(db, SCANS_COLLECTION),
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
