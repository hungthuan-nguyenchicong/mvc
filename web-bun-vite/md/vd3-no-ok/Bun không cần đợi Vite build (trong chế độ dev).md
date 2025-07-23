# Bun không cần đợi Vite build (trong chế độ dev)
## Cấu trúc thư mục mới
web-bun-vite/
├── node_modules/
├── public/
│   └── index.html  <-- Tệp index.html mới được di chuyển vào đây
├── src/
│   └── main.js     <-- Tệp JavaScript client-side
├── dist/           <-- Sẽ được tạo sau khi chạy 'bun build'
├── package.json
├── server.js
└── vite.config.js

## public/index.html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bun SSR + Vite + Vanilla JS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #f0f4f8; /* Màu nền nhẹ nhàng */
            color: #334155; /* Màu chữ chính */
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            box-sizing: border-box;
        }
        .container {
            background-color: #ffffff;
            padding: 40px;
            border-radius: 16px; /* Góc bo tròn */
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08); /* Đổ bóng nhẹ */
            text-align: center;
            max-width: 600px;
            width: 100%;
        }
        h1 {
            color: #1e293b;
            margin-bottom: 16px;
            font-size: 2.5rem; /* Kích thước tiêu đề lớn hơn */
            font-weight: 700;
        }
        p {
            font-size: 1.125rem; /* Kích thước đoạn văn dễ đọc */
            line-height: 1.6;
            margin-bottom: 24px;
        }
        button {
            background-color: #4f46e5; /* Màu nút đẹp */
            color: #ffffff;
            padding: 12px 24px;
            border-radius: 12px; /* Góc bo tròn cho nút */
            font-weight: 600;
            transition: background-color 0.3s ease, transform 0.2s ease;
            cursor: pointer;
            border: none;
            outline: none;
        }
        button:hover {
            background-color: #4338ca;
            transform: translateY(-2px); /* Hiệu ứng nhấc nhẹ khi hover */
        }
        button:active {
            transform: translateY(0);
        }
        #app-message {
            margin-top: 20px;
            font-style: italic;
            color: #64748b;
        }
    </style>
</head>
<body>
    <div class="container">
        <div id="app-ssr-placeholder"></div>

        <p id="client-message">Nội dung này được thêm vào từ phía client (Vanilla JS).</p>
        <button id="counter-button">Nhấn vào đây: 0</button>
        <p id="app-message"></p>
    </div>

    <script type="module" src="/src/main.js"></script>
</body>
</html>

## src/main.js

// src/main.js
// Đây là mã JavaScript chạy ở phía trình duyệt (client-side).

console.log("Client-side JavaScript đã tải.");

const counterButton = document.getElementById('counter-button');
const appMessage = document.getElementById('app-message');
let count = 0;

const appDiv = document.getElementById('app');
if (appDiv) {
    appMessage.textContent = "Phần 'app' đã được render từ máy chủ và bây giờ được 'hydrate' bởi client-side JS.";
} else {
    appMessage.textContent = "Phần 'app' không được render từ máy chủ, chỉ có client-side JS hoạt động.";
    const ssrPlaceholder = document.getElementById('app-ssr-placeholder');
    const newAppDiv = document.createElement('div');
    newAppDiv.id = 'app';
    newAppDiv.innerHTML = `<h1>Chào mừng từ Client!</h1><p>Ứng dụng được khởi tạo hoàn toàn từ client.</p>`;
    if (ssrPlaceholder) {
        ssrPlaceholder.appendChild(newAppDiv);
    } else {
        document.querySelector('.container').prepend(newAppDiv);
    }
}

counterButton.addEventListener('click', () => {
    count++;
    counterButton.textContent = `Nhấn vào đây: ${count}`;
});

document.getElementById('client-message').style.color = '#10b981'; // Màu xanh lá cây

## server.js
// server.js
// Máy chủ Bun này xử lý SSR và phục vụ các tài nguyên tĩnh,
// đồng thời hoạt động như một proxy đến Vite dev server trong chế độ phát triển.

import { serve } from "bun";
import { readFileSync } from "fs";
import path from "path";

// Xác định môi trường: production hay development
const isProduction = process.env.NODE_ENV === 'production';
const projectRoot = import.meta.dir; // Thư mục hiện tại của tệp server.js
const viteDevServerUrl = 'http://localhost:5173'; // URL mặc định của Vite dev server

let templateHtml;

if (isProduction) {
  // Trong chế độ production, đọc tệp index.html đã được build từ thư mục 'dist'
  const distPath = path.join(projectRoot, 'dist');
  templateHtml = readFileSync(path.join(distPath, 'index.html'), 'utf-8');
} else {
  // Trong chế độ development, đọc tệp index.html gốc từ thư mục 'public'
  templateHtml = readFileSync(path.join(projectRoot, 'public', 'index.html'), 'utf-8');
}

