// server.js
// Máy chủ Bun này xử lý SSR.

import { serve } from "bun";
import { readFileSync } from "fs";
import path from "path";

const isProduction = process.env.NODE_ENV === 'production';
const projectRoot = import.meta.dir;
const viteDevServerUrl = 'http://127.0.0.1:5173';

let templateHtml;
let manifest;

try {
  if (isProduction) {
    const distPath = path.join(projectRoot, 'dist');
    templateHtml = readFileSync(path.join(distPath, 'index.html'), 'utf-8');
    const manifestPath = path.join(distPath, 'manifest.json');
    manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    console.log("Server: Read production index.html from:", path.join(distPath, 'index.html'));
    console.log("Server: Read production manifest.json from:", manifestPath);
  } else {
    // Trong chế độ phát triển, Vite sẽ phục vụ index.html từ thư mục public của nó
    // và tiêm các script HMR. Bun chỉ cần đọc template cơ bản.
    templateHtml = readFileSync(path.join(projectRoot, 'public', 'index.html'), 'utf-8');
    console.log("Server: Read development index.html from:", path.join(projectRoot, 'public', 'index.html'));
  }
  console.log("Server: Initial templateHtml (first 500 chars):\n", templateHtml.substring(0, Math.min(templateHtml.length, 500)));
} catch (error) {
  console.error("Server: Error reading index.html template or manifest.json:", error);
  process.exit(1);
}

async function renderAppOnServer() {
  // Đây là nơi bạn sẽ import và render ứng dụng React/Vue/Svelte của mình
  // Ví dụ: const { render } = await import('./src/entry-server.js');
  // return render();
  return `<div id="app"><h1>Chào mừng đến với Bun SSR!</h1><p>Nội dung này được render từ máy chủ.</p></div>`;
}

console.log("Máy chủ Bun SSR đang khởi động...");
console.log(`Môi trường: ${isProduction ? 'Production' : 'Development'}`);

serve({
  port: 3000,
  host: '127.0.0.1', // Đặt host của Bun server thành 127.0.0.1
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // --- BỎ PHẦN NÀY TRONG CHẾ ĐỘ DEVELOPMENT ---
    // Lý do: Vite dev server sẽ xử lý việc phục vụ các tệp /src/ và /public/
    // và proxy các yêu cầu HTML đến Bun. Bun không cần tự phục vụ các tệp này
    // trong chế độ dev khi Vite đang ở phía trước.
    // if (!isProduction) {
    //     let filePath;
    //     if (pathname.startsWith('/src/')) {
    //         filePath = path.join(projectRoot, pathname);
    //     } else {
    //         filePath = path.join(projectRoot, 'public', pathname);
    //     }
    //     try {
    //         const file = Bun.file(filePath);
    //         if (await file.exists()) {
    //             console.log(`Server: Serving dev file: ${filePath}`);
    //             return new Response(file);
    //         }
    //     } catch (error) {
    //         console.error(`Server: Error serving dev file ${filePath}:`, error);
    //     }
    // }
    // --- KẾT THÚC PHẦN BỎ QUA ---

    // Phục vụ các tài nguyên tĩnh trong chế độ production
    if (isProduction && (pathname.startsWith('/assets/') || pathname.endsWith('.css') || pathname.endsWith('.js') || pathname.endsWith('.svg') || pathname.endsWith('.png'))) {
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
        const ssrPlaceholder = `<!--SSR_APP_HTML_PLACEHOLDER-->`;
        const cssJsPlaceholder = `<!--CSS_JS_PLACEHOLDER-->`;

        let assetsHtml = '';
        if (isProduction) {
          const cssFile = manifest['src/style.css']?.file;
          const jsFile = manifest['src/main.js']?.file;

          if (cssFile) {
            assetsHtml += `<link rel="stylesheet" href="/assets/${cssFile}">\n`;
          } else {
            console.warn("Server: 'src/style.css' not found in manifest.json. CSS might not load.");
          }
          if (jsFile) {
            assetsHtml += `<script type="module" src="/assets/${jsFile}"></script>\n`;
          } else {
            console.warn("Server: 'src/main.js' not found in manifest.json. JavaScript might not load.");
          }
        } else {
          // Trong chế độ development, các tài nguyên sẽ được Vite phục vụ
          // và được tiêm vào HTML bởi Vite thông qua proxy.
          // Bun chỉ cần trả về HTML cơ bản và Vite sẽ thêm các script/link cần thiết.
          // Đảm bảo rằng public/index.html của bạn có <div id="app"></div> và các placeholder.
          // Vite sẽ tiêm script client của nó và các tài nguyên khác.
          assetsHtml += `
            <script type="module" src="${viteDevServerUrl}/@vite/client"></script>
            <script type="module" src="${viteDevServerUrl}/src/main.js"></script>
            <link rel="stylesheet" href="${viteDevServerUrl}/src/style.css">
          `;
        }

        let finalHtml = templateHtml.replace(ssrPlaceholder, appHtml);
        finalHtml = finalHtml.replace(cssJsPlaceholder, assetsHtml);

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
  console.log("Bun server này chỉ chịu trách nhiệm render SSR, không phục vụ tài nguyên tĩnh trong chế độ dev.");
} else {
  console.log("Trong chế độ production, hãy đảm bảo bạn đã chạy 'bun build' (hoặc 'vite build') để tạo thư mục 'dist'.");
}
