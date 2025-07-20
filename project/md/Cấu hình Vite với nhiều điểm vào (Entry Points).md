## Cấu hình Vite với nhiều điểm vào (Entry Points)

Tuyệt vời! Đây là một trường hợp sử dụng phổ biến cho các ứng dụng lớn hơn hoặc có nhiều giao diện (ví dụ: client và admin panel) được quản lý trong cùng một dự án Vite. Vite hỗ trợ cấu hình nhiều điểm vào (entry points) thông qua tùy chọn build.rollupOptions.input.

Để đạt được điều bạn muốn, bạn sẽ cấu hình vite.config.ts (hoặc .js) để có nhiều "input" cho Rollup (engine build của Vite).

Cấu hình Vite với nhiều điểm vào (Entry Points)
Bạn sẽ cần điều chỉnh file vite.config.ts của mình như sau:

TypeScript

// frontend/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Hoặc plugin phù hợp với framework của bạn
import path from 'path';

// Biến này nên khớp với cổng của Bun backend
const BUN_BACKEND_PORT = 3000;
const API_BASE_PATH = '/api';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      [API_BASE_PATH]: {
        target: `http://localhost:${BUN_BACKEND_PORT}`,
        changeOrigin: true,
      },
    },
  },
  build: {
    // Quan trọng: outDir của build sẽ là thư mục gốc nơi tất cả các output sẽ được đặt.
    // Các output cụ thể sẽ được đặt trong các thư mục con tương ứng.
    outDir: '../backend/frontend_dist', // Ví dụ: thư mục này sẽ chứa cả client và admin
    emptyOutDir: true, // Xóa thư mục output trước khi build

    rollupOptions: {
      input: {
        // Điểm vào cho Client View
        // 'client' sẽ là tên thư mục con trong outDir
        // path.resolve(__dirname, 'src/client/main.ts') đảm bảo đường dẫn tuyệt đối
        // '__dirname' ở đây là thư mục 'frontend' (nơi vite.config.ts đang nằm)
        client: path.resolve(__dirname, 'src/client/main.ts'),

        // Điểm vào cho Admin View
        // 'admin/index' sẽ tạo ra một thư mục 'admin' bên trong outDir,
        // và file đầu ra sẽ là 'index.js' (hoặc 'index.html' nếu đó là điểm vào HTML)
        admin: path.resolve(__dirname, 'src/admin/main.ts'),

        // Nếu bạn muốn các file HTML cũng là điểm vào:
        // 'client-html': path.resolve(__dirname, 'index.html'), // Client index.html
        // 'admin-html': path.resolve(__dirname, 'admin.html'), // Admin index.html (nếu bạn có)
      },
      output: {
        // Cấu hình cách các file đầu ra được đặt tên và tổ chức
        // entryFileNames: '[name]/assets/[name]-[hash].js', // Tên file JS cho entry points
        // chunkFileNames: 'assets/chunk-[hash].js', // Tên file JS cho các chunk (shared code)
        // assetFileNames: 'assets/[name]-[hash].[ext]', // Tên file cho các asset (CSS, images)

        // Đối với mục tiêu của bạn:
        // - src/client -> output /public/ (frontend_dist/)
        // - src/admin -> output /public/admin (frontend_dist/admin/)
        // Bạn sẽ cần điều chỉnh base URL hoặc cấu hình server của Bun để phục vụ đúng.

        // Vite sẽ tự động tạo các thư mục con dựa trên key của `input` map.
        // Ví dụ: `client` -> `client/index.js`, `admin` -> `admin/index.js` (trong outDir)
        // Nếu bạn muốn chính xác `/public` và `/public/admin` bên trong `outDir`,
        // bạn có thể đặt `outDir: '../backend/public'` và sau đó `admin: 'src/admin/main.ts'`
        // hoặc để outDir là frontend_dist và quản lý base URL trên backend.

        // Quan trọng: Nếu bạn muốn `client` nằm ở gốc của `frontend_dist`
        // và `admin` nằm ở `frontend_dist/admin`, bạn cần setup `input` một chút khác:
        // input: {
        //   'index': path.resolve(__dirname, 'src/client/main.ts'), // sẽ ra index.js ở gốc
        //   'admin/index': path.resolve(__dirname, 'src/admin/main.ts'), // sẽ ra admin/index.js
        // },
        // Hoặc bạn có thể giữ nguyên cấu trúc `input: { client: ..., admin: ... }`
        // và sau đó chỉnh sửa server Bun để mapping URL phù hợp.
        // Tôi khuyến nghị để Vite tạo cấu trúc `client/` và `admin/` trong outDir,
        // và sau đó Bun sẽ handle các đường dẫn này.
      },
    },
  },
});
Cấu trúc thư mục Frontend
Với cấu hình trên, bạn sẽ có cấu trúc thư mục frontend như sau:

frontend/
├── index.html                  <-- Có thể là điểm vào HTML chính cho client
├── src/
│   ├── client/
│   │   ├── main.ts             <-- Điểm vào chính cho Client view
│   │   └── App.tsx
│   └── admin/
│       ├── main.ts             <-- Điểm vào chính cho Admin view
│       └── AdminPanel.tsx
├── public/                     <-- Các assets tĩnh được copy nguyên bản
│   ├── client_logo.png
│   └── admin_icon.svg
└── vite.config.ts
Cập nhật Bun Backend để phục vụ các File Build
Với việc Vite sẽ build vào ../backend/frontend_dist/client/ và ../backend/frontend_dist/admin/, bạn cần điều chỉnh logic phục vụ file tĩnh của Bun.

1. Cập nhật paths.ts
TypeScript

// ./src/paths.ts
import path from 'path';

