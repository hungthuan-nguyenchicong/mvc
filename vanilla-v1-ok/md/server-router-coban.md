##

Chắc chắn rồi! Việc nhầm lẫn giữa định tuyến phía máy khách và phía máy chủ là rất phổ biến khi bạn mới làm quen với môi trường full-stack như Bun. Hãy cùng làm rõ và xây dựng một lớp phía máy chủ đơn giản Routercho Bun .

Định tuyến máy khách so với máy chủ 🌐
Sự khác biệt chính là nơi mã chạy:

Định tuyến phía máy khách (Trình duyệt) : Đây core.router.jslà một bộ định tuyến phía máy khách. Nó chạy trên trình duyệt của người dùng . Nó chặn các thay đổi URL (như nhấp vào liên kết hoặc sử dụng nút quay lại) sau khi trang HTML ban đầu được tải, sau đó tự động thay đổi nội dung trên trang mà không yêu cầu tệp HTML mới từ máy chủ . Đây là lý do tại sao Ứng dụng Trang Đơn (SPA) hoạt động nhanh.

Định tuyến phía máy chủ (Máy chủ Bun) : Mã này chạy trên máy chủ Bun của bạn . Đây là điểm tiếp xúc đầu tiên khi trình duyệt đưa ra yêu cầu (ví dụ: nhập URL hoặc gửi biểu mẫu). Bộ định tuyến của máy chủ quyết định nội dung nào sẽ gửi lại cho trình duyệt (ví dụ: trang HTML, dữ liệu JSON cho API, hình ảnh hoặc lỗi 404).

Lớp phía máy chủ đơn giản Routercho Bun
Đây là một lớp phía máy chủ đơn giản Routermà bạn có thể sử dụng với hàm Bun serve. Nó sẽ giúp bạn quản lý các tuyến đường, xử lý các phương thức HTTP khác nhau (GET, POST) và ánh xạ chúng với các hành động của bộ điều khiển.

1. routes.js(Định nghĩa tuyến đường phía máy chủ)
Tệp này sẽ xác định các tuyến đường của máy chủ. Lưu ý cách nó ánh xạ các đường dẫn và phương thức HTTP đến các hàm điều khiển.

JavaScript

// ./routes.js
import UserController from "./controllers/UserController.js"; // Import your UserController

const routes = {
    // GET /
    '/': {
        GET: async (req) => {
            return new Response("Chào mừng đến với ứng dụng Bun MVC!");
        }
    },
    // GET /users
    '/users': {
        GET: async (req) => {
            // Call the index method from UserController via an instance
            const userControllerInstance = new UserController();
            return await userControllerInstance.index();
        }
    },
    // POST /users
    '/users/create': {
        POST: async (req) => {
            // Example of handling a POST request
            const userControllerInstance = new UserController();
            return await userControllerInstance.create(req); // Assume UserController has a 'create' method
        }
    },
    // GET /products/{id} (Example of a dynamic route)
    '/products/:id': {
        GET: async (req) => {
            const productId = req.params.id; // How you'd get the 'id' parameter
            return new Response(`Product Detail for ID: ${productId}`);
        }
    },
    // 404 Fallback
    '404': {
        GET: async (req) => {
            return new Response("404 Not Found", { status: 404 });
        }
    }
};

export default routes;
2. controllers/UserController.js(Bộ điều khiển hiện tại của bạn)
Giữ nguyên UserControllernhư vậy. Hãy nhớ rằng, các phương thức của nó phải trả về Responsecác đối tượng cho máy chủ.

JavaScript

// ./controllers/UserController.js

class UserController {
    async index() {
        console.log("UserController.index called on server!");
        return new Response("Hello from Server-side UserController.index!");
    }

    async create(req) {
        // Example: process a POST request
        const body = await req.json(); // Assuming JSON body
        console.log("Creating user on server:", body);
        return new Response(JSON.stringify({ message: "User created!", data: body }), {
            headers: { "Content-Type": "application/json" },
            status: 201
        });
    }
}

export default UserController;
3. server.js(Lớp phía máy chủ Router)
Lớp này Routersẽ xử lý các yêu cầu đến bằng cách sử dụng routes.jsđịnh nghĩa của bạn.

