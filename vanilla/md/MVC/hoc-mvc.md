## MVC hoc

Tuyệt vời! Để triển khai một ví dụ cơ bản về mô hình MVC trong Bun, chúng ta sẽ xây dựng một ứng dụng nhỏ hiển thị danh sách người dùng từ cơ sở dữ liệu PostgreSQL.

Dưới đây là cấu trúc thư mục và nội dung của từng file:

your-bun-mvc-app/
├── public/
│   └── style.css         # File CSS tĩnh
├── src/
│   ├── controllers/
│   │   └── UserController.js # Bộ điều khiển cho người dùng
│   ├── models/
│   │   └── User.js         # Mô hình dữ liệu người dùng
│   ├── views/
│   │   └── users/
│   │       └── index.html  # Giao diện hiển thị danh sách người dùng
│   ├── routes/
│   │   └── index.js        # Định nghĩa tất cả các tuyến đường
│   ├── core/
│   │   └── connection.js   # Kết nối cơ sở dữ liệu PostgreSQL
│   └── server.js           # File khởi động ứng dụng chính
├── package.json
└── bun.lockb
Bước 1: Cài đặt thư viện pg

Mở terminal tại thư mục gốc của dự án (your-bun-mvc-app/) và chạy lệnh sau:

Bash

bun add pg
Bước 2: Tạo các file và thư mục

Tạo cấu trúc thư mục như trên, sau đó điền nội dung vào từng file.

1. File: src/core/connection.js (Kết nối cơ sở dữ liệu)
File này sẽ chứa logic kết nối PostgreSQL.
PostgreSQL Connection
18:23 18 thg 7

Mở

2. File: src/models/User.js (Mô hình người dùng)
Model User sẽ chịu trách nhiệm tương tác trực tiếp với bảng users trong cơ sở dữ liệu.
User Model
18:23 18 thg 7

Mở

3. File: src/controllers/UserController.js (Bộ điều khiển người dùng)
Controller này sẽ xử lý các yêu cầu HTTP liên quan đến người dùng, gọi Model để lấy dữ liệu, và sau đó render View.
User Controller
18:23 18 thg 7

Mở

4. File: src/views/users/index.html (Giao diện hiển thị danh sách người dùng)
Đây là một file HTML đơn giản sẽ được Controller đọc và điền dữ liệu vào.
User List View
18:23 18 thg 7

Mở

5. File: public/style.css (CSS tĩnh)
Một file CSS đơn giản để làm đẹp giao diện.
Public Style CSS
18:23 18 thg 7

Mở

6. File: src/routes/index.js (Định nghĩa tuyến đường)
File này sẽ tập trung định nghĩa các tuyến đường và ánh xạ chúng tới các phương thức của Controller.
Route Definitions
18:23 18 thg 7

Mở

7. File: src/server.js (File khởi động ứng dụng chính)
Đây là file chính để khởi động Bun server và xử lý định tuyến.
Bun MVC Server
18:23 18 thg 7

Mở

Bước 3: Chuẩn bị cơ sở dữ liệu
Đảm bảo rằng bạn đã tạo cơ sở dữ liệu mvcdb và bảng users với dữ liệu mẫu trong PostgreSQL. Nếu chưa, hãy chạy các lệnh SQL sau:

SQL

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

INSERT INTO users (name, email) VALUES ('Nguyen Van A', 'nguyenvana@example.com');
INSERT INTO users (name, email) VALUES ('Tran Thi B', 'tranthib@example.com');
INSERT INTO users (name, email) VALUES ('Le Van C', 'levanc@example.com');
Bước 4: Chạy ứng dụng
Mở terminal tại thư mục gốc của dự án (your-bun-mvc-app/) và chạy:

Bash

bun run src/server.js
Bạn sẽ thấy thông báo "✅ Kết nối thành công tới PostgreSQL!" và "🚀 Server Bun MVC đang chạy tại http://localhost:3000".

Bước 5: Kiểm tra ứng dụng
Mở trình duyệt và truy cập:

http://localhost:3000/: Trang chủ đơn giản.

