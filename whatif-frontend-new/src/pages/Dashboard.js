import React, { useState, useEffect } from 'react';
import PhotoUploader from '../components/PhotoUploader';
import Card from '../components/Card';
import './Dashboard.css';

function Dashboard({ user }) {
  const [scenarios, setScenarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  /* Fetch scenarios whenever `user` changes */
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

  /* This function now makes a real API call to delete the scenario */
  const handleDelete = async (scenarioIdToDelete) => {
    // Optional: Add a confirmation dialog for a better user experience
    if (!window.confirm("Are you sure you want to permanently delete this scenario?")) {
      return;
    }

    if (!user) {
        alert("You must be logged in to delete scenarios.");
        return;
    }

    try {
        const idToken = await user.getIdToken();
        const response = await fetch(`http://localhost:8000/photo_upload/${scenarioIdToDelete}`, {
            method: 'DELETE',
            headers: {
                'id-token': idToken,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete scenario from the server.');
        }

        // If the API call is successful, then remove the card from the UI
        setScenarios((prev) => prev.filter((s) => s.id !== scenarioIdToDelete));
        console.log(`Successfully deleted scenario ${scenarioIdToDelete}`);

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

  /* ---------- RENDER ---------- */
  return (
    <div className="dashboard-container">
      <div className="scenario-creator-panel glass-panel">
        <h1>Build a New Scenario</h1>
        <PhotoUploader onScenarioCreated={handleNewScenario} user={user} />
      </div>

      <div className="info-panel">
        <h2>Dashboard</h2>
        <p>Manage and explore your What If moments.</p>

        {isLoading ? (
          <p>Loading scenarios…</p>
        ) : fetchError ? (
          <p style={{ color: 'red' }}>
            Sorry—couldn’t load your scenarios. Please try again.
          </p>
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
                description={
                  s.prompt ||
                  (s.ai_labels?.length
                    ? `AI tags: ${s.ai_labels.join(', ')}`
                    : 'No description provided.')
                }
                imageUrl={s.imageUrl}
                onDelete={() => handleDelete(s.id)}
                onPlay={() => handlePlayAudio(s)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
