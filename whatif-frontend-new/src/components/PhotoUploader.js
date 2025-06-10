import React, { useState } from 'react';
import { getAuth } from "firebase/auth";

// Accept the new onScenarioCreated function as a prop
export default function PhotoUploader({ onScenarioCreated }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // This local state is no longer needed, as the parent will handle it.
  // const [result, setResult] = useState(null);

  const clearForm = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setTitle('');
    setKeywords('');
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setPreviewUrl('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile || !title) return;

    setIsLoading(true);

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert("You must be logged in to create a scenario.");
      setIsLoading(false);
      return;
    }
    const idToken = await user.getIdToken();

    const formData = new FormData();
    formData.append('photo', selectedFile);
    formData.append('title', title);
    formData.append('keywords', keywords);

    try {
      const response = await fetch('http://localhost:8000/photo_upload/', {
        method: 'POST',
        headers: { 'id-token': idToken },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Success:', data);

      // Call the function from the parent to add the new card to the grid
      onScenarioCreated(data);

      // Clear the form for a clean user experience
      clearForm();

    } catch (error) {
      console.error('Error uploading scenario:', error);
      alert('There was an error creating your scenario. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="photo-uploader-content">
      <p>Upload a photo and provide some keywords to bring your "what if" scenario to life.</p>

      <form onSubmit={handleSubmit}>
        {/* --- Form inputs are unchanged --- */}
        <div>
          <label htmlFor="title">Scenario Title:</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Q3 Financial Projection" required style={{ width: '100%', padding: '8px', margin: '10px 0' }}/>
        </div>
        <div>
          <label htmlFor="keywords">Keywords:</label>
          <input type="text" id="keywords" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="e.g., New Job, Dream Vacation, Startup Idea" style={{ width: '100%', padding: '8px', margin: '10px 0' }}/>
        </div>
        <div>
          <label htmlFor="photo">Photo:</label>
          <input type="file" id="photo" accept="image/jpeg, image/png" onChange={handleFileChange} style={{ margin: '10px 0' }}/>
        </div>
        {previewUrl && ( <div><h3>Preview:</h3><img src={previewUrl} alt="Selected preview" style={{ maxWidth: '100%', height: 'auto', maxHeight: '300px', borderRadius: '8px' }} /></div> )}
        <button type="submit" disabled={!selectedFile || !keywords || !title || isLoading} style={{ padding: '10px 20px', marginTop: '20px' }}>
          {isLoading ? 'Analyzing...' : 'Generate Scenario'}
        </button>
      </form>
    </div>
  );
}
