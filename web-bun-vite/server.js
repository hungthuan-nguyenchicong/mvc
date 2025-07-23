// server.js
// Máy chủ Bun này xử lý SSR và tạo template HTML động.

import { serve } from "bun";
import { readFileSync } from "fs";
import path from "path";

const isProduction = process.env.NODE_ENV === 'production';
const projectRoot = import.meta.dir;
const viteDevServerUrl = 'http://127.0.0.1:5173'; // Địa chỉ Vite dev server

let manifest; // Chỉ cần cho production build assets

if (isProduction) {
  try {
    const distPath = path.join(projectRoot, 'dist');
    const manifestPath = path.join(distPath, 'manifest.json');
    manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    console.log("Server: Read production manifest.json from:", manifestPath);
  } catch (error) {
    console.error("Server: Error reading production manifest.json:", error);
    process.exit(1);
  }
}

async function renderAppOnServer() {
  // Đây là nơi bạn sẽ import và render ứng dụng React/Vue/Svelte của mình
  // Ví dụ: const { render } = await import('./src/entry-server.js');
  // return render();
  // Hiện tại, chúng ta trả về một placeholder HTML đơn giản cho ứng dụng
  // Đã sửa đổi để bao gồm các phần tử với ID mà main.js đang tìm kiếm
  return `
    <div id="app">
        <h1>Chào mừng đến với Bun SSR!</h1>
        <p id="app-message">Nội dung này được render từ máy chủ.</p>
        <button id="counter-button">Nhấn vào đây: 0</button>
        <p id="client-message">Thông báo từ client-side.</p>
    </div>
  `;
}

console.log("Máy chủ Bun SSR đang khởi động...");
console.log(`Môi trường: ${isProduction ? 'Production' : 'Development'}`);

serve({
  port: 3000,
  host: '127.0.0.1', // Đặt host của Bun server thành 127.0.0.1 để nhất quán
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Trong chế độ production, phục vụ các tài nguyên tĩnh đã được build bởi Vite
    if (isProduction && (pathname.startsWith('/assets/') || pathname.endsWith('.css') || pathname.endsWith('.js') || pathname.endsWith('.svg') || pathname.endsWith('.png'))) {
      const filePath = path.join(projectRoot, 'dist', pathname);
      try {
        const file = Bun.file(filePath);
        if (await file.exists()) {
          console.log(`Server: Serving static file (production): ${filePath}`);
          return new Response(file);
        }
      } catch (error) {
        console.error(`Server: Lỗi khi phục vụ tệp tĩnh (production) ${filePath}:`, error);
        return new Response("Không tìm thấy tài nguyên", { status: 404 });
      }
    }

    // Xử lý các yêu cầu trang HTML (ví dụ: '/')
    if (pathname === '/') {
      try {
        const appHtml = await renderAppOnServer();
        let headAssets = '';
        let bodyScripts = '';

        if (isProduction) {
          // Lấy các tệp CSS và JS từ manifest để liên kết các tài nguyên đã build
          const cssFile = manifest['src/style.css']?.file;
          const jsFile = manifest['src/main.js']?.file;

          if (cssFile) {
            headAssets += `<link rel="stylesheet" href="/assets/${cssFile}">\n`;
          } else {
            console.warn("Server: 'src/style.css' not found in manifest.json. CSS might not load.");
          }
          if (jsFile) {
            bodyScripts += `<script type="module" src="/assets/${jsFile}"></script>\n`;
          } else {
            console.warn("Server: 'src/main.js' not found in manifest.json. JavaScript might not load.");
          }
        } else {
          // Trong chế độ development, Bun sẽ tạo HTML và Vite sẽ tiêm HMR client
          // và các script/link của nó.
          // Chúng ta cần đảm bảo các script và link của Vite được tải.
          headAssets += `<link rel="stylesheet" href="${viteDevServerUrl}/src/style.css">\n`;
          bodyScripts += `<script type="module" src="${viteDevServerUrl}/src/main.js"></script>\n`;
          bodyScripts += `<script type="module" src="${viteDevServerUrl}/@vite/client"></script>\n`;
        }

        // Tạo toàn bộ cấu trúc HTML động
        const finalHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bun SSR App</title>
    ${headAssets}
</head>
<body>
    ${appHtml}
    ${bodyScripts}
</body>
</html>
        `;

        console.log("Server: Final HTML (first 500 chars):\n", finalHtml.substring(0, Math.min(finalHtml.length, 500)));

        return new Response(finalHtml, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      } catch (e) {
        console.error("Server: Lỗi trong quá trình render SSR:", e);
        return new Response("Lỗi máy chủ nội bộ", { status: 500 });
      }
    }

    return new Response("Không tìm thấy trang", { status: 404 });
  },
});

console.log("Máy chủ Bun SSR đang chạy tại http://127.0.0.1:3000");
if (!isProduction) {
  console.log("Trong chế độ development, hãy truy cập http://127.0.0.1:5173 (Vite dev server) để tận dụng HMR.");
  console.log("Vite sẽ tự động proxy các yêu cầu trang về Bun server này.");
  console.log("Bun server này tạo toàn bộ HTML template động.");
} else {
  console.log("Trong chế độ production, hãy đảm bảo bạn đã chạy 'bun build' (hoặc 'vite build') để tạo thư mục 'dist'.");
}
