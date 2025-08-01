## Bây giờ, chúng ta sẽ tích hợp CookieManager

Rất tốt\! Bạn đang xây dựng một cấu trúc khá rõ ràng và logic cho ứng dụng web của mình. Việc tách `CookieManager` thành một class riêng là một cách tiếp cận tốt, giúp quản lý code dễ dàng hơn.

Bây giờ, chúng ta sẽ tích hợp `CookieManager` vào `LoginController.js` để xử lý việc đăng nhập, thiết lập cookie, và đăng xuất.

### Cập nhật `CookieManager.js`

Đầu tiên, có một lỗi nhỏ trong class `CookieManager` của bạn. Phương thức `slip` không tồn tại, bạn cần thay bằng `split`. Đồng thời, tôi sẽ thêm một phương thức để tạo chuỗi xóa cookie.

```javascript
// web-mvc/backend/core/CookieManager.js

class CookieManager {
    #requestHeader;
    #newCookies = [];

    constructor(requestHeaders) {
        this.#requestHeader = requestHeaders;
    }

    get(name) {
        const cookieHeader = this.#requestHeader.get('Cookie');
        if (!cookieHeader) {
            return undefined;
        }

        const cookies = cookieHeader.split(';').map(cookie => cookie.trim());
        for (const cookie of cookies) {
            const [key, value] = cookie.split('=');
            if (key === name) {
                return value;
            }
        }
        return undefined;
    }

    set(name, value, options = {}) {
        let cookiesString = `${name}=${value}`;

        if (options.maxAge) {
            cookiesString += `; Max-Age=${options.maxAge}`;
        }
        if (options.path) {
            cookiesString += `; Path=${options.path}`;
        }
        if (options.httpOnly) {
            cookiesString += `; HttpOnly`;
        }
        if (options.secure) {
            cookiesString += `; Secure`;
        }
        
        this.#newCookies.push(cookiesString);
    }
    
    // Thêm phương thức để xóa cookie bằng cách đặt maxAge = 0
    delete(name, options = {}) {
        this.set(name, '', { ...options, maxAge: 0 });
    }

    getSetCookieHeaders() {
        return this.#newCookies;
    }
}

export { CookieManager }
```

-----

### Cập nhật `LoginController.js`

Chúng ta sẽ thêm logic để tạo và xóa cookie sau khi đăng nhập và đăng xuất.

```javascript
// web-mvc/backend/admin/controller.js/LoginController.js

import { LoginModel } from "../models/LoginModel";
import { loginPage } from "../views/login/login-page";
import { CookieManager } from "../core/CookieManager";
import crypto from 'crypto';

class LoginController {
    async index(req) {
        // ... (Giữ nguyên logic tạo CSP header) ...
        const nonce = crypto.randomBytes(16).toString('base64');
        let cspHeader = null;
        if (import.meta.env.NODE_ENV === 'development') {
            cspHeader = ``
        } else {
            cspHeader = `default-src 'self'; style-src 'self' 'nonce-${nonce}'; script-src 'self' 'nonce-${nonce}';`;
        }
        return new Response(await loginPage(nonce), {
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Content-Security-Policy': cspHeader
            },
            status: 200
        });
    }

    async login(req) {
        const loginModelInstance = new LoginModel();
        let response = {};
        const cookieManager = new CookieManager(req.headers); // Khởi tạo CookieManager với headers từ request

        try {
            const formData = await req.formData();
            const username = formData.get('username');
            const password = formData.get('password');

            if (await loginModelInstance.validate(username, password)) {
                // Đăng nhập thành công, thiết lập cookie
                cookieManager.set('session_token', 'your_secure_token', {
                    maxAge: 3600, // 1 giờ
                    httpOnly: true,
                    secure: true,
                    path: '/admin'
                });
                cookieManager.set('user_id', username, {
                    maxAge: 3600,
                    path: '/admin'
                });

                response.status = 200;
            } else {
                response.status = 401; // Sử dụng mã lỗi 401 Unauthorized khi đăng nhập thất bại
            }
        } catch (error) {
            console.error('Error during login:', error);
            response.status = 500;
        }
        
        const res = Response.json(response);

        // Gắn tất cả các header Set-Cookie vào response trước khi gửi đi
        const setCookieHeaders = cookieManager.getSetCookieHeaders();
        for (const header of setCookieHeaders) {
            res.headers.append('Set-Cookie', header);
        }

        return res;
    }
    
    async logout(req) {
        const cookieManager = new CookieManager(req.headers); // Khởi tạo CookieManager

        // Xóa cookie bằng cách đặt Max-Age = 0
        cookieManager.delete('session_token', { path: '/admin' });
        cookieManager.delete('user_id', { path: '/admin' });

        const res = new Response('Logged out successfully');

        // Gắn header Set-Cookie để xóa cookie trên trình duyệt
        const setCookieHeaders = cookieManager.getSetCookieHeaders();
        for (const header of setCookieHeaders) {
            res.headers.append('Set-Cookie', header);
        }

        return res;
    }
}

export { LoginController }
```