JavaScript

// ./server.js
import { serve } from "bun";
import routes from "./routes.js"; // Import your server-side route definitions

class Router {
    constructor(routes) {
        this.routes = routes;
    }

    /**
     * Finds a matching route and extracts parameters.
     * Supports basic dynamic segments like /users/:id
     * @param {string} path - The request path (e.g., "/users/123")
     * @param {string} method - The HTTP method (e.g., "GET")
     * @returns {{handler: Function, params: Object}|null} - The matched handler and extracted params, or null if no match
     */
    matchRoute(path, method) {
        // Try to find an exact match first
        if (this.routes[path] && this.routes[path][method]) {
            return { handler: this.routes[path][method], params: {} };
        }

        // Check for dynamic routes
        for (const routePath in this.routes) {
            // Skip 404 and exact matches already handled
            if (routePath === '404' || typeof this.routes[routePath] !== 'object' || !this.routes[routePath][method]) {
                continue;
            }

            // Convert route path to a regex for dynamic segments (e.g., /products/:id)
            const regexPattern = new RegExp(`^${routePath.replace(/:([a-zA-Z0-9_]+)/g, '(?<$1>[^/]+)')}$`);
            const match = path.match(regexPattern);

            if (match) {
                return {
                    handler: this.routes[routePath][method],
                    params: match.groups || {} // Capture named groups (e.g., { id: "123" })
                };
            }
        }

        // If no specific route matches, return the 404 handler if defined
        if (this.routes['404'] && this.routes['404'].GET) { // Assuming 404 is always a GET request
            return { handler: this.routes['404'].GET, params: {} };
        }

        return null; // No match found at all
    }

    /**
     * Handles an incoming request by routing it to the appropriate handler.
     * @param {Request} request - The incoming Bun Request object.
     * @returns {Promise<Response>} - A promise that resolves to a Bun Response object.
     */
    async handleRequest(request) {
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;

        console.log(`Incoming request: ${method} ${path}`);

        const matched = this.matchRoute(path, method);

        if (matched) {
            try {
                // Pass the request object along with params
                const response = await matched.handler({ ...request, params: matched.params });
                if (!(response instanceof Response)) {
                    console.error(`Handler for ${method} ${path} did not return a Response object.`);
                    return new Response("Internal Server Error: Handler did not return a Response", { status: 500 });
                }
                return response;
            } catch (error) {
                console.error(`Error handling ${method} ${path}:`, error);
                return new Response("Internal Server Error", { status: 500 });
            }
        } else {
            // This case should ideally be caught by '404' in matchRoute,
            // but as a fallback, ensure a 404 is returned.
            return new Response("404 Not Found", { status: 404 });
        }
    }
}

// Create an instance of your server-side Router
const serverRouter = new Router(routes);

// Serve with Bun's fetch handler, delegating to your Router instance
serve({
    port: 3000,
    fetch: (request) => serverRouter.handleRequest(request),
});

console.log('Bun MVC Server is running on http://localhost:3000');
Cách chạy
Lưu ba tệp này ( routes.js, controllers/UserController.js, server.js) vào các vị trí tương ứng của chúng ( ./, ./controllers/, ./).

Mở terminal ở thư mục gốc của dự án.

Chạy tốt:

Đập

bun run server.js
Hãy thử xem:
Open your browser to http://localhost:3000/. You'll see "Chào mừng đến với ứng dụng Bun MVC!".

Đi tới http://localhost:3000/users. Bạn sẽ thấy "Xin chào từ Server-side UserController.index!" và UserController.index called on server!trong terminal của bạn.

Đi tới http://localhost:3000/products/123. Bạn sẽ thấy "Chi tiết sản phẩm cho ID: 123".

Đi tới http://localhost:3000/nonexistent. Bạn sẽ thấy "404 Không tìm thấy".

Thiết lập này cung cấp cho bạn một cách rõ ràng và có thể mở rộng để quản lý logic định tuyến của máy chủ bằng cách sử dụng Routerlớp chuyên dụng và định nghĩa tuyến riêng biệt.