http://localhost:3000/users: Để xem danh sách người dùng được lấy từ cơ sở dữ liệu và hiển thị bằng View.

http://localhost:3000/users/1: Để xem chi tiết người dùng có ID là 1. (Bạn có thể thay đổi ID).

Bạn cũng có thể thử các phương thức POST, PUT, DELETE bằng các công cụ như Postman hoặc curl để tương tác với các API /users và /users/:id.

Ví dụ với curl để tạo người dùng mới:

Bash

curl -X POST -H "Content-Type: application/json" -d '{"name": "Pham Van D", "email": "phamvand@example.com"}' http://localhost:3000/users
Chúc mừng bạn đã triển khai thành công một ứng dụng Bun cơ bản theo mô hình MVC! Mô hình này sẽ giúp bạn quản lý mã nguồn tốt hơn khi ứng dụng của bạn phát triển lớn hơn.

### // src/core/connection.js
import pg from 'pg';

const { Pool } = pg;

// Cấu hình kết nối PostgreSQL
const pool = new Pool({
    user: "cong",          // Tên người dùng PostgreSQL của bạn
    host: "localhost",     // Host của PostgreSQL (thường là localhost)
    database: "mvcdb",     // Tên cơ sở dữ liệu của bạn
    password: "Cong12345", // Mật khẩu PostgreSQL của bạn
    port: 5432,            // Cổng PostgreSQL (mặc định là 5432)
    max: 20,               // Số lượng kết nối tối đa trong pool
    idleTimeoutMillis: 30000, // Đóng kết nối nhàn rỗi sau 30 giây
    connectionTimeoutMillis: 2000, // Timeout khi thiết lập kết nối mới
});

// Xử lý lỗi từ pool
pool.on('error', (err, client) => {
    console.error('Lỗi không mong muốn trên client PostgreSQL:', err);
    // Trong môi trường production, bạn có thể muốn xử lý lỗi này một cách nhẹ nhàng hơn
    // Ví dụ: ghi log và cố gắng kết nối lại
    process.exit(-1); // Thoát ứng dụng nếu có lỗi nghiêm trọng
});

// Export pool để có thể sử dụng ở các file khác (Model)
export { pool };

### // src/models/User.js
import { pool } from '../core/connection.js';

class User {
    // Phương thức để lấy tất cả người dùng từ cơ sở dữ liệu
    static async getAll() {
        let client;
        try {
            client = await pool.connect(); // Lấy một client từ pool
            const result = await client.query('SELECT id, name, email FROM users ORDER BY id ASC');
            return result.rows; // Trả về mảng các đối tượng người dùng
        } catch (error) {
            console.error("Lỗi khi lấy tất cả người dùng:", error.message);
            throw error; // Ném lỗi để Controller xử lý
        } finally {
            if (client) client.release(); // Luôn giải phóng client về pool
        }
    }

    // Phương thức để lấy người dùng theo ID từ cơ sở dữ liệu
    static async getById(id) {
        let client;
        try {
            client = await pool.connect();
            // Sử dụng parameterized query ($1) để tránh SQL Injection
            const result = await client.query('SELECT id, name, email FROM users WHERE id = $1', [id]);
            return result.rows[0]; // Trả về đối tượng người dùng đầu tiên tìm thấy (hoặc undefined)
        } catch (error) {
            console.error(`Lỗi khi lấy người dùng với ID ${id}:`, error.message);
            throw error;
        } finally {
            if (client) client.release();
        }
    }

    // Phương thức để tạo một người dùng mới
    static async create(name, email) {
        let client;
        try {
            client = await pool.connect();
            const result = await client.query(
                'INSERT INTO users(name, email) VALUES($1, $2) RETURNING id, name, email',
                [name, email]
            );
            return result.rows[0]; // Trả về người dùng vừa được tạo với ID
        } catch (error) {
            console.error("Lỗi khi tạo người dùng mới:", error.message);
            throw error;
        } finally {
            if (client) client.release();
        }
    }

