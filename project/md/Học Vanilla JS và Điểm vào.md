## Học Vanilla JS và Điểm vào

Bạn đang có một cách tiếp cận rất tốt để học JavaScript bằng cách tập trung vào Vanilla JS và hiểu rõ quy trình từ frontend đến backend! Việc bạn muốn điểm vào là một file .js chứ không phải .html là một điểm đặc biệt thú vị, và Bun có thể giúp bạn làm điều đó.

1. Học Vanilla JS và Điểm vào .js
Để học Vanilla JS và có điểm vào là .js thay vì .html cho frontend, bạn có thể sử dụng Bun's loader để phục vụ một file JavaScript trực tiếp làm ứng dụng client-side của bạn.

project/frontend/src/main.js (Điểm vào Frontend Vanilla JS)
Đây sẽ là file chính của ứng dụng frontend của bạn.

JavaScript

// project/frontend/src/main.js

console.log('Hello from Vanilla JS Frontend!');

document.addEventListener('DOMContentLoaded', () => {
    const appDiv = document.createElement('div');
    appDiv.id = 'app';
    appDiv.innerHTML = `
        <h1>Vanilla JS App</h1>
        <p>This content is rendered by JavaScript directly!</p>
        <button id="fetchAdminIndex">Fetch Admin Index</button>
        <button id="fetchAdminLogin">Fetch Admin Login (GET)</button>
        <button id="sendAdminLoginPost">Send Admin Login (POST)</button>
    `;
    document.body.appendChild(appDiv);

    // Xử lý sự kiện click
    document.getElementById('fetchAdminIndex').addEventListener('click', async () => {
        try {
            const response = await fetch('/admin/index');
            const text = await response.text();
            alert('Admin Index Response: ' + text);
        } catch (error) {
            console.error('Error fetching admin index:', error);
            alert('Error fetching admin index. Check console.');
        }
    });

    document.getElementById('fetchAdminLogin').addEventListener('click', async () => {
        try {
            const response = await fetch('/admin/login');
            const text = await response.text();
            alert('Admin Login GET Response: ' + text);
        } catch (error) {
            console.error('Error fetching admin login GET:', error);
            alert('Error fetching admin login GET. Check console.');
        }
    });

    document.getElementById('sendAdminLoginPost').addEventListener('click', async () => {
        try {
            const response = await fetch('/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: 'testuser', password: 'testpassword' })
            });
            const json = await response.json();
            alert('Admin Login POST Response: ' + JSON.stringify(json));
        } catch (error) {
            console.error('Error sending admin login POST:', error);
            alert('Error sending admin login POST. Check console.');
        }
    });
});
2. Xây dựng Frontend tại frontend/public
Để build các file JavaScript và đặt chúng vào frontend/public, bạn có thể sử dụng lệnh bun build. Bun là một JavaScript runtime và cũng là một bundler mạnh mẽ.

project/frontend/package.json
Bạn sẽ cần một script để build. Vite không cần thiết ở đây vì bạn không dùng React và không muốn index.html.

JSON

