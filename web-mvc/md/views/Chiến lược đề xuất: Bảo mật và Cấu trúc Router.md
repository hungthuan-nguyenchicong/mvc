# Chiến lược đề xuất: Bảo mật và Cấu trúc Router

Bạn nói hoàn toàn chính xác! Với một khu vực quản trị (admin panel), SEO không phải là ưu tiên hàng đầu mà bảo mật mới là quan trọng nhất. Và việc cấu hình routing để đảm bảo tất cả các request đến /admin/* đều được bảo vệ là một chiến lược rất đúng đắn.

Hãy cùng làm rõ cách kết hợp bảo mật, routing và việc sử dụng query string cho API trong môi trường Bun & Vite của bạn.

Chiến lược đề xuất: Bảo mật và Cấu trúc Router
Chúng ta sẽ chia thành 2 loại đường dẫn chính dưới tiền tố /admin/:

/admin/ (HTML Pages & Static Assets): Dành cho các trang giao diện người dùng của admin (ví dụ: /admin/login, /admin/dashboard, /admin/users). Các trang này sẽ được trả về từ server của bạn (hoặc được render bởi Vite và phục vụ tĩnh).

/admin/api?c=Controller&a=method&... (API Endpoints): Dành riêng cho các yêu cầu API, có thể dùng query string để định tuyến đến controller/method cụ thể.

Bước 1: Middleware Xác thực cho tất cả /admin/*
Đây là điểm mấu chốt về bảo mật. Tất cả các request đến /admin/* (cả HTML và API) đều phải đi qua một lớp kiểm tra xác thực.

Bạn cần một hàm middleware để kiểm tra session/cookie.

JavaScript

// web-mvc/backend/middleware/authMiddleware.js

// Hàm này sẽ kiểm tra xem người dùng có phải admin không
async function isAdminAuthenticated(req) {
    // Trong thực tế, bạn sẽ kiểm tra cookie, session, JWT token, v.v.
    // Ví dụ đơn giản: kiểm tra một cookie tên 'admin_session'
    const adminSessionCookie = req.headers.get('cookie')?.split('; ').find(row => row.startsWith('admin_session='));

    if (adminSessionCookie && adminSessionCookie.split('=')[1] === 'true') {
        // Giả sử cookie admin_session=true là đủ cho mục đích ví dụ
        console.log("Admin authenticated.");
        return true;
    }

    console.log("Admin NOT authenticated.");
    return false;
}

// Middleware function
export async function authMiddleware(req) {
    // Nếu request là tới trang login hoặc API login (để người dùng có thể đăng nhập)
    // chúng ta không chặn.
    const url = new URL(req.url);
    if (url.pathname === '/admin/login' || url.pathname.startsWith('/admin/api')) {
        // For API, we might allow non-authenticated for specific API calls (like login API)
        // Or you might handle authentication differently inside the API handler
        return { authorized: true }; // Cho phép request đi tiếp
    }

    const authenticated = await isAdminAuthenticated(req);

    if (!authenticated) {
        // Chuyển hướng về trang đăng nhập nếu chưa xác thực
        // Lưu ý: Đối với AJAX/API request, bạn nên trả về 401 Unauthorized thay vì redirect
        if (req.headers.get('accept')?.includes('application/json')) {
            // Đây là API request
            return {
                authorized: false,
                response: Response.json({ message: "Unauthorized API access" }, { status: 401 })
            };
        } else {
            // Đây là request cho trang HTML
            return {
                authorized: false,
                response: new Response('Redirecting to login...', {
                    status: 302,
                    headers: { 'Location': '/admin/login' }
                })
            };
        }
    }
    return { authorized: true }; // Cho phép request đi tiếp
}
Bước 2: Cấu trúc Router trong Bun Backend
Chúng ta sẽ sử dụng Bun's native router (hoặc một thư viện như Hono nếu bạn muốn phức tạp hơn) và áp dụng middleware.

JavaScript

// web-mvc/backend/router.js

import { Router } from 'bun';
import { authMiddleware } from './middleware/authMiddleware.js';

// Controllers
import AdminController from './admin/controllers/AdminController.js';

const router = new Router();

// --- Auth Routes (không cần xác thực trước khi xử lý logic login) ---
router.post('/admin/login', async (req) => {
    const adminController = new AdminController(req);
    // Hàm login trong controller sẽ xử lý logic xác thực và tạo session/cookie
    const loginResponse = await adminController.login();

    // Nếu đăng nhập thành công, bạn có thể thiết lập cookie ở đây
    // Ví dụ: set-cookie: admin_session=true; Path=/admin/; HttpOnly
    if (loginResponse.status === 200 || loginResponse.status === 204) { // Giả sử 200/204 là thành công
        const responseWithCookie = new Response(loginResponse.body, {
            status: loginResponse.status,
            headers: loginResponse.headers,
        });
        responseWithCookie.headers.append('Set-Cookie', 'admin_session=true; Path=/admin/; HttpOnly; Max-Age=3600'); // Cookie hết hạn sau 1 giờ
        return responseWithCookie;
    }
    return loginResponse;
});

router.get('/admin/login', async (req) => {
    const adminController = new AdminController(req);
    return await adminController.login(); // Trả về trang login
});


// --- General Admin HTML Routes (cần xác thực) ---
// Catch-all cho các trang HTML admin
router.get('/admin/:path*', async (req) => {
    // Áp dụng middleware xác thực
    const authResult = await authMiddleware(req);
    if (!authResult.authorized) {
        return authResult.response; // Chuyển hướng hoặc trả về 401
    }

    // Nếu đã xác thực, có thể serve HTML page hoặc Dashboard
    // Ở đây bạn sẽ render HTML cho các trang admin khác nhau
    // Tạm thời trả về một trang dashboard đơn giản
    if (req.params.path === 'dashboard') {
        return new Response(`
            <h1>Admin Dashboard</h1>
            <p>Welcome, authenticated user! This is your dashboard.</p>
            <form action="/admin/logout" method="POST">
                <button type="submit">Logout</button>
            </form>
            <script>
                document.querySelector('form').addEventListener('submit', async (e) => {
                    e.preventDefault();
                    await fetch('/admin/logout', { method: 'POST' });
                    window.location.href = '/admin/login';
                });
            </script>
        `, { headers: { 'Content-Type': 'text/html' }});
    }

    return new Response(`Admin Page Not Found for path: ${req.params.path}`, { status: 404 });
});

// Logout route
router.post('/admin/logout', async (req) => {
    const response = new Response("Logged out", { status: 200 });
    // Xóa cookie admin_session
    response.headers.append('Set-Cookie', 'admin_session=; Path=/admin/; HttpOnly; Max-Age=0');
    return response;
});


// --- Admin API Routes (dùng query string) ---
// Tất cả các API request sẽ đi qua đây: /admin/api?c=ControllerName&a=methodName&param1=value1
router.all('/admin/api', async (req) => { // 'all' để bắt cả GET/POST/PUT/DELETE
    // Áp dụng middleware xác thực cho API
    const authResult = await authMiddleware(req);
    if (!authResult.authorized) {
        return authResult.response; // Trả về 401 Unauthorized
    }

    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);

    const controllerName = params.get('c');
    const methodName = params.get('a');

    if (!controllerName || !methodName) {
        return Response.json({ message: "Missing controller or method in API request" }, { status: 400 });
    }

    try {
        // Tên Controller: Admin -> AdminController, Post -> PostController
        const fullControllerName = controllerName.charAt(0).toUpperCase() + controllerName.slice(1) + 'Controller';
        const controllerPath = `./admin/controllers/${fullControllerName}.js`; // Giả sử cùng cấp với router.js

        const { default: ControllerClass } = await import(controllerPath);
        const controllerInstance = new ControllerClass(req);

        if (typeof controllerInstance[methodName] === 'function') {
            // Lấy các query param khác ngoài c và a để truyền vào method nếu cần
            const otherParams = {};
            for (const [key, value] of params.entries()) {
                if (key !== 'c' && key !== 'a') {
                    otherParams[key] = value;
                }
            }
            // Gọi method với các param khác (nếu method cần)
            return await controllerInstance[methodName](otherParams);
        } else {
            return Response.json({ message: `API method '${methodName}' not found in '${controllerName}' controller` }, { status: 404 });
        }

    } catch (error) {
        console.error("Error handling API request:", error);
        return Response.json({ message: "Internal server error for API request", error: error.message }, { status: 500 });
    }
});

export default router;
Bước 3: Cập nhật Server Chính (index.js hoặc server.js)
JavaScript

// index.js (main server file)
import router from './backend/router.js'; // Import router mới của bạn

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const match = router.match(req);

    if (match) {
      req.params = match.params; // Gán params từ router match
      return await match.handler(req);
    }

    // Nếu không có route nào khớp (ngoại trừ /admin/* đã được router xử lý)
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Bun server running on http://localhost:${server.port}`);
Bước 4: Cập nhật AdminController.js
Hàm login của bạn đã khá ổn, chỉ cần chắc chắn rằng nó xử lý việc thiết lập cookie/session.

JavaScript

// web-mvc/backend/admin/controllers/AdminController.js

class AdminController {
    constructor(req) {
        this.req = req;
    }

    async index() {
        return new Response('adm ctl index');
    }

    async login(queryParams = {}) { // Đã thêm queryParams nếu muốn dùng
        if (this.req.method === 'POST') {
            try {
                const formData = await this.req.formData();
                const username = formData.get('username');
                const password = formData.get('password');

                if (username === 'admin' && password === '123') {
                    // Trả về JSON khi đăng nhập thành công
                    // Cookie sẽ được set ở router.js sau khi nhận được response này
                    return Response.json({
                        message: "Login successful",
                        user: username,
                        status: 'success'
                    });
                } else {
                    return Response.json({
                        message: "Invalid username or password",
                        status: 'error'
                    }, { status: 401 });
                }

            } catch (error) {
                console.error("Error during login POST:", error);
                return Response.json({
                    message: "Server error during login",
                    error: error.message,
                    status: 'error'
                }, { status: 500 });
            }
        }
        
        // GET request: render login page
        const { default: loginPageRenderer } = await import('../views/loginPage.js');
        const html = loginPageRenderer.render();
        return new Response(html, {
            headers: { 'Content-Type': 'text/html' }
        });
    }

    // Ví dụ một API method khác
    async getUsers(queryParams) { // Nhận queryParams từ router
        // Kiểm tra xem queryParams có gì không, ví dụ: queryParams.search
        console.log('Fetching users with params:', queryParams);
        // Logic lấy danh sách user từ DB
        const users = [
            { id: 1, name: "Alice" },
            { id: 2, name: "Bob" }
        ];
        return Response.json({ users, queryParams });
    }

    async createUser(queryParams) {
        // Lấy dữ liệu từ request.json() hoặc request.formData()
        const data = await this.req.json(); // Hoặc await this.req.formData()
        console.log('Creating user with data:', data);
        return Response.json({ message: "User created", data: data });
    }
}

export default AdminController;
Bước 5: Cấu hình Vite Proxy (vite.config.js)
Vite proxy sẽ đơn giản hơn nhiều vì chúng ta không cần rewrite tiền tố /admin nữa.

JavaScript

// vite.config.js
import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react'; // Nếu bạn dùng React

export default defineConfig({
  // plugins: [react()],
  server: {
    proxy: {
      // Mọi request bắt đầu bằng /admin sẽ được chuyển hướng tới backend Bun
      // Không cần rewrite vì cả frontend và backend đều dùng tiền tố /admin
      '/admin': {
        target: 'http://localhost:3000', // Server Bun của bạn
        changeOrigin: true, // Thay đổi Host header thành target URL
        secure: false, // Bỏ qua lỗi SSL nếu bạn dùng HTTPS tự ký (thường không cần trong dev)
      },
    },
  },
});
Bước 6: Cập nhật Client-side JavaScript (loginPage.js và các file JS frontend khác)
Đối với form login, action="/admin/login" vẫn hoạt động tốt.

Đối với các API calls sau khi đăng nhập:

JavaScript

// Ví dụ trong một file JS frontend khác
async function fetchUsers() {
    // Gọi API bằng query string
    const response = await fetch('/admin/api?c=Admin&a=getUsers&search=john');
    const data = await response.json();
    console.log('API Response for getUsers:', data);
}

async function createUserApi() {
    const newUser = { name: "New User", email: "new@example.com" };
    const response = await fetch('/admin/api?c=Admin&a=createUser', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    });
    const data = await response.json();
    console.log('API Response for createUser:', data);
}

// fetchUsers();
// createUserApi();
Tóm tắt chiến lược bảo mật & routing:
Bảo mật tập trung: Middleware authMiddleware chặn tất cả các request đến /admin/* (trừ /admin/login).

Cookie Session: Server sẽ thiết lập admin_session=true cookie (HttpOnly) khi đăng nhập thành công. Middleware đọc cookie này.

Routing HTML: Router Bun sẽ bắt các request /admin/login và /admin/:path* để phục vụ các trang HTML admin.

Routing API với Query String: Router Bun sẽ bắt /admin/api và sau đó dùng c (controller) và a (action/method) từ query string để dynamic import và gọi phương thức tương ứng. Các param khác trong query string có thể được truyền vào hàm method.

Vite Proxy: Rất đơn giản, chỉ cần proxy /admin sang http://localhost:3000.

Chiến lược này đáp ứng yêu cầu về bảo mật, linh hoạt cho các API endpoints mà không cần quan tâm đến URL "đẹp", và dễ dàng cấu hình proxy giữa Vite và Bun.

## Cập nhật Kiến trúc Router & Server để tối ưu Bảo mật và Phục vụ File Tĩnh

Bạn lại đưa ra những điểm cực kỳ sắc bén và đúng đắn! Phân tích của bạn về router.get và việc xử lý file tĩnh (static files) là hoàn toàn chính xác. Chúng ta cần tinh chỉnh lại để đảm bảo cả chức năng và bảo mật.

Phân tích và Giải pháp chi tiết:
router.get('/admin/:path*') chỉ là GET:

Vấn đề: Đúng vậy, router.get chỉ bắt các request GET. Nếu bạn muốn tất cả các HTTP method (GET, POST, PUT, DELETE, v.v.) đi qua middleware xác thực cho các đường dẫn /admin/* không phải /admin/login hoặc /admin/api, bạn cần dùng router.all.

Giải pháp: Thay đổi thành router.all('/admin/:path*'). Tuy nhiên, cần lưu ý thứ tự của các route. Các route cụ thể hơn phải được định nghĩa trước các route catch-all.

Phục vụ File Tĩnh (/admin/dist) sau khi build Vite:

Vấn đề: Khi bạn build frontend Vite, nó tạo ra các file tĩnh (HTML, CSS, JS, hình ảnh) trong thư mục dist. Backend Bun của bạn cần phục vụ các file này. Nếu router.all('/admin/:path*') được đặt trước, nó có thể "bắt" các yêu cầu đến file tĩnh trước khi Bun có cơ hội phục vụ chúng.

Giải pháp:

Đặt route phục vụ file tĩnh lên trước: Đây là cách phổ biến nhất. Router sẽ kiểm tra xem đường dẫn có khớp với file tĩnh nào không trước khi chuyển đến các route động khác.

Cấu hình Vite Output: Đảm bảo Vite build các file ra một thư mục mà Bun có thể truy cập, ví dụ /admin/dist.

Code JS trực tiếp vào file đã render (loginPage.js) vs. quá trình build của Vite:

Vấn đề: Bạn muốn các script chạy ở client-side (loginPage.js) được bao gồm trực tiếp trong HTML, nhưng lo ngại về việc chúng có thể không tham gia quá trình build của Vite hoặc chỉ hoạt động khi admin == true.

Giải pháp:

Cách tiếp cận hiện tại (JS nhúng trong HTML): Với loginPage.js trả về HTML có <script> nhúng, đây là một giải pháp hợp lệ cho các trang nhỏ hoặc trang khởi đầu như login. Nó không cần Vite build script đó. Tuy nhiên, nếu script trở nên phức tạp, việc quản lý nó trong một chuỗi HTML sẽ khó khăn.

Cách Vite "chuẩn": Frontend Vite sẽ có một file main.js (hoặc index.js) riêng, được Vite xử lý, biên dịch và nén. File này sẽ tải các module JS khác (như logic login, dashboard).

Kích hoạt JS Client-side khi đã xác thực: Bạn có thể kiểm tra trạng thái xác thực bằng cách đọc cookie/localStorage trên client sau khi trang HTML được tải. Nếu admin == true, bạn sẽ khởi tạo các script và UI phức tạp hơn.

Cập nhật Kiến trúc Router & Server để tối ưu Bảo mật và Phục vụ File Tĩnh
Chúng ta sẽ sửa đổi file backend/router.js và hàm fetch chính của server.

Bước 1: Cấu hình phục vụ file tĩnh trong Bun
Bun có thể phục vụ file tĩnh một cách hiệu quả.

JavaScript

// web-mvc/backend/utils/staticFileHandler.js

import { file, serve } from 'bun';

const PUBLIC_PATH = process.env.NODE_ENV === 'production' ?
    './admin/dist' : // Đường dẫn khi đã build production
    '../frontend-admin/dist'; // Giả định frontend Vite build ra đây trong dev (hoặc bất cứ đâu bạn cấu hình)

export async function serveAdminStaticFile(pathname) {
    // Chỉ phục vụ các file nằm dưới tiền tố /admin/
    // Ví dụ: pathname là /admin/index.html, /admin/assets/logo.png
    // Chúng ta cần loại bỏ /admin/ để tìm trong thư mục dist
    const filePath = PUBLIC_PATH + pathname.replace(/^\/admin/, '');
    
    try {
        // Kiểm tra xem file có tồn tại không
        const staticFile = file(filePath);
        if (await staticFile.exists()) {
            // Bun sẽ tự động thêm Content-Type header đúng
            return new Response(staticFile);
        }
    } catch (error) {
        // console.warn(`Could not serve static file ${filePath}: ${error.message}`);
        // Không tìm thấy file, trả về null để router chính tiếp tục xử lý
    }
    return null; // Không tìm thấy file tĩnh
}
Bước 2: Cập nhật Router (backend/router.js)
Chúng ta sẽ điều chỉnh thứ tự và logic:

router.get('/admin/login') và router.post('/admin/login'): Vẫn giữ nguyên.

router.post('/admin/logout'): Vẫn giữ nguyên.

router.all('/admin/api'): Vẫn giữ nguyên cho API bằng query string.

router.get('/admin/:path*') cho HTML/Views (Authenticated): Xử lý các trang admin sau khi đã đăng nhập.

Phục vụ file tĩnh (static files): Đây là phần quan trọng. Nó cần được ưu tiên trong hàm fetch của server chính.

JavaScript

// web-mvc/backend/router.js

import { Router } from 'bun';
import { authMiddleware } from './middleware/authMiddleware.js';
import AdminController from './admin/controllers/AdminController.js';
// import { serveAdminStaticFile } from './utils/staticFileHandler.js'; // Sẽ dùng trực tiếp trong server.js

const router = new Router();

// --- Auth Routes (specific, no middleware applied directly here) ---
router.post('/admin/login', async (req) => {
    const adminController = new AdminController(req);
    const loginResponse = await adminController.login();

    if (loginResponse.status >= 200 && loginResponse.status < 300) { // Success status codes
        const responseWithCookie = new Response(loginResponse.body, {
            status: loginResponse.status,
            headers: loginResponse.headers,
        });
        // Set cookie on successful login
        responseWithCookie.headers.append('Set-Cookie', 'admin_session=true; Path=/admin/; HttpOnly; Max-Age=3600');
        return responseWithCookie;
    }
    return loginResponse;
});

router.get('/admin/login', async (req) => {
    const adminController = new AdminController(req);
    return await adminController.login(); // This should return the login HTML page
});

router.post('/admin/logout', async (req) => {
    const response = new Response("Logged out", { status: 200 });
    response.headers.append('Set-Cookie', 'admin_session=; Path=/admin/; HttpOnly; Max-Age=0'); // Clear cookie
    return response;
});

// --- Admin API Routes (Authenticated & Query String based) ---
router.all('/admin/api', async (req) => {
    const authResult = await authMiddleware(req);
    if (!authResult.authorized) {
        return authResult.response;
    }

    const url = new URL(req.url);
    const params = new URLSearchParams(url.search);

    const controllerName = params.get('c');
    const methodName = params.get('a');

    if (!controllerName || !methodName) {
        return Response.json({ message: "Missing controller or method in API request" }, { status: 400 });
    }

    try {
        const fullControllerName = controllerName.charAt(0).toUpperCase() + controllerName.slice(1) + 'Controller';
        const controllerPath = `./admin/controllers/${fullControllerName}.js`;

        // Using dynamic import to prevent circular dependencies if AdminController imports router etc.
        const { default: ControllerClass } = await import(controllerPath);
        const controllerInstance = new ControllerClass(req);

        if (typeof controllerInstance[methodName] === 'function') {
            const otherParams = {};
            for (const [key, value] of params.entries()) {
                if (key !== 'c' && key !== 'a') {
                    otherParams[key] = value;
                }
            }
            return await controllerInstance[methodName](otherParams);
        } else {
            return Response.json({ message: `API method '${methodName}' not found in '${controllerName}' controller` }, { status: 404 });
        }

    } catch (error) {
        console.error("Error handling API request:", error);
        return Response.json({ message: "Internal server error for API request", error: error.message }, { status: 500 });
    }
});


// --- General Admin Pages (Authenticated & HTML/View based) ---
// This will catch requests like /admin/dashboard, /admin/users, etc.
// IMPORTANT: This must come AFTER specific routes like /admin/login and /admin/api
router.all('/admin/:path*', async (req) => { // Use router.all to catch any method for authenticated pages
    const authResult = await authMiddleware(req);
    if (!authResult.authorized) {
        return authResult.response;
    }

    // Now, handle different pages based on req.params.path
    // This is where you'd typically have a templating engine or render specific HTML views
    const pagePath = req.params.path || 'dashboard'; // Default to dashboard if just /admin/

    switch (pagePath) {
        case 'dashboard':
            return new Response(`
                <h1>Admin Dashboard</h1>
                <p>Welcome, authenticated user! This is your dashboard.</p>
                <form action="/admin/logout" method="POST">
                    <button type="submit">Logout</button>
                </form>
                <script>
                    document.querySelector('form').addEventListener('submit', async (e) => {
                        e.preventDefault();
                        await fetch('/admin/logout', { method: 'POST' });
                        window.location.href = '/admin/login';
                    });
                </script>
            `, { headers: { 'Content-Type': 'text/html' }});
        case 'users':
            return new Response(`<h1>User Management</h1><p>List of users will be here.</p>`, { headers: { 'Content-Type': 'text/html' }});
        // Add more cases for other admin pages
        default:
            return new Response(`Admin Page '${pagePath}' Not Found`, { status: 404 });
    }
});

export default router;
Bước 3: Cập nhật Server Chính (index.js hoặc server.js) - Đây là nơi quan trọng nhất để xử lý thứ tự!
JavaScript

// index.js (main server file)
import router from './backend/router.js'; // Import router của bạn
import { serveAdminStaticFile } from './backend/utils/staticFileHandler.js'; // Import static file handler

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;

    // 1. Ưu tiên phục vụ các file tĩnh dưới /admin/ (từ thư mục /admin/dist)
    // Điều này phải nằm ở đầu tiên để tránh router động bắt các file tĩnh
    if (pathname.startsWith('/admin/') && pathname !== '/admin/login') { // Login page is handled by router directly
        const staticResponse = await serveAdminStaticFile(pathname);
        if (staticResponse) {
            console.log(`Serving static file: ${pathname}`);
            return staticResponse;
        }
    }

    // 2. Sau đó, mới cho router xử lý các request khác
    const match = router.match(req);
    if (match) {
        req.params = match.params; // Gán params từ router match
        return await match.handler(req);
    }

    // 3. Nếu không có route nào khớp hoặc không phải file tĩnh admin, trả về 404
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Bun server running on http://localhost:${server.port}`);
Bước 4: Cấu hình Vite (vite.config.js)
Để Vite build ra thư mục admin/dist và sau đó bạn sẽ cấu hình Bun để phục vụ nó.

JavaScript

// vite.config.js
import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react'; // Nếu bạn dùng React

export default defineConfig({
  // plugins: [react()],
  base: '/admin/', // Quan trọng: Đặt base URL cho ứng dụng Vite của bạn
                   // để các asset path (CSS, JS) được generate đúng với /admin/
  build: {
    outDir: 'dist', // Build ra thư mục 'dist' trong thư mục frontend Vite của bạn
                   // Sau đó bạn sẽ copy/move thư mục 'dist' này vào 'backend/admin/dist'
                   // HOẶC cấu hình Bun để đọc từ đường dẫn tương đối của frontend
  },
  server: {
    proxy: {
      '/admin': { // Mọi request bắt đầu bằng /admin từ Vite dev server
        target: 'http://localhost:3000', // Chuyển hướng tới backend Bun
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
Cách triển khai thư mục dist:

Bạn có 2 lựa chọn:

Copy thủ công/script build: Sau khi chạy vite build (tạo ra frontend-admin/dist), bạn sẽ có một script hoặc tự copy thư mục dist này vào backend/admin/dist. Đây là cách rõ ràng và an toàn.

Đọc trực tiếp từ thư mục frontend-admin/dist trong dev: Thay đổi PUBLIC_PATH trong staticFileHandler.js thành đường dẫn tương đối đến thư mục build của Vite ở frontend.

JavaScript

// web-mvc/backend/utils/staticFileHandler.js
// ...
const PUBLIC_PATH = process.env.NODE_ENV === 'production' ?
    './admin/dist' : // Đường dẫn khi đã build production
    '../../frontend-admin/dist'; // Giả định frontend Vite nằm ngoài thư mục backend
// ...
Cách này tiện lợi cho dev nhưng cần đảm bảo đường dẫn chính xác.

Ưu điểm của cấu trúc mới:
Bảo mật: Tất cả các truy cập vào /admin/* (trừ login) đều được bảo vệ bởi authMiddleware.

Routing rõ ràng:

/admin/login: Xử lý đăng nhập (GET/POST).

/admin/api: Tất cả các API calls dùng query string.

/admin/:path*: Các trang HTML admin khác sau khi đăng nhập (ví dụ: /admin/dashboard, /admin/users).

Static Files: Được phục vụ ưu tiên nếu tồn tại, giúp Bun nhanh chóng trả về các file CSS/JS/ảnh của ứng dụng Vite đã build.

Tách biệt trách nhiệm: Frontend Vite build ra các file tĩnh, Backend Bun phục vụ chúng và xử lý API/logic.

JS Client-side:

loginPage.js nhúng JS vẫn hoạt động cho trang login đơn giản.

Đối với các trang admin phức tạp hơn (dashboard, users), bạn sẽ dùng Vite để build một ứng dụng frontend riêng biệt, và Bun chỉ đơn giản là phục vụ file index.html của ứng dụng Vite đó (có thể là /admin/dist/index.html). Khi index.html tải, các script Vite của bạn sẽ chạy và khởi tạo UI.

Cấu trúc này mang lại sự cân bằng tốt giữa bảo mật, linh hoạt và hiệu quả trong việc phát triển một ứng dụng admin với Bun và Vite.