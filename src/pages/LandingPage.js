import React from "react";
import "./LandingPage.css";
// import Chatbot from '../components/Chatbot'; // You'd import your chatbot component here

function LandingPage() {
  return (
    <div className="landing-page">
      <nav className="navbar">
        <h1>WhatIf.AI</h1>
        <div className="nav-links">
          <a href="/dashboard">Dashboard</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/settings">Settings</a>
        </div>
      </nav>


      <section className="hero">
        <h2>What If You Could Simulate Smarter Decisions?</h2>
        <p>
          WhatIf.AI blends immersive storytelling with productivity automation. Upload a photo, ask a question, or simplify cybersecurity compliance—all through intelligent agents trained to help users think clearer and act faster.
        </p>
        <div className="cta-buttons">
          <a className="btn" href="/dashboard">🎯 Try the Demo</a>
          <a className="btn secondary" href="https://youtu.be/demo">▶️ Watch it in Action</a>
        </div>
      </section>


      <footer>
        <p>© 2025 WhatIf.AI. All rights reserved.</p>
      </footer>

      {/* Optional: Floating Chatbot Icon - This would be a separate component */}
      {/* <Chatbot /> */}
    </div>
  );
}

export default LandingPage;