    // Phương thức để cập nhật thông tin người dùng
    static async update(id, name, email) {
        let client;
        try {
            client = await pool.connect();
            const result = await client.query(
                'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING id, name, email',
                [name, email, id]
            );
            return result.rows[0]; // Trả về người dùng đã cập nhật
        } catch (error) {
            console.error(`Lỗi khi cập nhật người dùng với ID ${id}:`, error.message);
            throw error;
        } finally {
            if (client) client.release();
        }
    }

    // Phương thức để xóa người dùng
    static async delete(id) {
        let client;
        try {
            client = await pool.connect();
            const result = await client.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
            return result.rowCount > 0; // Trả về true nếu có bản ghi được xóa
        } catch (error) {
            console.error(`Lỗi khi xóa người dùng với ID ${id}:`, error.message);
            throw error;
        } finally {
            if (client) client.release();
        }
    }
}

export default User;


### // src/controllers/UserController.js
import User from '../models/User.js'; // Import Model User
import { readFileSync } from 'fs'; // Để đọc file HTML

class UserController {
    // Phương thức hiển thị danh sách tất cả người dùng
    static async index(req) {
        try {
            const users = await User.getAll(); // Gọi Model để lấy dữ liệu
            // Đọc nội dung file HTML View
            const htmlContent = readFileSync('./src/views/users/index.html', 'utf8');

            // Tạo các hàng HTML cho bảng người dùng
            let userRows = '';
            if (users && users.length > 0) {
                userRows = users.map(user => `
                    <tr>
                        <td class="px-4 py-2 border rounded-md">${user.id}</td>
                        <td class="px-4 py-2 border rounded-md">${user.name}</td>
                        <td class="px-4 py-2 border rounded-md">${user.email}</td>
                        <td class="px-4 py-2 border rounded-md">
                            <a href="/users/${user.id}" class="text-blue-500 hover:underline">Chi tiết</a>
                        </td>
                    </tr>
                `).join('');
            } else {
                userRows = `<tr><td colspan="4" class="px-4 py-2 text-center text-gray-500">Không có người dùng nào.</td></tr>`;
            }

            // Thay thế placeholder trong HTML bằng dữ liệu thực tế
            const finalHtml = htmlContent.replace('<!-- USER_ROWS -->', userRows);

            return new Response(finalHtml, {
                headers: { 'Content-Type': 'text/html; charset=utf-8' },
            });
        } catch (error) {
            console.error("Lỗi trong UserController.index:", error.message);
            return new Response("Lỗi server khi lấy danh sách người dùng.", { status: 500 });
        }
    }

    // Phương thức hiển thị chi tiết người dùng theo ID
    static async show(req) {
        const { id } = req.params; // Lấy ID từ URL params
        try {
            const user = await User.getById(id); // Gọi Model để lấy dữ liệu chi tiết

            if (!user) {
                return new Response(`Không tìm thấy người dùng với ID: ${id}`, { status: 404 });
            }

            // Tạo HTML đơn giản để hiển thị chi tiết người dùng
            const htmlResponse = `
                <!DOCTYPE html>
                <html lang="vi">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Chi tiết người dùng</title>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
                    <style>
                        body { font-family: 'Inter', sans-serif; }
                    </style>
                </head>
                <body class="bg-gray-100 flex items-center justify-center min-h-screen p-4">
                    <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                        <h1 class="text-3xl font-bold mb-6 text-gray-800 text-center">Chi tiết người dùng</h1>
                        <div class="space-y-4">
                            <p class="text-lg"><strong class="font-semibold text-gray-700">ID:</strong> <span class="text-gray-600">${user.id}</span></p>
                            <p class="text-lg"><strong class="font-semibold text-gray-700">Tên:</strong> <span class="text-gray-600">${user.name}</span></p>
                            <p class="text-lg"><strong class="font-semibold text-gray-700">Email:</strong> <span class="text-gray-600">${user.email}</span></p>
                        </div>
                        <div class="mt-6 text-center">
                            <a href="/users" class="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300">
                                Quay lại danh sách
                            </a>
                        </div>
                    </div>
                </body>
                </html>
            `;
            return new Response(htmlResponse, {
                headers: { 'Content-Type': 'text/html; charset=utf-8' },
            });
        } catch (error) {
            console.error(`Lỗi trong UserController.show cho ID ${id}:`, error.message);
            return new Response("Lỗi server khi lấy chi tiết người dùng.", { status: 500 });
        }
    }

