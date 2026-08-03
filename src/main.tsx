// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
 import './index.css';
declare global {
  interface Window {
    MyWidget: {
      clientId: string;
    };
  }
}

// Initialize widget
const initializeWidget = () => {
  // Create container if it doesn't exist
  let container = document.getElementById('chat-widget-root');
  if (!container) {
    container = document.createElement('div');
    container.id = 'chat-widget-root';
    document.body.appendChild(container);
  }

  // Track installation early so the widget origin is recorded as soon as it initializes.
  // void WidgetTracker.trackInstallation();

  // Render the widget
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App 
                    clientId={window.MyWidget.clientId.toString()}

      />
    </React.StrictMode>
  );
};

// Auto-initialize if script is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeWidget);
} else {
  initializeWidget();
}
 