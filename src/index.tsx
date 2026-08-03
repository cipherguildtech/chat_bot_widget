import './index.css'
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";


declare global {
  interface Window {
    MyWidget: {
      clientId: string;
    };
  }
}

(function () {
  let container = document.getElementById("my-widget-root");

if (!container) {
  container = document.createElement("div");
  container.id = "my-widget-root";
  document.body.appendChild(container);
}

  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <App 
              clientId={window.MyWidget.clientId.toString()}

      />
    </React.StrictMode>
  );
})();