    // Phương thức xử lý tạo người dùng mới (ví dụ: từ form POST)
    static async create(req) {
        try {
            const { name, email } = await req.json(); // Giả sử dữ liệu gửi dưới dạng JSON
            if (!name || !email) {
                return new Response("Tên và Email là bắt buộc.", { status: 400 });
            }
            const newUser = await User.create(name, email);
            return Response.json({ message: "Người dùng đã được tạo thành công!", user: newUser }, { status: 201 });
        } catch (error) {
            console.error("Lỗi trong UserController.create:", error.message);
            return new Response("Lỗi server khi tạo người dùng.", { status: 500 });
        }
    }

    // Phương thức xử lý cập nhật người dùng
    static async update(req) {
        const { id } = req.params;
        try {
            const { name, email } = await req.json();
            if (!name || !email) {
                return new Response("Tên và Email là bắt buộc.", { status: 400 });
            }
            const updatedUser = await User.update(id, name, email);
            if (!updatedUser) {
                return new Response("Không tìm thấy người dùng để cập nhật.", { status: 404 });
            }
            return Response.json({ message: "Người dùng đã được cập nhật thành công!", user: updatedUser });
        } catch (error) {
            console.error(`Lỗi trong UserController.update cho ID ${id}:`, error.message);
            return new Response("Lỗi server khi cập nhật người dùng.", { status: 500 });
        }
    }

    // Phương thức xử lý xóa người dùng
    static async delete(req) {
        const { id } = req.params;
        try {
            const deleted = await User.delete(id);
            if (!deleted) {
                return new Response("Không tìm thấy người dùng để xóa.", { status: 404 });
            }
            return new Response("Người dùng đã được xóa thành công!", { status: 200 });
        } catch (error) {
            console.error(`Lỗi trong UserController.delete cho ID ${id}:`, error.message);
            return new Response("Lỗi server khi xóa người dùng.", { status: 500 });
        }
    }
}

export default UserController;

### src/views/users/index.html

<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Danh sách người dùng</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/style.css"> <!-- Liên kết đến file CSS tĩnh -->
    <style>
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-gray-100 p-8">
    <div class="container mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 class="text-4xl font-bold mb-8 text-center text-gray-800">Danh sách người dùng</h1>

        <div class="overflow-x-auto">
            <table class="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead class="bg-gray-200">
                    <tr>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider rounded-tl-lg">ID</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tên</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider rounded-tr-lg">Hành động</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    <!-- USER_ROWS -->
                    <!-- Dữ liệu người dùng sẽ được chèn vào đây bởi Controller -->
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>

### src/routes/index.js

// src/routes/index.js
import UserController from '../controllers/UserController.js';

