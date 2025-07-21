# Đề xuất cấu trúc dự án

Với mục tiêu học Vanilla JS và muốn Bun phục vụ các file tĩnh, đồng thời tối ưu hóa quy trình phát triển frontend với Vite, đây là một đề xuất cấu trúc và cách thiết lập tối ưu hơn so với việc cố gắng làm JS entry point trực tiếp mà không có HTML.

Đề xuất cấu trúc dự án
project/
├── backend/
│   ├── controllers/
│   │   └── AdminController.js
│   ├── core/
│   │   └── AdminRouter.js
│   └── server.js                  <-- Bun backend server
├── frontend/
│   ├── public/                     <-- Vite output for static assets
│   │   ├── vite.svg
│   │   └── favicon.ico (optional)
│   ├── src/
│   │   ├── assets/                 <-- Common assets (images, fonts)
│   │   │   └── javascript.svg
│   │   ├── admin/
│   │   │   ├── dashboard.js        <-- Admin JS entry
│   │   │   └── dashboard.html      <-- Admin HTML entry
│   │   ├── main.js                 <-- Main JS entry for public site
│   │   ├── style.css
│   │   └── index.html              <-- Main public site HTML entry
│   ├── .gitignore
│   ├── package.json
│   └── vite.config.js              <-- Vite configuration
└── package.json (root)             <-- Optional: monorepo package.json for common scripts
Tại sao lại đề xuất cấu trúc này?
Tách biệt rõ ràng: frontend và backend độc lập, dễ quản lý.

Tận dụng Vite hiệu quả: Vite được sinh ra để tối ưu hóa việc phát triển frontend dựa trên HTML/JS/CSS. Việc sử dụng index.html và admin/dashboard.html làm các điểm vào (entry points) chính sẽ cho phép Vite cung cấp Hot Module Replacement (HMR) và live reloading tốt nhất trong quá trình phát triển.

Phục vụ file tĩnh linh hoạt bởi Bun: Bun có thể dễ dàng phục vụ nhiều file HTML và các asset liên quan từ thư mục đã build của Vite.

Dễ mở rộng: Bạn có thể thêm các trang hoặc các ứng dụng frontend độc lập khác trong frontend/src một cách dễ dàng.

1. Cấu hình Vite (frontend/vite.config.js)
Đây là nơi bạn định nghĩa cách Vite xử lý các điểm vào HTML và nơi nó sẽ build ra các file tĩnh.

JavaScript

// project/frontend/vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname, 'src'), // <-- Rất quan trọng: Vite sẽ xem 'src' là thư mục gốc của frontend
  
  build: {
    outDir: path.resolve(__dirname, 'public'), // <-- Build vào project/frontend/public
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: {
        // Đây là các điểm vào HTML chính của ứng dụng web của bạn
        // Vite sẽ phân tích các file này để tìm các script JS và CSS liên quan
        main: path.resolve(__dirname, 'src/index.html'),
        admin: path.resolve(__dirname, 'src/admin/dashboard.html'), // Điểm vào cho trang Admin
      },
    },
  },
  server: {
    port: 5173, // Cổng mặc định của Vite dev server
    proxy: {
      // Proxy tất cả các request đến /api và /admin về Bun backend
      '/api': 'http://localhost:3000',
      '/admin': 'http://localhost:3000',
    },
  },
});


Giải thích:

root: path.resolve(__dirname, 'src'): Đây là thay đổi quan trọng nhất. Nó cho Vite biết rằng thư mục src (tức là project/frontend/src) là thư mục gốc cho các file frontend của bạn. Điều này đơn giản hóa việc tham chiếu đường dẫn trong HTML và JavaScript của bạn. Ví dụ, trong index.html, bạn có thể viết <script type="module" src="/main.js"></script> thay vì /src/main.js.

outDir: path.resolve(__dirname, 'public'): Đảm bảo Vite build ra project/frontend/public.

input trong rollupOptions: Bạn liệt kê tất cả các file HTML làm điểm vào chính. Vite sẽ tự động xử lý các file JS/CSS mà các file HTML này tham chiếu.

