// backend/server.js
import { serve, file } from "bun";
import path from "path"; // Ensure 'path' module is imported for path.join

// 🌟 Xác định thư mục gốc của dự án một cách động.
// Điều này giả định bạn luôn chạy lệnh 'bun run dev' từ thư mục gốc của dự án.
const PROJECT_ROOT = process.cwd();

// Xác định thư mục chứa các file frontend đã được build.
// Thư mục này chỉ được sử dụng khi server chạy ở chế độ production.
const FRONTEND_BUILD_DIR = path.join(PROJECT_ROOT, 'frontend', 'dist');

// 🌟 Quan trọng: Xác định biến môi trường để biết server đang ở chế độ nào.
// 'process.env.NODE_ENV' sẽ là 'production' nếu bạn chạy 'NODE_ENV=production bun run start'.
// Nếu không được set, nó sẽ là 'undefined' hoặc 'development' theo quy ước.
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

console.log(`Dự án đang chạy từ gốc: ${PROJECT_ROOT}`);
console.log(`Môi trường: ${IS_PRODUCTION ? 'Production' : 'Development'}`);
if (IS_PRODUCTION) {
    console.log(`Phục vụ frontend từ: ${FRONTEND_BUILD_DIR}`);
}

const server = serve({
  port: process.env.PORT || 3000, // Sử dụng PORT từ .env hoặc mặc định 3000
  fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;
    const requestOrigin = req.headers.get('Origin'); // Lấy Origin từ request của trình duyệt

    // Các origins được phép trong môi trường phát triển (dev)
    const ALLOWED_DEV_ORIGINS = [
        process.env.FRONTEND_URL || "http://localhost:5173", // Lấy từ .env, hoặc mặc định
        "http://localhost:5173" // Luôn cho phép localhost
    ];

    let corsOriginHeader = '';
    // Logic xác định header Access-Control-Allow-Origin dựa trên môi trường
    if (IS_PRODUCTION) {
        // Trong production, chỉ cho phép origin của chính server hoặc một domain cụ thể
        corsOriginHeader = url.origin; // Cho phép cùng origin
        // Hoặc bạn có thể chỉ định một domain cụ thể:
        // corsOriginHeader = "https://your-production-frontend-domain.com";
    } else {
        // Trong phát triển (dev), kiểm tra origin của request
        if (requestOrigin && ALLOWED_DEV_ORIGINS.includes(requestOrigin)) {
            // Nếu origin của request hợp lệ, trả lại chính origin đó
            corsOriginHeader = requestOrigin;
        } else {
            // Nếu không, mặc định trả về một trong các dev origins đã định nghĩa
            // Điều này giúp tránh lỗi nếu trình duyệt tự động chuyển từ localhost sang 127.0.0.1
            corsOriginHeader = ALLOWED_DEV_ORIGINS[0]; 
        }
    }

    // 🌟 LOGIC PHỤC VỤ CÁC FILE FRONTEND ĐÃ BUILD TRONG PRODUCTION 🌟
    // Phần này chỉ hoạt động khi IS_PRODUCTION là true.
    // Trong môi trường dev, Vite Dev Server sẽ phục vụ frontend.
    if (IS_PRODUCTION) {
        const filePath = path.join(FRONTEND_BUILD_DIR, pathname === '/' ? 'index.html' : pathname);
        
        const requestedFile = Bun.file(filePath);
        if (requestedFile.exists()) {
            console.log(`Serving static file: ${filePath}`);
            return new Response(requestedFile);
        }

        // Nếu không tìm thấy file và không phải là một request API, 
        // giả định đây là một ứng dụng SPA và trả về index.html để router của frontend xử lý.
        if (!pathname.startsWith('/api/') && !pathname.includes('.')) { 
            const indexHtmlPath = path.join(FRONTEND_BUILD_DIR, 'index.html');
            if (Bun.file(indexHtmlPath).exists()) {
                console.log(`Serving index.html for SPA route: ${pathname}`);
                return new Response(file(indexHtmlPath));
            }
        }
    }

    // 🌟 LOGIC XỬ LÝ CÁC ĐIỂM KẾT NỐI API BACKEND 🌟
    if (pathname === "/api/hello" && req.method === "GET") {
      console.log("Received request for /api/hello from origin:", requestOrigin);
      return new Response(JSON.stringify({ message: "Hello from Bun Backend!" }), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": corsOriginHeader, // Sử dụng Origin đã xác định
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        },
      });
    }

    // Xử lý các request OPTIONS (Preflight requests) cho CORS
    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 204, // "No Content" - báo hiệu thành công cho preflight
            headers: {
                "Access-Control-Allow-Origin": corsOriginHeader,
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Max-Age": "86400" // Cache preflight response trong 24 giờ
            }
        });
    }

    // Trả về 404 Not Found nếu không có route nào khớp
    return new Response("404 Not Found", { status: 404 });
  },
  error(error) {
    // Xử lý lỗi server và trả về phản hồi 500
    console.error("Bun server error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});

console.log(`🚀 Bun server running on http://localhost:${server.port}`);