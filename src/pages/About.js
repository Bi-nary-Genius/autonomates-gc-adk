import React from 'react';
import './LandingPage.css'; // Optional: for shared styles

function About() {
  return (
    <div
      className="about-container"
      style={{
        padding: '3rem 2rem',
        color: '#fff',
        background: 'linear-gradient(to bottom right, #1d1c3b, #2a235b)',
      }}
    >
      <h1 style={{ color: '#2af5d0', marginBottom: '1rem' }}>About WhatIf.AI</h1>

      <p style={{ marginBottom: '1.5rem' }}>
        At WhatIf.AI, we believe one question can unlock powerful insight: <strong>“What if?”</strong>
      </p>

      <p style={{ marginBottom: '2.5rem' }}>
        We're building a customizable, real-time AI tool that helps individuals and enterprises explore decisions and scenarios as they happen.
        Whether you're wondering, “What if I changed careers?” or “What if my system failed a compliance audit?”, WhatIf.AI gives you immediate,
        intelligent feedback — powered by vision, voice, and emotional context.
      </p>

      <h2 style={{ color: '#2af5d0', marginBottom: '1rem' }}>Our Mission</h2>
      <p style={{ marginBottom: '2.5rem' }}>
        To replace hours of confusion with seconds of clarity. WhatIf.AI is redefining how businesses interact with complex information by turning voice, image, and regulation into actionable insight—instantly.
      </p>

      <h2 style={{ color: '#2af5d0', marginBottom: '1rem' }}>What Makes Us Different</h2>
      <ul style={{ paddingLeft: '1.25rem', marginBottom: '3rem' }}>
        <li><strong>Multi-Agent Intelligence:</strong> Vision AI, Speech-to-Text, Text-to-Speech, and NLU work together to interpret voice, tone, and images in real time.</li>
        <li><strong>Immediate Results:</strong> Get instant feedback on life decisions, business scenarios, or compliance concerns.</li>
        <li><strong>Ready for Enterprise Use:</strong> Built to scale with HIPAA and STIG-aligned workflows.</li>
        <li><strong>Powered by Google Cloud + Firebase:</strong> Secure, fast, and scalable infrastructure.</li>
        <li><strong>Customizable by Design:</strong> Built to serve industries like healthcare, education, finance, and more.</li>
      </ul>

      <h2 style={{ color: '#2af5d0', marginBottom: '1rem' }}>Core Capabilities</h2>
      <div
        className="card-grid"
        style={{
          display: 'flex',
          gap: '2rem',
          flexWrap: 'wrap',
          marginBottom: '4rem',
        }}
      >
        <div
          className="card"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '1.5rem',
            borderRadius: '12px',
            flex: '1 1 300px',
          }}
        >
          <h3>AI Interpretation</h3>
          <p>Processes images, voice, and text to understand user context in real time.</p>
        </div>

        <div
          className="card"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '1.5rem',
            borderRadius: '12px',
            flex: '1 1 300px',
          }}
        >
          <h3>Automated Guidance</h3>
          <p>Generates intelligent suggestions and visual/audio simulations based on user input.</p>
        </div>

        <div
          className="card"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '1.5rem',
            borderRadius: '12px',
            flex: '1 1 300px',
          }}
        >
          <h3>Intelligent Query</h3>
          <p>Lets users ask deep “what if” questions across personal and enterprise domains.</p>
        </div>
      </div>

      <h2 style={{ color: '#2af5d0', marginBottom: '1rem' }}>Our Vision for the Future</h2>
      <p style={{ marginBottom: '4rem' }}>
        We envision WhatIf.AI as a foundational tool across industries — enabling banks, hospitals, schools, and individuals to simulate decisions
        before they’re made. With future integrations for compliance, diagnostics, and proactive planning, we aim to turn hypothetical into
        operational insight at scale.
      </p>

      <footer style={{ fontSize: '0.85rem', color: '#aaa', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
        &copy; 2025 WhatIf.AI. All rights reserved. |{' '}
        <a href="/dashboard" style={{ color: '#2af5d0' }}>Dashboard</a> |{' '}
        <a href="/contact" style={{ color: '#2af5d0' }}>Contact</a>
      </footer>
    </div>
  );
}

export default About;
