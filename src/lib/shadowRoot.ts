export function createShadowRoot() {
  const container = document.createElement("div");

  container.id = "my-widget-root";

  document.body.appendChild(container);

  return container.attachShadow({
    mode: "open",
  });
}