2. Cấu trúc HTML và JS cho Frontend
project/frontend/src/index.html(Trang công khai chính)
HTML

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Public Site - Vanilla JS</title>
    <link rel="stylesheet" href="/style.css"> </head>
<body>
    <div id="app-public"></div>
    <script type="module" src="/main.js"></script> </body>
</html>
project/frontend/src/main.js(Logic cho trang công khai chính)
JavaScript

// project/frontend/src/main.js
import './style.css'; // Import CSS vào JS (Vite sẽ xử lý)
import { setupCounter } from './counter.js'; // Ví dụ import một module khác

console.log('Public site JavaScript loaded!');

document.addEventListener('DOMContentLoaded', () => {
    const appDiv = document.getElementById('app-public');
    if (appDiv) {
        appDiv.innerHTML = `
            <h1>Welcome to the Public Site!</h1>
            <p>This content is from main.js.</p>
            <button id="publicCounter">Click me!</button>
        `;
        setupCounter(document.getElementById('publicCounter'));
    }
});
project/frontend/src/admin/dashboard.html(Trang Admin)
HTML

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="/style.css"> 
</head>
<body>
    <div id="app-admin"></div>
    <script type="module" src="/admin/dashboard.js"></script> </body>
</html>
project/frontend/src/admin/dashboard.js(Logic cho trang Admin)
JavaScript

// project/frontend/src/admin/dashboard.js
console.log('Admin Dashboard JavaScript loaded!');

document.addEventListener('DOMContentLoaded', () => {
    const adminAppDiv = document.getElementById('app-admin');
    if (adminAppDiv) {
        adminAppDiv.innerHTML = `
            <h1>Admin Dashboard</h1>
            <p>Welcome, Admin!</p>
            <button id="testAdminIndex">Fetch /admin/index</button>
            <button id="testAdminLoginGet">Fetch /admin/login (GET)</button>
            <button id="testAdminLoginPost">Send /admin/login (POST)</button>
        `;

        document.getElementById('testAdminIndex').addEventListener('click', async () => {
            const res = await fetch('/admin/index');
            const text = await res.text();
            alert('Response from /admin/index: ' + text);
        });

        document.getElementById('testAdminLoginGet').addEventListener('click', async () => {
            const res = await fetch('/admin/login');
            const text = await res.text();
            alert('Response from /admin/login (GET): ' + text);
        });

        document.getElementById('testAdminLoginPost').addEventListener('click', async () => {
            const res = await fetch('/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: 'admin', password: 'password' })
            });
            const json = await res.json();
            alert('Response from /admin/login (POST): ' + JSON.stringify(json));
        });
    }
});
3. Cấu hình Bun Server (backend/server.js)
Bun server sẽ phục vụ các file tĩnh đã build từ frontend/public/ và các API routes.

JavaScript

// ./project/backend/server.js

import { serve, file } from "bun";
import { AdminRouter } from "../core/AdminRouter.js";
import path from 'path';

// Đường dẫn tuyệt đối đến thư mục frontend/public
const FRONTEND_PUBLIC_DIR = path.join(import.meta.dir, '../../frontend/public');

