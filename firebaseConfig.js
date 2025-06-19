// NoteWave/firebaseConfig.js
// This file initializes Firebase and exports the database instance.
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration (provided by the user)
const firebaseConfig = {
  apiKey: "AIzaSyATGw1a0DQuO7GCyRKgTUPAxvkoqEnGTzw",
  authDomain: "notesyncapp-b23bd.firebaseapp.com",
  projectId: "notesyncapp-b23bd",
  storageBucket: "notesyncapp-b23bd.firebasestorage.app",
  messagingSenderId: "130366594882",
  appId: "1:130366594882:web:1e0a777e50196658c572db",
  measurementId: "G-CJYMK4Z0RV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the Realtime Database service
const database = getDatabase(app);

// Export the database instance for use in other files
export { database };