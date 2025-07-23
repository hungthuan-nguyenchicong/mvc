// my-bun-ssr-app-vanilla/src/render-server.js

// Hàm này sẽ tạo ra chuỗi HTML cho component của bạn
export function renderAppContent(initialCount = 0) {
  return `
    <div>
      <h1>Hello from Vanilla JS SSR!</h1>
      <p>Count: <span id="count-display">${initialCount}</span></p>
      <button id="increment-button">Increment</button>
    </div>
  `;
}