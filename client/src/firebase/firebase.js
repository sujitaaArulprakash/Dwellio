import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Dwellio web app Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqYzFiKrlLbL_xylf8mxXt0FZ1On-LSmc",
  authDomain: "dwellio-fd57e.firebaseapp.com",
  projectId: "dwellio-fd57e",
  storageBucket: "dwellio-fd57e.firebasestorage.app",
  messagingSenderId: "531109455797",
  appId: "1:531109455797:web:c0da57a18d1e2f19079bfc",
  measurementId: "G-RKETGFTEZS"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication & Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Analytics conditionally if supported in browser environment
isSupported().then((supported) => {
  if (supported) {
    getAnalytics(app);
  }
}).catch(() => {
  // Graceful fallback for non-analytics environments
});

export default app;
