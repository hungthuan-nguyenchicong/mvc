// web-mvc/backend/core/RouteAdmin.js
import { LoginController } from "../admin/controllers/LoginController"
import { CookieManager } from "./CookieManager";
const loginControllerInstance = new LoginController();

// Hàm kiểm tra quyền truy cập.
// Nó sẽ nhận request và thực hiện kiểm tra cookie.
async function checkAuth(req) {
    const cookieManagerInstance = new CookieManager(req.headers);
    const sessionToken = cookieManagerInstance.get('session_token');
    console.log(sessionToken)
    // Giả định bạn có một cách để xác thực token này
    // Ở đây, chúng ta chỉ kiểm tra xem nó có tồn tại không.
    // Trong thực tế, bạn sẽ cần kiểm tra token này với database hoặc bộ nhớ cache.
    if (sessionToken && sessionToken.length > 0) {
        return true;
    }
    return false;
}
const RouteAdmin = {
    '/admin/': async req => {
        // Gọi hàm checkAuth để kiểm tra
        //console.log(req)
        if (await checkAuth(req)) {
            // Nếu đã đăng nhập, trả về nội dung trang admin
            // Ví dụ: một trang dashboard đơn giản.
            return new Response('/admin/')
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