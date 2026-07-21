// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Track widget installation
// const trackWidgetInstallation = async () => {
//   try {
//     const response = await fetch('https://your-vercel-app.vercel.app/api/track-widget', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         // The server will read headers, but we can also send additional data
//         widgetId: 'your-widget-id',
//         timestamp: new Date().toISOString(),
//       }),
//     });
    
//     if (!response.ok) {
//       console.warn('Failed to track widget installation');
//     }
//   } catch (error) {
//     // Don't let tracking failures break the widget
//     console.warn('Tracking error:', error);
//   }
// };

// Initialize widget
const initializeWidget = () => {
  // Create container if it doesn't exist
  let container = document.getElementById('chat-widget-root');
  if (!container) {
    container = document.createElement('div');
    container.id = 'chat-widget-root';
    document.body.appendChild(container);
  }

  // Track installation
  // trackWidgetInstallation();

  // Render the widget
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// Auto-initialize if script is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeWidget);
} else {
  initializeWidget();
}

// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
// import "./index.css";

// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
