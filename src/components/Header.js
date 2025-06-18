import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header
      style={{
        backgroundColor: '#1d1c3b',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src="/images/logo.png"
          alt="WhatIf.AI Logo"
          style={{
            height: '40px',
            width: 'auto',
            marginRight: '1rem',
          }}
        />
        <h2 style={{ color: '#2af5d0', margin: 0 }}>WhatIf.AI</h2>
      </div>
      <nav>
        <Link to="/dashboard" style={{ color: '#2af5d0', marginRight: '1rem' }}>
          Dashboard
        </Link>
        <Link to="/about" style={{ color: '#2af5d0', marginRight: '1rem' }}>
          About
        </Link>
        <Link to="/contact" style={{ color: '#2af5d0' }}>
          Contact
        </Link>
      </nav>
    </header>
  );
}

export default Header;
