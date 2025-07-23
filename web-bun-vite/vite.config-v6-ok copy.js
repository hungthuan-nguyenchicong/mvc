// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public', // Vite sẽ phục vụ các tệp từ thư mục 'public' tại gốc của server
  server: {
    host: '127.0.0.1', // Quan trọng: Đặt host của Vite server thành 127.0.0.1 để nhất quán với Bun
    port: 5173,
    cors: true, // Cho phép CORS để Bun server có thể tải tài nguyên từ Vite dev server
    hmr: { // Cấu hình HMR (Hot Module Replacement) rõ ràng
      host: '127.0.0.1', // Host cho kết nối HMR WebSocket
      port: 5173, // Cổng cho kết nối HMR WebSocket
      protocol: 'ws', // Giao thức WebSocket
    },
    proxy: {
      // Cấu hình proxy:
      // Proxy các yêu cầu trang (ví dụ: '/', '/ac') về máy chủ Bun SSR.
      // Tất cả các yêu cầu khác (bao gồm /src, /node_modules, /__vite_ws__, /@vite/client, v.v.)
      // sẽ được Vite tự xử lý, đảm bảo đúng MIME type và HMR.
      //
      // Chúng ta sẽ sử dụng một hàm để kiểm soát proxy chi tiết hơn.
      // Hàm này sẽ proxy chỉ các yêu cầu HTML và để Vite xử lý các tài nguyên khác.
      //
      // Lưu ý: Nếu bạn muốn proxy một đường dẫn cụ thể như '/ac', bạn có thể thêm nó vào đây.
      // Ví dụ: '/ac': { target: 'http://127.0.0.1:3000', changeOrigin: true, ws: true }
      //
      // Tuy nhiên, để giải quyết vấn đề MIME type và socket,
      // cách tốt nhất là chỉ proxy các yêu cầu HTML và để Vite xử lý các tài nguyên.
      //
      // Sử dụng một hàm proxy tùy chỉnh để kiểm soát chính xác hơn.
      // Yêu cầu đến Vite dev server sẽ được xử lý bởi Vite,
      // ngoại trừ các yêu cầu được chuyển tiếp đến Bun.
      //
      // Đây là một cách tiếp cận phổ biến cho SSR với Vite:
      // Vite sẽ xử lý các tệp src, node_modules, HMR, và public assets.
      // Chỉ các yêu cầu cho HTML (đường dẫn gốc) mới được chuyển đến Bun.
      '/': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        ws: true,
        // Rewrite rule để đảm bảo Bun nhận được đường dẫn gốc '/'
        // nếu bạn truy cập /ac và muốn Bun render trang chính.
        // Nếu Bun của bạn xử lý /ac là một trang khác, bạn có thể bỏ rewrite.
        rewrite: (path) => {
          // Chỉ rewrite nếu đường dẫn là /ac, chuyển nó thành / cho Bun
          // Nếu bạn có nhiều đường dẫn SSR, bạn sẽ cần logic phức tạp hơn.
          if (path === '/') {
            return '/';
          }
          return path;
        },
        // Bỏ qua các đường dẫn mà Vite cần tự xử lý
        bypass: (req, res, proxyOptions) => {
          if (
            req.url.startsWith('/public/') ||
            req.url.startsWith('/src/') ||
            req.url.startsWith('/node_modules/') ||
            req.url.startsWith('/__vite_ws__') ||
            req.url.startsWith('/@vite/client') || // Thêm @vite/client
            req.url.endsWith('.js') || // Bỏ qua các tệp JS
            req.url.endsWith('.css') || // Bỏ qua các tệp CSS
            req.url.endsWith('.svg') || // Bỏ qua các tệp SVG
            req.url.includes('?token=') // Bỏ qua các yêu cầu HMR WebSocket có token
          ) {
            return true; // Vite sẽ tự xử lý yêu cầu này
          }
          return null; // Proxy yêu cầu này
        },
      },
    },
  },
  build: {
    //ssr: 'src/main.js', // Chỉ định entry point cho SSR build
    outDir: 'dist', // Thư mục đầu ra cho bản build
  },
});
