import React, { useState } from 'react';

export default function VoiceRecorder({ user, onScenarioCreated }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStartRecording = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
    setIsRecording(true);
  };

  const handleSubmitScenario = async () => {
    if (!transcript) {
      alert("Please record something first.");
      return;
    }

    if (!user) {
      alert("You must be logged in to submit scenarios.");
      return;
    }

    setIsSubmitting(true);
    try {
      const idToken = await user.getIdToken();
      const formData = new FormData();
      formData.append("title", `Voice Prompt ${new Date().toISOString()}`);
      formData.append("prompt", transcript);

      const response = await fetch("http://localhost:8000/scenario/", {
        method: "POST",
        headers: { "id-token": idToken },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create scenario");
      }

      const newScenario = await response.json();
      onScenarioCreated(newScenario);
      setTranscript('');
      alert("Scenario created successfully from voice input!");
    } catch (err) {
      console.error("Error submitting scenario:", err);
      alert("Failed to submit scenario.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="voice-recorder">
      <button onClick={handleStartRecording} disabled={isRecording}>
        {isRecording ? 'Recording...' : 'Start Voice Recording'}
      </button>

      {transcript && (
        <div>
          <p>Transcript: {transcript}</p>
          <button onClick={handleSubmitScenario} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Scenario'}
          </button>
        </div>
      )}
    </div>
  );
}
