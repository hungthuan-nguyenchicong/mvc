// ./project/frontend/vite.config.js

// project/frontend/vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname, 'src'), // <-- Rất quan trọng: Vite sẽ xem 'src' là thư mục gốc của frontend
  
  build: {
    outDir: path.resolve(__dirname, 'public'), // <-- Build vào project/frontend/public
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: {
        // Đây là các điểm vào HTML chính của ứng dụng web của bạn
        // Vite sẽ phân tích các file này để tìm các script JS và CSS liên quan
        main: path.resolve(__dirname, 'src/index.html'),
        admin: path.resolve(__dirname, 'src/admin/dashboard.html'), // Điểm vào cho trang Admin
        login: path.resolve(__dirname, 'src/admin/login.html'), // Điểm vào cho trang login
      },
    },
  },
  server: {
    port: 5173, // Cổng mặc định của Vite dev server
    proxy: {
      // Proxy tất cả các request đến /api và /admin về Bun backend
      '/api': 'http://localhost:3000',
      '/admin': 'http://localhost:3000',
    },
  },
});