const server = serve({
    port: process.env.PORT || 3000,
    
    async fetch(req) {
        const url = new URL(req.url);
        const pathname = url.pathname;
        const method = req.method;

        // --- 1. Xử lý AdminRouter động ---
        // Ví dụ: /admin/index, /admin/login
        if (pathname.startsWith('/admin/')) {
            // Kiểm tra xem đây có phải là một API call (không phải file HTML/CSS/JS tĩnh của admin)
            // Bằng cách kiểm tra không có phần mở rộng file
            if (!pathname.includes('.')) { 
                const parts = pathname.split('/').filter(Boolean);
                if (parts.length >= 2 && parts[0] === 'admin') {
                    const methodName = parts[1];
                    req.params = { method: methodName }; 

                    const dynamicAdminHandler = AdminRouter['/admin/:method'];
                    if (dynamicAdminHandler) {
                        return await dynamicAdminHandler(req);
                    }
                }
            }
        }

        // --- 2. Phục vụ các file tĩnh từ FRONTEND_PUBLIC_DIR ---
        // Yêu cầu file tĩnh có thể là /index.html, /main.js, /style.css, /admin/dashboard.html, ...
        let filePath = path.join(FRONTEND_PUBLIC_DIR, pathname);
        
        // Đặc biệt xử lý yêu cầu gốc (/) để trả về index.html chính
        if (pathname === '/') {
            filePath = path.join(FRONTEND_PUBLIC_DIR, 'index.html');
        } 
        // Nếu yêu cầu đến /admin/ và không có file cụ thể, trả về dashboard.html của admin
        else if (pathname === '/admin/') {
             filePath = path.join(FRONTEND_PUBLIC_DIR, 'admin', 'dashboard.html');
        }

        const requestedFile = Bun.file(filePath);

        if (await requestedFile.exists() && !(await requestedFile.isDirectory())) {
            return new Response(requestedFile);
        }

        // --- 3. Xử lý các API routes khác (nếu có) ---
        // Ví dụ: /api/products, /api/users
        // ... thêm logic API routes của bạn tại đây ...

        // --- 4. Fallback cho Single Page Application (SPA) ---
        // Nếu không tìm thấy file tĩnh khớp và không phải API/Admin API,
        // trả về index.html chính để client-side router xử lý.
        // Điều này áp dụng cho các route như /about, /contact mà không phải là file tĩnh
        const spaIndexHtmlFile = Bun.file(path.join(FRONTEND_PUBLIC_DIR, 'index.html'));
        if (await spaIndexHtmlFile.exists()) {
            return new Response(spaIndexHtmlFile, {
                headers: { 'Content-Type': 'text/html' }
            });
        }

        // --- 5. Trả về 404 nếu không tìm thấy gì ---
        return new Response('Page 404 - Not Found', { status: 404 });
    }
});

console.log(`Bun server running on http://${process.env.HOST || 'localhost'}:${server.port}`);
Quy trình làm việc được đề xuất
Mở 2 Terminal:

Terminal 1 (Backend Dev): Di chuyển đến project/backend.

Chạy bun run server.js. Server Bun sẽ lắng nghe trên cổng 3000.

Terminal 2 (Frontend Dev): Di chuyển đến project/frontend.

Chạy bun install.

Chạy bun dev (đã được cấu hình trong package.json của frontend để chạy vite). Vite dev server sẽ lắng nghe trên cổng 5173.

Phát triển Frontend:

Truy cập trang Public: Mở trình duyệt và truy cập http://localhost:5173/. Vite sẽ phục vụ index.html và main.js của bạn. Mọi thay đổi trong frontend/src sẽ được live reload hoặc HMR ngay lập tức.

Truy cập trang Admin: Truy cập http://localhost:5173/admin/dashboard.html. Vite sẽ phục vụ trang admin.

Khi frontend của bạn fetch tới /admin/* hoặc /api/*, Vite dev server sẽ tự động proxy request đó tới Bun backend của bạn trên cổng 3000.

Xây dựng cho Sản xuất:

Khi bạn sẵn sàng triển khai, di chuyển đến project/frontend và chạy bun build.

Vite sẽ build toàn bộ frontend của bạn (bao gồm index.html, main.js, style.css, admin/dashboard.html, admin/dashboard.js, và các asset khác) vào thư mục project/frontend/public. Tất cả các file JS/CSS sẽ được tối ưu hóa và có tên được hash.

Chạy Production:

Đảm bảo bạn đã chạy bun build ở frontend.

Chạy bun run server.js ở backend.

Bây giờ, người dùng có thể truy cập http://localhost:3000/ để xem trang công khai hoặc http://localhost:3000/admin/dashboard.html để truy cập trang admin, và tất cả các request API sẽ được xử lý bởi cùng một Bun server.

Cách tiếp cận này mang lại lợi ích của live reloading/HMR của Vite trong quá trình phát triển, đồng thời vẫn cho phép Bun phục vụ tất cả các file tĩnh đã build một cách hiệu quả trong môi trường production, mà không cần cố gắng "hack" Vite để phục vụ JS trực tiếp.