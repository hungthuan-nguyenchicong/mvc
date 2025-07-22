// src/app.js

// Hàm này sẽ tạo ra chuỗi HTML của ứng dụng
export function renderAppHtml(message) {
    return `
        <div>
            <h1>${message}</h1>
            <p>Đây là ứng dụng Vanilla JS được render bởi Bun (SSR) và được hydrate bởi Vite (Client).</p>
            <button id="myButton">Click me!</button>
            <p id="clickCount">Đã click: 0 lần</p>
        </div>
    `;
}

// Hàm này sẽ gắn các sự kiện vào DOM đã tồn tại
export function hydrateApp() {
    const button = document.getElementById('myButton');
    const clickCountElement = document.getElementById('clickCount');
    let count = 0;

    if (button && clickCountElement) {
        button.addEventListener('click', () => {
            count++;
            clickCountElement.textContent = `Đã click: ${count} lần`;
            console.log('Nút đã được click!');
        });
    }
}