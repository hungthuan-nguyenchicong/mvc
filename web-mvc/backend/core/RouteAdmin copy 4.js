// web-mvc/backend/core/RouteAdmin.js
import { LoginController } from "../admin/controllers/LoginController"
//import { CookieManager } from "./CookieManager";
import { AuthService } from "./AuthService";
const loginControllerInstance = new LoginController();
const authServiceInstance = new AuthService();
//let adminPage = null;
let adminPageHandler;

// Logic để chọn cách xử lý trang admin dựa trên môi trường
if (import.meta.env.NODE_ENV === 'development') {
    // Trong môi trường phát triển, proxy đến server Vite
    const VITE_ADMIN_URL = "http://localhost:4000/src/admin/index.html"; // Cổng mặc định của Vite

    adminPageHandler = async (req) => {
        try {
            // Chuyển tiếp request đến Vite dev server
            // Lưu ý: Cần thêm logic để xử lý các tài nguyên phụ (CSS, JS, etc.)
            // Đây là một cách đơn giản chỉ chuyển tiếp index.html
            const proxyResponse = await fetch(VITE_ADMIN_URL);
            return proxyResponse;
        } catch (error) {
            console.error("Lỗi khi kết nối đến Vite dev server:", error);
            return new Response("Lỗi: Không thể kết nối đến server Vite. Hãy đảm bảo nó đang chạy.", { status: 500 });
        }
    };
} else {
    // Trong môi trường production, phục vụ file tĩnh từ thư mục dist
    adminPageHandler = async (req) => {
        const distPath = path.join(__dirname, '../../dist/admin/index.html');
        try {
            // Đọc file index.html đã được build
            const file = Bun.file(distPath);
            return new Response(file);
        } catch (error) {
            console.error("Lỗi khi đọc file dist/admin/index.html:", error);
            return new Response("Lỗi: Không tìm thấy trang admin.", { status: 404 });
        }
    };
}

const RouteAdmin = {
    '/admin/*': async req => {
        // Gọi hàm checkAuth để kiểm tra
        //console.log(req)
        if (await authServiceInstance.checkAuth(req)) {
            // Nếu đã đăng nhập, trả về nội dung trang admin
            // Ví dụ: một trang dashboard đơn giản.
            //return new Response('/admin/')
            // if (adminPage) {
            //     console.log(adminPage)
            //     return adminPage;
            // }
            return await adminPageHandler(req);
            //return ADMIN_PAGE_URL;
            //return new Response('Admin Dashboard', { status: 200 });
        } else {
            // Nếu chưa đăng nhập, chuyển hướng đến trang login
            return new Response(null, {
                status: 302,
                headers: {
                    'location': '/admin/login'
                }
            })
            //return new Response('/302')

        }
    },
    //'/admin/login': new LoginController().index(),
    '/admin/login': {
        GET: () => loginControllerInstance.index(),
        POST: async req => loginControllerInstance.login(req),
    },
    '/admin/logout': {
        GET: async req => loginControllerInstance.logout(req),
    }
}

export { RouteAdmin }
//console.log(sessionToken)
//console.log(new LoginController().index())