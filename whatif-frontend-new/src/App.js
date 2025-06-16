import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import DebugGetToken from './components/DebugGetToken';
import About from './pages/About';
import Contact from './pages/Contact';
import SettingsPrivacy from './pages/SettingsPrivacy';
import SignIn from './pages/SignIn';

// The main App component now handles authentication state directly.
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hooks from react-router-dom must be used within a component descendant of <Router>
  const navigate = useNavigate();
  const location = useLocation();

  // This hook listens for changes to the user's login state.
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      // Logic for automatic redirection
      if (currentUser && (location.pathname === '/signin' || location.pathname === '/')) {
        navigate('/dashboard');
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [navigate, location.pathname]);

  // Display a loading message until Firebase has confirmed the auth state.
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#121212', color: 'white' }}>
        <h2>Loading Application...</h2>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      {/* The 'user' object is now passed directly as a prop to the Dashboard */}
      <Route path="/dashboard" element={<>
    <Dashboard user={user} />
    <DebugGetToken />
  </>} />
      <Route path="/dashboard" element={<Dashboard user={user} />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/settings" element={<SettingsPrivacy />} />
      <Route path="/signin" element={<SignIn />} />
    </Routes>
  );
}

// A new Root component wraps the App to provide the necessary Router context.
// This allows the App component itself to use navigation hooks.
function Root() {
  return (
    <Router>
      <App />
    </Router>
  )
}

export default Root;
