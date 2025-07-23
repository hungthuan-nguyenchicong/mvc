// server.js
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