export const PROJECT_ROOT = path.join(import.meta.dir, '..');
export const BACKEND_PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');

// Thư mục gốc nơi Vite sẽ build tất cả các output
export const FRONTEND_BUILD_BASE_DIR = path.join(PROJECT_ROOT, 'frontend_dist'); // Đổi tên cho rõ ràng hơn

// Các thư mục con cụ thể trong thư mục build của frontend
export const CLIENT_BUILD_DIR = path.join(FRONTEND_BUILD_BASE_DIR, 'client');
export const ADMIN_BUILD_DIR = path.join(FRONTEND_BUILD_BASE_DIR, 'admin');

export const API_BASE_PATH = '/api';
2. Cập nhật server.ts của Bun
Bây giờ, logic phục vụ file tĩnh của Bun cần kiểm tra các đường dẫn khác nhau.

TypeScript

// ./src/server.ts
import { serve, file } from 'bun';
import path from 'path';
import {
  PROJECT_ROOT,
  BACKEND_PUBLIC_DIR,
  FRONTEND_BUILD_BASE_DIR, // Sử dụng thư mục build gốc
  CLIENT_BUILD_DIR,        // Thư mục build của client
  ADMIN_BUILD_DIR,         // Thư mục build của admin
  API_BASE_PATH,
} from './paths.ts';

console.log('Project Root:', PROJECT_ROOT);
console.log('Backend Public Dir:', BACKEND_PUBLIC_DIR);
console.log('Frontend Build Base Dir:', FRONTEND_BUILD_BASE_DIR);

serve({
  port: 3000,
  fetch(request) {
    const url = new URL(request.url);
    let filePath: string;
    let fileToServe: Bun.FileSystemRouter;

    // --- 1. Xử lý API Requests ---
    if (url.pathname.startsWith(API_BASE_PATH)) {
      if (url.pathname === `${API_BASE_PATH}/hello`) {
        return new Response(JSON.stringify({ message: 'Hello from Bun API!' }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return new Response('API Not Found', { status: 404 });
    }

    // --- 2. Phục vụ File Tĩnh ---

    // Ưu tiên phục vụ các assets của Admin (ví dụ: /admin/index.html, /admin/assets/...)
    if (url.pathname.startsWith('/admin')) {
      filePath = path.join(FRONTEND_BUILD_BASE_DIR, url.pathname);
      fileToServe = Bun.file(filePath);
      if (fileToServe.exists()) {
        console.log(`Serving admin build file: ${filePath}`);
        return new Response(fileToServe);
      }
      // Nếu không tìm thấy file cụ thể, cố gắng trả về index.html của admin SPA
      const adminIndex = path.join(ADMIN_BUILD_DIR, 'index.html');
      const adminIndexFile = Bun.file(adminIndex);
      if (adminIndexFile.exists()) {
          console.log('Serving admin index.html for admin path.');
          return new Response(adminIndexFile);
      }
    }

    // Sau đó, phục vụ các assets của Client (ví dụ: /index.html, /assets/...)
    // Đối với Client, nó thường ở gốc của frontend_dist
    filePath = path.join(FRONTEND_BUILD_BASE_DIR, url.pathname);
    fileToServe = Bun.file(filePath);

    if (fileToServe.exists()) {
        console.log(`Serving client build file: ${filePath}`);
        return new Response(fileToServe);
    }

    // Nếu không tìm thấy file nào, trả về index.html của client SPA (cho các route client-side)
    const clientIndex = path.join(CLIENT_BUILD_DIR, 'index.html');
    const clientIndexFile = Bun.file(clientIndex);
    if (clientIndexFile.exists()) {
        console.log('Serving client index.html for unknown path.');
        return new Response(clientIndexFile);
    }

    // Cuối cùng, thử thư mục public của backend
    filePath = path.join(BACKEND_PUBLIC_DIR, url.pathname);
    fileToServe = Bun.file(filePath);
    if (fileToServe.exists()) {
        console.log(`Serving backend public file: ${filePath}`);
        return new Response(fileToServe);
    }

    return new Response('File Not Found', { status: 404 });
  },
});

console.log('Bun backend listening on http://localhost:3000');
console.log(`API base path: ${API_BASE_PATH}`);
Đồng bộ hóa môi trường Dev và Production
Môi trường Dev (Development)
Bạn chạy Vite dev server cho frontend (từ thư mục frontend). Nó sẽ tự phục vụ các file của src/client và src/admin (hoặc các file HTML nếu bạn đã định nghĩa chúng là điểm vào). Bạn sẽ truy cập http://localhost:5173/ cho client và http://localhost:5173/admin cho admin (Vite dev server tự động xử lý các route này).

Bạn chạy Bun backend server (từ thư mục backend). Vite proxy sẽ chuyển tiếp các yêu cầu /api từ frontend đến Bun.

Môi trường Production
Bạn chạy lệnh build Vite (ví dụ: bun run build từ thư mục frontend). Lệnh này sẽ tạo ra các file đã được tối ưu hóa trong backend/frontend_dist/client/ và backend/frontend_dist/admin/.

Bạn chỉ cần chạy Bun backend server (từ thư mục backend). Bun server của bạn giờ đây sẽ chịu trách nhiệm phục vụ:

API requests (/api/*)

Các file client (/, /assets/...) từ frontend_dist/client/

Các file admin (/admin, /admin/assets/...) từ frontend_dist/admin/

Các file tĩnh của backend (/backend_static/...) từ backend/public/

Với cấu hình này, bạn có một quy trình xây dựng và triển khai mạnh mẽ, cho phép bạn quản lý nhiều giao diện người dùng từ cùng một dự án trong khi vẫn duy trì sự tách biệt và hiệu quả giữa môi trường phát triển và sản xuất.