## Project Root

Bạn muốn biết cách xác định đường dẫn gốc (root path) cho toàn bộ dự án Bun + Vite một cách tự động hoặc chuẩn hóa. Mặc dù không có một biến môi trường hay hàm "toàn cục" duy nhất được Bun hoặc Vite cung cấp cụ thể cho mục đích này, bạn có thể đạt được điều đó bằng cách sử dụng biến môi trường và các phương thức tích hợp sẵn của Node.js/Bun một cách chiến lược.

Dưới đây là một ví dụ cụ thể về cách khai báo và sử dụng biến để xác định gốc dự án, giúp bạn dễ dàng tham chiếu các đường dẫn giữa frontend và backend.

1. Xác Định Gốc Dự Án (Project Root)
Cách chuẩn và đáng tin cậy nhất để xác định thư mục gốc của dự án trong môi trường Node.js/Bun là sử dụng process.cwd() (current working directory - thư mục làm việc hiện tại) hoặc import.meta.dir (thư mục của file hiện tại).

process.cwd(): Trả về thư mục mà từ đó tiến trình Bun được khởi chạy. Đây thường là thư mục gốc của dự án nếu bạn chạy lệnh bun run dev từ đó.

import.meta.dir: Trả về đường dẫn thư mục của file ES module hiện tại.

Trong một dự án phức tạp hơn, nơi bạn có thể chạy các script từ các thư mục con, việc sử dụng process.cwd() là đáng tin cậy hơn để xác định gốc dự án, miễn là bạn luôn chạy các lệnh chính từ thư mục gốc.

2. Biến Môi Trường Chung (.env file)
Sử dụng biến môi trường là cách phổ biến để chia sẻ cấu hình giữa các phần khác nhau của ứng dụng mà không mã hóa cứng (hardcode) các đường dẫn.

Bước 1: Tạo file .env ở thư mục gốc của dự án
Tạo một file có tên .env trong thư mục gốc của bạn (your-project/.env):

# your-project/.env
# PROJECT_ROOT sẽ được xác định tự động trong code, không cần khai báo ở đây trừ khi bạn muốn override
# BASE_API_URL là ví dụ về một URL API chung
BASE_API_URL=http://localhost:3000
Bun tự động tải các biến từ file .env vào process.env.

Bước 2: Xác định và sử dụng PROJECT_ROOT trong Backend
Bạn có thể xác định PROJECT_ROOT một lần trong file server chính của backend.

backend/server.js

JavaScript

// backend/server.js
import { serve, file } from "bun";
import path from "path"; // Bun có sẵn module 'path'

// 🌟🌟🌟 CÁCH XÁC ĐỊNH GỐC DỰ ÁN 🌟🌟🌟
// Sử dụng process.cwd() để lấy thư mục mà từ đó lệnh 'bun run dev' được thực thi.
// Điều này giả định bạn luôn chạy lệnh từ thư mục gốc của dự án.
const PROJECT_ROOT = process.cwd();

console.log(`Dự án đang chạy từ gốc: ${PROJECT_ROOT}`);

// Ví dụ về cách sử dụng PROJECT_ROOT để tham chiếu các file khác
const FRONTEND_BUILD_DIR = path.join(PROJECT_ROOT, 'frontend', 'dist'); // Thư mục build của Vite

