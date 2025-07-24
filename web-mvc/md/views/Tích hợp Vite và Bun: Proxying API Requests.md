# Tích hợp Vite và Bun: Proxying API Requests

Hoàn hảo! Ảnh bạn vừa gửi xác nhận rằng server backend đã nhận được dữ liệu POST và trả về JSON phản hồi thành công dựa trên logic xác thực. Đây là một bước tiến lớn!

Bây giờ đến phần tích hợp với Vite ở phía client, đây là một ý tưởng rất hay để xây dựng giao diện người dùng hiện đại.

Tích hợp Vite và Bun: Proxying API Requests
Vite là một công cụ build và dev server tuyệt vời cho frontend. Khi bạn phát triển frontend với Vite, nó sẽ chạy trên một cổng riêng (ví dụ: http://localhost:5173). Backend của bạn (Bun) lại chạy trên một cổng khác (ví dụ: http://localhost:3000).

Vấn đề nảy sinh khi frontend (Vite) muốn gửi yêu cầu API đến backend (Bun):

CORS (Cross-Origin Resource Sharing): Trình duyệt sẽ chặn các yêu cầu từ http://localhost:5173 đến http://localhost:3000 vì chúng đến từ các "nguồn gốc" (origin) khác nhau.

Quản lý URL: Bạn không muốn phải viết đầy đủ http://localhost:3000/api/login trong code frontend. Tốt hơn là chỉ cần /api/login.

Để giải quyết vấn đề này, bạn sẽ sử dụng tính năng proxy của Vite.

Tại sao nên tạo một đường dẫn API riêng (/api)?
Rất nên! Việc tạo một đường dẫn API riêng (ví dụ: tất cả các API endpoint bắt đầu bằng /api/) là một thực tiễn tốt nhất trong phát triển web hiện đại.

Lợi ích của việc tạo đường dẫn /api:

Dễ dàng cấu hình Proxy: Với Vite, bạn chỉ cần cấu hình một quy tắc proxy duy nhất: "bất kỳ yêu cầu nào đến /api hãy chuyển hướng nó đến backend".

Phân tách rõ ràng: Giúp phân biệt rõ ràng giữa các tài nguyên tĩnh (HTML, CSS, JS) và các API endpoint. Điều này làm cho việc quản lý route và debugging dễ dàng hơn.

Khả năng mở rộng: Nếu sau này bạn có nhiều controller hoặc phiên bản API (ví dụ: /api/v1/users, /api/v2/products), việc có tiền tố /api giúp cấu trúc gọn gàng hơn.

Tính di động: Khi triển khai lên môi trường production, bạn có thể dễ dàng cấu hình Nginx, Apache, hoặc các CDN để định tuyến các yêu cầu /api tới backend và các yêu cầu khác tới frontend tĩnh.

Tránh xung đột tên: Giảm thiểu nguy cơ tên route frontend và backend bị trùng lặp.

Cách cấu hình Vite Proxy
Bạn sẽ cấu hình proxy trong file vite.config.js (hoặc vite.config.ts).

Tạo vite.config.js (nếu chưa có) trong thư mục gốc của dự án frontend Vite của bạn:

JavaScript

// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Nếu bạn dùng React

export default defineConfig({
  plugins: [react()], // Thêm các plugin bạn đang sử dụng
  server: {
    proxy: {
      // Định nghĩa proxy
      '/api': { // Mọi request bắt đầu bằng /api
        target: 'http://localhost:3000', // Server Bun của bạn
        changeOrigin: true, // Thay đổi Host header thành target URL (quan trọng cho một số server)
        rewrite: (path) => path.replace(/^\/api/, ''), // Loại bỏ '/api' khỏi đường dẫn khi gửi tới backend
      },
      // Bạn có thể thêm các rule khác nếu cần:
      // '/admin': { // Nếu bạn không muốn dùng /api prefix cho admin
      //   target: 'http://localhost:3000',
      //   changeOrigin: true,
      // },
    },
  },
});
Điều chỉnh Backend Bun của bạn:
Hiện tại, các route của bạn là /admin/login. Để phù hợp với cấu hình proxy rewrite, bạn có 2 lựa chọn:

Lựa chọn 1 (Khuyên dùng): Thay đổi route backend để bắt đầu bằng /api:
Đây là cách tốt nhất để tận dụng lợi ích của prefix /api.
Bạn sẽ cần thay đổi AdminRoutes.js của bạn:

JavaScript

// web-mvc/backend/admin/core/AdminRoutes.js

const AdminRoutes = {
    '/api/admin/test': new Response('/api/admin/test'),
    '/api/admin/:method': async req => {
        const { default: AdminController } = await import('../controllers/AdminController.js');
        const adminControllerInstance = new AdminController(req);
        const methodName = req.params.method;

        if (typeof adminControllerInstance[methodName] === 'function') {
            // Cần đảm bảo rằng `req.params.method` sẽ lấy đúng phần method
            // trong đường dẫn sau khi '/api/admin/' đã bị loại bỏ bởi router của Bun
            return adminControllerInstance[methodName]();
        }
        return new Response('Not Found', { status: 404 });
    }
};

export default AdminRoutes;
Và trong frontend (client-side JavaScript trong loginPage.js):
Bạn sẽ gửi request tới /api/admin/login:

JavaScript

// Trong script của loginPage.js
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    try {
        // Gửi request tới /api/admin/login
        // Vite dev server sẽ proxy nó tới http://localhost:3000/admin/login
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        console.log(result);
        responseMessageDiv.textContent = JSON.stringify(result);
        responseMessageDiv.style.color = result.status === 'success' ? 'green' : 'red';
    } catch (error) {
        console.error('Error during fetch:', error);
        responseMessageDiv.textContent = 'Error: ' + error.message;
        responseMessageDiv.style.color = 'red';
    }
});
Lựa chọn 2 (Ít lý tưởng hơn): Giữ nguyên route backend và điều chỉnh proxy Vite:
Nếu bạn thực sự không muốn thay đổi route backend của mình, bạn có thể điều chỉnh vite.config.js như sau:

