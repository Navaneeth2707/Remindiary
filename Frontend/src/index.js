// src/index.js (or main.js)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Import your App component
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>  {/* Wrap your app with BrowserRouter */}
    <App />
  </BrowserRouter>
);
