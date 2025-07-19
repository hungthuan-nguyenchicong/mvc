## vite

Vâng, bạn hoàn toàn có thể sử dụng Bun làm máy chủ backend và Vite cho phát triển frontend , tận dụng khả năng HMR tuyệt vời của Vite. Đây là một thiết lập rất phổ biến và hiệu quả cho phát triển full-stack.

Để chạy cả Bun (cho phần phụ trợ server.js) và Vite (cho phần giao diện frontend.jsvà views), bạn thường sẽ sử dụng trình chạy tập lệnh đồng thời trong package.json.

Chạy Bun Backend và Vite Frontend đồng thời
Sau đây là cách thiết lập package.jsonđể chạy cả hai cùng lúc:

1. Cấu trúc dự án
Đầu tiên, hãy đảm bảo cấu trúc dự án của bạn tách biệt mã frontend và mã backend.

your-project/
├── backend/
│   └── server.js      # Your Bun backend server
├── frontend/
│   ├── index.html     # Your main HTML file for Vite
│   ├── main.js        # Your main frontend JS file
│   └── views/         # Any additional views/components for frontend
│       └── some-view.js
├── package.json
└── tsconfig.json      # (Optional, if using TypeScript)
2. Thiết lập Vite trongfrontend/
Nếu bạn chưa thực hiện, hãy thiết lập một dự án Vite trong frontend/thư mục của bạn.

Đập

cd your-project
bun create vite frontend --template vanilla # or react, vue, svelte etc.
cd frontend
bun install
Điều này sẽ tạo ra frontend/index.html, frontend/main.js, v.v.

3. Cập nhậtpackage.json
Bây giờ, hãy sửa đổi gốc package.json(at your-project/package.json) của bạn để bao gồm các tập lệnh cho cả Bun và Vite, sau đó là một tập lệnh kết hợp.

JSON

{
  "name": "your-fullstack-app",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "backend:dev": "bun --watch run ./backend/server.js",
    "frontend:dev": "cd frontend && bun --bun vite dev --port 5173",
    "dev": "bun run backend:dev & bun run frontend:dev"
  },
  "devDependencies": {
    "@types/bun": "latest",
    "vite": "^5.0.0"
  },
  "peerDependencies": {
    "typescript": "^5.0.0"
  }
}
Giải thích về các tập lệnh:
backend:dev": "bun --watch run ./backend/server.js":

Tập lệnh này khởi động máy chủ phụ trợ Bun của bạn ( server.js).

--watchđảm bảo rằng Bun sẽ tự động khởi động lại máy chủ phụ trợ của bạn bất cứ khi nào bạn thực hiện thay đổi server.jshoặc bất kỳ tệp nào mà nó nhập vào.

frontend:dev": "cd frontend && bun --bun vite dev --port 5173":

cd frontend: Điều hướng đến frontend/thư mục của bạn. Vite cần được chạy từ thư mục gốc của dự án.

bun --bun vite dev: Chạy vite devlệnh bằng Bun. bun --bunyêu cầu Bun sử dụng buntrình phân giải nội bộ của nó để chạy vitetệp thực thi được cài đặt dưới dạng tệp phụ thuộc trong frontend/package.json.

--port 5173: Chỉ định cổng cho máy chủ phát triển của Vite (mặc định là 5173). Vite sẽ cung cấp tài nguyên giao diện người dùng của bạn tại đây và xử lý HMR.

dev": "bun run backend:dev & bun run frontend:dev":

Đây là tập lệnh phát triển chính của bạn.

&(dấu &) là một toán tử shell chạy các lệnh ở chế độ nền (đồng thời). Điều này có nghĩa là cả máy chủ phụ trợ Bun và máy chủ phát triển frontend Vite của bạn sẽ khởi động cùng lúc.

Cách thức hoạt động cùng nhau
Chạy tập lệnh kết hợp: Mở terminal trong your-project/thư mục gốc và chạy:

Đập

bun run dev
Truy cập giao diện của bạn: Mở trình duyệt và điều hướng đến http://localhost:5173(cổng Vite).

Phát triển giao diện người dùng (Vite):

Khi bạn sửa đổi bất kỳ tệp nào trong frontend/thư mục của mình (HTML, main.js, CSS hoặc các tệp được chúng nhập, bao gồm cả các tệp trong frontend/views/), HMR của Vite sẽ tự động cập nhật trình duyệt của bạn mà không cần tải lại toàn bộ trang , đồng thời giữ nguyên trạng thái ứng dụng khi có thể.

Mã giao diện người dùng của bạn sẽ thực hiện các yêu cầu API tới phần phụ trợ Bun của bạn (ví dụ: http://localhost:3000/api/data).

Phát triển Backend (Bun):

Khi bạn sửa đổi backend/server.jshoặc nhập bất kỳ tệp nào, bun --watchnó sẽ phát hiện các thay đổi và khởi động lại máy chủ Bun của bạn (ví dụ: trên cổng 3000).

Sau khi máy chủ backend khởi động lại, mọi yêu cầu API mới từ frontend của bạn sẽ được cập nhật mã backend. Vì Vite xử lý frontend, trình duyệt sẽ không tự động làm mới khi backend khởi động lại; bạn có thể cần kích hoạt một hành động frontend gọi lại API để xem các thay đổi backend được phản ánh, hoặc chỉ cần làm mới trình duyệt nếu đó là một thay đổi backend quan trọng ảnh hưởng đến quá trình tải trang ban đầu.

server.jsVí dụ về phần cuối
Sau đó, bạn backend/server.jssẽ tập trung chủ yếu vào các tuyến API:

JavaScript

// backend/server.js
import { serve } from "bun";

const server = serve({
  port: 3000, // Bun backend port
  fetch(req) {
    const url = new URL(req.url);

    // Example API route
    if (url.pathname === "/api/hello" && req.method === "GET") {
      return new Response(JSON.stringify({ message: "Hello from Bun Backend!" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // You might also serve some static files from backend if needed,
    // but Vite typically handles all frontend static assets.
    // ... your other backend routes (e.g., database interactions, authentication)

    return new Response("Not Found", { status: 404 });
  },
  error(error) {
    console.error("Bun server error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});

console.log(`Bun Backend server running on http://localhost:${server.port}`);
Thiết lập này cung cấp những điều tốt nhất của cả hai thế giới: thời gian chạy Bun nhanh với chức năng khởi động lại tự động và máy chủ phát triển Vite mạnh mẽ với HMR cực nhanh.