// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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
const analytics = getAnalytics(app);