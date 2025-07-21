import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Thư mục đầu ra mặc định cho tất cả các bản dựng.
    // Các bản dựng cụ thể sẽ ghi đè hoặc tạo thư mục con bên trong này.
    outDir: 'public', // Vite sẽ tự động tạo 'public' nếu chưa có
    emptyOutDir: true, // Xóa thư mục public trước khi build
    
    rollupOptions: {
      input: {
        // Điểm vào cho ứng dụng chính (ví dụ: trang người dùng)
        // src/main.js sẽ được biên dịch vào public/index.html (hoặc public/main.js tùy cấu hình build)
        // Vite thường đặt tên file đầu ra dựa trên tên input key
        main: './src/main.js', // Hoặc './src/index.js' tùy vào file chính của bạn

        // Điểm vào cho khu vực admin
        // src/admin/main.js sẽ được biên dịch vào public/admin/index.html (hoặc public/admin/main.js)
        admin: './src/admin/main.js', // Đảm bảo bạn có file này
        login: './src/admin/login-main.js',
      },
      output: {
        // Tùy chỉnh tên file đầu ra và cấu trúc thư mục
        entryFileNames: ({ name }) => {
          // Nếu tên input là 'admin', đặt vào thư mục 'admin'
          if (name === 'admin') {
            return 'admin/[name].js';
          }
          // Các input khác (ví dụ: 'main') sẽ vào thư mục gốc
          return '[name].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js', // Tùy chọn cho các chunk code chia sẻ
        assetFileNames: 'assets/[name]-[hash].[ext]', // Tùy chọn cho các tài sản (css, hình ảnh...)
      },
    },
  },
});