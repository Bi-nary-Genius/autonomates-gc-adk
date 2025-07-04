import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import PhotoUploader from '../components/PhotoUploader';
import STIGClarifier from '../components/STIGClarifier';
import Card from '../components/Card';
import EditModal from '../components/EditModal';
import './Dashboard.css';

function Dashboard({ user }) {
  const [activeTab, setActiveTab] = useState('scenario');
  const [scenarios, setScenarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(null);

  useEffect(() => {
    const fetchScenarios = async () => {
      if (!user) {
        setScenarios([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setFetchError(false);
      try {
        const idToken = await user.getIdToken();
        const res = await fetch('http://localhost:8000/photo_upload/', {
          headers: { 'id-token': idToken }
        });
        if (!res.ok) throw new Error('Failed to fetch scenarios');
        setScenarios(await res.json());
      } catch (err) {
        console.error('Error fetching scenarios:', err);
        setFetchError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchScenarios();
  }, [user]);

  const handleDelete = async (scenarioIdToDelete) => {
    if (!window.confirm("Are you sure you want to permanently delete this scenario?")) return;
    if (!user) return alert("You must be logged in to delete scenarios.");
    try {
      const idToken = await user.getIdToken();
      const response = await fetch(`http://localhost:8000/photo_upload/${scenarioIdToDelete}`, {
        method: 'DELETE',
        headers: { 'id-token': idToken },
      });
      if (!response.ok) throw new Error('Failed to delete scenario.');
      setScenarios((prev) => prev.filter((s) => s.id !== scenarioIdToDelete));
    } catch (error) {
      console.error("Error deleting scenario:", error);
      alert("There was an error deleting the scenario.");
    }
  };

  const handleNewScenario = (newScenario) =>
    setScenarios((prev) => [newScenario, ...prev]);

  const handlePlayAudio = (scenario) => {
    console.log(`Requesting audio for scenario: "${scenario.title}"`);
    alert(`Playing audio for: ${scenario.title}`);
  };

  const handleOpenEditModal = (scenario) => {
    setCurrentScenario(scenario);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentScenario(null);
  };

  const handleSaveChanges = async (updatedScenario) => {
    if (!user) return alert("You must be logged in to save changes.");
    try {
      const idToken = await user.getIdToken();
      const response = await fetch(`http://localhost:8000/photo_upload/${updatedScenario.id}`, {
        method: 'PUT',
        headers: {
          'id-token': idToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: updatedScenario.title,
          prompt: updatedScenario.prompt,
        }),
      });
      if (!response.ok) throw new Error('Failed to update scenario.');
      setScenarios(scenarios.map(s => s.id === updatedScenario.id ? updatedScenario : s));
      handleCloseModal();
    } catch (error) {
      console.error("Update error:", error);
      alert("Error saving changes.");
    }
  };

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
            <>
              <div className="scenario-creator-panel glass-panel">
                <h2>Build a New Scenario</h2>
                <PhotoUploader user={user} onScenarioCreated={handleNewScenario} />
              </div>

              <div className="info-panel">
                <h2>My Scenarios</h2>
                <p>Manage and explore your WhatIf.AI results.</p>

                {isLoading ? (
                  <p>Loading scenarios…</p>
                ) : fetchError ? (
                  <p style={{ color: 'red' }}>Could not load scenarios.</p>
                ) : scenarios.length === 0 ? (
                  <div className="empty-state">
                    <h3>Welcome to Your Workspace</h3>
                    <p>Create your first scenario using the panel above.</p>
                  </div>
                ) : (
                  <div className="card-grid">
                    {scenarios.map((s) => (
                      <Card
                        key={s.id}
                        title={s.title}
                        description={s.prompt || (s.ai_labels?.length ? `AI tags: ${s.ai_labels.join(', ')}` : 'No description provided.')}
                        imageUrl={(s.imageUrls && s.imageUrls[0]) || "https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg"}
                        story={s.story}
                        onDelete={() => handleDelete(s.id)}
                        onPlay={() => handlePlayAudio(s)}
                        onEdit={() => handleOpenEditModal(s)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'stig' && (
            <div className="glass-panel" style={{ padding: '1rem' }}>
              <h2>STIG Clarification</h2>
              <STIGClarifier user={user} />
            </div>
          )}
        </div>
      </main>

      <EditModal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        scenario={currentScenario}
        onSave={handleSaveChanges}
      />
    </div>
  );
}

export default Dashboard;
