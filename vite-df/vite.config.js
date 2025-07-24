// .vite.config.js

import { defineConfig } from 'vite';

export default defineConfig({
    //root: '.',
    publicDir: 'public', // Giữ nguyên thư mục public cho các tài sản tĩnh

    server: {
        proxy: {
            '^/(?!src|node_modules|dist|@vite/client)': {
                target: 'http://localhost:3000', // Địa chỉ của máy chủ Bun SSR của bạn
                changeOrigin: true, // Thay đổi header Host của yêu cầu thành target URL
                ws: true, // Để proxy WebSocket nếu Bun server có WebSocket riêng (không phải cho Vite HMR)
            },
        }
    }

  // Tùy chọn cấu hình Vite khác có thể được thêm ở đây
  // Ví dụ:
  // plugins: [],
  // build: {
  //   outDir: 'dist',
  // },
  // server: {
  //   port: 3000,
  // },
});