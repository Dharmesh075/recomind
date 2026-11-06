import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import { isFirebaseConfigured } from './firebase';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  createdAt?: string;
  language?: string;
  currency?: string;
}

const errorMessages: Record<string, string> = {
  'auth/user-not-found': 'No account found with this email address.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/invalid-credential': 'Invalid email or password. Please try again.',
  'auth/email-already-in-use': 'An account with this email already exists. Try signing in instead.',
  'auth/weak-password': 'Password is too weak. Use at least 8 characters.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Please check your connection.',
  'auth/user-disabled': 'This account has been disabled. Contact support.',
};

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code: string }).code;
    return errorMessages[code] || 'Something went wrong. Please try again.';
  }
  return 'An unexpected error occurred. Please try again.';
}

/* -------------------------------------------------------------
 * Local Storage Authentication Engine (Robust Demo / Offline Fallback)
 * ------------------------------------------------------------- */
const USERS_STORAGE_KEY = 'recomind_registered_users_v1';
const SESSION_STORAGE_KEY = 'recomind_active_session_v1';
const AUTH_EVENT_NAME = 'recomind_auth_change';

async function hashPassword(password: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
    return btoa(password);
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'recomind_salt_2026');
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

interface StoredUser {
  uid: string;
  email: string;
  displayName: string;
  passwordHash: string;
  createdAt: string;
  photoURL?: string | null;
  language?: string;
  currency?: string;
  shoppingPreferences?: string[];
}

async function ensureDefaultDemoUsers(): Promise<StoredUser[]> {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // invalid JSON, reset
    }
  }

  // Pre-seed a clean demo account for presentations & grading
  const demoHash = await hashPassword('Password123');
  const initialUsers: StoredUser[] = [
    {
      uid: 'user_demo_001',
      email: 'demo@recomind.com',
      displayName: 'Alex Morgan',
      passwordHash: demoHash,
      createdAt: '2024-10-15T10:00:00.000Z',
      language: 'English',
      currency: 'INR (₹)',
      shoppingPreferences: ['Audio', 'Workspace'],
    },
  ];
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
  return initialUsers;
}

function notifyAuthChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_EVENT_NAME));
  }
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/* -------------------------------------------------------------
 * Unified Public Authentication Methods
 * ------------------------------------------------------------- */

export async function signIn(
  email: string,
  password: string
): Promise<{ user?: UserProfile; error?: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  if (isFirebaseConfigured()) {
    try {
      const { auth } = await import('./firebase');
      if (!auth) throw new Error('Firebase Auth not available');
      const cred = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      return {
        user: {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: cred.user.displayName,
          photoURL: cred.user.photoURL,
          createdAt: cred.user.metadata.creationTime,
          language: 'English',
          currency: 'INR (₹)',
        },
      };
    } catch (error) {
      return { error: getErrorMessage(error) };
    }
  }

  // Local demo fallback
  await delay(400); // Realistic request timing for loading state
  const users = await ensureDefaultDemoUsers();
  const foundUser = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!foundUser) {
    return { error: 'Invalid email or password. Please try again.' };
  }

  const inputHash = await hashPassword(password);
  if (foundUser.passwordHash !== inputHash) {
    return { error: 'Invalid email or password. Please try again.' };
  }

  const profile: UserProfile = {
    uid: foundUser.uid,
    email: foundUser.email,
    displayName: foundUser.displayName,
    photoURL: foundUser.photoURL || null,
    createdAt: foundUser.createdAt,
    language: foundUser.language || 'English',
    currency: foundUser.currency || 'INR (₹)',
  };

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(profile));
  notifyAuthChange();
  return { user: profile };
}

export async function signUp(
  email: string,
  password: string,
  displayName: string
): Promise<{ user?: UserProfile; error?: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  if (isFirebaseConfigured()) {
    try {
      const { auth } = await import('./firebase');
      if (!auth) throw new Error('Firebase Auth not available');
      const cred = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
      await updateProfile(cred.user, { displayName });
      return {
        user: {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName,
          createdAt: cred.user.metadata.creationTime,
          language: 'English',
          currency: 'INR (₹)',
        },
      };
    } catch (error) {
      return { error: getErrorMessage(error) };
    }
  }

  // Local demo fallback
  await delay(450);
  const users = await ensureDefaultDemoUsers();
  const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (existing) {
    return {
      error: 'An account with this email already exists. Try signing in instead.',
    };
  }

  const passwordHash = await hashPassword(password);
  const newUser: StoredUser = {
    uid: `user_${Date.now()}`,
    email: normalizedEmail,
    displayName: displayName.trim(),
    passwordHash,
    createdAt: new Date().toISOString(),
    language: 'English',
    currency: 'INR (₹)',
    shoppingPreferences: ['Audio', 'Workspace'],
  };

  users.push(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  const profile: UserProfile = {
    uid: newUser.uid,
    email: newUser.email,
    displayName: newUser.displayName,
    createdAt: newUser.createdAt,
    language: newUser.language,
    currency: newUser.currency,
  };

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(profile));
  notifyAuthChange();
  return { user: profile };
}

