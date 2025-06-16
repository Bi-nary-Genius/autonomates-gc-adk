import React from 'react';
import './Card.css';

// The component now accepts an 'isPlaying' prop to change the button's state
function Card({ title, description, imageUrl, onDelete, onEdit, onPlay, isPlaying }) {
  return (
    <div className="card glass-panel">
      <img src={imageUrl} alt={`Visual representation for scenario: ${title}`} className="card-image" />
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
        <div className="card-actions">
          {/* This button's text and disabled state are now controlled by the parent. */}
          <button
            className="card-button play-button"
            onClick={onPlay}
            disabled={isPlaying}
          >
            {isPlaying ? 'Playing...' : 'Play Audio'}
          </button>
          <button className="card-button" onClick={onEdit}>Edit</button>
          <button className="card-button delete-button" onClick={onDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default Card;