const server = serve({
  port: process.env.PORT || 3000, // Lấy cổng từ biến môi trường hoặc mặc định 3000
  fetch(req) {
    const url = new URL(req.url);

    // API endpoint
    if (url.pathname === "/api/hello" && req.method === "GET") {
      return new Response(JSON.stringify({ message: "Hello from Bun Backend!" }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": process.env.FRONTEND_URL || "http://localhost:5173", // Lấy URL frontend từ env
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        },
      });
    }

    // Serving built frontend files in production (example)
    // In development, Vite Dev Server handles this.
    // In production, Bun might serve your built frontend.
    if (url.pathname.startsWith('/')) {
        const filePath = path.join(FRONTEND_BUILD_DIR, url.pathname === '/' ? 'index.html' : url.pathname);
        if (Bun.file(filePath).exists()) {
            return new Response(file(filePath));
        }
    }

    // CORS preflight
    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": process.env.FRONTEND_URL || "http://localhost:5173",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Max-Age": "86400"
            }
        });
    }

    return new Response("Not Found", { status: 404 });
  },
  error(error) {
    console.error("Bun server error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});

console.log(`🚀 Bun Backend server running on http://localhost:${server.port}`);
Bước 3: Cấu hình Frontend (Vite)
Vite có cách riêng để xử lý biến môi trường. Nó tự động tải các biến từ .env nếu chúng có tiền tố VITE_.

frontend/main.js

JavaScript

// frontend/main.js
import './public/style.css';

document.addEventListener('DOMContentLoaded', () => {
    const h1 = document.querySelector('h1');
    const fetchDataBtn = document.getElementById('fetchDataBtn');
    const dataMessage = document.getElementById('dataMessage');

    h1.textContent = 'Welcome to Bun + Vite App!';

    // 🌟🌟🌟 CÁCH SỬ DỤNG BIẾN MÔI TRƯỜNG TRONG FRONTEND (VITE) 🌟🌟🌟
    // Vite tự động expose biến môi trường có tiền tố VITE_
    const BASE_API_URL = import.meta.env.VITE_BASE_API_URL || 'http://localhost:3000';
    console.log(`Frontend API Base URL: ${BASE_API_URL}`);

    fetchDataBtn.addEventListener('click', async () => {
        dataMessage.textContent = 'Fetching data...';
        try {
            const response = await fetch(`${BASE_API_URL}/api/hello`); // Sử dụng biến BASE_API_URL
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            dataMessage.textContent = `Backend Says: "${data.message}"`;
            console.log('Data from backend:', data);
        } catch (error) {
            dataMessage.textContent = `Error: ${error.message}`;
            console.error('Error fetching data:', error);
        }
    });

    console.log('Frontend script loaded!');
});
frontend/vite.config.js

Bạn có thể định nghĩa các biến môi trường cho Vite hoặc cấu hình proxy API ở đây.

JavaScript

// frontend/vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: 'public',
  server: {
    port: 5173,
    // 🌟🌟🌟 Cấu hình Proxy API để tránh CORS trong quá trình phát triển 🌟🌟🌟
    // Mọi request đến /api sẽ được chuyển hướng sang backend Bun của bạn
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // URL của Bun backend
        changeOrigin: true, // Thay đổi origin của request sang target
        // rewrite: (path) => path.replace(/^\/api/, '') // Nếu backend API không có tiền tố /api
      },
    },
  },
  define: {
    // Để biến môi trường không có tiền tố VITE_ cũng được expose cho frontend
    // hoặc bạn có thể chỉ dùng VITE_BASE_API_URL trong .env
    // 'process.env.VITE_BASE_API_URL': JSON.stringify(process.env.VITE_BASE_API_URL),
  }
});
Bước 4: Cập nhật .env cho Frontend
Vì Vite yêu cầu biến môi trường cho frontend phải có tiền tố VITE_, bạn cần cập nhật file .env của mình:

your-project/.env

# your-project/.env
PORT=3000
FRONTEND_URL=http://localhost:5173

# Biến môi trường cho Frontend (Vite) phải có tiền tố VITE_
VITE_BASE_API_URL=http://localhost:3000
Tóm tắt Cách Xác Định Gốc Dự Án:
Backend (Bun): Sử dụng process.cwd() ở file gốc của server (ví dụ: backend/server.js) để xác định đường dẫn gốc của dự án. Từ đó, bạn có thể xây dựng các đường dẫn tuyệt đối đến các thư mục khác bằng cách sử dụng module path của Bun (ví dụ: path.join(PROJECT_ROOT, 'some', 'folder')).

Frontend (Vite): Frontend không trực tiếp cần biết "gốc dự án" theo nghĩa hệ thống tệp. Nó quan tâm đến base URL của API backend. Điều này được cấu hình thông qua biến môi trường có tiền tố VITE_ trong file .env và được expose cho frontend thông qua import.meta.env.VITE_YOUR_VAR_NAME. Ngoài ra, Vite proxy trong vite.config.js là cực kỳ hữu ích để xử lý các cuộc gọi API đến backend trong quá trình phát triển, tránh lỗi CORS.

Biến Môi Trường (.env): Là phương pháp chuẩn để quản lý các giá trị cấu hình chung (như URL API, cổng) giữa frontend và backend, và giữa các môi trường (dev, production).

Với cách tiếp cận này, bạn có một phương pháp chuẩn hóa để quản lý đường dẫn và cấu hình trong toàn bộ dự án Bun + Vite của mình.