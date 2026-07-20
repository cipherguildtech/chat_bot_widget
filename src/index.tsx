import React from "react";
import ReactDOM from "react-dom/client";
import { createShadowRoot } from "./lib/shadowRoot";

import "./styles/widget.css";
import App from "./App";

declare global {
  interface Window {
    MyWidget?: {
      // apiKey?: string;
      theme?: "light" | "dark";
    };
  }
}

(function () {
  const shadowRoot = createShadowRoot();

  const mountPoint = document.createElement("div");

  shadowRoot.appendChild(mountPoint);

  ReactDOM.createRoot(mountPoint).render(
    <React.StrictMode>
      <App/>
    </React.StrictMode>
  );
})();