import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// This is the configuration for your web app's connection to Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBnDaJi7U3ZGQKa8Lp07OaoZPbPJiE4lhw",
  authDomain: "whatif-backend-462323.firebaseapp.com",
  projectId: "whatif-backend-462323",
  storageBucket: "whatif-backend-462323.appspot.com",
  messagingSenderId: "179232866301",
  appId: "1:179232866301:web:0990e11a14da4f940ee394",
  measurementId: "G-19MRXPSJVW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Export the auth object so other files can use it
export { auth };
