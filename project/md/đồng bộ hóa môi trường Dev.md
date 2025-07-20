## đồng bộ hóa môi trường Dev

Tuyệt vời! Bạn đã nắm bắt đúng vấn đề cốt lõi: làm sao để đồng bộ hóa môi trường phát triển giữa Bun backend (phục vụ API và file tĩnh) và Vite frontend (phát triển giao diện người dùng), đặc biệt khi cả hai đều liên quan đến thư mục /public.

Mục tiêu đồng bộ hóa môi trường Dev
Mục tiêu của chúng ta là:

Bun Backend: Phục vụ các API và file tĩnh từ thư mục /public của nó.

Vite Frontend: Trong quá trình phát triển (dev), Vite sẽ tự xử lý các file tĩnh của nó. Sau khi build (prod), Vite sẽ xuất các file này vào một thư mục (thường là dist) mà sau đó Bun backend sẽ chịu trách nhiệm phục vụ.

Để làm được điều này, chúng ta cần cấu hình proxy trong Vite và đảm bảo Bun có thể tìm thấy và phục vụ các file tĩnh đúng cách.

1. Cấu hình Bun Backend
Bun backend sẽ chịu trách nhiệm phục vụ API và các file tĩnh, bao gồm cả các file được build ra từ Vite.

a. Định nghĩa thư mục gốc và thư mục Public
Đầu tiên, hãy đảm bảo bạn có các hằng số đường dẫn chính xác.

TypeScript

// ./src/paths.ts (hoặc bất kỳ tên nào bạn muốn)
import path from 'path';

// ROOT sẽ là thư mục gốc của dự án của bạn (nơi chứa package.json, vite.config.ts, v.v.)
// Giả sử tệp này (paths.ts) nằm trong thư mục 'src'
export const PROJECT_ROOT = path.join(import.meta.dir, '..');

// Thư mục 'public' của backend (nếu có các file tĩnh riêng của backend)
export const BACKEND_PUBLIC_DIR = path.join(PROJECT_ROOT, 'public');

// Thư mục 'dist' nơi Vite sẽ build các file frontend
export const FRONTEND_BUILD_DIR = path.join(PROJECT_ROOT, 'frontend', 'dist');

// Ví dụ về cách Bun sẽ phục vụ các file API
export const API_BASE_PATH = '/api';
b. Viết Bun Server
Server Bun của bạn sẽ làm hai nhiệm vụ chính: phục vụ API và phục vụ các file tĩnh.

TypeScript

// ./src/server.ts
import { serve, file } from 'bun';
import path from 'path';
import { PROJECT_ROOT, BACKEND_PUBLIC_DIR, FRONTEND_BUILD_DIR, API_BASE_PATH } from './paths.ts';

console.log('Project Root:', PROJECT_ROOT);
console.log('Backend Public Dir:', BACKEND_PUBLIC_DIR);
console.log('Frontend Build Dir (for prod):', FRONTEND_BUILD_DIR);

