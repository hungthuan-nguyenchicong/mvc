// web-mvc/backend/core/RouteAdmin.js
import { LoginController } from "../admin/controllers/LoginController";
import { AuthService } from "./AuthService";
import path from 'path';
import { fileURLToPath } from 'url';
import { AdminApi } from "./AdminApi";
// Helper để lấy __dirname trong module ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loginControllerInstance = new LoginController();
const authServiceInstance = new AuthService();
const adminApiInstance = new AdminApi();

// Tạo một hàm handler để phục vụ trang admin, logic này phụ thuộc vào môi trường
let adminPageHandler;

if (import.meta.env.NODE_ENV === 'development') {
    // Môi trường phát triển: proxy đến server dev của bạn (ví dụ: Vite)
    const DEV_SERVER_URL = "http://localhost:4000"; 
    
    adminPageHandler = async (req) => {
        try {
            // Lấy pathname từ request
            const pathname = new URL(req.url).pathname;

            // Xử lý đặc biệt cho root của admin
            const finalPathname = pathname === '/admin/' ? '/src/admin/index.html' : pathname;

            // Thực hiện fetch đến dev server với URL đầy đủ
            const proxyResponse = await fetch(`${DEV_SERVER_URL}${finalPathname}`);

            // Trả về response từ dev server
            return proxyResponse;

        } catch (error) {
            console.error("Lỗi khi kết nối đến server dev:", error);
            return new Response("Lỗi: Không thể kết nối đến server dev. Vui lòng đảm bảo nó đang chạy.", { status: 500 });
        }
    };
} else {
    // Môi trường production: phục vụ file tĩnh từ thư mục dist
    const distPath = path.join(__dirname, '../../dist/server');

    adminPageHandler = async (req) => {
        const requestUrl = new URL(req.url);
        // Lấy pathname, loại bỏ prefix '/admin/'
        let pathname = requestUrl.pathname.substring(6); 
        
        // Luôn trả về index.html cho mọi request trong SPA
        const filePath = path.join(distPath, 'index.html');

        try {
            const file = Bun.file(filePath);
            return new Response(file);
        } catch (error) {
            console.error(`Lỗi: Không tìm thấy file SPA index.html tại ${filePath}`, error);
            return new Response("Không tìm thấy trang admin.", { status: 404 });
        }
    };
}

const RouteAdmin = {
    '/admin/*': async req => {
        if (await authServiceInstance.checkAuth(req)) {
            // Gọi hàm handler đã được định nghĩa ở trên để phục vụ trang
            return await adminPageHandler(req);
        } else {
            return new Response(null, {
                status: 302,
                headers: {
                    'location': '/admin/login'
                }
            });
        }
    },
    '/admin/login': {
        GET: () => loginControllerInstance.index(),
        POST: async req => loginControllerInstance.login(req),
    },
    '/admin/logout': {
        GET: async req => loginControllerInstance.logout(req),
    },
    '/admin/api/*': async req => {
        if (await authServiceInstance.checkAuth(req)) {
            return await adminApiInstance.handle(req);
        } else {
            return new Response(null, {
                status: 302,
                headers: {
                    'location': '/admin/login'
                }
            })
        }
    }
}

export { RouteAdmin };