import React from "react";
import ReactDOM from "react-dom/client";

import Widget from "./components/Widget";
import { createShadowRoot } from "./lib/shadowRoot";

import "./styles/widget.css";

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
      <Widget />
    </React.StrictMode>
  );
})();