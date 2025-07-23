// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Cấu hình cho SSR build
    ssr: 'src/main.js', // Hoặc src/entry-server.js nếu bạn có tệp riêng cho SSR
    outDir: 'dist', // Thư mục đầu ra cho bản build
  },
});