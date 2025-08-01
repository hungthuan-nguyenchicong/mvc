// web-mvc/server.js
//import { RouteAdmin } from "./backend/core/RouteAdmin";
import index from "./index.html";
Bun.serve({
    // development can also be an object.
    // development: {
    //     // Enable Hot Module Reloading
    //     hmr: true,

    //     // Echo console logs from the browser to the terminal
    //     console: true,
    // },
    port: 3000,
    hostname: "0.0.0.0",
    routes: {
        //'/': new Response('/'),
        '/': index,
       // ...RouteAdmin,
    },
    //development: true,

    // async fetch(req) {
    // const url = new URL(req.url);
    // const pathname = url.pathname;

    // --- Xử lý các file tĩnh trong thư mục 'src' ---
    // if (pathname.startsWith("/src/")) {
    //   const filePath = `.${pathname}`; // Tạo đường dẫn file tương đối từ root của server

    //   try {
    //     const file = Bun.file(filePath);

    //     // Kiểm tra xem file có tồn tại và có thể đọc được không
    //     if (await file.exists()) {
    //       // Xác định Content-Type dựa trên phần mở rộng của file
    //       let contentType = "application/octet-stream"; // Mặc định
    //       if (filePath.endsWith(".js")) {
    //         contentType = "application/javascript";
    //       } else if (filePath.endsWith(".css")) {
    //         contentType = "text/css";
    //       } else if (filePath.endsWith(".html")) {
    //         contentType = "text/html";
    //       } else if (filePath.endsWith(".png")) {
    //         contentType = "image/png";
    //       } else if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) {
    //         contentType = "image/jpeg";
    //       } else if (filePath.endsWith(".gif")) {
    //         contentType = "image/gif";
    //       }
    //       // Thêm các loại file khác nếu cần

    //       return new Response(file, {
    //         headers: {
    //           "Content-Type": contentType,
    //         },
    //       });
    //     }
    //   } catch (error) {
    //     // Log lỗi nếu có vấn đề khi đọc file (ví dụ: permission denied)
    //     console.error(`Error serving file ${filePath}:`, error);
    //     return new Response("Internal Server Error", { status: 500 });
    //   }
    // }

    // --- Các route API hoặc dynamic khác có thể đặt ở đây ---
    // Ví dụ:
    // if (pathname === "/api/data") {
    //   return Response.json({ message: "API data" });
    // }

    // --- Cuối cùng, nếu không có route nào khớp ---
    //return new Response("Not Found", { status: 404 }),
  // },
});