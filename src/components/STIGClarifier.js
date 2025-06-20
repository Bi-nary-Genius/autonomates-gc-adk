import React, { useState } from 'react';

function STIGClarifier({ user }) {
  const [stigId, setStigId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleClarify = async () => {
    setError('');
    setResult(null);

    if (!stigId.trim()) {
      setError('Please enter a STIG ID.');
      return;
    }

    try {
      const idToken = user && (await user.getIdToken());
      const res = await fetch(`http://localhost:8000/stig/explain_stig?stig_id=${stigId}`, {
        headers: { 'id-token': idToken }
      });

      if (!res.ok) throw new Error('Failed to fetch STIG explanation');
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Unable to retrieve STIG clarification.');
    }
  };

  return (
    <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '2rem' }}>
      <h2 style={{ marginBottom: '1rem', color: '#bdebdc' }}>🔐 STIG AI Clarifier</h2>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
        <input
          type="text"
          value={stigId}
          onChange={(e) => setStigId(e.target.value)}
          placeholder="Enter STIG ID (e.g., V-71991)"
          style={{
            marginRight: '1rem',
            padding: '0.6rem',
            borderRadius: '8px',
            width: '300px',
            border: '1px solid #ccc',
            boxShadow: '0 0 10px rgba(189, 235, 220, 0.2)'
          }}
        />
        <button
          onClick={handleClarify}
          style={{
            padding: '0.6rem 1.2rem',
            backgroundColor: '#bdebdc',
            color: '#1c1c2c',
            fontWeight: 'bold',
            borderRadius: '8px',
            border: 'none',
            boxShadow: '0 4px 12px rgba(189, 235, 220, 0.4)',
            transition: 'transform 0.2s ease-in-out'
          }}
          onMouseOver={e => (e.target.style.transform = 'scale(1.05)')}
          onMouseOut={e => (e.target.style.transform = 'scale(1.0)')}
        >
          Clarify
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: '1rem', textAlign: 'left' }}>
          <p><strong>🧠 Explanation:</strong> {result.explanation}</p>
          <p><strong>⚠️ Impact:</strong> {result.impact}</p>
          <div>
            <strong>🛠 Fixes:</strong>
            <ul>
              {Object.entries(result.example_fixes).map(([os, fix]) => (
                <li key={os}><strong>{os.toUpperCase()}:</strong> {fix}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <a
          href="https://public.cyber.mil/stigs/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '0.6rem 1.2rem',
            backgroundColor: '#bdebdc',
            color: '#1c1c2c',
            fontWeight: 'bold',
            borderRadius: '8px',
            textDecoration: 'none',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={e => (e.target.style.backgroundColor = '#a0ded0')}
          onMouseOut={e => (e.target.style.backgroundColor = '#bdebdc')}
        >
          🔗 View Official STIGs Repository
        </a>
      </div>
    </div>
  );
}

export default STIGClarifier;
