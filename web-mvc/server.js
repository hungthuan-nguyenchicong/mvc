// web-mvc/server.js
import { RouteAdmin } from "./backend/core/RouteAdmin";
//import index from "./index.html";
Bun.serve({
    // development can also be an object.
    // development: {
    //     // Enable Hot Module Reloading
    //     hmr: true,

    //     // Echo console logs from the browser to the terminal
    //     console: true,
    // },
    //port: 3000,
    //hostname: "0.0.0.0",
    routes: {
        '/': new Response('/'),
        //'/': index,
        ...RouteAdmin,
        '/src/*': req => {
          const url = new URL(req.url);
          const pathname = url.pathname;
          //console.log(pathname)
          const catchFile = ['.css', '.js', '.png', '.svg'];
          // Bước 1: Trích xuất phần mở rộng của tệp
          const fileExtension = pathname.substring(pathname.lastIndexOf('.'));
          // Bước 2: Kiểm tra xem phần mở rộng có nằm trong danh sách cho phép không
          if (!catchFile.includes(fileExtension)) {
            // Nếu không nằm trong danh sách, trả về lỗi 403 Forbidden hoặc 404 Not Found
            console.warn(`Yêu cầu truy cập tệp không hợp lệ: ${pathname}`);
            return new Response('Forbidden', { status: 403 }); // Hoặc 404 nếu bạn muốn ẩn sự tồn tại của tệp
          }

          try {
            const file = Bun.file('./' + pathname);
            if (file) {
              return new Response(file);
            }
          } catch (error) {
            console.error(error);
          }
        }
    },
    fetch(req) {
      return new Response("404!");
    }
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