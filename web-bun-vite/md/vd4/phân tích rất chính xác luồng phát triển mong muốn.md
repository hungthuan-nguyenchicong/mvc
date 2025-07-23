# phân tích rất chính xác luồng phát triển mong muốn
chúng ta cần phân tích lại luông của dự án

1 . chúng ta sẽ truy cập cổng 5173 để tận dụng HMR khi dev fronend

2. khi truy cập / hoặc các đường dẫ tại cổng 5173 của vite ->> sẽ proxy về cổng bun 3000 để đợi bun render và gửi qua trình duyệt đã built

3. file điểm vàm /public/index.html -->> chúng ta cần bun render ${isDev

                ? `

                    <link rel="stylesheet" href="http://localhost:5173/src/style.css">

                    <script type="module" src="http://localhost:5173/src/main.js"></script>

                `

                : `

                    <link rel="stylesheet" href="/assets/${manifest['src/style.css'].file}">

                    <script type="module" src="/assets/${manifest['src/main.js'].file}"></script>

                `}

khi bun cần các file tĩnh ->> sẽ proxy qua vite trong môi trường phát triển

chúng ta sẽ hoàn thành mã tập trung vào môi trường phát triển trước

## Cấu trúc thư mục (Giữ nguyên)
web-bun-vite/
├── node_modules/
├── public/
│   └── index.html  <-- Tệp index.html
├── src/
│   └── main.js     <-- Tệp JavaScript client-side
│   └── style.css   <-- (Tùy chọn) Tệp CSS nếu bạn muốn có một tệp riêng
├── dist/           <-- Sẽ được tạo sau khi chạy 'bun build' (cho production)
├── package.json
├── server.js
└── vite.config.js

## public/index.html
<!-- public/index.html -->
<!-- Đây là tệp HTML gốc mà Vite sử dụng làm template. -->
<!-- Nội dung từ máy chủ sẽ được chèn vào placeholder <div id="app-ssr-placeholder"></div> -->

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
    <!-- Thêm thẻ link cho style.css nếu bạn có tệp riêng -->
    <!-- Nếu style.css được import trong main.js, bạn không cần dòng này -->
    <!-- <link rel="stylesheet" href="/src/style.css"> -->
</head>
<body>
    <div class="container">
        <!-- Đây là placeholder nơi nội dung được render từ máy chủ sẽ được chèn vào -->
        <div id="app-ssr-placeholder"></div>

        <p id="client-message">Nội dung này được thêm vào từ phía client (Vanilla JS).</p>
        <button id="counter-button">Nhấn vào đây: 0</button>
        <p id="app-message"></p>
    </div>

    <!-- Điểm vào JavaScript phía client cho Vite -->
    <!-- Trong chế độ development, Vite sẽ inject client của nó và xử lý module này -->
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

## vite.config.js

// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  // Đặt thư mục gốc của dự án là thư mục chứa vite.config.js
  root: '.',
  // Chỉ định thư mục chứa các tài nguyên tĩnh (như index.html)
  // Vite sẽ phục vụ các tệp từ thư mục này trực tiếp.
  publicDir: 'public',
  server: {
    port: 5173, // Cổng mặc định của Vite dev server
    // Proxy tất cả các yêu cầu không phải là tài nguyên tĩnh của Vite
    // về máy chủ Bun SSR đang chạy trên cổng 3000.
    proxy: {
      // Proxy tất cả các yêu cầu đến root path và các API routes (nếu có)
      // Ví dụ: '/', '/api', v.v.
      // Đối với SSR, chúng ta muốn tất cả các yêu cầu trang được proxy.
      '^/': {
        target: 'http://localhost:3000', // Địa chỉ của máy chủ Bun SSR của bạn
        changeOrigin: true, // Thay đổi header Host của yêu cầu thành target URL
        // rewrite: (path) => path, // Giữ nguyên đường dẫn
        // Cấu hình cho WebSocket proxy (nếu bạn có WebSocket trên server 3000)
        ws: true,
      },
    },
  },
  build: {
    // Đảm bảo Vite biết điểm vào cho bản build SSR là gì.
    // Đối với Vanilla JS, đây có thể là điểm vào phía client chính của bạn.
    ssr: 'src/main.js', // Đây là điểm vào cho SSR build, không phải cho client dev
    outDir: 'dist', // Thư mục đầu ra cho bản build production
  },
});

