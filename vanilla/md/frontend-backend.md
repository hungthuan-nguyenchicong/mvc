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

## vi du co ban

Dưới đây là một ví dụ đơn giản để phát triển cả backend (Bun) và frontend (Vite) trong cùng một dự án, tuân theo cấu trúc bạn đã cung cấp.

Cấu Trúc Dự Án
your-project/
├── backend/
│   └── server.js
├── frontend/
│   ├── index.html
│   ├── main.js
│   └── public/        # Thư mục chứa các tài nguyên tĩnh khác của frontend (ví dụ: CSS)
│       └── style.css
├── package.json
└── tsconfig.json      # (Nếu bạn dùng TypeScript)
1. File package.json (ở thư mục gốc your-project/)
Đây là nơi bạn định nghĩa các script để chạy cả hai phần.

JSON

{
  "name": "fullstack-bun-vite",
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
2. Máy chủ phụ trợ ( backend/server.js)
File này sẽ là API backend của bạn, chạy trên Bun.

JavaScript

// backend/server.js
import { serve } from "bun";

const server = serve({
  port: 3000, // Cổng cho API backend của Bun
  fetch(req) {
    const url = new URL(req.url);

    // Một API endpoint đơn giản
    if (url.pathname === "/api/hello" && req.method === "GET") {
      console.log("Received request for /api/hello");
      return new Response(JSON.stringify({ message: "Hello from Bun Backend!" }), {
        headers: {
          "Content-Type": "application/json",
          // Cho phép frontend từ Vite server (port 5173) truy cập API này
          "Access-Control-Allow-Origin": "http://localhost:5173",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        },
      });
    }

    // Xử lý preflight requests cho CORS
    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 204, // No Content
            headers: {
                "Access-Control-Allow-Origin": "http://localhost:5173",
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
3. Frontend Files (trong thư mục frontend/)
3.1.frontend/index.html
File HTML chính của ứng dụng frontend.

HTML

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bun + Vite Frontend</title>
    <link rel="stylesheet" href="/public/style.css">
</head>
<body>
    <h1>Loading...</h1>
    <button id="fetchDataBtn">Fetch Data from Backend</button>
    <p id="dataMessage"></p>
    <script type="module" src="/main.js"></script>
</body>
</html>
3.2.frontend/main.js
Logic JavaScript cho frontend của bạn, tương tác với backend.

JavaScript

// frontend/main.js
import './public/style.css'; // Import CSS

document.addEventListener('DOMContentLoaded', () => {
    const h1 = document.querySelector('h1');
    const fetchDataBtn = document.getElementById('fetchDataBtn');
    const dataMessage = document.getElementById('dataMessage');

    h1.textContent = 'Welcome to Bun + Vite App!';

    fetchDataBtn.addEventListener('click', async () => {
        dataMessage.textContent = 'Fetching data...';
        try {
            // Gọi API từ backend server của Bun
            const response = await fetch('http://localhost:3000/api/hello');
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
3.3.frontend/public/style.css
Một file CSS đơn giản cho frontend.

CSS

/* frontend/public/style.css */
body {
    font-family: Arial, sans-serif;
    margin: 20px;
    background-color: #f4f4f4;
    color: #333;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 90vh;
}

h1 {
    color: #3498db;
}

button {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #2ecc71;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 20px;
}

button:hover {
    background-color: #27ae60;
}

#dataMessage {
    margin-top: 20px;
    font-weight: bold;
    color: #e74c3c;
}
4. Thiết Lập Vite (frontend/vite.config.js) (Tùy chọn nhưng tốt cho cấu hình)
Khi chạy bun create vite, nó sẽ tạo file này. Nếu không, bạn có thể tạo thủ công.

JavaScript

// frontend/vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  // Cấu hình Vite tại đây
  // Ví dụ: để phục vụ các file từ thư mục 'public' trong frontend
  publicDir: 'public',
  server: {
    port: 5173, // Đảm bảo trùng với port trong package.json
  },
});
Các Bước Chạy
Mở Terminal: Chuyển đến thư mục gốc của dự án (your-project/).

Cài đặt Dependencies:

Đập

bun install
# Chắc chắn đã cài đặt Vite trong thư mục frontend
cd frontend && bun install && cd ..
Khởi động Dev Server:

Đập

bun run dev
Bây giờ:

Terminal sẽ hiển thị thông báo từ Bun backend (chạy trên http://localhost:3000) và Vite frontend (chạy trên http://localhost:5173).

Mở trình duyệt và truy cập http://localhost:5173. Bạn sẽ thấy ứng dụng frontend của mình.

Khi bạn sửa đổi frontend/main.js hoặc frontend/public/style.css, Vite sẽ tự động hot-reload trình duyệt mà không làm mất trạng thái.

Khi bạn sửa đổi backend/server.js, Bun sẽ tự động khởi động lại backend server của bạn. Bạn có thể nhấn nút "Fetch Data from Backend" để thấy các thay đổi từ backend.

Đây là một cấu hình cơ bản nhưng mạnh mẽ để bắt đầu phát triển full-stack với Bun và Vite.