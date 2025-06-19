import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import PhotoUploader from '../components/PhotoUploader';
import STIGClarifier from '../components/STIGClarifier';
import './Dashboard.css';

function Dashboard({ user }) {
  const [activeTab, setActiveTab] = useState('scenario');

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main-content">
        <div className="dashboard-tabs">
          <button
            className={activeTab === 'scenario' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('scenario')}
          >
            Build New Scenario
          </button>
          <button
            className={activeTab === 'stig' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('stig')}
          >
            STIG AI Clarifier
          </button>
        </div>

        <div className="dashboard-panels">
          {activeTab === 'scenario' && (
            <div className="scenario-creator-panel glass-panel">
              <h2>Build a New Scenario</h2>
              <PhotoUploader user={user} />
            </div>
          )}

          {activeTab === 'stig' && (
            <div className="glass-panel" style={{ padding: '1rem' }}>
              <h2>STIG Clarification</h2>
              <STIGClarifier user={user} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