## package.json

{
  "name": "bun-vite-hmr",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "concurrently \"bunx --bun vite\" \"bun run server.js\"",
    "build": "vite build",
    "preview": "vite preview",
    "server": "NODE_ENV=production bun run server.js"
  },
  "devDependencies": {
    "concurrently": "^8.2.2",
    "vite": "^5.0.0"
  },
  "dependencies": {
    "bun": "^1.1.13"
  }
}

## bun add -D concurrently

# fix
## // vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  server: {
    port: 5173,
    proxy: {
      // Proxy tất cả các yêu cầu TRỪ các đường dẫn bắt đầu bằng
      // '/src', '/node_modules', hoặc '/dist'.
      // Điều này đảm bảo Vite tự phục vụ các tệp nguồn và dependencies,
      // trong khi các yêu cầu trang (như '/') sẽ được proxy về Bun server.
      '^/(?!src|node_modules|dist)': {
        target: 'http://localhost:3000', // Địa chỉ của máy chủ Bun SSR của bạn
        changeOrigin: true, // Thay đổi header Host của yêu cầu thành target URL
        ws: true, // Để proxy WebSocket nếu Bun server có
      },
    },
  },
  build: {
    ssr: 'src/main.js',
    outDir: 'dist',
  },
});

## <!-- public/index.html -->
<!-- Đây là tệp HTML gốc mà Vite sử dụng làm template. -->

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
        <!--SSR_APP_HTML_PLACEHOLDER-->

        <p id="client-message">Nội dung này được thêm vào từ phía client (Vanilla JS).</p>
        <button id="counter-button">Nhấn vào đây: 0</button>
        <p id="app-message"></p>
    </div>

    <!-- Điểm vào JavaScript phía client cho Vite -->
    <script type="module" src="/src/main.js"></script>
</body>
</html>

## // server.js
// Máy chủ Bun này xử lý SSR.

import { serve } from "bun";
import { readFileSync } from "fs";
import path from "path";

const isProduction = process.env.NODE_ENV === 'production';
const projectRoot = import.meta.dir;
// viteDevServerUrl không được sử dụng trực tiếp trong luồng này cho Bun's dev server,
// nhưng nó vẫn được giữ lại để tham khảo.
const viteDevServerUrl = 'http://localhost:5173'; 

let templateHtml;

try {
  if (isProduction) {
    const distPath = path.join(projectRoot, 'dist');
    templateHtml = readFileSync(path.join(distPath, 'index.html'), 'utf-8');
    console.log("Server: Read production index.html from:", path.join(distPath, 'index.html'));
  } else {
    templateHtml = readFileSync(path.join(projectRoot, 'public', 'index.html'), 'utf-8');
    console.log("Server: Read development index.html from:", path.join(projectRoot, 'public', 'index.html'));
  }
  console.log("Server: Initial templateHtml (first 500 chars):\n", templateHtml.substring(0, Math.min(templateHtml.length, 500)));
} catch (error) {
  console.error("Server: Error reading index.html template:", error);
  process.exit(1); // Thoát nếu không thể đọc template
}


async function renderAppOnServer() {
  return `<div id="app"><h1>Chào mừng đến với Bun SSR!</h1><p>Nội dung này được render từ máy chủ.</p></div>`;
}

console.log("Máy chủ Bun SSR đang khởi động...");
console.log(`Môi trường: ${isProduction ? 'Production' : 'Development'}`);

