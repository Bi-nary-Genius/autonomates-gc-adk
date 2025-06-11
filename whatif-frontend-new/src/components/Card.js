

import React from 'react';
import './Card.css'; // We'll create this file next for styling

function Card({ title, description, imageUrl, onDelete }) {
  return (
    <div className="card glass-panel">
      <img src={imageUrl} alt={title} className="card-image" />
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>
        <div className="card-actions">
          <button className="card-button delete-button" onClick={onDelete}>Delete</button>
          <button className="card-button">Edit</button>
        </div>
      </div>
    </div>
  );
}

export default Card;