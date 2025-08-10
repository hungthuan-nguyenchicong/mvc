# Thêm Listener cho adminRouterFrontend()

Có, bạn hoàn toàn có thể để hàm `adminRouterFrontend()` lắng nghe một `CustomEvent`. Đây là một cách tiếp cận rất tốt để tách biệt logic và làm cho ứng dụng của bạn có cấu trúc lỏng lẻo (loosely coupled), giống như việc sử dụng một thư viện router chuyên nghiệp.

-----

### Cách thực hiện

Bạn đã tạo `CustomEvent` trong `linkHandler()`:

```javascript
const navEvent = new CustomEvent('navigated', { detail: { href: href } });
document.dispatchEvent(navEvent);
```

Bây giờ, thay vì gọi trực tiếp `adminRouterFrontend()`, bạn sẽ thêm một listener để lắng nghe sự kiện này.

**1. Sửa lại `linkHandler()`:**

Thay vì gọi `adminRouterFrontend()` trực tiếp, hãy để hàm này chỉ dispatch sự kiện. Logic của bạn đã làm điều này rồi.

```javascript
function linkHandler() {
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link) {
            e.preventDefault();
            const href = link.getAttribute('href');
            // Cập nhật URL
            history.pushState(null, null, href);
            // Dispatch sự kiện điều hướng
            const navEvent = new CustomEvent('navigated', { detail: { href: href } });
            document.dispatchEvent(navEvent);
        }
    });

    window.addEventListener('popstate', () => {
        const href = window.location.href;
        const navEvent = new CustomEvent('navigated', { detail: { href: href } });
        document.dispatchEvent(navEvent);
    });
}
```

-----

### 2\. Thêm Listener cho `adminRouterFrontend()`

Bây giờ, bạn sẽ thêm một `event listener` vào file `adminRouterFrontend.js` để hàm này tự động chạy khi sự kiện `Mapsd` được kích hoạt.

**File `web-mvc/src/admin/core/adminRouterFrontend.js`:**

```javascript
import { dashboard } from "../template/pages/dashboard";
import { posts } from "../template/pages/posts";
import { notFound } from "../template/pages/notFound";

const routes = {
    'dashboard': dashboard,
    'posts': posts,
    'notFound': notFound,
};

async function adminRouterFrontend() {
    // ... (Giữ nguyên logic xử lý routing của bạn) ...
    const search = window.location.search;
    const searchString = new URLSearchParams(search);
    const pageName = searchString.get('p') || 'dashboard';
    const pageAction = searchString.get('action');
    const params = {};

    for (const [key, value] of searchString) {
        if (key !== 'p' && key !== 'action') {
            params[key] = value;
        }
    }
    
    const routeHandler = routes[pageName];
    if (routeHandler) {
        const moduleInstance = routeHandler();
        const action = pageAction || 'index';
        if (moduleInstance[action]) {
            moduleInstance[action](params);
        } else {
            const errorMessage = `Không tìm thấy hành động "${action}" trong module "${pageName}"`;
            notFound().index(errorMessage);
            console.error(errorMessage);
        }
    } else {
        const errorMessage = `Lỗi: Không tìm thấy route hợp lệ cho trang: "${pageName}"`;
        notFound().index(errorMessage);
        console.error(errorMessage);
    }
}

// Lắng nghe sự kiện 'navigated'
document.addEventListener('navigated', (e) => {
    console.log('Event "navigated" received. Loading new page...');
    adminRouterFrontend();
});

// Lần đầu tiên tải trang, bạn cần gọi hàm này một lần
document.addEventListener('DOMContentLoaded', adminRouterFrontend);

// Không cần export adminRouterFrontend nữa vì nó tự lắng nghe sự kiện
// Tuy nhiên, bạn vẫn có thể giữ export nếu cần gọi nó ở các trường hợp đặc biệt
export { adminRouterFrontend };
```

-----

### Cách sử dụng ở các file khác (ví dụ: tạo bài viết)

Bây giờ, trong file xử lý tạo bài viết, bạn chỉ cần dispatch một sự kiện tương tự.

```javascript
if (result.message === 'success') {
    // Cập nhật URL
    history.pushState(null, null, '/admin/?p=posts&action=index');
    
    // Dispatch sự kiện để kích hoạt router
    const navEvent = new CustomEvent('navigated');
    document.dispatchEvent(navEvent);

    // Bạn có thể truyền thông báo qua detail của event để xử lý sau
    // const navEvent = new CustomEvent('navigated', { detail: { message: '...' } });
    // document.dispatchEvent(navEvent);
}
```

### Ưu điểm của cách tiếp cận này

  * **Tách biệt hoàn toàn**: Các module của bạn không cần biết gì về nhau ngoài việc cùng lắng nghe một sự kiện.
  * **Mã nguồn sạch hơn**: Bạn không cần `import` hàm `adminRouterFrontend()` vào mọi nơi. Logic xử lý routing chỉ nằm ở một chỗ và tự động chạy khi cần.
  * **Dễ mở rộng**: Bạn có thể thêm nhiều event listener khác nhau mà không làm thay đổi các module hiện tại.
  * **Tái sử dụng cao**: Bất cứ đâu bạn muốn kích hoạt việc định tuyến, bạn chỉ cần `dispatchEvent` một sự kiện.

Đây là một mô hình thiết kế rất tốt, giúp code của bạn linh hoạt và dễ bảo trì hơn rất nhiều.