serve({
  port: 3000,
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Trong chế độ development, nếu truy cập trực tiếp máy chủ Bun, phục vụ các tệp /src/.
    // Điều này là để kiểm thử trực tiếp máy chủ Bun tại :3000.
    // Khi truy cập qua Vite (tại :5173), Vite sẽ phục vụ các tệp /src/.
    if (!isProduction && pathname.startsWith('/src/')) {
        const filePath = path.join(projectRoot, pathname); // Ví dụ: /src/main.js
        try {
            const file = Bun.file(filePath);
            if (await file.exists()) {
                console.log(`Server: Serving dev src file: ${filePath}`);
                return new Response(file);
            }
        } catch (error) {
            console.error(`Server: Error serving dev src file ${filePath}:`, error);
            return new Response("Không tìm thấy tài nguyên", { status: 404 });
        }
    }


    // Phục vụ các tài nguyên tĩnh trong chế độ production
    if (isProduction && (pathname.startsWith('/assets/') || pathname.endsWith('.css') || pathname.endsWith('.js'))) {
      const filePath = path.join(projectRoot, 'dist', pathname);
      try {
        const file = Bun.file(filePath);
        if (await file.exists()) {
          console.log(`Server: Serving static file: ${filePath}`);
          return new Response(file);
        }
      } catch (error) {
        console.error(`Server: Lỗi khi phục vụ tệp tĩnh ${filePath}:`, error);
        return new Response("Không tìm thấy tài nguyên", { status: 404 });
      }
    }

    // Xử lý các yêu cầu trang HTML (ví dụ: '/')
    if (pathname === '/') {
      try {
        const appHtml = await renderAppOnServer();
        const placeholder = `<!--SSR_APP_HTML_PLACEHOLDER-->`; // Placeholder đã cập nhật

        if (!templateHtml.includes(placeholder)) {
          console.error(`Server: Placeholder "${placeholder}" NOT found in templateHtml!`);
          // Fallback: chèn appHtml ngay sau thẻ <body> nếu không tìm thấy placeholder
          const bodyTag = '<body>';
          if (templateHtml.includes(bodyTag)) {
            const finalHtml = templateHtml.replace(bodyTag, `${bodyTag}${appHtml}`);
            console.log("Server: Using fallback HTML injection (after <body>).");
            return new Response(finalHtml, {
              headers: { "Content-Type": "text/html; charset=utf-8" },
            });
          } else {
            console.error("Server: <body> tag not found for fallback injection.");
            return new Response("Lỗi SSR: Không tìm thấy placeholder hoặc thẻ <body>.", { status: 500 });
          }
        }

        const finalHtml = templateHtml.replace(placeholder, appHtml);
        console.log("Server: Final HTML (first 500 chars):\n", finalHtml.substring(0, Math.min(finalHtml.length, 500)));

        return new Response(finalHtml, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      } catch (e) {
        console.error("Server: Lỗi trong quá trình render SSR:", e);
        return new Response("Lỗi máy chủ nội bộ", { status: 500 });
      }
    }

    // Đối với bất kỳ yêu cầu nào khác không được xử lý, trả về 404
    return new Response("Không tìm thấy trang", { status: 404 });
  },
});

console.log("Máy chủ Bun SSR đang chạy tại http://localhost:3000");
if (!isProduction) {
  console.log("Trong chế độ development, hãy truy cập http://localhost:5173 (Vite dev server) để tận dụng HMR.");
  console.log("Vite sẽ tự động proxy các yêu cầu trang về Bun server này.");
  console.log("Nếu bạn truy cập trực tiếp http://localhost:3000, Bun sẽ tự phục vụ các tệp từ /public và /src.");
} else {
  console.log("Trong chế độ production, hãy đảm bảo bạn đã chạy 'bun build' (hoặc 'vite build') để tạo thư mục 'dist'.");
}

# fix 2

## // vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  // Root directory of the project, relative to where vite.config.js is located.
  root: '.',
  // Directory to serve static assets from.
  publicDir: 'public',
  server: {
    port: 5173, // Default port for Vite dev server
    // Ensure HMR is enabled (it's true by default, but explicitly stating can help).
    hmr: true,
    proxy: {
      // Proxy requests for the root path '/' to the Bun SSR server.
      // Vite will automatically handle other requests like /src/main.js, /src/style.css,
      // and static assets from publicDir as they won't match this proxy rule.
      '/': {
        target: 'http://localhost:3000', // Address of your Bun SSR server
        changeOrigin: true, // Changes the Host header of the request to the target URL
        ws: true, // Enable WebSocket proxying for HMR (Vite to Bun)
        // Removed the 'configure' function as it was primarily for logging
        // and not directly related to the HMR socket issue.
      },
      // If you have specific API paths that the Bun server handles, you can add them here.
      // Example:
      // '/api': {
      //   target: 'http://localhost:3000',
      //   changeOrigin: true,
      //   ws: false,
      // },
    },
  },
  build: {
    // Ensure Vite knows the entry point for the SSR build.
    // For Vanilla JS, this might be your main client-side entry point.
    ssr: 'src/main.js', // This is the entry point for SSR build, not for client dev
    outDir: 'dist', // Output directory for the production build
  },
});


## // server.js
// Máy chủ Bun này xử lý SSR.

import { serve } from "bun";
import { readFileSync } from "fs";
import path from "path";

const isProduction = process.env.NODE_ENV === 'production';
const projectRoot = import.meta.dir;
const viteDevServerUrl = 'http://localhost:5173'; 

let templateHtml;

try {
  if (isProduction) {
    const distPath = path.join(projectRoot, 'dist');
    templateHtml = readFileSync(path.join(distPath, 'index.html'), 'utf-8');
    console.log("Server: Read production index.html from:", path.join(distPath, 'index.html'));
  } else {
    // Trong chế độ development, đọc tệp index.html gốc từ thư mục 'public'
    const publicIndexPath = path.join(projectRoot, 'public', 'index.html');
    templateHtml = readFileSync(publicIndexPath, 'utf-8');
    console.log("Server: Read development index.html from:", publicIndexPath);
  }
  console.log("Server: Initial templateHtml (first 500 chars):\n", templateHtml.substring(0, Math.min(templateHtml.length, 500)));
  // Kiểm tra xem placeholder có tồn tại trong template không
  const placeholder = `<!--SSR_APP_HTML_PLACEHOLDER-->`;
  if (!templateHtml.includes(placeholder)) {
    console.warn(`Server: WARNING! Placeholder "${placeholder}" NOT found in initial templateHtml.`);
  }
} catch (error) {
  console.error("Server: FATAL ERROR: Could not read index.html template:", error);
  process.exit(1); // Thoát nếu không thể đọc template
}


async function renderAppOnServer() {
  // Trong một ứng dụng thực tế, đây sẽ là nơi bạn gọi hàm render của framework SSR (React, Vue, etc.)
  // và trả về chuỗi HTML đã render.
  return `<div id="app"><h1>Chào mừng đến với Bun SSR!</h1><p>Nội dung này được render từ máy chủ.</p></div>`;
}

console.log("Máy chủ Bun SSR đang khởi động...");
console.log(`Môi trường: ${isProduction ? 'Production' : 'Development'}`);