serve({
  port: 3000,
  fetch(request) {
    const url = new URL(request.url);

    // --- 1. Xử lý API Requests ---
    if (url.pathname.startsWith(API_BASE_PATH)) {
      // Ví dụ: API endpoint /api/hello
      if (url.pathname === `${API_BASE_PATH}/hello`) {
        return new Response(JSON.stringify({ message: 'Hello from Bun API!' }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
      // Các API endpoint khác...
      return new Response('API Not Found', { status: 404 });
    }

    // --- 2. Phục vụ File Tĩnh (Frontend Production Build hoặc Backend Public) ---
    // Trong môi trường production, Bun sẽ phục vụ các file đã được build từ Vite.
    // Trong môi trường dev, Vite dev server sẽ tự phục vụ.
    // Logic này chủ yếu dành cho môi trường production.

    let filePath: string;
    let fileToServe: Bun.FileSystemRouter;

    // Ưu tiên phục vụ từ thư mục build của frontend (khi triển khai)
    filePath = path.join(FRONTEND_BUILD_DIR, url.pathname);
    fileToServe = Bun.file(filePath);

    if (fileToServe.exists()) {
        console.log(`Serving frontend build file: ${filePath}`);
        return new Response(fileToServe);
    }

    // Nếu không tìm thấy trong frontend build, thử thư mục public của backend
    filePath = path.join(BACKEND_PUBLIC_DIR, url.pathname);
    fileToServe = Bun.file(filePath);

    if (fileToServe.exists()) {
        console.log(`Serving backend public file: ${filePath}`);
        return new Response(fileToServe);
    }

    // Nếu không tìm thấy bất kỳ file nào, trả về index.html của frontend
    // Điều này quan trọng cho các SPA (Single Page Applications) để xử lý định tuyến phía client.
    const frontendIndex = path.join(FRONTEND_BUILD_DIR, 'index.html');
    const indexHtmlFile = Bun.file(frontendIndex);
    if (indexHtmlFile.exists()) {
        console.log('Serving frontend index.html for unknown path.');
        return new Response(indexHtmlFile);
    }

    return new Response('File Not Found', { status: 404 });
  },
});

console.log('Bun backend listening on http://localhost:3000');
console.log(`API base path: ${API_BASE_PATH}`);
2. Cấu hình Vite Frontend
Vite sẽ chạy một dev server riêng. Để frontend của bạn có thể gọi API từ Bun backend trong môi trường dev, chúng ta sẽ sử dụng proxy của Vite.

a. Cấu trúc dự án điển hình
my-project/
├── backend/                  <-- Bun Backend code (your ./src, ./public here)
│   ├── src/
│   │   ├── server.ts
│   │   └── paths.ts
│   └── public/               <-- Backend's static files (if any)
├── frontend/                 <-- Vite Frontend code
│   ├── index.html
│   ├── src/
│   │   └── main.ts
│   ├── public/               <-- Frontend's static assets (images, etc.)
│   └── vite.config.ts
├── package.json
├── bun.lockb
└── tsconfig.json
Lưu ý: Trong ví dụ này, tôi giả định backend và frontend là các thư mục con trong thư mục gốc của dự án. Điều này giúp quản lý rõ ràng. Bạn sẽ chạy Bun server từ thư mục backend và Vite dev server từ thư mục frontend.

b. Cập nhật vite.config.ts
Trong tệp vite.config.ts của frontend, bạn sẽ cấu hình proxy để chuyển tiếp các yêu cầu API từ frontend dev server sang Bun backend dev server.

TypeScript

// frontend/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Hoặc plugin phù hợp với framework của bạn

// Biến này nên khớp với cổng của Bun backend
const BUN_BACKEND_PORT = 3000;
const API_BASE_PATH = '/api'; // Phải khớp với API_BASE_PATH của backend

export default defineConfig({
  plugins: [react()],
  // Cấu hình server cho môi trường dev
  server: {
    port: 5173, // Cổng mặc định của Vite dev server
    proxy: {
      // Khi frontend yêu cầu /api/*, Vite sẽ chuyển tiếp nó đến Bun backend
      [API_BASE_PATH]: {
        target: `http://localhost:${BUN_BACKEND_PORT}`,
        changeOrigin: true, // Thay đổi Host header thành target URL
        // rewrite: (path) => path.replace(/^\/api/, ''), // Có thể cần nếu API endpoint không bắt đầu bằng /api trên backend
      },
      // Nếu bạn muốn proxy các request tĩnh khác mà Bun phục vụ (ví dụ: /uploads)
      // '/uploads': {
      //   target: `http://localhost:${BUN_BACKEND_PORT}`,
      //   changeOrigin: true,
      // },
    },
  },
  // Cấu hình build cho môi trường production
  build: {
    outDir: '../backend/frontend/dist', // Đảm bảo output folder là nơi Bun sẽ tìm thấy các file build
    emptyOutDir: true, // Xóa thư mục output trước khi build
  },
});
c. Sử dụng API trong Frontend
Trong mã frontend của bạn, bạn sẽ gọi các API với đường dẫn đầy đủ, ví dụ: /api/hello. Vite dev server sẽ thấy điều này và chuyển tiếp nó đến Bun backend.

TypeScript

// frontend/src/App.tsx
import React, { useState, useEffect } from 'react';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Gọi API từ Bun backend
    fetch('/api/hello')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error fetching API:', error));
  }, []);

  return (
    <div>
      <h1>Vite Frontend</h1>
      <p>Message from Bun Backend: {message}</p>
      {/* Ví dụ về việc truy cập file tĩnh từ public của frontend */}
      <img src="/vite.svg" alt="Vite Logo" />
    </div>
  );
}

export default App;
3. Quy trình làm việc và Đồng bộ hóa môi trường Dev
Trong môi trường Dev:

Bạn chạy Bun backend trên cổng 3000 (ví dụ: bun run server.ts từ thư mục backend).

Bạn chạy Vite frontend dev server trên cổng 5173 (ví dụ: bun run dev từ thư mục frontend).

Khi trình duyệt yêu cầu http://localhost:5173/api/hello, Vite dev server sẽ thấy tiền tố /api và proxy yêu cầu đó đến http://localhost:3000/api/hello.

Các file tĩnh của frontend (từ frontend/public hoặc được Vite xử lý) sẽ do Vite dev server tự phục vụ.

Các file tĩnh của backend (từ backend/public) sẽ do Bun server phục vụ trực tiếp.

Trong môi trường Production:

Bạn chạy lệnh build Vite (ví dụ: bun run build từ thư mục frontend). Lệnh này sẽ xuất tất cả các file frontend đã được tối ưu hóa vào thư mục backend/frontend/dist.

Bạn chỉ cần chạy Bun backend (ví dụ: bun run server.ts từ thư mục backend). Bun server của bạn giờ đây sẽ chịu trách nhiệm phục vụ cả API và các file tĩnh đã được build từ thư mục backend/frontend/dist.

Bằng cách này, bạn có một sự tách biệt rõ ràng giữa quá trình phát triển (Vite xử lý frontend, Bun xử lý backend) và quá trình triển khai (Bun xử lý mọi thứ). Đây là một mô hình rất phổ biến và hiệu quả cho các ứng dụng web hiện đại!