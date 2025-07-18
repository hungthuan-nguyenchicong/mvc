## RouteAdmin.js

Tuy nhiên, nếu mục tiêu của bạn là có một bộ định tuyến phía máy chủ dựa trên JavaScript sử dụng Bun mô phỏng chức năng của bạn RouteAdmin.php, thì bạn hoàn toàn có thể! Điều này có nghĩa là bạn phải thay thế máy chủ PHP bằng máy chủ Bun.

Sau đây là cách bạn có thể viết bộ định tuyến JavaScript phía máy chủ bằng Bun để phản ánh RouteAdminlớp PHP của bạn.

Định tuyến phía máy chủ với Bun (JavaScript) 🚀
Để đạt được chức năng định tuyến phía máy chủ tương tự khi sử dụng Bun, bạn thường sử dụng máy chủ HTTP tích hợp của Bun hoặc một framework được xây dựng trên đó. Hãy cùng tạo một ứng dụng máy chủ Bun đơn giản sao chép logic định tuyến từ mã PHP của bạn.

Trước tiên, hãy đảm bảo bạn đã cài đặt Bun. Bạn có thể tìm thấy hướng dẫn trênTrang web tốt.

Cấu trúc dự án
Để rõ ràng hơn, chúng ta hãy giả sử một cấu trúc dự án tương tự:

.
├── server.js               # Our Bun server
└── Admin/
    └── Controllers/
        └── AdminController.js # The equivalent of AdminController.php
1.Admin/Controllers/AdminController.js
Tệp này sẽ chứa logic "bộ điều khiển" của bạn, tương tự như tệp AdminController.php.

JavaScript

// Admin/Controllers/AdminController.js

class AdminController {
    index() {
        return 'Admin Dashboard';
    }

    js(filename) {
        // In a real application, you'd read and serve the actual JS file.
        // For demonstration, we'll just return its name.
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
2. server.js(Người phục vụ bánh mì của chúng tôi)
Tệp này sẽ là điểm vào chính cho ứng dụng Bun của bạn và sẽ xử lý việc định tuyến.

JavaScript

// server.js
import AdminController from './Admin/Controllers/AdminController.js';

const adminController = new AdminController();

const server = Bun.serve({
    port: 3000, // You can choose any available port
    fetch(request) {
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;

        // Simulate file existence check for AdminController
        // In a real Bun application, you'd just import it directly
        // as we've done above. The PHP's `is_file` check is for dynamic loading,
        // which is less common in modern JS server setups with module imports.

        if (method === 'GET' || method === 'POST') {
            switch (path) {
                case '/admin/':
                    return new Response(adminController.index());
                case '/admin/csrf-login/':
                    return new Response(adminController.csrfLogin());
                case '/admin/csrf/':
                    return new Response(adminController.csrf());
                case '/admin/login/':
                    return new Response(adminController.login());
                case '/admin/logout/':
                    return new Response(adminController.logout());
                default:
                    // Using a regular expression for /admin/js/*.js
                    const jsMatch = path.match(/^\/admin\/js\/(.*\.js)$/);
                    if (jsMatch) {
                        return new Response(adminController.js(jsMatch[1]));
                    }
                    
                    return new Response(adminController.notFound(), { status: 404 });
            }
        } else {
            return new Response('Method Not Allowed', { status: 405 });
        }
    },
});

console.log(`Bun server listening on http://localhost:${server.port}`);
Cách chạy
Lưu AdminController.jstệp ở định dạng Admin/Controllers/.

Lưu server.jstệp vào thư mục gốc của dự án.

Mở terminal trong thư mục gốc của dự án và chạy:

Đập

bun run server.js
Bây giờ, nếu bạn điều hướng đến http://localhost:3000/admin/"Bảng điều khiển quản trị" trong trình duyệt, bạn sẽ thấy "Bảng điều khiển quản trị". Nếu bạn truy cập http://localhost:3000/admin/js/somefile.js", bạn sẽ thấy "Đang phục vụ tệp JS: somefile.js".

Tại sao lại áp dụng cách tiếp cận này?
JavaScript phía máy chủ: Bun cho phép bạn sử dụng JavaScript (và TypeScript) để phát triển phía máy chủ, thay thế nhu cầu sử dụng PHP cho logic phía sau của bạn.

Xử lý HTTP trực tiếp: Bun Bun.servecung cấp cách trực tiếp để xử lý các yêu cầu HTTP, giúp bạn kiểm soát chặt chẽ việc định tuyến và phản hồi.

Nhập mô-đun: Thay vì require_once, Bun sử dụng các câu lệnh JavaScript chuẩn importđể quản lý các phụ thuộc, giúp mã của bạn có tính mô-đun hơn và dễ bảo trì hơn.

Hiệu suất: Bun được thiết kế để tăng tốc độ, cung cấp giải pháp thay thế có khả năng nhanh hơn cho các thiết lập PHP truyền thống đối với một số khối lượng công việc nhất định.

Thiết lập này cung cấp cho bạn một JavaScript tương đương trực tiếp với định tuyến phía máy chủ PHP của bạn, chạy trên Bun. Đây là một sự chuyển đổi cơ bản từ máy chủ dựa trên PHP sang máy chủ dựa trên JavaScript.