import React from 'react';
import './Card.css';

// accepts 'onEdit' and 'onPlay' function props
function Card({ title, description, imageUrl, onDelete, onEdit, onPlay }) {
  return (
    <div className="card glass-panel">
      <img src={imageUrl} alt={`Visual representation for scenario: ${title}`} className="card-image" />
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
        <div className="card-actions">
          <button className="card-button play-button" onClick={onPlay}>Play Audio</button>
          {/* This button now correctly calls the onEdit function when clicked */}
          <button className="card-button" onClick={onEdit}>Edit</button>
          <button className="card-button delete-button" onClick={onDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default Card;
