import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { auth, googleProvider } from '../firebase/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('dwellio_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize auth from token on app load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('dwellio_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res?.user) {
            setUser(res.user);
          } else {
            logout();
          }
        } catch (error) {
          console.warn('Session expired or invalid:', error.message);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login with Email/Password (Firebase Auth with seamless local fallback for seeded demo accounts)
  const login = async (email, password) => {
    try {
      // 1. Attempt Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      // 2. Synchronize with MongoDB backend
      const res = await authService.firebaseAuthSync({ idToken });
      if (res.token && res.user) {
        localStorage.setItem('dwellio_token', res.token);
        localStorage.setItem('dwellio_user', JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
        return res.user;
      }
      throw new Error('Invalid authentication response from server');
    } catch (fbError) {
      // If user is not found in Firebase (e.g. seeded demo accounts like admin@dwellio.com),
      // fall back to MongoDB local authentication
      if (
        fbError.code === 'auth/user-not-found' ||
        fbError.code === 'auth/invalid-credential' ||
        fbError.code === 'auth/invalid-login-credentials'
      ) {
        try {
          const localRes = await authService.login({ email, password });
          if (localRes.token && localRes.user) {
            localStorage.setItem('dwellio_token', localRes.token);
            localStorage.setItem('dwellio_user', JSON.stringify(localRes.user));
            setToken(localRes.token);
            setUser(localRes.user);
            return localRes.user;
          }
        } catch (localErr) {
          throw new Error(localErr.message || 'Invalid email or password');
        }
      }

      // Format Firebase error message for friendly display
      let msg = fbError.message || 'Login failed';
      if (fbError.code === 'auth/wrong-password') msg = 'Incorrect password entered';
      if (fbError.code === 'auth/invalid-email') msg = 'Please enter a valid email address';
      if (fbError.code === 'auth/too-many-requests') msg = 'Too many attempts. Please try again later';
      throw new Error(msg);
    }
  };

  // Register with Email/Password (Creates in Firebase Auth & synchronizes into MongoDB)
  const register = async (userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      const idToken = await userCredential.user.getIdToken();

      const res = await authService.firebaseAuthSync({
        idToken,
        role: userData.role || 'tenant',
        name: userData.name,
        phone: userData.phone,
      });

      if (res.token && res.user) {
        localStorage.setItem('dwellio_token', res.token);
        localStorage.setItem('dwellio_user', JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
        return res.user;
      }
      throw new Error('Registration failed to synchronize with database');
    } catch (error) {
      let msg = error.message || 'Registration failed';
      if (error.code === 'auth/email-already-in-use') msg = 'An account with this email already exists';
      if (error.code === 'auth/weak-password') msg = 'Password should be at least 6 characters';
      if (error.code === 'auth/invalid-email') msg = 'Please provide a valid email address';
      throw new Error(msg);
    }
  };

  // Sign In / Register with Google OAuth
  const loginWithGoogle = async (role = 'tenant') => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const idToken = await userCredential.user.getIdToken();

      const res = await authService.firebaseAuthSync({
        idToken,
        role: role || 'tenant',
        name: userCredential.user.displayName,
        phone: userCredential.user.phoneNumber || '',
      });

      if (res.token && res.user) {
        localStorage.setItem('dwellio_token', res.token);
        localStorage.setItem('dwellio_user', JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
        return res.user;
      }
      throw new Error('Google authentication failed to synchronize');
    } catch (error) {
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Google sign-in popup was closed');
      }
      let msg = error.message || 'Google sign-in failed';
      throw new Error(msg);
    }
  };

  // Sign out from both Firebase and local session
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signout notification:', e.message);
    }
    localStorage.removeItem('dwellio_token');
    localStorage.removeItem('dwellio_user');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const res = await authService.updateProfile(profileData);
    if (res.user) {
      setUser(res.user);
      localStorage.setItem('dwellio_user', JSON.stringify(res.user));
    }
    return res;
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    role: user?.role || null,
    login,
    register,
    loginWithGoogle,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
