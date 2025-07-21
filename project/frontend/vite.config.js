import { defineConfig } from 'vite';

export default defineConfig({
  // Thư mục chứa các tệp tĩnh sẽ được sao chép trực tiếp vào thư mục đầu ra.
  // Mặc định là 'public'. Các tệp trong thư mục này sẽ được phục vụ tại gốc.
  // Ví dụ: public/my-image.png sẽ có thể truy cập tại /my-image.png
  publicDir: 'public', // Giữ nguyên thư mục public cho các tài sản tĩnh

  build: {
    // Thư mục đầu ra cho tất cả các bản dựng.
    // Các bản dựng cụ thể sẽ ghi đè hoặc tạo thư mục con bên trong này.
    // Thay đổi từ 'public' sang 'dist' để tách biệt với publicDir
    outDir: 'public', // Vite sẽ tạo 'dist' nếu chưa có
    emptyOutDir: true, // Xóa thư mục dist trước khi build

    rollupOptions: {
      input: {
        // Điểm vào cho ứng dụng chính (ví dụ: trang người dùng)
        main: './src/main.js',

        // Điểm vào cho khu vực admin
        adminMain: './src/admin/main.js',
        adminLogin: './src/admin/adminLogin.js',
      },
      output: {
        // Đặt tên các tệp entry (JS/CSS liên kết với HTML)
        entryFileNames: ({ name }) => {
          // Các tệp JS/CSS của admin
          if (name.includes('admin')) {
            return 'admin/[name].js';
          }
          // Các tệp JS/CSS chính
          return '[name].js';
        },

        // Đặt tên cho các chunk (mã được chia sẻ)
        chunkFileNames: 'assets/[name]-[hash].js',

        // Đặt tên và đường dẫn cho các tài nguyên tĩnh (ảnh, font, etc.)
        assetFileNames: (assetInfo) => {
          const extension = assetInfo.name.split('.').pop();
          if (extension === 'css') {
            // Đặt các file CSS vào thư mục admin nếu chúng từ admin,
            // nếu không thì vào assets/
            if (assetInfo.name.includes('admin/')) {
              // Cố gắng giữ cấu trúc cho CSS của admin
              return `admin/${assetInfo.name.replace('src/admin/', '')}`; // Giữ nguyên tên
            }
            return `assets/[name]-[hash].css`;
          }
          // Các tài nguyên khác (ảnh, font)
          return `assets/[name]-[hash].[ext]`;
        },
      },
    },
  },
});
