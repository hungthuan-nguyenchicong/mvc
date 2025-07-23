// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  server: {
    port: 5173,
    proxy: {
      // Proxy tất cả các yêu cầu TRỪ các đường dẫn bắt đầu bằng
      // '/src', '/node_modules', hoặc '/dist'.
      // Điều này đảm bảo Vite tự phục vụ các tệp nguồn và dependencies,
      // trong khi các yêu cầu trang (như '/') sẽ được proxy về Bun server.
      '^/(?!src|node_modules|dist)': {
        target: 'http://localhost:3000', // Địa chỉ của máy chủ Bun SSR của bạn
        changeOrigin: true, // Thay đổi header Host của yêu cầu thành target URL
        ws: true, // Để proxy WebSocket nếu Bun server có
      },
    },
  },
  build: {
    ssr: 'src/main.js',
    outDir: 'dist',
  },
});
