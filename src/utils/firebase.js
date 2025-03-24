// Update your firebase.js file
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "blog-app-fa076.firebaseapp.com",
  projectId: "blog-app-fa076",
  storageBucket: "blog-app-fa076.firebasestorage.app",
  messagingSenderId: "173848740549",
  appId: "1:173848740549:web:793a77728a3e507a2fe6ac",
  measurementId: "G-TDFJ606VG4"
};

let app;
let storage;

if (typeof window !== 'undefined') {
  app = initializeApp(firebaseConfig);
  storage = getStorage(app);
  
  import('firebase/analytics').then(({ getAnalytics }) => {
    const analytics = getAnalytics(app);
  }).catch((error) => {
    console.error('Analytics failed to load:', error);
  });
} else {
  app = initializeApp(firebaseConfig);
  storage = getStorage(app);
}

export { app, storage };