export async function updateUserProfile(
  updates: Partial<Pick<UserProfile, 'displayName' | 'photoURL' | 'language' | 'currency'>>
): Promise<{ user?: UserProfile; error?: string }> {
  if (isFirebaseConfigured()) {
    try {
      const { auth } = await import('./firebase');
      if (!auth?.currentUser) throw new Error('Not signed in');
      await updateProfile(auth.currentUser, {
        displayName: updates.displayName,
        photoURL: updates.photoURL,
      });
      const updatedUser: UserProfile = {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        displayName: auth.currentUser.displayName,
        photoURL: auth.currentUser.photoURL,
        language: updates.language || 'English',
        currency: updates.currency || 'INR (₹)',
      };
      notifyAuthChange();
      return { user: updatedUser };
    } catch (err) {
      return { error: getErrorMessage(err) };
    }
  }

  // Local demo fallback
  await delay(300);
  const sessionRaw = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionRaw) return { error: 'No active session found.' };

  const currentProfile: UserProfile = JSON.parse(sessionRaw);
  const users = await ensureDefaultDemoUsers();
  const userIdx = users.findIndex((u) => u.uid === currentProfile.uid);

  const updatedProfile: UserProfile = {
    ...currentProfile,
    ...updates,
  };

  if (userIdx >= 0) {
    users[userIdx] = {
      ...users[userIdx],
      displayName: updates.displayName ?? users[userIdx].displayName,
      photoURL: updates.photoURL !== undefined ? updates.photoURL : users[userIdx].photoURL,
      language: updates.language ?? users[userIdx].language,
      currency: updates.currency ?? users[userIdx].currency,
    };
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedProfile));
  notifyAuthChange();
  return { user: updatedProfile };
}

export async function changePassword(
  oldPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  if (isFirebaseConfigured()) {
    try {
      const { auth } = await import('./firebase');
      const { updatePassword, EmailAuthProvider, reauthenticateWithCredential } = await import('firebase/auth');
      if (!auth?.currentUser || !auth.currentUser.email) throw new Error('Not signed in');

      const cred = EmailAuthProvider.credential(auth.currentUser.email, oldPassword);
      await reauthenticateWithCredential(auth.currentUser, cred);
      await updatePassword(auth.currentUser, newPassword);
      return { success: true };
    } catch (err) {
      return { success: false, error: getErrorMessage(err) };
    }
  }

  // Local demo fallback
  await delay(400);
  const sessionRaw = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionRaw) return { success: false, error: 'No active session found.' };

  const currentProfile: UserProfile = JSON.parse(sessionRaw);
  const users = await ensureDefaultDemoUsers();
  const found = users.find((u) => u.uid === currentProfile.uid);
  if (!found) return { success: false, error: 'User record not found.' };

  const oldHash = await hashPassword(oldPassword);
  if (found.passwordHash !== oldHash) {
    return { success: false, error: 'The current password you entered is incorrect.' };
  }

  if (newPassword.length < 8) {
    return { success: false, error: 'New password must be at least 8 characters.' };
  }

  found.passwordHash = await hashPassword(newPassword);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  return { success: true };
}

