# Bun SSR (Server-Side Rendering) với Vite ở phía frontend và Vanilla JavaScript

## server.js

// server.js
// Đây là tệp máy chủ Bun chịu trách nhiệm cho SSR và phục vụ các tài nguyên tĩnh.

import { serve } from "bun";
import { readFileSync } from "fs";
import path from "path";

// Đường dẫn tuyệt đối đến thư mục gốc của dự án
// Trong một dự án thực tế, bạn sẽ có thư mục 'dist' sau khi chạy 'vite build'
const projectRoot = import.meta.dir; // Lấy thư mục hiện tại của tệp server.js
const distPath = path.join(projectRoot, 'dist'); // Giả định thư mục build của Vite là 'dist'

// Đọc tệp index.html từ thư mục build của Vite
// Trong quá trình phát triển, Vite sẽ phục vụ index.html trực tiếp.
// Khi deploy, bạn sẽ đọc index.html đã được build.
let templateHtml = readFileSync(path.join(distPath, 'index.html'), 'utf-8');

// Hàm giả lập việc render ứng dụng React/Vue/Vanilla JS ở phía máy chủ
// Trong một dự án Vite SSR thực tế, bạn sẽ import 'entry-server.js' từ Vite
// và gọi một hàm render để tạo ra chuỗi HTML của ứng dụng.
async function renderAppOnServer() {
  // Ví dụ đơn giản: trả về một chuỗi HTML tĩnh.
  // Trong thực tế, đây sẽ là kết quả của việc render component gốc của bạn.
  return `<div id="app"><h1>Chào mừng đến với Bun SSR!</h1><p>Nội dung này được render từ máy chủ.</p></div>`;
}

console.log("Máy chủ Bun SSR đang khởi động...");

serve({
  port: 3000,
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Phục vụ các tài nguyên tĩnh từ thư mục 'dist' của Vite
    // Ví dụ: /assets/index-xxxxxxxx.js, /style.css
    if (pathname.startsWith('/assets/') || pathname.endsWith('.css') || pathname.endsWith('.js')) {
      const filePath = path.join(distPath, pathname);
      try {
        const file = Bun.file(filePath);
        if (await file.exists()) {
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
        // Render ứng dụng ở phía máy chủ
        const appHtml = await renderAppOnServer();

        // Thay thế placeholder trong template HTML bằng nội dung đã render
        const finalHtml = templateHtml.replace(`<!--app-html-->`, appHtml);

        return new Response(finalHtml, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      } catch (e) {
        console.error("Lỗi khi render SSR:", e);
        return new Response("Lỗi máy chủ nội bộ", { status: 500 });
      }
    }

    // Trả về 404 cho các đường dẫn không xác định
    return new Response("Không tìm thấy trang", { status: 404 });
  },
});

console.log("Máy chủ đang chạy tại http://localhost:3000");
console.log("Hãy đảm bảo bạn đã chạy 'bun build' (hoặc 'vite build') để tạo thư mục 'dist' trước khi chạy máy chủ này.");

// Lưu ý quan trọng:
// Trong một dự án Vite SSR thực tế, tệp server.js sẽ:
// 1. Sử dụng 'vite.createServer' để tạo một dev server trong chế độ phát triển.
// 2. Load 'entry-server.js' (được Vite build) để render ứng dụng ở phía máy chủ.
// 3. Load 'index.html' (template) và inject HTML đã render vào đó.
// 4. Phục vụ các tài nguyên tĩnh và thực hiện hydration ở client bằng 'entry-client.js'.

## index.html

<!-- index.html -->
<!-- Đây là tệp HTML gốc mà Vite sử dụng làm template. -->
<!-- Nội dung từ máy chủ sẽ được chèn vào placeholder <!--app-html--> -->

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
        <!-- Đây là placeholder nơi nội dung được render từ máy chủ sẽ được chèn vào -->
        <!-- Ví dụ: <div id="app">...nội dung từ server...</div> -->
        <!--app-html-->

        <p id="client-message">Nội dung này được thêm vào từ phía client (Vanilla JS).</p>
        <button id="counter-button">Nhấn vào đây: 0</button>
        <p id="app-message"></p>
    </div>

    <!-- Client-side JavaScript -->
    <!-- Trong một dự án Vite SSR thực tế, đây sẽ là đường dẫn đến entry-client.js
         được Vite build (ví dụ: /src/entry-client.js hoặc /assets/entry-client.js) -->
    <script type="module">
        // src/main.js (hoặc src/entry-client.js)
        // Đây là mã JavaScript chạy ở phía trình duyệt (client-side).

        console.log("Client-side JavaScript đã tải.");

        const counterButton = document.getElementById('counter-button');
        const appMessage = document.getElementById('app-message');
        let count = 0;

        // Kiểm tra xem #app có tồn tại không (nếu được render từ server)
        const appDiv = document.getElementById('app');
        if (appDiv) {
            appMessage.textContent = "Phần 'app' đã được render từ máy chủ và bây giờ được 'hydrate' bởi client-side JS.";
            // Trong thực tế, bạn sẽ khởi tạo framework (React/Vue) ở đây
            // và gắn nó vào #app để tiếp quản DOM từ server.
        } else {
            appMessage.textContent = "Phần 'app' không được render từ máy chủ, chỉ có client-side JS hoạt động.";
            // Điều này có thể xảy ra nếu SSR không thành công hoặc không được bật.
            const newAppDiv = document.createElement('div');
            newAppDiv.id = 'app';
            newAppDiv.innerHTML = `<h1>Chào mừng từ Client!</h1><p>Ứng dụng được khởi tạo hoàn toàn từ client.</p>`;
            document.querySelector('.container').prepend(newAppDiv);
        }


        counterButton.addEventListener('click', () => {
            count++;
            counterButton.textContent = `Nhấn vào đây: ${count}`;
        });

        // Ví dụ về cách kiểm tra xem JS có chạy ở client hay không
        document.getElementById('client-message').style.color = '#10b981'; // Màu xanh lá cây
    </script>
</body>
</html>

## vite.config.js

// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    // Cấu hình cho SSR build
    ssr: 'src/main.js', // Hoặc src/entry-server.js nếu bạn có tệp riêng cho SSR
    outDir: 'dist', // Thư mục đầu ra cho bản build
  },
});

