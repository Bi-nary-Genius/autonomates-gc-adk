import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getAuth, onAuthStateChanged, getIdToken } from "firebase/auth";



import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SettingsPrivacy from "./pages/SettingsPrivacy";
import SignIn from "./pages/SignIn";

function App() {
  // --- NEW: Add this useEffect hook to listen for auth changes ---
  // This code will run once when the app loads.
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // This block runs if the user is logged in
        console.log("User is signed in. Getting a fresh ID Token...");
        getIdToken(user, /* forceRefresh: true */).then((idToken) => {
          // This is the token you need for Postman!
          console.log("✅ Your fresh ID Token is:", idToken);
        }).catch((error) => {
          console.error("Error getting token:", error);
        });
      } else {
        // This block runs if the user is signed out
        console.log("User is signed out.");
      }
    });

    // This cleans up the listener when the component is no longer on the screen
    return () => unsubscribe();
  }, []); // The empty array [] means this effect runs only once.
  // -------------------------------------------------------------

  return (
    <Router>
      <Routes>
        {/* Root route shows the landing page */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/settings" element={<SettingsPrivacy />} />
        <Route path="/signin" element={<SignIn />} /> {/* 👈 add SignIn route */}
      </Routes>
    </Router>
  );
}

export default App;