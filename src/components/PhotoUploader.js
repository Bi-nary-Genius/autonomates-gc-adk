import React, { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { getAuth } from "firebase/auth";
import './PhotoUploader.css';

export default function PhotoUploader({ onScenarioCreated, user }) {
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

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

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] },
    multiple: true,
  });

  // --- Voice Recording Logic ---
  const handleRecordToggle = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorderRef.current.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunks.current.push(e.data);
        };
        mediaRecorderRef.current.onstop = handleStopRecording;
        audioChunks.current = [];
        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        alert("Microphone access was denied or is not supported by your browser.");
        console.error("Mic error:", err);
      }
    } else {
      mediaRecorderRef.current.stop();
      // The stream tracks are stopped in handleStopRecording
    }
  };

  const handleStopRecording = async () => {
    // Stop all media tracks to turn off the microphone indicator
    mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    setIsRecording(false);

    const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
    const formData = new FormData();
    formData.append("file", audioBlob, "prompt.webm");

    // TODO: Add backend call for Speech-to-Text here
    alert("Recording stopped. Speech-to-Text integration is the next step!");
  };


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
    formData.append('prompt', prompt);

    try {
      const res = await fetch('http://localhost:8000/photo_upload/', {
        method: 'POST',
        headers: { 'id-token': idToken },
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data
          = await res.json();
      /*testing for ai story generation*/
      console.log("Generated:",data.scenario_generated);
      onScenarioCreated(data);
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

        {/* --- Section 1: Title --- */}
        <div className="form-section-box">
          <label htmlFor="title">Scenario Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Patient XYZ - Post-Op Analysis"
            required
          />
        </div>

        {/* --- Section 2: Prompt --- */}
        <div className="form-section-box">
            <div className="prompt-header">
                <label htmlFor="prompt">Your "What If" Prompt</label>
                <button type="button" onClick={handleRecordToggle} className={`record-button ${isRecording ? 'recording' : ''}`}>
                    {isRecording ? 'Stop' : 'Speak'} 🎙️
                </button>
            </div>
            <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder='Type or speak your prompt here...'
                rows={4}
            />
        </div>

        {/* --- Section 3: Photo Upload --- */}
        <div className="form-section-box">
            <label>Optional: Add Photos</label>
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <p>Drag & drop images, or click to select (up to {maxFiles})</p>
            </div>
        </div>

        {files.length > 0 && (
          <div className="preview-container">
            <h4>Image Previews</h4>
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
          {isLoading ? (
            <>
              Analyzing...
              <span className="button-spinner"></span>
            </>
          ) : (
            'Generate Scenario'
          )}
        </button>
      </form>
    </div>
  );
}
