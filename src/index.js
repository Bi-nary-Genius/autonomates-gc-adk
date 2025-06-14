// In index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Root from './App'; // This is your App component
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'; // IMPORT THE ROUTER

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();