serve({
  port: 3000,
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    console.log(`Server: Received request for: ${pathname}`);

    // Trong chế độ development, nếu truy cập trực tiếp máy chủ Bun, phục vụ các tệp /src/.
    // Điều này là để kiểm thử trực tiếp máy chủ Bun tại :3000.
    // Khi truy cập qua Vite (tại :5173), Vite sẽ phục vụ các tệp /src/.
    if (!isProduction && pathname.startsWith('/src/')) {
        const filePath = path.join(projectRoot, pathname); // Ví dụ: /src/main.js
        try {
            const file = Bun.file(filePath);
            if (await file.exists()) {
                console.log(`Server: Serving dev src file: ${filePath}`);
                return new Response(file);
            }
        } catch (error) {
            console.error(`Server: Error serving dev src file ${filePath}:`, error);
            return new Response("Không tìm thấy tài nguyên src", { status: 404 });
        }
    }

    // Phục vụ các tài nguyên tĩnh trong chế độ production
    if (isProduction && (pathname.startsWith('/assets/') || pathname.endsWith('.css') || pathname.endsWith('.js'))) {
      const filePath = path.join(projectRoot, 'dist', pathname);
      try {
        const file = Bun.file(filePath);
        if (await file.exists()) {
          console.log(`Server: Serving static file: ${filePath}`);
          return new Response(file);
        }
      } catch (error) {
        console.error(`Server: Lỗi khi phục vụ tệp tĩnh ${filePath}:`, error);
        return new Response("Không tìm thấy tài nguyên tĩnh", { status: 404 });
      }
    }

    // Xử lý các yêu cầu trang HTML (ví dụ: '/')
    if (pathname === '/') {
      try {
        const appHtml = await renderAppOnServer();
        const placeholder = `<!--SSR_APP_HTML_PLACEHOLDER-->`; // Placeholder đã cập nhật

        let finalHtml = templateHtml;
        if (templateHtml.includes(placeholder)) {
          finalHtml = templateHtml.replace(placeholder, appHtml);
          console.log("Server: Placeholder found and replaced.");
        } else {
          console.warn(`Server: Placeholder "${placeholder}" NOT found in templateHtml for request ${pathname}. Attempting fallback injection.`);
          // Fallback: chèn appHtml ngay sau thẻ <body> nếu không tìm thấy placeholder
          const bodyTag = '<body>';
          if (templateHtml.includes(bodyTag)) {
            finalHtml = templateHtml.replace(bodyTag, `${bodyTag}${appHtml}`);
            console.log("Server: Using fallback HTML injection (after <body>).");
          } else {
            console.error("Server: <body> tag not found for fallback injection. SSR content might not be visible.");
            // Nếu không tìm thấy cả placeholder và <body>, trả về template gốc.
            // Điều này có thể dẫn đến việc chỉ có client-side JS hiển thị.
          }
        }
        
        console.log("Server: Final HTML (first 500 chars):\n", finalHtml.substring(0, Math.min(finalHtml.length, 500)));

        return new Response(finalHtml, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      } catch (e) {
        console.error("Server: Lỗi trong quá trình render SSR:", e);
        return new Response("Lỗi máy chủ nội bộ trong quá trình SSR", { status: 500 });
      }
    }

    // Đối với bất kỳ yêu cầu nào khác không được xử lý, trả về 404
    console.log(`Server: Returning 404 for unhandled path: ${pathname}`);
    return new Response("Không tìm thấy trang", { status: 404 });
  },
});

console.log("Máy chủ Bun SSR đang chạy tại http://localhost:3000");
if (!isProduction) {
  console.log("Trong chế độ development, hãy truy cập http://localhost:5173 (Vite dev server) để tận dụng HMR.");
  console.log("Vite sẽ tự động proxy các yêu cầu trang về Bun server này.");
  console.log("Nếu bạn truy cập trực tiếp http://localhost:3000, Bun sẽ tự phục vụ các tệp từ /public và /src.");
} else {
  console.log("Trong chế độ production, hãy đảm bảo bạn đã chạy 'bun build' (hoặc 'vite build') để tạo thư mục 'dist'.");
}

##  <!-- public/index.html -->
<!-- Đây là tệp HTML gốc mà Vite sử dụng làm template. -->
<!-- Nội dung từ máy chủ sẽ được chèn vào placeholder <!--SSR_APP_HTML_PLACEHOLDER--> -->

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
        <!--SSR_APP_HTML_PLACEHOLDER-->

        <p id="client-message">Nội dung này được thêm vào từ phía client (Vanilla JS).</p>
        <button id="counter-button">Nhấn vào đây: 0</button>
        <p id="app-message"></p>
    </div>

    <!-- Điểm vào JavaScript phía client cho Vite -->
    <!-- Vite sẽ tự động inject client HMR của nó và xử lý module này -->
    <script type="module" src="/src/main.js"></script>
</body>
</html>