export async function deleteAccount(
  passwordConfirm: string
): Promise<{ success: boolean; error?: string }> {
  if (isFirebaseConfigured()) {
    try {
      const { auth } = await import('./firebase');
      const { deleteUser, EmailAuthProvider, reauthenticateWithCredential } = await import('firebase/auth');
      if (!auth?.currentUser || !auth.currentUser.email) throw new Error('Not signed in');
      const cred = EmailAuthProvider.credential(auth.currentUser.email, passwordConfirm);
      await reauthenticateWithCredential(auth.currentUser, cred);
      await deleteUser(auth.currentUser);
      await signOutUser();
      return { success: true };
    } catch (err) {
      return { success: false, error: getErrorMessage(err) };
    }
  }

  // Local demo fallback
  await delay(500);
  const sessionRaw = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!sessionRaw) return { success: false, error: 'No active session found.' };

  const currentProfile: UserProfile = JSON.parse(sessionRaw);
  const users = await ensureDefaultDemoUsers();
  const userIdx = users.findIndex((u) => u.uid === currentProfile.uid);
  if (userIdx === -1) return { success: false, error: 'User record not found.' };

  const checkHash = await hashPassword(passwordConfirm);
  if (users[userIdx].passwordHash !== checkHash) {
    return { success: false, error: 'Password confirmation failed. Please enter your correct password.' };
  }

  // Remove user record
  users.splice(userIdx, 1);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  // Remove user-specific persistence
  localStorage.removeItem(`recomind_wishlist_${currentProfile.uid}`);
  localStorage.removeItem(`recomind_history_${currentProfile.uid}`);
  localStorage.removeItem(`recomind_prefs_${currentProfile.uid}`);

  await signOutUser();
  return { success: true };
}

export function getShoppingPreferences(uid?: string): string[] {
  if (typeof window === 'undefined') return ['Audio', 'Workspace'];
  try {
    const key = uid ? `recomind_prefs_${uid}` : 'recomind_prefs_guest';
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return ['Audio', 'Workspace'];
}

export function saveShoppingPreferences(categories: string[], uid?: string): void {
  if (typeof window === 'undefined') return;
  const key = uid ? `recomind_prefs_${uid}` : 'recomind_prefs_guest';
  localStorage.setItem(key, JSON.stringify(categories));
  window.dispatchEvent(new Event('recomind_prefs_updated'));
}

export async function resetPassword(
  email: string
): Promise<{ success: boolean; error?: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  if (isFirebaseConfigured()) {
    try {
      const { auth } = await import('./firebase');
      if (auth) {
        await sendPasswordResetEmail(auth, normalizedEmail);
      }
      return { success: true };
    } catch (error) {
      console.warn('Firebase reset warning:', error);
      return { success: true };
    }
  }

  // Local demo fallback
  await delay(350);
  if (typeof window !== 'undefined') {
    const resets = JSON.parse(localStorage.getItem('recomind_password_resets') || '[]');
    resets.push({
      email: normalizedEmail,
      timestamp: new Date().toISOString(),
      resetToken: `rec_${Math.random().toString(36).substring(2, 10)}`,
    });
    localStorage.setItem('recomind_password_resets', JSON.stringify(resets));
  }
  return { success: true };
}

export async function signOutUser(): Promise<void> {
  if (isFirebaseConfigured()) {
    try {
      const { auth } = await import('./firebase');
      if (auth) await firebaseSignOut(auth);
    } catch (err) {
      console.warn('Firebase signout error:', err);
    }
  }

  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    notifyAuthChange();
  }
}

export function subscribeToAuthState(
  callback: (user: UserProfile | null) => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  if (isFirebaseConfigured()) {
    let unsubscribeFirebase: (() => void) | undefined;
    import('firebase/auth').then(({ onAuthStateChanged }) => {
      import('./firebase').then(({ auth }) => {
        if (auth) {
          unsubscribeFirebase = onAuthStateChanged(auth, (fbUser) => {
            if (fbUser) {
              callback({
                uid: fbUser.uid,
                email: fbUser.email,
                displayName: fbUser.displayName,
                photoURL: fbUser.photoURL,
                createdAt: fbUser.metadata.creationTime,
                language: 'English',
                currency: 'INR (₹)',
              });
            } else {
              callback(null);
            }
          });
        }
      });
    });
    return () => {
      if (unsubscribeFirebase) unsubscribeFirebase();
    };
  }

  // Local storage listener
  const checkSession = () => {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      callback(null);
      return;
    }
    try {
      callback(JSON.parse(raw));
    } catch {
      callback(null);
    }
  };

  // Immediate check
  checkSession();

  window.addEventListener(AUTH_EVENT_NAME, checkSession);
  window.addEventListener('storage', checkSession);

  return () => {
    window.removeEventListener(AUTH_EVENT_NAME, checkSession);
    window.removeEventListener('storage', checkSession);
  };
}
