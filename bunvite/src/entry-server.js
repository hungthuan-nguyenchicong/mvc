// src/entry-server.js
import { renderAppHtml } from './app.js';

export function render() {
    // Chúng ta chỉ gọi hàm renderAppHtml để lấy chuỗi HTML
    const html = renderAppHtml("Chào mừng đến với Vanilla JS SSR!");
    return html;
}