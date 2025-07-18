## View File

Để trường hợp 'login' trả về một view, bạn cần có một cơ chế để render các tệp HTML (views). Trong môi trường Node.js hoặc JavaScript Runtime như Bun/Deno, điều này thường đòi hỏi một template engine (công cụ mẫu) hoặc một cách để đọc và trả về nội dung tệp HTML tĩnh.

Dưới đây là các bước và ví dụ để bạn có thể làm điều đó:

1. Chuẩn bị View File
Đầu tiên, bạn cần một tệp HTML cho trang login của mình. Hãy tạo một thư mục (ví dụ: views) và đặt tệp login.html vào đó.

Ví dụ: ./admin/views/login.html

HTML

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login</title>
    <style>
        body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f4f4f4; }
        .login-container { background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center; }
        input[type="text"], input[type="password"] { width: 90%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px; }
        button { background-color: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background-color: #0056b3; }
    </style>
</head>
<body>
    <div class="login-container">
        <h2>Admin Login</h2>
        <form action="/admin/do-login" method="post">
            <input type="text" placeholder="Username" required><br>
            <input type="password" placeholder="Password" required><br>
            <button type="submit">Login</button>
        </form>
    </div>
</body>
</html>
2. Cập nhật AdminController
Bạn sẽ thêm một phương thức mới trong AdminController để đọc và trả về nội dung của tệp HTML. Để đọc tệp, chúng ta sẽ cần thư viện fs/promises (File System promises API) của Node.js (hoặc tương đương trong Bun/Deno).

Ví dụ: ./admin/controllers/AdminController.js

JavaScript

import { readFile } from 'fs/promises'; // Import readFile for asynchronous file reading
import path from 'path'; // Import path for resolving file paths
import { fileURLToPath } from 'url'; // For ES Modules to get __dirname equivalent

// Helper to get directory name in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AdminController {
    async index() {
        return 'Admin Dashboard';
    }

    async json() {
        const data = {
            message: "This is a JSON response from admin"
        };
        return data;
    }

    async login() {
        try {
            // Construct the path to your login.html file
            // Adjust the path as per your directory structure relative to AdminController.js
            const loginPath = path.join(__dirname, '../views/login.html');
            const htmlContent = await readFile(loginPath, 'utf8');
            return htmlContent;
        } catch (error) {
            console.error('Error reading login view:', error);
            return 'Login page not found.'; // Fallback message
        }
    }

    async notFound() {
        return 'Page 404 not found';
    }
}

export default AdminController;
3. Cập nhật AdminRouter
Trong AdminRouter, bạn sẽ thêm một case mới cho /admin/login và gọi phương thức login() của AdminController. Điều quan trọng là phải thiết lập Content-Type header thành text/html để trình duyệt biết rằng nó đang nhận một trang HTML.

Ví dụ: ./admin/core/AdminRouter.js

JavaScript

import AdminController from "../controllers/AdminController";


class AdminRouter {
    constructor() {
        this.adminController = new AdminController();
    }

    async handleRequest(request) {
        const url = new URL(request.url);
        const pathname = url.pathname;
        const method = request.method;

        if (method === 'GET' || method === 'POST') {
            switch (pathname) {
                case '/admin':
                    return new Response(await this.adminController.index());
                case '/json':
                    const jsonData = await this.adminController.json();
                    return new Response(JSON.stringify(jsonData), {
                        headers: {
                            'Content-Type': 'application/json',
                            "X-Custom-Admin-Header": "json admin response"
                        }
                    });
                case '/admin/login': // New case for login view
                    const loginHtml = await this.adminController.login();
                    return new Response(loginHtml, {
                        headers: {
                            'Content-Type': 'text/html' // Crucial: Set Content-Type to text/html
                        }
                    });
                default:
                    return new Response(await this.adminController.notFound(), { status: 404 });
            }
        } else {
            // Method not allowed for other HTTP methods
            return new Response('Method Not Allowed', { status: 405 });
        }
    }
}

export default AdminRouter;
Giải thích
./admin/views/login.html: Đây là tệp HTML tĩnh mà bạn muốn trả về.

AdminController.js - import { readFile } from 'fs/promises';: Dòng này nhập hàm readFile từ module fs/promises. Đây là cách tiêu chuẩn để đọc tệp không đồng bộ trong môi trường JavaScript.

AdminController.js - path and fileURLToPath:

path module giúp bạn xử lý các đường dẫn tệp một cách độc lập với hệ điều hành (ví dụ: / trên Linux/macOS vs \ trên Windows).

fileURLToPath(import.meta.url) và path.dirname(__filename) là cách chuẩn để có được đường dẫn thư mục hiện tại (__dirname tương đương) khi sử dụng ES Modules. Điều này quan trọng để xác định đường dẫn chính xác đến tệp login.html.

AdminController.js - async login() method:

Nó xây dựng đường dẫn đầy đủ đến login.html.

Sử dụng await readFile(loginPath, 'utf8') để đọc nội dung của tệp dưới dạng một chuỗi UTF-8.

Trả về chuỗi HTML đó.

Bao gồm một khối try...catch để xử lý các lỗi có thể xảy ra khi đọc tệp (ví dụ: tệp không tồn tại).

AdminRouter.js - case '/admin/login':

Khi URL là /admin/login, nó gọi phương thức this.adminController.login().

Nó nhận lại chuỗi HTML từ phương thức đó.

Tạo một Response mới với chuỗi HTML làm thân (body) và quan trọng nhất là đặt Content-Type': 'text/html' trong headers. Điều này báo cho trình duyệt biết rằng nội dung là HTML và nó nên render nó như một trang web.

Bây giờ, khi bạn truy cập http://localhost:3000/admin/login trong trình duyệt của mình, bạn sẽ thấy trang đăng nhập được render.