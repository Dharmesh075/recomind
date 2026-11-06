'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signIn as authSignIn,
  signUp as authSignUp,
  resetPassword as authResetPassword,
  signOutUser,
  subscribeToAuthState,
  updateUserProfile,
  changePassword as authChangePassword,
  deleteAccount as authDeleteAccount,
  getShoppingPreferences,
  saveShoppingPreferences,
  type UserProfile,
} from '@/lib/auth';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  preferences: string[];
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<{ error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (
    updates: Partial<Pick<UserProfile, 'displayName' | 'photoURL' | 'language' | 'currency'>>
  ) => Promise<{ user?: UserProfile; error?: string }>;
  changePassword: (
    oldPassword: string,
    newPassword: string
  ) => Promise<{ success: boolean; error?: string }>;
  deleteAccount: (passwordConfirm: string) => Promise<{ success: boolean; error?: string }>;
  updatePreferences: (categories: string[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState<string[]>(['Audio', 'Workspace']);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setPreferences(getShoppingPreferences(currentUser.uid));
      } else {
        setPreferences(getShoppingPreferences());
      }
      setLoading(false);
    });

    const handlePrefsChange = () => {
      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('recomind_active_session_v1') : null;
        const uid = raw ? JSON.parse(raw)?.uid : undefined;
        setPreferences(getShoppingPreferences(uid));
      } catch {
        setPreferences(getShoppingPreferences());
      }
    };

    window.addEventListener('recomind_prefs_updated', handlePrefsChange);

    return () => {
      unsubscribe();
      window.removeEventListener('recomind_prefs_updated', handlePrefsChange);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await authSignIn(email, password);
    return { error: result.error };
  };

  const signUp = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    const result = await authSignUp(email, password, displayName);
    return { error: result.error };
  };

  const resetPassword = async (email: string) => {
    return authResetPassword(email);
  };

  const signOut = async () => {
    await signOutUser();
  };

  const updateProfile = async (
    updates: Partial<Pick<UserProfile, 'displayName' | 'photoURL' | 'language' | 'currency'>>
  ) => {
    const result = await updateUserProfile(updates);
    if (result.user) {
      setUser(result.user);
    }
    return result;
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    return authChangePassword(oldPassword, newPassword);
  };

  const deleteAccount = async (passwordConfirm: string) => {
    return authDeleteAccount(passwordConfirm);
  };

  const updatePreferences = (categories: string[]) => {
    saveShoppingPreferences(categories, user?.uid);
    setPreferences(categories);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        preferences,
        signIn,
        signUp,
        resetPassword,
        signOut,
        updateProfile,
        changePassword,
        deleteAccount,
        updatePreferences,
      }}
    >
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
