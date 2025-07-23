// vite.config.js
import { defineConfig } from 'vite';
// import path from 'path'; // 'path' không còn cần thiết nếu không dùng trong cấu hình

export default defineConfig({
  root: '.',
  publicDir: 'public', // Có thể giữ lại nếu bạn vẫn có các tài nguyên tĩnh trong public/
                       // hoặc có thể loại bỏ nếu Bun hoàn toàn xử lý mọi thứ
  server: {
    host: '127.0.0.1', // Đặt host rõ ràng để nhất quán với Bun
    port: 5173,
    cors: true, // Cho phép CORS để Bun server có thể tải tài nguyên từ Vite dev server
    hmr: { // Cấu hình HMR rõ ràng để đảm bảo kết nối WebSocket
      host: '127.0.0.1',
      port: 5173,
      protocol: 'ws',
    },
    watch: {
      usePolling: true // Sử dụng polling nếu bạn gặp vấn đề với HMR trong môi trường ảo (WSL, Docker)
    },
    proxy: {
      // Proxy tất cả các yêu cầu TRỪ các đường dẫn bắt đầu bằng
      // '/src', '/node_modules', '/dist', hoặc '/@vite/client'
      // Điều này đảm bảo Vite tự phục vụ các tệp nguồn, dependencies, và HMR client,
      // trong khi các yêu cầu trang (như '/') được proxy đến Bun server.
      '^/(?!src|node_modules|dist|@vite/client)': {
        target: 'http://localhost:3000', // Địa chỉ của máy chủ Bun SSR của bạn
        changeOrigin: true, // Thay đổi header Host của yêu cầu thành target URL
        ws: true, // Để proxy WebSocket nếu Bun server có WebSocket riêng (không phải cho Vite HMR)
      },
    },
  },
  build: {
    ssr: 'src/main.js', // Chỉ định entry point cho SSR build
    outDir: 'dist', // Thư mục đầu ra cho bản build
  },
});