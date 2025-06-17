// src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import 'bootstrap/dist/css/bootstrap.min.css';

import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import SettingsPrivacy from './pages/SettingsPrivacy';
import SignIn from './pages/SignIn';
import NavigationBar from './components/NavigationBar';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
  const auth = getAuth();
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    setLoading(false);

    if (currentUser) {
      // Redirect to dashboard if logged in and currently on home or signin
      if (location.pathname === '/' || location.pathname === '/signin') {
        navigate('/dashboard', { replace: true });
      }
    } else {
      // If not logged in, prevent access to dashboard
      if (location.pathname === '/dashboard') {
        navigate('/signin', { replace: true });
      }
    }
  });

  return () => unsubscribe();
}, [navigate, location.pathname]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f9f9f9', color: '#333' }}>
        <h2>Loading Application...</h2>
      </div>
    );
  }

  return (
    <>
      <NavigationBar user={user} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/settings" element={<SettingsPrivacy />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </>
  );
}

export default App;
