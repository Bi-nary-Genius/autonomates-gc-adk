import React from 'react';

function Contact() {
  return (
    <div
      style={{
        padding: '3rem 2rem',
        color: '#fff',
        background: 'linear-gradient(to bottom right, #1d1c3b, #2a235b)',
      }}
    >
      <h1 style={{ color: '#2af5d0', marginBottom: '2rem' }}>Meet the Creators</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2rem',
          marginBottom: '4rem',
        }}
      >
        {/* Sherie Chandler */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '2rem',
            borderRadius: '12px',
            textAlign: 'left',
            lineHeight: '1.6',
          }}
        >
          <img
            src="/images/sherie.jpeg"
            alt="Sherie Chandler"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #2af5d0',
              marginBottom: '1rem',
            }}
          />
          <h3>Sherie Chandler</h3>
          <p style={{ color: '#ccc' }}>
            Co-Creator, Full-Stack & AI Developer, Product Strategist
          </p>
          <p><strong>Contribution to WhatIf.AI:</strong> Implemented authentication, UI, and Firestore integration. Connected Firebase to backend routes, deployed to custom domain, and integrated image classification with Vertex AI Vision. Implemented TTS agent and is developing STIG automation.</p>
          <p><strong>Key Skills:</strong> JavaScript, React, Firebase, FastAPI, Vertex AI, UX Design</p>
          <p><strong>Why:</strong> I’m passionate about building real-time decision support systems that blend AI, intuitive UX, and strong security. I thrive on learning, designing intelligent agents, and exploring how ethical AI can empower people—not replace them—by preserving
              meaningful, human-centered work.</p>
          <p>
            <strong>Connect:</strong>{' '}
            <a
              href="https://github.com/Bi-nary-Genius"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#2af5d0' }}
            >
              GitHub
            </a>
          </p>
        </div>

        {/* Chiu Ssu Hsieh */}
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            padding: '2rem',
            borderRadius: '12px',
            textAlign: 'left',
            lineHeight: '1.6',
          }}
        >
          <img
            src="/images/chiussu.png"
            alt="Chiu Ssu Hsieh"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #2af5d0',
              marginBottom: '1rem',
            }}
          />
          <h3>Chiu Ssu Hsieh</h3>
          <p style={{ color: '#ccc' }}>
            Co-Creator, Backend & AI Integrations Specialist
          </p>
          <p><strong>Contribution to WhatIf.AI:</strong> Designed backend architecture using FastAPI. Integrated Vertex AI for NLU, TTS, and scenario generation. Wrote backend API documentation and implemented security rules for Cloud Storage. Leading HIPAA automation in Sprint 3.</p>
          <p><strong>Key Skills:</strong> Python, FastAPI, Vertex AI, Firebase Security Rules, Google Cloud Platform</p>
          <p><strong>Why:</strong> Motivated to build tools that make complex AI usable, secure, and actionable in regulated industries.</p>
          <p>
            <strong>Connect:</strong>{' '}
            <a
              href="https://github.com/chiussuhsieh"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#2af5d0' }}
            >
              GitHub
            </a>
          </p>
        </div>
      </div>

      <footer style={{ fontSize: '0.85rem', color: '#aaa', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
        &copy; 2025 WhatIf.AI. All rights reserved. |{' '}
        <a href="/about" style={{ color: '#2af5d0' }}>About</a>
      </footer>
    </div>
  );
}

export default Contact;
