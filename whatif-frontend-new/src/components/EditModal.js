import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import './EditModal.css';

// This line is important for accessibility. It tells the modal library
// which element to hide from screen readers when the modal is open.
Modal.setAppElement('#root');

export default function EditModal({ isOpen, onRequestClose, scenario, onSave }) {
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');

  // This useEffect hook updates the form fields whenever a new scenario is selected for editing.
  useEffect(() => {
    if (scenario) {
      setTitle(scenario.title || '');
      setPrompt(scenario.prompt || '');
    }
  }, [scenario]);

  const handleSave = () => {

    onSave({
      ...scenario,
      title,
      prompt,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal"
      overlayClassName="overlay"
    >
      <h2>Edit Scenario</h2>

      <div className="form-group">
        <label htmlFor="edit-title">Scenario Title:</label>
        <input
          type="text"
          id="edit-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="edit-prompt">Your "What If" Prompt:</label>
        <textarea
          id="edit-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={5}
        />
      </div>

      <div className="modal-actions">
        <button className="modal-button cancel-button" onClick={onRequestClose}>Cancel</button>
        <button className="modal-button save-button" onClick={handleSave}>Save Changes</button>
      </div>
    </Modal>
  );
}
