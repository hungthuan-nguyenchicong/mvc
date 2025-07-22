// src/entry-client.js
import { hydrateApp } from './app.js';

// Đảm bảo mã này chỉ chạy trên trình duyệt
if (typeof document !== 'undefined') {
    // Gọi hàm hydrateApp để gắn các sự kiện
    hydrateApp();
    console.log('Client-side hydration hoàn tất!');
}