// Hàm giả lập việc render ứng dụng ở phía máy chủ
// Trong một dự án Vite SSR thực tế, bạn sẽ import 'entry-server.js' từ Vite
// và gọi một hàm render để tạo ra chuỗi HTML của ứng dụng.
async function renderAppOnServer() {
  // Ví dụ đơn giản: trả về một chuỗi HTML tĩnh.
  // Trong thực tế, đây sẽ là kết quả của việc render component gốc của bạn.
  return `<div id="app"><h1>Chào mừng đến với Bun SSR!</h1><p>Nội dung này được render từ máy chủ.</p></div>`;
}

console.log("Máy chủ Bun SSR đang khởi động...");
console.log(`Môi trường: ${isProduction ? 'Production' : 'Development'}`);

serve({
  port: 3000,
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (!isProduction) {
      // Trong chế độ development, proxy các yêu cầu cho client của Vite và các tệp nguồn
      // Bao gồm: /src/ (mã nguồn của bạn), /@vite/client (client của Vite HMR),
      // /@fs/ (truy cập hệ thống tệp của Vite), /node_modules/ (các gói node_modules)
      if (pathname.startsWith('/src/') || pathname.startsWith('/@vite/client') || pathname.startsWith('/@fs/') || pathname.startsWith('/node_modules/')) {
        console.log(`Proxying ${pathname} to Vite dev server at ${viteDevServerUrl}`);
        // Chuyển tiếp yêu cầu đến Vite dev server
        try {
          const viteResponse = await fetch(`${viteDevServerUrl}${pathname}`, request);
          return viteResponse;
        } catch (error) {
          console.error(`Lỗi khi proxy đến Vite: ${error.message}`);
          return new Response(`Lỗi proxy đến Vite: ${error.message}`, { status: 502 });
        }
      }
    }

    // Phục vụ các tài nguyên tĩnh từ thư mục 'dist' trong chế độ production
    if (isProduction && (pathname.startsWith('/assets/') || pathname.endsWith('.css') || pathname.endsWith('.js'))) {
      const filePath = path.join(projectRoot, 'dist', pathname);
      try {
        const file = Bun.file(filePath);
        if (await file.exists()) {
          console.log(`Serving static file: ${filePath}`);
          return new Response(file);
        }
      } catch (error) {
        console.error(`Lỗi khi phục vụ tệp tĩnh ${filePath}:`, error);
        return new Response("Không tìm thấy tài nguyên", { status: 404 });
      }
    }

    // Xử lý các yêu cầu trang HTML (ví dụ: '/')
    if (pathname === '/') {
      try {
        const appHtml = await renderAppOnServer();
        // Thay thế placeholder bằng nội dung đã được render từ máy chủ
        const finalHtml = templateHtml.replace(`<div id="app-ssr-placeholder"></div>`, appHtml);

        return new Response(finalHtml, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      } catch (e) {
        console.error("Lỗi trong quá trình render SSR:", e);
        return new Response("Lỗi máy chủ nội bộ", { status: 500 });
      }
    }

    // Trả về 404 cho các đường dẫn không xác định
    return new Response("Không tìm thấy trang", { status: 404 });
  },
});

console.log("Máy chủ đang chạy tại http://localhost:3000");
if (isProduction) {
  console.log("Hãy đảm bảo bạn đã chạy 'bun build' (hoặc 'vite build') để tạo thư mục 'dist' trước khi chạy máy chủ này trong chế độ production.");
} else {
  console.log("Trong chế độ development, hãy đảm bảo Vite dev server cũng đang chạy trên http://localhost:5173.");
}

## vite.config.js
// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  // Đặt thư mục gốc của dự án là thư mục chứa vite.config.js
  // Điều này thường là thư mục gốc của dự án.
  root: '.',
  // Chỉ định thư mục chứa các tài nguyên tĩnh (như index.html)
  // Vite sẽ phục vụ các tệp từ thư mục này trực tiếp.
  publicDir: 'public',
  server: {
    // Xóa cấu hình proxy ở đây, vì máy chủ Bun sẽ xử lý proxy cho '/src/'
    // và các đường dẫn Vite-specific khác trong chế độ development.
    // Vite sẽ chỉ phục vụ các tệp của riêng nó và xử lý HMR.
  },
  build: {
    // Đảm bảo Vite biết điểm vào cho bản build SSR là gì.
    // Đối với Vanilla JS, đây có thể là điểm vào phía client chính của bạn.
    ssr: 'src/main.js',
    outDir: 'dist', // Thư mục đầu ra cho bản build production
  },
});
