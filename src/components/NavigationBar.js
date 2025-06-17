import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth } from 'firebase/auth';

function NavigationBar({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();

  const handleSignOut = () => {
    auth.signOut().then(() => navigate('/'));
  };

  // Show navbar only on the dashboard
  if (location.pathname !== '/dashboard') return null;

  return (
    <Navbar bg="light" variant="light" expand="lg" fixed="top" className="shadow-sm px-3">
      <Container fluid>
        <Navbar.Brand
          onClick={() => navigate('/')}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: 'bold',
            fontSize: '1.3rem',
            color: '#0088FF',
       }}
        > {/* <-- THIS IS THE CRUCIAL CHANGE: The closing `>` for Navbar.Brand's attributes */}
          {/* Now, the content (your div with text) goes inside the Navbar.Brand component */}
          <div>
            WhatIf.AI?
          </div>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="nav-collapse" />
        <Navbar.Collapse id="nav-collapse" className="justify-content-end">
          <Nav className="align-items-center gap-2">
            <Nav.Link onClick={() => navigate('/dashboard')}>Dashboard</Nav.Link>
            <Nav.Link onClick={() => navigate('/about')}>About</Nav.Link>
            <Nav.Link onClick={() => navigate('/contact')}>Contact</Nav.Link>
            <Nav.Link onClick={() => navigate('/settings')}>Settings</Nav.Link>
            <Button variant="outline-primary" className="ms-3" onClick={handleSignOut}>
              Sign Out
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
