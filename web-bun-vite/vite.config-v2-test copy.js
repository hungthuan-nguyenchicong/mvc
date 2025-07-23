// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  // Đặt thư mục gốc của dự án là thư mục chứa vite.config.js
  root: '.',
  // Chỉ định thư mục chứa các tài nguyên tĩnh (như index.html)
  // Vite sẽ phục vụ các tệp từ thư mục này trực tiếp.
  publicDir: 'public',
  server: {
    port: 5173, // Cổng mặc định của Vite dev server
    // Proxy tất cả các yêu cầu không phải là tài nguyên tĩnh của Vite
    // về máy chủ Bun SSR đang chạy trên cổng 3000.
    proxy: {
      // Proxy tất cả các yêu cầu đến root path và các API routes (nếu có)
      // Ví dụ: '/', '/api', v.v.
      // Đối với SSR, chúng ta muốn tất cả các yêu cầu trang được proxy.
      '^/': {
        target: 'http://localhost:3000', // Địa chỉ của máy chủ Bun SSR của bạn
        changeOrigin: true, // Thay đổi header Host của yêu cầu thành target URL
        // rewrite: (path) => path, // Giữ nguyên đường dẫn
        // Cấu hình cho WebSocket proxy (nếu bạn có WebSocket trên server 3000)
        ws: true,
      },
    },
  },
  build: {
    // Đảm bảo Vite biết điểm vào cho bản build SSR là gì.
    // Đối với Vanilla JS, đây có thể là điểm vào phía client chính của bạn.
    ssr: 'src/main.js', // Đây là điểm vào cho SSR build, không phải cho client dev
    outDir: 'dist', // Thư mục đầu ra cho bản build production
  },
});