# fix
## server.js
// server.js
// Đây là tệp máy chủ Bun chịu trách nhiệm cho SSR và phục vụ các tài nguyên tĩnh.

import { serve } from "bun";
import { readFileSync } from "fs";
import path from "path";

// Đường dẫn tuyệt đối đến thư mục gốc của dự án
// Trong một dự án thực tế, bạn sẽ có thư mục 'dist' sau khi chạy 'vite build'
const projectRoot = import.meta.dir; // Lấy thư mục hiện tại của tệp server.js
const distPath = path.join(projectRoot, 'dist'); // Giả định thư mục build của Vite là 'dist'

// Đọc tệp index.html từ thư mục build của Vite
// Trong quá trình phát triển, Vite sẽ phục vụ index.html trực tiếp.
// Khi deploy, bạn sẽ đọc index.html đã được build.
let templateHtml = readFileSync(path.join(distPath, 'index.html'), 'utf-8');

// Hàm giả lập việc render ứng dụng React/Vue/Vanilla JS ở phía máy chủ
// Trong một dự án Vite SSR thực tế, bạn sẽ import 'entry-server.js' từ Vite
// và gọi một hàm render để tạo ra chuỗi HTML của ứng dụng.
async function renderAppOnServer() {
  // Ví dụ đơn giản: trả về một chuỗi HTML tĩnh.
  // Trong thực tế, đây sẽ là kết quả của việc render component gốc của bạn.
  return `<div id="app"><h1>Chào mừng đến với Bun SSR!</h1><p>Nội dung này được render từ máy chủ.</p></div>`;
}

console.log("Máy chủ Bun SSR đang khởi động...");

serve({
  port: 3000,
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Phục vụ các tài nguyên tĩnh từ thư mục 'dist' của Vite
    // Ví dụ: /assets/index-xxxxxxxx.js, /style.css
    if (pathname.startsWith('/assets/') || pathname.endsWith('.css') || pathname.endsWith('.js')) {
      const filePath = path.join(distPath, pathname);
      try {
        const file = Bun.file(filePath);
        if (await file.exists()) {
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
        // Render ứng dụng ở phía máy chủ
        const appHtml = await renderAppOnServer();

        // Thay thế placeholder trong template HTML bằng nội dung đã render
        // CHÚ Ý: Đã thay đổi placeholder từ comment sang div#app-ssr-placeholder
        const finalHtml = templateHtml.replace(`<div id="app-ssr-placeholder"></div>`, appHtml);

        return new Response(finalHtml, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      } catch (e) {
        console.error("Lỗi khi render SSR:", e);
        return new Response("Lỗi máy chủ nội bộ", { status: 500 });
      }
    }

    // Trả về 404 cho các đường dẫn không xác định
    return new Response("Không tìm thấy trang", { status: 404 });
  },
});

console.log("Máy chủ đang chạy tại http://localhost:3000");
console.log("Hãy đảm bảo bạn đã chạy 'bun build' (hoặc 'vite build') để tạo thư mục 'dist' trước khi chạy máy chủ này.");

// Lưu ý quan trọng:
// Trong một dự án Vite SSR thực tế, tệp server.js sẽ:
// 1. Sử dụng 'vite.createServer' để tạo một dev server trong chế độ phát triển.
// 2. Load 'entry-server.js' (được Vite build) để render ứng dụng ở phía máy chủ.
// 3. Load 'index.html' (template) và inject HTML đã render vào đó.
// 4. Phục vụ các tài nguyên tĩnh và thực hiện hydration ở client bằng 'entry-client.js'.





