// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE,
  authDomain: "blog-app-fa076.firebaseapp.com",
  projectId: "blog-app-fa076",
  storageBucket: "blog-app-fa076.firebasestorage.app",
  messagingSenderId: "173848740549",
  appId: "1:173848740549:web:793a77728a3e507a2fe6ac",
  measurementId: "G-TDFJ606VG4"
};

// Initialize Firebase
let app;
let analytics;

// Initialize Firebase only in browser environment
if (typeof window !== 'undefined') {
  app = initializeApp(firebaseConfig);
  
  // Import and initialize analytics dynamically in the browser
  import('firebase/analytics').then(({ getAnalytics }) => {
    analytics = getAnalytics(app);
  }).catch((error) => {
    console.error('Analytics failed to load:', error);
  });
} else {
  // Server-side initialization
  app = initializeApp(firebaseConfig);
}

export { app };