// frontend/vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  // Cấu hình Vite tại đây
  // Ví dụ: để phục vụ các file từ thư mục 'public' trong frontend
  publicDir: 'public',
  server: {
    port: 5173, // Đảm bảo trùng với port trong package.json
  },
});