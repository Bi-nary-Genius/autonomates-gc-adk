import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { getAuth } from "firebase/auth";
import './PhotoUploader.css';

export default function PhotoUploader({ onScenarioCreated, user }) {
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState('');
  // Replaced 'keywords' with 'prompt'
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const maxFiles = 10;

  const onDrop = useCallback((acceptedFiles) => {
    if (files.length + acceptedFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} images.`);
      return;
    }
    const previews = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    setFiles(prev => [...prev, ...previews]);
  }, [files]);

  const removeFile = (fileName) => {
    setFiles(prev => prev.filter(f => f.name !== fileName));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] },
    multiple: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || (!prompt.trim() && files.length === 0)) {
        alert('Please provide a title, and either a prompt or at least one photo.');
        return;
    }

    if (!user) {
      alert("You must be logged in to create a scenario.");
      return;
    }

    setIsLoading(true);
    const idToken = await user.getIdToken();
    const formData = new FormData();

    files.forEach(file => formData.append('photos', file));
    formData.append('title', title);
    formData.append('prompt', prompt); // Sending 'prompt' instead of 'keywords'

    try {
      const res = await fetch('http://localhost:8000/photo_upload/', {
        method: 'POST',
        headers: { 'id-token': idToken },
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      onScenarioCreated(data);
      // Clear the form after a successful submission
      setFiles([]);
      setTitle('');
      setPrompt('');
    } catch (err) {
      console.error(err);
      alert('Upload error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="photo-uploader-content">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Scenario Title:</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Patient XYZ - Post-Op Analysis" required />
        </div>

        {/* Replaced 'Keywords' input with a 'Prompt' textarea */}
        <div className="form-group">
          <label htmlFor="prompt">Your "What If" Prompt:</label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder='e.g., What if this patient develops clots and we start them on this new medication?'
            rows={4}
            style={{ width: '100%', padding: '12px', backgroundColor: 'rgba(255, 255, 255, 0.08)', border: '1px solid #444', borderRadius: '8px', color: '#e0e0e0', fontSize: '1rem' }}
          />
        </div>

        <div {...getRootProps({ className: `dropzone ${isDragActive ? 'active' : ''}` })}>
          <input {...getInputProps()} />
          <p>Optional: Drag & drop images here, or click to select (up to {maxFiles})</p>
        </div>

        {files.length > 0 && (
          <div className="preview-container">
            <h3>Previews:</h3>
            <div className="image-preview-grid">
              {files.map((file) => (
                <div key={file.name} className="preview-wrapper">
                  <img src={file.preview} alt={file.name} className="preview-image" />
                  <button type="button" className="remove-btn" onClick={() => removeFile(file.name)}>×</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button type="submit" className="generate-button" disabled={isLoading || !title}>
          {isLoading ? 'Analyzing...' : 'Generate Scenario'}
        </button>
      </form>
    </div>
  );
}
