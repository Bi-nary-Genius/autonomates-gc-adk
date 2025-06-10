import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3fIzRSF3oPEqaiNQfT5nerr61uDJFU3s",
  authDomain: "whatif-backend-462323.firebaseapp.com",
  projectId: "whatif-backend-462323",
  storageBucket: "whatif-backend-462323.firebasestorage.app",
  messagingSenderId: "606118025900",
  appId: "1:606118025900:web:5d5e34bb6edcec60fd5d09",
  measurementId: "G-G60TG9KJ47"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Export the auth object so other files can use it
export { auth };