// Định nghĩa các tuyến đường của ứng dụng
const routes = {
    // Tuyến đường cho trang chủ
    '/': async () => {
        return new Response('Chào mừng đến với ứng dụng Bun MVC!', {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
    },

    // Các tuyến đường liên quan đến người dùng
    '/users': {
        GET: UserController.index, // Hiển thị danh sách người dùng
        POST: UserController.create, // Tạo người dùng mới
    },
    '/users/:id': {
        GET: UserController.show,    // Hiển thị chi tiết người dùng theo ID
        PUT: UserController.update,  // Cập nhật người dùng theo ID
        DELETE: UserController.delete, // Xóa người dùng theo ID
    },

    // Các tuyến đường API khác có thể được thêm vào đây
    '/api/health': () => new Response('OK', { status: 200 }),
};

export default routes;


### src/server.js

// src/server.js
import { serve } from "bun";
import { pool } from "./core/connection.js"; // Import pool để kiểm tra kết nối DB
import routes from './routes/index.js'; // Import các tuyến đường đã định nghĩa
import { stat, readFile } from 'fs/promises'; // Để xử lý file tĩnh

const PORT = 3000;

// Hàm kiểm tra kết nối cơ sở dữ liệu khi server khởi động
async function testDbConnection() {
    let client;
    try {
        client = await pool.connect();
        console.log("✅ Kết nối thành công tới PostgreSQL!");
        const res = await client.query('SELECT NOW()');
        console.log("⏰ Thời gian hiện tại từ DB:", res.rows[0].now);
    } catch (err) {
        console.error("❌ Lỗi kết nối hoặc truy vấn PostgreSQL:", err.message);
        console.error("Vui lòng kiểm tra cấu hình DB và đảm bảo PostgreSQL đang chạy.");
        // Có thể thoát ứng dụng nếu kết nối DB là bắt buộc
        process.exit(1);
    } finally {
        if (client) client.release(); // Luôn giải phóng client
    }
}

// Gọi hàm kiểm tra kết nối khi server khởi động
testDbConnection();

serve({
    async fetch(req) {
        const url = new URL(req.url);
        const path = url.pathname;
        const method = req.method;

        // Xử lý file tĩnh từ thư mục public/
        if (path.startsWith('/public/') || path === '/style.css') {
            const filePath = path === '/style.css' ? './public/style.css' : `.${path}`;
            try {
                const fileStat = await stat(filePath);
                if (fileStat.isFile()) {
                    const fileContent = await readFile(filePath);
                    let contentType = 'application/octet-stream';
                    if (filePath.endsWith('.css')) contentType = 'text/css';
                    else if (filePath.endsWith('.js')) contentType = 'text/javascript';
                    else if (filePath.endsWith('.png')) contentType = 'image/png';
                    else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) contentType = 'image/jpeg';
                    return new Response(fileContent, { headers: { 'Content-Type': contentType } });
                }
            } catch (error) {
                // File không tìm thấy hoặc lỗi đọc file
                console.warn(`File tĩnh không tìm thấy: ${filePath}`);
            }
        }

        // Tìm kiếm tuyến đường phù hợp
        for (const routePath in routes) {
            // Xử lý các tuyến đường có tham số động (ví dụ: /users/:id)
            if (routePath.includes(':')) {
                const regexPath = new RegExp(`^${routePath.replace(/:([a-zA-Z0-9_]+)/g, '(?<$1>[^/]+)')}$`);
                const match = url.pathname.match(regexPath);

                if (match) {
                    const handler = routes[routePath];
                    if (typeof handler === 'function' && method === 'GET') {
                        // Nếu là hàm trực tiếp (ví dụ: '/')
                        return handler(req);
                    } else if (typeof handler === 'object' && handler[method]) {
                        // Nếu là đối tượng với các phương thức HTTP
                        req.params = match.groups; // Gắn params vào đối tượng request
                        return handler[method](req);
                    }
                }
            } else if (routePath === path) {
                const handler = routes[routePath];
                if (typeof handler === 'function' && method === 'GET') {
                    // Nếu là hàm trực tiếp (ví dụ: '/')
                    return handler(req);
                } else if (typeof handler === 'object' && handler[method]) {
                    // Nếu là đối tượng với các phương thức HTTP
                    return handler[method](req);
                }
            }
        }

        // Nếu không có tuyến đường nào khớp
        return new Response("Không tìm thấy trang (404 Not Found)", { status: 404 });
    },
    port: PORT,
});

console.log(`🚀 Server Bun MVC đang chạy tại http://localhost:${PORT}`);
console.log(`Truy cập: http://localhost:${PORT}/users để xem danh sách người dùng.`);

### SQL

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);

INSERT INTO users (name, email) VALUES ('Nguyen Van A', 'nguyenvana@example.com');
INSERT INTO users (name, email) VALUES ('Tran Thi B', 'tranthib@example.com');
INSERT INTO users (name, email) VALUES ('Le Van C', 'levanc@example.com');

### bun run src/server.js
bun run src/server.js
