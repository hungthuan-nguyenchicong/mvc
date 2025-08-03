## tách các param ra khỏi url search

Đây là một ý tưởng rất hay. Bạn muốn tách biệt các tham số đặc biệt như `p` (page) và `action` ra khỏi các tham số còn lại (ví dụ: `id`, `limit`, `page`), sau đó truyền chúng vào hàm tương ứng. Điều này làm cho logic của bạn sạch sẽ và dễ bảo trì hơn.

Bạn hoàn toàn có thể làm điều đó. Cách tiếp cận của bạn là tạo một đối tượng mới chỉ chứa các tham số còn lại.

Dưới đây là cách bạn có thể sửa đổi đoạn code để đạt được mục tiêu đó:

```javascript
// web-mvc/src/admin/core/adminRouterFrontend.js
import { posts } from "../template/pages/posts/posts";
import { notFound } from "../template/pages/notFound/notFound";

const routes = {
    'posts': posts,
    '404': notFound,
};

function adminRouterFrontend() {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    
    // Lấy p và action ra riêng
    const pageName = params.get('p');
    const pageAction = params.get('action');

    // Tạo một đối tượng mới để lưu các tham số còn lại
    const remainingParams = {};
    
    // Duyệt qua tất cả các tham số
    for (const [key, value] of params.entries()) {
        // Loại bỏ 'p' và 'action', chỉ giữ lại các tham số khác
        if (key !== 'p' && key !== 'action') {
            remainingParams[key] = value;
        }
    }

    const routeHandler = routes[pageName] || routes['404'];

    if (routeHandler) {
        const moduleInstance = routeHandler();
        const action = pageAction || 'index';

        if (moduleInstance[action]) {
            console.log(`Đang chạy chức năng: ${action} của ${pageName || '404'} với các tham số:`, remainingParams);
            
            // Gọi hàm và truyền các tham số còn lại vào
            moduleInstance[action](remainingParams);
            
        } else {
            console.log(`Không tìm thấy hành động "${action}" trong module "${pageName}"`);
        }
    } else {
        console.error("Không tìm thấy route hợp lệ.");
    }
}

adminRouterFrontend();
```

### Phân tích những thay đổi

1.  **Tách tham số đặc biệt**: Chúng ta sử dụng `params.get('p')` và `params.get('action')` để lấy `pageName` và `pageAction` một cách rõ ràng.

2.  **Tạo đối tượng mới**: Một đối tượng rỗng (`remainingParams`) được tạo để lưu các tham số còn lại.

3.  **Lặp và lọc**: Vòng lặp `for...of` duyệt qua tất cả các cặp khóa-giá trị của `URLSearchParams`.

      * Sử dụng điều kiện `if (key !== 'p' && key !== 'action')` để kiểm tra và loại bỏ hai tham số đặc biệt.
      * Các tham số còn lại được thêm vào đối tượng `remainingParams`.

4.  **Truyền tham số**: Khi gọi hàm, chúng ta truyền đối tượng `remainingParams` vào làm đối số: `moduleInstance[action](remainingParams);`.

-----

### Cập nhật cấu trúc module của bạn

Để sử dụng cách này, bạn cần cập nhật các module của mình để có thể nhận các tham số này. Ví dụ, trong file `posts.js` của bạn, hàm `index()` sẽ cần nhận một tham số.

```javascript
// web-mvc/src/admin/template/pages/posts/posts.js

function posts() {
    function index(params = {}) { // Nhận đối tượng params làm tham số
        console.log("Hàm index đã được gọi với các tham số:", params);
        // Bây giờ bạn có thể truy cập các tham số như params.id, params.limit, ...
        // Ví dụ:
        if (params.id) {
            console.log("Đang xem bài viết có ID:", params.id);
        }
    }

    function create() {
        // ...
    }

    return {
        index,
        create,
    };
}

export { posts };
```

Cách này giúp mã của bạn có cấu trúc rõ ràng và dễ dàng mở rộng, đồng thời tách biệt được logic định tuyến với logic xử lý nghiệp vụ của từng module.