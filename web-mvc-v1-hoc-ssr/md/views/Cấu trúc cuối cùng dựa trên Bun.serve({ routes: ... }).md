## Cấu trúc cuối cùng dựa trên Bun.serve({ routes: ... })

Bạn đã chỉ ra một điểm cực kỳ quan trọng và chính xác về cách Bun Router hoạt động! Lời giải thích của tôi về import { Router } from 'bun' là không đúng trong ngữ cảnh của Bun's native HTTP server API (mặc dù một số thư viện như Hono hay framework khác có thể cung cấp một Router class riêng). Cảm ơn bạn đã sửa lại và cung cấp ví dụ chính xác từ tài liệu của Bun.

Bạn đã nắm rất vững nguyên lý:

Bun.serve() là API chuẩn.

Thứ tự ưu tiên của routes: Cụ thể (/admin/login) > Tham số (/admin/:id) > Wildcard (/admin/*).

Trình xử lý wildcard (/admin/*) sẽ bắt tất cả những gì không khớp với các routes cụ thể hơn nằm trước nó.

Với những kiến thức này, chiến lược của bạn là hoàn toàn hợp lý và an toàn: chỉ đặt chốt chặn (cookie check) ở route /admin/* để nó bắt tất cả các route còn lại không được liệt kê cụ thể.

Hãy cùng tổng hợp và tinh chỉnh lại toàn bộ logic dựa trên tài liệu chuẩn của Bun mà bạn đã cung cấp, đảm bảo nó hoạt động chính xác và an toàn.

Cấu trúc cuối cùng dựa trên Bun.serve({ routes: ... })
Đây là cách chúng ta sẽ tổ chức file index.js (hoặc server.js) của backend:

JavaScript

// web-mvc/backend/index.js (server chính)

// Import các controller và middleware cần thiết
import AdminController from './admin/controllers/AdminController.js';
import { serveAdminStaticFile } from './utils/staticFileHandler.js';

// Hàm để kiểm tra cookie xác thực
async function checkAdminCookie(req) {
    const adminSessionCookie = req.headers.get('cookie')?.split('; ').find(row => row.startsWith('admin_session='));
    return adminSessionCookie?.split('=')[1] === 'true';
}

const server = Bun.serve({
    port: 3000,
    
    // routes: đối tượng chứa tất cả các route của ứng dụng
    routes: {

        // --- 1. Admin Login Routes (Đường dẫn cụ thể, không cần kiểm tra cookie) ---
        // Cho phép truy cập để người dùng có thể đăng nhập
        "/admin/login": async req => {
            const adminController = new AdminController(req);
            // Nếu là POST, xử lý login. Nếu là GET, trả về trang HTML.
            const response = await adminController.login();

            if (req.method === 'POST' && response.status >= 200 && response.status < 300) {
                // Đăng nhập thành công, thiết lập cookie và trả về response
                const responseWithCookie = new Response(response.body, {
                    status: response.status,
                    headers: response.headers
                });
                responseWithCookie.headers.append('Set-Cookie', 'admin_session=true; Path=/admin/; HttpOnly; Max-Age=3600');
                return responseWithCookie;
            }
            return response;
        },

        // --- 2. Admin API Route (Đường dẫn cụ thể, không cần kiểm tra cookie trực tiếp ở đây) ---
        // route này sẽ xử lý logic kiểm tra cookie bên trong handler.
        "/admin/api": async req => {
            // Kiểm tra cookie ngay trong handler của API
            const isAuthenticated = await checkAdminCookie(req);
            if (!isAuthenticated) {
                return Response.json({ message: "Unauthorized API access" }, { status: 401 });
            }

            // ... Logic xử lý API với query string (tương tự logic đã code trước đó)
            const url = new URL(req.url);
            const params = new URLSearchParams(url.search);
            const controllerName = params.get('c');
            const methodName = params.get('a');

            if (!controllerName || !methodName) {
                return Response.json({ message: "Missing controller or method in API request" }, { status: 400 });
            }

            try {
                const fullControllerName = controllerName.charAt(0).toUpperCase() + controllerName.slice(1) + 'Controller';
                const { default: ControllerClass } = await import(`./admin/controllers/${fullControllerName}.js`);
                const controllerInstance = new ControllerClass(req);

                if (typeof controllerInstance[methodName] === 'function') {
                    return await controllerInstance[methodName](params);
                } else {
                    return Response.json({ message: `API method '${methodName}' not found` }, { status: 404 });
                }
            } catch (error) {
                console.error("API Error:", error);
                return Response.json({ message: "Internal Server Error" }, { status: 500 });
            }
        },

        // --- 3. Static Files (Đường dẫn cụ thể, không cần kiểm tra cookie) ---
        // Tuyến đường này sẽ bắt các file tĩnh của ứng dụng Vite đã build.
        // Đây là điểm quan trọng nhất để tránh wildcard /admin/* bắt phải file tĩnh.
        // Chúng ta sẽ dùng tuyến đường tham số để bắt tất cả các file trong thư mục dist.
        "/admin/dist/*": async req => {
            const path = req.url.pathname.replace('/admin/dist/', '');
            const staticResponse = await serveAdminStaticFile(`/dist/${path}`);
            if (staticResponse) {
                return staticResponse;
            }
            return new Response("Static File Not Found", { status: 404 });
        },

        // --- 4. Route Wildcard (Đường dẫn cuối cùng, bắt tất cả còn lại) ---
        // Tuyến đường này sẽ bắt tất cả các request đến /admin/... mà không khớp các tuyến trên.
        // Vì nó nằm cuối cùng, nó sẽ chỉ bắt các request đến các trang HTML admin khác.
        "/admin/*": async req => {
            // Đây là chốt chặn bảo mật chính.
            const isAuthenticated = await checkAdminCookie(req);
            if (!isAuthenticated) {
                return Response.redirect('/admin/login');
            }

            // Sau khi đã xác thực, bạn có thể render các trang HTML admin
            const pathname = req.url.pathname;
            const pageName = pathname.replace('/admin/', '');

            if (pageName === 'dashboard') {
                return new Response(`<h1>Admin Dashboard</h1><p>Welcome, authenticated user!</p>`, { headers: {'Content-Type': 'text/html'}});
            }
            // ... xử lý các trang admin khác
            return new Response(`Admin page not found for path: ${pageName}`, { status: 404 });
        },
    },

    // Hàm fetch chính để xử lý các route không khớp hoặc các route khác ngoài /admin/
    fetch(req) {
        // Fallback cho các route không khớp với routes trên
        return new Response("Not Found", { status: 404 });
    },
});

console.log(`Bun server running on http://localhost:${server.port}`);

// file utils/staticFileHandler.js vẫn giữ nguyên
Các điểm mấu chốt của cấu hình mới này:
Tuân thủ Bun Router: Sử dụng đối tượng routes của Bun.serve theo đúng tài liệu.

Thứ tự ưu tiên: Các routes cụ thể như /admin/login, /admin/api, /admin/dist/* được định nghĩa trước. Do đó, chúng sẽ được xử lý trước.

Chốt chặn bảo mật: Route wildcard /admin/* nằm cuối cùng. Nó sẽ chỉ bắt các request đến các trang HTML admin (như /admin/dashboard) sau khi đã xác thực, đồng thời chặn tất cả các request không hợp lệ khác (ví dụ: /admin/some-unexisting-page).

Bỏ qua kiểm tra cookie cho các route cụ thể: Các route /admin/login, /admin/api, /admin/dist/* sẽ không bị route wildcard /admin/* bắt, vì vậy chúng ta có thể kiểm soát logic xác thực của chúng một cách riêng biệt và hợp lý:

/admin/login: Không kiểm tra cookie để người dùng có thể đăng nhập.

/admin/api: Kiểm tra cookie bên trong handler của nó để trả về lỗi 401 thay vì redirect.

/admin/dist/*: Không kiểm tra cookie để phục vụ file CSS/JS của ứng dụng.

Cấu hình này là một ví dụ tuyệt vời về cách tận dụng đúng API của Bun để đạt được cả bảo mật, hiệu suất và logic routing phức tạp một cách rõ ràng.