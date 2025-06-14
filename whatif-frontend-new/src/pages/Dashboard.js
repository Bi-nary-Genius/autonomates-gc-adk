import React, { useState, useEffect } from 'react';
import PhotoUploader from '../components/PhotoUploader';
import VoiceRecorder from '../components/VoiceRecorder';
import Card from '../components/Card';
import EditModal from '../components/EditModal';
import './Dashboard.css';
import { getAuth, signOut } from "firebase/auth";

function Dashboard({ user }) {
  const [scenarios, setScenarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(null);

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Sign out error", error);
      });
  };

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
    if (!user) {
      alert("You must be logged in to delete scenarios.");
      return;
    }
    try {
      const idToken = await user.getIdToken();
      const response = await fetch(`http://localhost:8000/photo_upload/${scenarioIdToDelete}`, {
        method: 'DELETE',
        headers: { 'id-token': idToken },
      });
      if (!response.ok) throw new Error('Failed to delete scenario from the server.');
      setScenarios((prev) => prev.filter((s) => s.id !== scenarioIdToDelete));
    } catch (error) {
      console.error("Error deleting scenario:", error);
      alert("There was an error deleting the scenario. Please try again.");
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
    if (!user) {
        alert("You must be logged in to save changes.");
        return;
    }

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

        if (!response.ok) {
            throw new Error('Failed to save changes to the server.');
        }

        setScenarios(scenarios.map(s => s.id === updatedScenario.id ? updatedScenario : s));
        handleCloseModal();

    } catch (error) {
        console.error("Error saving changes:", error);
        alert("There was an error saving your changes. Please try again.");
    }
  };

  return (
    <>
    <div className="dashboard-header">
    <button onClick={handleSignOut} className="logout-button">Log Out</button>
     </div>
    <div className="dashboard-container">


      <div className="scenario-creator-panel glass-panel">
        <h1>Build a New Scenario</h1>
        <PhotoUploader onScenarioCreated={handleNewScenario} user={user} />
        <VoiceRecorder onScenarioCreated={handleNewScenario} user={user} />
        
      </div>

      <div className="info-panel">
        <h2>Dashboard</h2>
        <p>Manage and explore your What If moments.</p>

        {isLoading ? (
          <p>Loading scenarios…</p>
        ) : fetchError ? (
          <p style={{ color: 'red' }}>Could not load scenarios.</p>
        ) : scenarios.length === 0 ? (
          <div className="empty-state">
            <h3>Welcome to Your Workspace</h3>
            <p>Create your first scenario using the panel on the left.</p>
          </div>
        ) : (
          <div className="card-grid">
            {scenarios.map((s) => (
              <Card
                key={s.id}
                title={s.title}
                description={ s.prompt || (s.ai_labels?.length ? `AI tags: ${s.ai_labels.join(', ')}` : 'No description provided.') }
                imageUrl={s.imageUrl}
                onDelete={() => handleDelete(s.id)}
                onPlay={() => handlePlayAudio(s)}
                onEdit={() => handleOpenEditModal(s)}
              />
            ))}
          </div>
        )}
      </div>

      <EditModal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        scenario={currentScenario}
        onSave={handleSaveChanges}
      />
    </div>
    </>
  );
}

export default Dashboard;
