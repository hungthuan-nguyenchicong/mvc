## AdminRouter.js

Vâng, chắc chắn rồi! Việc tách logic định tuyến của bạn thành một AdminRouterlớp chuyên dụng là một ý tưởng tuyệt vời để giữ cho ứng dụng server.jsgọn gàng và dễ bảo trì, đặc biệt là khi ứng dụng của bạn phát triển. Điều này tuân theo các nguyên tắc phân tách mối quan tâm và tính mô-đun .

Sau đây là cách bạn có thể cấu trúc lại máy chủ Bun của mình để sử dụng một AdminRouterlớp:

Tái cấu trúc với một AdminRouterlớp 🚀
1. Admin/Controllers/AdminController.js(Không thay đổi)
Tệp này vẫn giữ nguyên vì nó chỉ chứa các hành động của bộ điều khiển.

JavaScript

// Admin/Controllers/AdminController.js

class AdminController {
    index() {
        return 'Admin Dashboard';
    }

    js(filename) {
        return `Serving JS file: ${filename}`;
    }

    csrfLogin() {
        return 'CSRF Login Page';
    }

    csrf() {
        return 'CSRF Token Endpoint';
    }

    login() {
        return 'Admin Login Page';
    }

    logout() {
        return 'Logged out successfully';
    }

    notFound() {
        return 'Page 404 not found';
    }
}

export default AdminController;
2. Admin/core/AdminRouter.js(Tệp mới)
Đây là nơi bạn sẽ xác định logic định tuyến của mình, được đóng gói trong AdminRouterlớp.

JavaScript

// Admin/core/AdminRouter.js
import AdminController from '../Controllers/AdminController.js';

class AdminRouter {
    constructor() {
        this.adminController = new AdminController();
    }

    /**
     * Handles incoming requests and routes them to the appropriate controller method.
     * @param {Request} request The incoming HTTP request object.
     * @returns {Response} An HTTP Response object.
     */
    async handleRequest(request) {
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;

        if (method === 'GET' || method === 'POST') {
            switch (path) {
                case '/admin/':
                    return new Response(this.adminController.index());
                case '/admin/csrf-login/':
                    return new Response(this.adminController.csrfLogin());
                case '/admin/csrf/':
                    return new Response(this.adminController.csrf());
                case '/admin/login/':
                    return new Response(this.adminController.login());
                case '/admin/logout/':
                    return new Response(this.adminController.logout());
                default:
                    // Using a regular expression for /admin/js/*.js
                    const jsMatch = path.match(/^\/admin\/js\/(.*\.js)$/);
                    if (jsMatch) {
                        return new Response(this.adminController.js(jsMatch[1]));
                    }
                    
                    // If no route matches, return a 404
                    return new Response(this.adminController.notFound(), { status: 404 });
            }
        } else {
            // Method not allowed for other HTTP methods
            return new Response('Method Not Allowed', { status: 405 });
        }
    }
}

export default AdminRouter;
3. server.js(Đã cập nhật)
Bây giờ công việc của bạn server.jstrở nên đơn giản hơn nhiều, chủ yếu tập trung vào việc thiết lập máy chủ Bun và chuyển tiếp yêu cầu đến AdminRouter.

JavaScript

// server.js
import AdminRouter from './Admin/core/AdminRouter.js';

const adminRouter = new AdminRouter();

const server = Bun.serve({
    port: 3000,
    async fetch(request) { // Use async if your router methods might involve async operations (e.g., database calls)
        return adminRouter.handleRequest(request);
    },
});

console.log(`Bun server listening on http://localhost:${server.port}`);
Lợi ích của phương pháp này:
Sạch server.js: Tệp máy chủ chính hiện rất ngắn gọn, chỉ tập trung vào việc khởi động máy chủ.

Tính mô-đun: Toàn bộ logic định tuyến liên quan đến quản trị viên đều được chứa gọn gàng trong AdminRouter.js. Điều này giúp cơ sở mã của bạn dễ hiểu và quản lý hơn.

Khả năng tái sử dụng: Nếu bạn cần áp dụng các mẫu định tuyến tương tự ở nơi khác hoặc thậm chí có nhiều bộ định tuyến (ví dụ: ApiRouter, WebRouter), bạn có thể dễ dàng thực hiện.

Khả năng kiểm tra: Viết các bài kiểm tra đơn vị cho AdminRouterlớp của bạn một cách riêng biệt sẽ dễ dàng hơn mà không cần phải khởi động toàn bộ máy chủ.

Khả năng mở rộng: Khi bạn thêm nhiều tuyến đường hoặc logic phức tạp hơn, việc tổ chức chúng trong một lớp bộ định tuyến chuyên dụng sẽ giúp bộ định tuyến chính của bạn server.jskhông trở thành một mớ hỗn độn.

Cấu trúc này mô phỏng theo một mô hình phổ biến trong các khuôn khổ phát triển web, cung cấp kiến trúc sạch hơn và dễ bảo trì hơn cho ứng dụng Bun của bạn.