-----

### Cập nhật `RouteAdmin.js`

Cuối cùng, chúng ta cần thêm route cho `logout` để hoàn thiện luồng.

```javascript
// web-mvc/backend/core/RouteAdmin.js

import { LoginController } from "../admin/controller.js/LoginController"

const loginControllerInstance = new LoginController();
const RouteAdmin = {
    '/admin/': new Response('/admin/'),
    '/admin/login': {
        GET: req => loginControllerInstance.index(req),
        POST: async req => loginControllerInstance.login(req),
    },
    '/admin/logout': {
        GET: async req => loginControllerInstance.logout(req),
    }
}

export { RouteAdmin }
```

### Phân tích những thay đổi

1.  **Sửa lỗi cú pháp**: Đã sửa `cookieHeader.slip(';')` thành `cookieHeader.split(';')` trong `CookieManager`.
2.  **Thêm logic đăng nhập**: Trong phương thức `login`, sau khi xác thực thành công, chúng ta tạo một instance của `CookieManager` và sử dụng phương thức `set` để thiết lập `session_token` và `user_id`.
3.  **Gắn header vào response**: Trước khi trả về response JSON, chúng ta gọi `cookieManager.getSetCookieHeaders()` để lấy các chuỗi `Set-Cookie` đã tạo. Sau đó, lặp qua mảng này và thêm từng chuỗi vào headers của response.
4.  **Thêm phương thức `logout`**: Tạo một phương thức `logout` trong `LoginController` để xử lý việc đăng xuất. Phương thức này sẽ sử dụng `cookieManager.delete()` để xóa cookie.
5.  **Cập nhật `RouteAdmin.js`**: Thêm route `/admin/logout` và liên kết nó với phương thức `logout` của `LoginController`.

Bằng cách này, bạn đã thành công trong việc tích hợp class `CookieManager` vào ứng dụng của mình. Bạn có thể thấy rằng lớp này đã giúp bạn trừu tượng hóa quá trình tạo và gắn header `Set-Cookie`, làm cho logic trong `LoginController` trở nên sạch và dễ đọc hơn.

## thêm /admin
// web-mvc/backend/core/RouteAdmin.js

import { LoginController } from "../admin/controller.js/LoginController";
import { CookieManager } from "./CookieManager";

const loginControllerInstance = new LoginController();

// Hàm kiểm tra quyền truy cập.
// Nó sẽ nhận request và thực hiện kiểm tra cookie.
async function checkAuth(req) {
    const cookieManager = new CookieManager(req.headers);
    const sessionToken = cookieManager.get('session_token');

    // Giả định bạn có một cách để xác thực token này
    // Ở đây, chúng ta chỉ kiểm tra xem nó có tồn tại không.
    // Trong thực tế, bạn sẽ cần kiểm tra token này với database hoặc bộ nhớ cache.
    if (sessionToken && sessionToken.length > 0) {
        // Token hợp lệ, cho phép request đi tiếp.
        return true;
    }

    // Token không tồn tại hoặc không hợp lệ, trả về false.
    return false;
}

const RouteAdmin = {
    // Thêm logic kiểm tra vào route '/admin/'
    '/admin/': async (req) => {
        // Gọi hàm checkAuth để kiểm tra
        if (await checkAuth(req)) {
            // Nếu đã đăng nhập, trả về nội dung trang admin
            // Ví dụ: một trang dashboard đơn giản.
            return new Response('Welcome to the Admin Dashboard!', {
                headers: { 'Content-Type': 'text/html' }
            });
        } else {
            // Nếu chưa đăng nhập, chuyển hướng đến trang login
            return new Response(null, {
                status: 302, // Mã trạng thái chuyển hướng
                headers: {
                    'Location': '/admin/login'
                }
            });
        }
    },
    
    '/admin/login': {
        GET: req => loginControllerInstance.index(req),
        POST: async req => {
            // Khi đăng nhập thành công, LoginController sẽ thiết lập cookie.
            // Cookie này sẽ được sử dụng để xác thực ở các request sau.
            return loginControllerInstance.login(req);
        },
    },

    '/admin/logout': {
        GET: async req => loginControllerInstance.logout(req),
    }
};

// Hàm này sẽ tìm và thực thi handler tương ứng với request
// Đây là một ví dụ đơn giản, bạn sẽ cần một logic routing đầy đủ hơn
// để xử lý các method GET/POST/etc.
export async function handleAdminRequest(req) {
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    if (RouteAdmin[path]) {
        const routeHandler = RouteAdmin[path];
        // Nếu handler là một hàm (như trường hợp '/admin/')
        if (typeof routeHandler === 'function') {
            return await routeHandler(req);
        } 
        // Nếu handler là một đối tượng chứa các method (như trường hợp '/admin/login')
        else if (routeHandler[method]) {
            return await routeHandler[method](req);
        }
    }
    
    // Trả về 404 nếu không tìm thấy route
    return new Response('Not Found', { status: 404 });
}