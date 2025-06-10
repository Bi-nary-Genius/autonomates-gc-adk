import React from "react";
import "./LandingPage.css";

function LandingPage() {
  return (
    <div className="landing-page">
      <nav className="navbar">
        <h1>What If AI App</h1>
        <div className="nav-links">
          <a href="/dashboard">Dashboard</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/settings">Settings</a>
        </div>
      </nav>

      <section className="hero">
        <h2>Imagine the Life You Could Live</h2>
        <p>
          What If is an AI-powered life simulator that brings your memories to life. Upload photos, record your voice, and watch as AI generates immersive ‘what if’ scenarios—narrated in your own voice. Explore how choices, like saving earlier or choosing a different path, could have changed your life. It’s interactive, personal, and blends financial literacy, emotional intelligence,
            and storytelling in a way no other app does.
        </p>
        <a className="btn" href="/signin">Sign In</a>
      </section>

      <footer>
        <p>&copy; 2025 WhatIf App. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