JavaScript

// vite.config.js (Lựa chọn 2)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/admin': { // Mọi request bắt đầu bằng /admin
        target: 'http://localhost:3000', // Server Bun của bạn
        changeOrigin: true,
        // rewrite: (path) => path, // Không rewrite, gửi y nguyên '/admin/login'
                               // tới backend
      },
    },
  },
});
Và trong frontend (client-side JavaScript trong loginPage.js):
Bạn sẽ vẫn gửi request tới /admin/login:

JavaScript

// Trong script của loginPage.js (Lựa chọn 2)
const response = await fetch('/admin/login', {
    // ...
});
Tuy nhiên, Lựa chọn 1 (dùng /api) vẫn được khuyến khích hơn vì sự rõ ràng và khả năng mở rộng như đã nêu ở trên.

Tóm lại các bước:
Quyết định tiền tố API: Rất nên dùng /api.

Cập nhật AdminRoutes.js: Thay đổi các đường dẫn /admin/... thành /api/admin/....

Cấu hình vite.config.js: Thiết lập proxy rule để chuyển hướng /api đến http://localhost:3000 và loại bỏ tiền tố /api.

Cập nhật mã client-side: Thay đổi các URL API call từ /admin/login thành /api/admin/login.

Với cấu hình này, khi bạn đang phát triển với Vite, trình duyệt của bạn sẽ gửi yêu cầu /api/admin/login đến Vite dev server. Vite dev server sẽ thấy quy tắc proxy và chuyển tiếp yêu cầu đó đến Bun backend của bạn tại http://localhost:3000/admin/login (vì /api đã bị rewrite loại bỏ), giải quyết vấn đề CORS và giúp quản lý URL gọn gàng.

## Phân tích các lựa chọn Routing cho Bun Backend

Bạn nói rất đúng! Đề xuất ban đầu của tôi về /api/admin/:method có thể không đủ linh hoạt cho các trường hợp như /admin/post/create hoặc /admin/post/show/id, vì nó chỉ bắt một method duy nhất ở cấp độ cuối cùng.

Cũng đúng là việc quản lý routing phức tạp cần một cách tiếp cận cẩn thận, và việc sử dụng query string để gọi Controller@method là một chiến lược phổ biến trong các framework MVC truyền thống.

Hãy cùng phân tích các lựa chọn và cách tốt nhất để đồng bộ hóa routing giữa client (Vite proxy) và server (Bun) cho các URL phức tạp hơn.

Phân tích các lựa chọn Routing cho Bun Backend
1. Sử dụng Route động (/:param) với độ sâu cố định (như đã thảo luận)
Ví dụ:

/api/admin/:method (chỉ bắt được login, index)

Không xử lý được /api/admin/post/create hoặc /api/admin/post/show/id.

