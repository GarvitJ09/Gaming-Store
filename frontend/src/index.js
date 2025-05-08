// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import for React 18+
import './index.css';
import App from './App';

// Create a root for the app
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app using the root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
