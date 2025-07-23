// src/views/appView.js
export function createAppHtml(message, clickCount = 0) {
    return `
        <div>
            <h1>${message}</h1>
            <p>Đây là ứng dụng Vanilla JS được render bởi Bun/Elysia (SSR) và được hydrate bởi Vite (Client).</p>
            <button id="myButton">Click me!</button>
            <p id="clickCount">Đã click: ${clickCount} lần</p>
        </div>
    `;
}