2. Sử dụng Wildcard (/*) hoặc Param bắt tất cả (/:all*)
Đây là cách phổ biến để tạo một "catch-all" route và sau đó xử lý logic định tuyến phức tạp bên trong controller hoặc một router nhỏ hơn.

Ví dụ:

JavaScript

// web-mvc/backend/admin/core/AdminRoutes.js
const AdminRoutes = {
    // ... các route cụ thể khác nếu có
    '/api/admin/*': async req => { // Bắt tất cả các đường dẫn dưới /api/admin/
        const { default: AdminController } = await import('../controllers/AdminController.js');
        const adminControllerInstance = new AdminController(req);

        // req.params['*'] sẽ chứa phần còn lại của đường dẫn sau /api/admin/
        const pathSegments = req.params['*'].split('/').filter(Boolean); // ['post', 'create'] hoặc ['post', 'show', 'id']

        let controllerMethod = 'index'; // Mặc định là index

        if (pathSegments.length > 0) {
            // Ví dụ đơn giản: coi phần tử đầu tiên là method
            // Trong thực tế phức tạp hơn, bạn sẽ cần logic mạnh mẽ hơn ở đây
            controllerMethod = pathSegments[0];
        }

        // Gọi method dựa trên segments
        if (typeof adminControllerInstance[controllerMethod] === 'function') {
            return adminControllerInstance[controllerMethod]();
        }

        // Hoặc nếu bạn muốn một router phức tạp hơn:
        // return handleAdminSubRoutes(req, pathSegments); // Một hàm mới để xử lý các sub-route

        return new Response('Admin Sub-route Not Found', { status: 404 });
    },
    // ...
};
export default AdminRoutes;
Ưu điểm: Linh hoạt, bắt được mọi URL.

Nhược điểm: Bạn phải tự xây dựng logic phân tích đường dẫn (pathSegments) và ánh xạ tới controller/method bên trong handler của route đó. Điều này có thể trở nên phức tạp nhanh chóng.

3. Routing dựa trên Query String (?controller=Admin&method=index)
Đây là cách bạn đã đề cập, khá giống với các framework PHP cũ hơn như CodeIgniter 2 hoặc các hệ thống CMS.

Ví dụ:

Client gửi request tới /api?controller=Admin&action=login hoặc /api?c=Admin&a=login

Vite Proxy: Chỉ cần proxy /api sang backend. Không cần rewrite phức tạp.

Bun Backend:

JavaScript

// web-mvc/backend/admin/core/AdminRoutes.js (có thể đổi tên thành AppRoutes.js)
import { URLSearchParams } from 'url'; // Để parse query string

const AppRoutes = {
    '/api': async req => {
        const url = new URL(req.url);
        const params = new URLSearchParams(url.search);

        const controllerName = params.get('c') || 'Home'; // Mặc định Home
        const methodName = params.get('a') || 'index'; // Mặc định index

        try {
            // Ví dụ: dynamic import controller
            // Giả định controller nằm ở thư mục controllers/ và tên file trùng với tên controller
            const controllerPath = `../controllers/${controllerName}Controller.js`;
            const { default: ControllerClass } = await import(controllerPath);

            const controllerInstance = new ControllerClass(req);

            if (typeof controllerInstance[methodName] === 'function') {
                return controllerInstance[methodName]();
            } else {
                return new Response(`Method ${methodName} not found in ${controllerName}Controller`, { status: 404 });
            }

        } catch (error) {
            console.error("Error loading controller or method:", error);
            return new Response(`Error: ${error.message}`, { status: 500 });
        }
    },
    // ... các route khác nếu cần
};
export default AppRoutes;
Ưu điểm:

Dễ dàng đồng bộ hóa giữa client và server (chỉ cần gửi đúng query string).

Không cần regex phức tạp trên server cho từng route.

Có thể xây dựng một bộ điều khiển (Dispatcher) trung tâm.

Nhược điểm:

URL không "đẹp" (human-readable) hay "RESTful".

Hạn chế SEO (mặc dù với API thì ít quan trọng hơn).

Có thể dễ bị trùng lặp tên query param nếu không cẩn thận.

Gợi ý cho bạn: Kết hợp Router và Query String (hoặc tốt nhất là Router có cấu trúc)
Trong một hệ thống MVC/API thực tế, bạn thường sẽ dùng một thư viện router hoặc xây dựng một router có cấu trúc hơn là chỉ dựa vào query string hoặc wildcard đơn giản.

Cách tiếp cận được đề xuất (Router có cấu trúc):

Dùng tiền tố /api như đã thống nhất.

Thiết lập các route Bun một cách có cấu trúc hơn:

/api/admin/login (specific route)

/api/admin/post/create (specific route)

/api/admin/post/:id (specific route với param)

Để làm được điều này, bạn cần một Router Layer mạnh mẽ hơn trong Bun, hoặc tự xây dựng nó. Bun API hiện tại (version 1.2.x) cung cấp routing cơ bản nhưng chưa phải là một framework router đầy đủ như Express hay Hono.

Bạn có thể dùng Hono.js (một framework web nhẹ, tương thích với Bun) hoặc tự xây dựng một RouteRegistry phức tạp hơn.

Ví dụ với Bun's native router (áp dụng cho Bun >= 1.1.0):

JavaScript

// web-mvc/backend/router.js (một file router chung)

import { Router } from 'bun'; // Hoặc bạn có thể tự implement Router class

// Admin Controllers
import AdminController from './admin/controllers/AdminController.js';
// Post Controllers (ví dụ)
// import PostController from './post/controllers/PostController.js';

const router = new Router();

// Admin Routes
router.post('/api/admin/login', async (req) => {
    const adminController = new AdminController(req);
    return await adminController.login();
});

router.get('/api/admin/login', async (req) => {
    const adminController = new AdminController(req);
    return await adminController.login(); // Đảm bảo hàm login xử lý GET
});

router.get('/api/admin', async (req) => {
    const adminController = new AdminController(req);
    return await adminController.index();
});

// Example Post Routes
router.post('/api/admin/post/create', async (req) => {
    // const postController = new PostController(req);
    // return await postController.create();
    return new Response('Create Post API');
});

router.get('/api/admin/post/show/:id', async (req) => {
    const id = req.params.id; // Lấy ID từ URL
    // const postController = new PostController(req);
    // return await postController.show(id);
    return new Response(`Show Post API for ID: ${id}`);
});

// Catch-all for /api/admin/* if no specific route matches
// This should come after more specific routes
router.all('/api/admin/:path*', async (req) => {
    // Có thể log lại path hoặc trả về lỗi
    return new Response('API Admin route not found', { status: 404 });
});

// Default route for API base (if you want something at /api)
router.get('/api', () => new Response('API Root'));


export default router;
Sau đó, trong file server chính của bạn (ví dụ: index.js hoặc server.js):

JavaScript

// index.js (main server file)
import router from './backend/router.js'; // Import router của bạn

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    // Thử match request với router
    const match = router.match(req);

    if (match) {
      // Gán req.params từ match vào req để controller có thể truy cập
      req.params = match.params;
      return await match.handler(req);
    }

    // Nếu không có route nào khớp, trả về 404
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`Bun server running on http://localhost:${server.port}`);
Tổng kết và Lời khuyên:
Dùng tiền tố /api: Luôn luôn dùng, đó là tiêu chuẩn tốt.

Client-side (loginPage.js): Luôn gọi đến URL có tiền tố /api/ (ví dụ: /api/admin/login).

Vite Proxy (vite.config.js):

JavaScript

proxy: {
  '/api': {
    target: 'http://localhost:3000',
    changeOrigin: true,
    // rewrite: (path) => path.replace(/^\/api/, ''), // Giữ nguyên '/api' nếu backend cũng dùng '/api'
  },
},
Lưu ý quan trọng về rewrite:

Nếu router Bun của bạn cũng bắt các route như /api/admin/login, thì bạn không nên dùng rewrite: (path) => path.replace(/^\/api/, '').

Hãy giữ nguyên rewrite nếu bạn muốn backend chỉ nhận /admin/login (như trong đề xuất ban đầu của tôi).

Lời khuyên: Đơn giản nhất là để cả frontend và backend đều dùng /api/ cho các API endpoint. Tức là frontend gọi /api/admin/login và backend cũng định nghĩa route /api/admin/login. Như vậy, bạn không cần rewrite trong Vite proxy.

Bun Backend Routing:

Cách đơn giản cho dự án nhỏ: Dùng đối tượng AdminRoutes như bạn đang làm, nhưng tạo các key cụ thể hơn:

JavaScript

const AdminRoutes = {
    '/api/admin/login': async req => { /* ... */ },
    '/api/admin/post/create': async req => { /* ... */ },
    '/api/admin/post/show/:id': async req => { /* ... */ },
    // ...
};
Với cách này, bạn cần đảm bảo rằng router của Bun mà bạn đang sử dụng (có thể là một custom router hoặc cách Bun handle routes) hỗ trợ match các route cụ thể trước khi match các route tổng quát hơn (như /api/admin/:method hay /api/admin/*).

Cách tốt hơn cho dự án lớn: Sử dụng một framework router mạnh mẽ hơn như Hono (rất nhẹ và nhanh với Bun) hoặc tự xây dựng một module router quản lý các route và ánh xạ tới Controller/Method.

Tôi rất khuyến khích bạn thử cách thứ 4 (router có cấu trúc) hoặc sử dụng một framework router như Hono. Nó sẽ giúp bạn quản lý các URL phức tạp như /admin/post/show/:id một cách dễ dàng và rõ ràng hơn rất nhiều so với việc cố gắng parse query string hay path wildcard thủ công.