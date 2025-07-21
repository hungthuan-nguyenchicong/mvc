## Cấu hình vite.config.js cho Chế độ Dev đa năng

// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ command, mode }) => {
  // `command` sẽ là 'serve' khi chạy dev
  // `mode` sẽ là giá trị bạn truyền vào (ví dụ: 'admin', 'client', hoặc 'development' mặc định)

  if (mode === 'admin') {
    console.log('--- Đang chạy DEV cho Admin App ---');
    return {
      root: resolve(__dirname, 'src/admin'), // Thư mục gốc cho admin app
      // Cấu hình server dev cụ thể cho admin
      server: {
        port: 3001, // Admin app chạy trên cổng 3001
        open: '/dashboard.html', // Mở trang dashboard khi khởi động
      },
      build: {
        // Cấu hình build admin (sẽ không được dùng trong dev)
        outDir: 'public/admin_dist',
        rollupOptions: {
          input: {
            dashboard: resolve(__dirname, 'src/admin/dashboard.html'),
            login: resolve(__dirname, 'src/admin/login.html'),
            // ... các entry points khác của admin
          },
        },
      },
      // Thêm các plugin hoặc alias dành riêng cho admin nếu cần
    };
  } else if (mode === 'client') {
    console.log('--- Đang chạy DEV cho Client App ---');
    return {
      root: resolve(__dirname, 'src/client'), // Thư mục gốc cho client app
      server: {
        port: 3000, // Client app chạy trên cổng 3000
        open: true, // Mở trình duyệt với index.html mặc định
      },
      build: {
        // Cấu hình build client (sẽ không được dùng trong dev)
        outDir: 'public/client_dist',
        rollupOptions: {
          input: resolve(__dirname, 'src/client/index.html'),
        },
      },
      // Thêm các plugin hoặc alias dành riêng cho client nếu cần
    };
  }

  // Cấu hình mặc định cho dev (ví dụ: main app)
  console.log('--- Đang chạy DEV cho Main App ---');
  return {
    root: resolve(__dirname, 'src'), // Thư mục gốc mặc định
    server: {
      port: 3000, // Cổng mặc định cho main app
      open: true,
    },
    build: {
      // Cấu hình build mặc định
      outDir: 'public/default_dist',
      rollupOptions: {
        input: resolve(__dirname, 'src/index.html'),
      },
    },
    // ... cấu hình chung cho tất cả các chế độ hoặc mặc định
  };
});

## package.json

{
  "name": "my-project",
  "scripts": {
    "dev": "vite",               // Chạy chế độ dev mặc định (Main App)
    "dev:admin": "vite --mode admin", // Chạy chế độ dev cho Admin App
    "dev:client": "vite --mode client"  // Chạy chế độ dev cho Client App
    // ... các script build tương ứng
  }
}