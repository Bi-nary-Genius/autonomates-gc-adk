import React, { useState } from 'react';
import PhotoUploader from '../components/PhotoUploader';
import Card from '../components/Card';
import './Dashboard.css';

// mock data, it will be added dynamically
const mockScenarios = [
  { id: 1, title: 'Patient Heart Scan #1', description: 'Scenario based on starting new medication.', imageUrl: 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
  { id: 2, title: 'Financial Projection Q3', description: 'Scenario based on market upturn.', imageUrl: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
];

function Dashboard() {
  const [scenarios, setScenarios] = useState(mockScenarios);

  const handleDelete = (id) => {
    console.log(`Request to delete scenario with id: ${id}`);
    setScenarios(currentScenarios => currentScenarios.filter(s => s.id !== id));
  };

  // This new function will be called by the PhotoUploader component
  // after a new scenario is successfully created by the backend.
  const handleNewScenario = (newScenario) => {
    setScenarios(currentScenarios => [newScenario, ...currentScenarios]);
  };

  return (
    <div className="dashboard-container">
      
      <div className="scenario-creator-panel glass-panel">
        <h1>Build a New Scenario</h1>
        {/* We pass the new handler function as a prop */}
        <PhotoUploader onScenarioCreated={handleNewScenario} />
      </div>

      <div className="info-panel">
        <h2>Dashboard</h2>
        <p>Manage and explore your What If moments.</p>
        
        <div className="card-grid">
          {scenarios.map(scenario => (
            <Card 
              key={scenario.id}
              title={scenario.title}
              description={scenario.description}
              imageUrl={scenario.imageUrl}
              onDelete={() => handleDelete(scenario.id)}
            />
          ))}
        </div>
      </div>

    </div>
  );
}

export default Dashboard;
