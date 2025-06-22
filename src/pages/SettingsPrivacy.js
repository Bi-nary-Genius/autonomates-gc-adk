import React from "react";

const SettingsPrivacy = () => {
  return (
    <div
      style={{
        padding: "3rem 2rem",
        background: "linear-gradient(to bottom right, #1d1c3b, #2a235b)",
        color: "#fff",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          color: "#2af5d0",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        Settings & Privacy
      </h1>

      {/* Consent & Privacy Section */}
      <div style={sectionStyle}>
        <h2 style={subheading}>Consent & Privacy</h2>
        <p style={descText}>Control how WhatIf.AI handles your data.</p>
        <ul style={ulStyle}>
          <li>
            <label>
              <input type="checkbox" defaultChecked /> Allow AI to process my
              uploaded images
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" defaultChecked /> Enable voice input and
              feedback
            </label>
          </li>
          <li>
            <label>
              <input type="checkbox" /> Share scenarios with trusted
              collaborators
            </label>
          </li>
        </ul>
      </div>

      {/* Account Section */}
      <div style={sectionStyle}>
        <h2 style={subheading}>Account</h2>
        <ul style={ulStyle}>
          <li>
            <a href="/profile" style={linkStyle}>
              Update Display Name
            </a>
          </li>
          <li>
            <a href="/auth/reset-password" style={linkStyle}>
              Change Password
            </a>
          </li>
          <li>
            <button style={buttonStyle}>Delete My Account</button>
          </li>
        </ul>
      </div>

      {/* Data Management Section */}
      <div style={sectionStyle}>
        <h2 style={subheading}>Data Management</h2>
        <ul style={ulStyle}>
          <li>
            <button style={buttonStyle}>Download All My Data</button>
          </li>
          <li>
            <button style={buttonStyle}>
              Clear Uploaded Photos & Audio
            </button>
          </li>
        </ul>
      </div>

      {/* Compliance Section */}
      <div style={sectionStyle}>
        <h2 style={subheading}>Compliance</h2>
        <p style={descText}>
          Your data is secured under HIPAA, FERPA, and GDPR-grade encryption.
          Learn more in our{" "}
          <a href="/security" style={linkStyle}>
            Security Overview
          </a>
          .
        </p>
        <span style={{ fontSize: "0.8rem", color: "#aaa" }}>
          🔒 HIPAA / FERPA / GDPR Compliant
        </span>
      </div>
    </div>
  );
};

// 🔧 Shared Inline Styles
const sectionStyle = {
  marginBottom: "3rem",
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  padding: "2rem",
  borderRadius: "12px",
};

const subheading = {
  color: "#2af5d0",
  fontSize: "1.4rem",
  marginBottom: "1rem",
};

const descText = {
  color: "#ccc",
  marginBottom: "1rem",
};

const ulStyle = {
  listStyle: "none",
  padding: 0,
  lineHeight: "2",
};

const linkStyle = {
  color: "#2af5d0",
  textDecoration: "underline",
};

const buttonStyle = {
  backgroundColor: "transparent",
  color: "#2af5d0",
  border: "1px solid #2af5d0",
  padding: "0.5rem 1rem",
  borderRadius: "6px",
  cursor: "pointer",
  marginTop: "0.5rem",
};

export default SettingsPrivacy;
