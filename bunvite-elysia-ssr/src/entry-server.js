// src/entry-server.js
console.log('[SSR] entry-server.js loaded and rendering minimal HTML.');

export function render(initialCount) {
  return `
    <div id="app-content-ssr">
      <h1>Hello from SSR - Minimal!</h1>
      <p id="count-display">Count: ${initialCount}</p>
      <button id="increment-button">Increment</button>
    </div>
  `;
}