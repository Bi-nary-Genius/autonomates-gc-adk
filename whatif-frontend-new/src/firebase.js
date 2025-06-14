import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC3fIzRSF3oPEqaiNQfT5nerr61uDJFU3s",
  authDomain: "whatif-backend-462323.firebaseapp.com",
  projectId: "whatif-backend-462323",
  storageBucket: "whatif-backend-462323.appspot.com",
  messagingSenderId: "606118025900",
  appId: "1:606118025900:web:5d5e34bb6edcec60fd5d09",
  measurementId: "G-G60TG9KJ47"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Analytics (optional)
const analytics = getAnalytics(app);

// Auth instance
const auth = getAuth(app);

// Optional for debug button
window.auth = auth;
window.getIdToken = () => auth.currentUser?.getIdToken().then(token => console.log("Your fresh ID Token:", token));

// Correct export
export { app, auth, analytics };
