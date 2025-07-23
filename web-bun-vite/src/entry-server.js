// server.js
// Máy chủ Bun này xử lý SSR và tích hợp Vite làm middleware trong chế độ phát triển.

import { serve } from 'bun';
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { createServer } from 'vite'; // Import createServer từ Vite

const isProduction = process.env.NODE_ENV === 'production';
const projectRoot = import.meta.dir; // Lấy thư mục gốc của dự án

let vite; // Biến để lưu trữ instance của Vite dev server (nếu ở chế độ dev)
let render; // Hàm render SSR (từ entry-server.js)

// Hàm khởi tạo máy chủ (chạy một lần khi khởi động)
async function initServer() {
  if (!isProduction) {
    // Trong chế độ phát triển, tạo Vite server ở chế độ middleware
    // Vite sẽ không tự khởi động HTTP server, mà sẽ hoạt động như một middleware
    vite = await createServer({
      server: { middlewareMode: true }, 
      appType: 'custom', // Cho phép kiểm soát việc biến đổi HTML
      root: projectRoot, // Đảm bảo Vite biết thư mục gốc của dự án
    });
    console.log("Server: Vite dev server created in middleware mode.");
  } else {
    // Trong chế độ sản xuất, tải hàm render SSR đã được build sẵn
    render = (await import('./dist/server/entry-server.js')).render;
    console.log("Server: Production render function loaded.");
  }
}

// Gọi hàm khởi tạo server khi ứng dụng bắt đầu
await initServer();

// Biến cờ để đảm bảo `serve()` chỉ được gọi một lần trong suốt vòng đời của tiến trình Bun
if (!globalThis.__bun_ssr_server_started__) {
  globalThis.__bun_ssr_server_started__ = true;

  serve({
    port: 3000,
    host: '127.0.0.1', // Đảm bảo Bun server lắng nghe trên địa chỉ loopback IPv4
    async fetch(request) {
      const url = new URL(request.url);
      const pathname = url.pathname;

      // --- Xử lý trong chế độ sản xuất (Production Mode) ---
      if (isProduction) {
        const filePath = path.join(projectRoot, 'dist', 'client', pathname);
        // Cố gắng phục vụ các tệp tĩnh từ thư mục dist/client trước
        if (existsSync(filePath)) {
          console.log(`Server: Serving production static file: ${filePath}`);
          return new Response(Bun.file(filePath));
        }

        // Nếu không phải tệp tĩnh, thực hiện SSR
        try {
          // Hàm render sẽ trả về toàn bộ HTML đã được SSR
          // Trong production, không cần truyền instance Vite
          const { body, status, headers } = await render(url, null); 
          return new Response(body, {
            status,
            headers: headers || { 'Content-Type': 'text/html' },
          });
        } catch (e) {
          console.error("Server: Lỗi trong quá trình render SSR (Production):", e);
          return new Response("Lỗi máy chủ nội bộ", { status: 500 });
        }
      }

      // --- Xử lý trong chế độ phát triển (Development Mode) ---
      // Trong chế độ phát triển, Bun sẽ sử dụng Vite làm middleware.
      // Điều này có nghĩa là Vite sẽ xử lý các yêu cầu cho tài nguyên (JS, CSS, HMR)
      // và Bun sẽ xử lý việc SSR HTML thông qua Vite API.

      // Bước 1: Mô phỏng Node.js req/res để gọi Vite middleware
      let responseFromVite = null;
      let viteMiddlewareHandled = false;

      // Tạo một đối tượng Node.js-like req/res cho Vite middleware
      const nodeReq = {
        url: request.url,
        method: request.method,
        // Chuyển Headers object của Bun sang plain object mà Node.js-like middleware mong đợi
        headers: Object.fromEntries(request.headers.entries()), 
        // Thêm các thuộc tính khác mà Vite middleware có thể mong đợi (ví dụ: connection, socket)
        connection: {},
        socket: {},
      };
      const nodeRes = {
        statusCode: 200,
        headers: {}, // Đối tượng để lưu trữ headers
        setHeader: (name, value) => { nodeRes.headers[name] = value; },
        getHeader: (name) => nodeRes.headers[name], // Cần cho Vite middleware (ví dụ: vary)
        removeHeader: (name) => { delete nodeRes.headers[name]; }, // Có thể cần cho một số middleware
        // Ghi đè phương thức `end` để bắt phản hồi từ Vite middleware
        end: (body) => {
          viteMiddlewareHandled = true;
          responseFromVite = new Response(body, { status: nodeRes.statusCode, headers: nodeRes.headers });
        },
        // Thêm các thuộc tính/phương thức khác mà Vite middleware có thể mong đợi
        write: (chunk) => { /* noop */ }, // Hàm ghi dữ liệu, không làm gì trong trường hợp này
        writeHead: (status, headers) => { // Thiết lập status code và headers
          nodeRes.statusCode = status; 
          Object.assign(nodeRes.headers, headers); 
        },
        finished: false, // Vite middleware có thể kiểm tra thuộc tính này
        // Thêm các phương thức EventEmitter cơ bản mà một số middleware có thể mong đợi
        on: (event, listener) => {},
        once: (event, listener) => {},
        emit: (event, ...args) => {},
      };

      // Gọi Vite middleware với các đối tượng req/res đã mô phỏng
      // Chúng ta không dùng Promise ở đây để tránh vấn đề với `next()`
      vite.middlewares(nodeReq, nodeRes, () => {
        // Nếu Vite middleware gọi next(), có nghĩa là nó không xử lý yêu cầu này.
        // Chúng ta sẽ không làm gì ở đây, và logic sẽ tiếp tục sau khối này.
      });

      if (viteMiddlewareHandled) {
        // Nếu Vite middleware đã xử lý yêu cầu (gọi res.end()), trả về phản hồi đó
        return responseFromVite;
      }

      // Bước 2: Nếu Vite middleware không xử lý, thì đây là yêu cầu HTML cho SSR
      try {
        // Tải hàm render từ entry-server.js thông qua Vite
        // Truyền projectRoot để giải quyết đường dẫn một cách mạnh mẽ
        const { render } = await vite.ssrLoadModule('/src/entry-server.js');
        const { body, status, headers } = await render(url, vite, projectRoot); 

        return new Response(body, {
          status,
          headers: headers || { 'Content-Type': 'text/html' },
        });
      } catch (e) {
        // Sử dụng Vite's stacktrace fixer để làm sạch stack trace của lỗi SSR
        vite?.ssrFixStacktrace(e); 
        console.error(e.stack);
        return new Response(`Error during SSR: ${e.message}`, { status: 500 });
      }
    },
  });

  console.log("Máy chủ Bun SSR đang chạy tại http://127.0.0.1:3000");
  console.log("Trong chế độ development, không cần chạy Vite dev server riêng biệt nữa.");
  console.log("Trong chế độ production, hãy đảm bảo bạn đã chạy 'bun build' (hoặc 'vite build') để tạo thư mục 'dist'.");
} else {
    console.log("Server module re-evaluated, but server is already running. Skipping serve() call.");
}