// project/frontend/package.json
{
  "name": "frontend",
  "version": "1.0.0",
  "description": "Vanilla JS Frontend",
  "main": "src/main.js",
  "scripts": {
    "build": "bun build ./src/main.js --outdir ./public --target browser --splitting"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
Giải thích lệnh bun build:

bun build ./src/main.js: Lấy main.js làm điểm vào.

--outdir ./public: Đặt kết quả đầu ra vào thư mục public (trong frontend).

--target browser: Biên dịch cho môi trường trình duyệt.

--splitting: Cho phép Bun thực hiện code splitting nếu bạn có các import() động trong Vanilla JS frontend của mình.

Cách Build Frontend:

Mở terminal trong thư mục project/frontend.

Chạy bun install (nếu có dependencies).

Chạy bun run build.
Sau khi chạy, bạn sẽ thấy các file JavaScript đã được biên dịch và tối ưu hóa trong project/frontend/public.

3. Bun Server Phục vụ File Tĩnh tại frontend/public
Bây giờ, Bun backend của bạn sẽ cần phục vụ các file JavaScript đã build từ project/frontend/public.

Cập nhật project/backend/server.js
JavaScript

// ./project/backend/server.js

import { serve, file } from "bun";
import { AdminRouter } from "../core/AdminRouter.js";
import path from 'path';

// Định nghĩa đường dẫn đến thư mục public của frontend
// Điều này quan trọng: nó trỏ đến nơi Bun build frontend của bạn
const FRONTEND_PUBLIC_DIR = path.join(import.meta.dir, '../../frontend/public');

const server = serve({
    port: process.env.PORT || 3000,

    async fetch(req) {
        const url = new URL(req.url);
        const pathname = url.pathname;

        // --- 1. Xử lý AdminRouter động ---
        if (pathname.startsWith('/admin/')) {
            const parts = pathname.split('/').filter(Boolean);
            if (parts.length >= 2 && parts[0] === 'admin') {
                const methodName = parts[1];
                req.params = { method: methodName }; // Gán params cho req

                const dynamicAdminHandler = AdminRouter['/admin/:method'];
                if (dynamicAdminHandler) {
                    return await dynamicAdminHandler(req);
                }
            }
        }

        // --- 2. Phục vụ các file tĩnh từ thư mục FRONTEND_PUBLIC_DIR ---
        // Ví dụ: khi trình duyệt yêu cầu /main.js (từ đường dẫn gốc)
        let filePath;
        if (pathname === '/') {
            // Nếu là yêu cầu gốc, trả về file JavaScript chính đã build
            filePath = path.join(FRONTEND_PUBLIC_DIR, 'main.js'); // Assuming main.js is the entry point
        } else {
            // Yêu cầu các file khác (ví dụ: các chunk JS khác nếu có code splitting)
            filePath = path.join(FRONTEND_PUBLIC_DIR, pathname);
        }
        
        const requestedFile = Bun.file(filePath);

        // Kiểm tra nếu file tồn tại
        if (await requestedFile.exists()) {
            return new Response(requestedFile);
        }

        // --- 3. Xử lý các API routes khác (nếu có) ---
        // Ví dụ:
        if (pathname === '/api/data') {
            return new Response(JSON.stringify({ message: 'Data from API' }), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // --- 4. Trả về 404 nếu không tìm thấy gì ---
        return new Response('Page 404 - Not Found', { status: 404 });
    }
});

console.log(`Bun server running on http://${process.env.HOST || 'localhost'}:${server.port}`);
Giải thích cập nhật server.js:

FRONTEND_PUBLIC_DIR: Đường dẫn đến thư mục public của frontend. ../../ để đi lên từ backend sang project rồi xuống frontend/public.

Điểm vào .js: Khi request đến / (root), thay vì tìm index.html, server sẽ trả về main.js đã được build từ frontend/public. Trình duyệt sẽ nhận file JS này và thực thi nó, tạo ra nội dung HTML.

Các yêu cầu khác (ví dụ: các chunk JS nếu bạn có tải động, hoặc các assets khác mà main.js cần) cũng sẽ được phục vụ từ FRONTEND_PUBLIC_DIR.

Quy trình Làm việc với Vanilla JS và Bun
Mở 2 Terminal:

Terminal 1 (Backend): Di chuyển đến project/backend.

Chạy bun run server.js (hoặc bun project/backend/server.js).

Server Bun sẽ lắng nghe trên cổng 3000.

Terminal 2 (Frontend): Di chuyển đến project/frontend.

Đầu tiên, chạy bun install.

Sau đó, chạy bun run build. Lệnh này sẽ biên dịch main.js và các phụ thuộc vào project/frontend/public.

Truy cập Ứng dụng: Mở trình duyệt và truy cập http://localhost:3000.

Bun server sẽ nhận yêu cầu /.

Nó sẽ phục vụ file main.js từ project/frontend/public.

Trình duyệt sẽ tải và thực thi main.js, tạo ra nội dung HTML và các button.

Khi bạn click vào các button, main.js sẽ gửi các request fetch đến các route /admin/index hoặc /admin/login, được xử lý bởi Bun backend của bạn.

Với thiết lập này, bạn có một môi trường học tập tuyệt vời để hiểu sâu về JavaScript (Vanilla JS), cách Bun xử lý cả backend logic và phục vụ file tĩnh, cũng như cách các ứng dụng frontend và backend giao tiếp.