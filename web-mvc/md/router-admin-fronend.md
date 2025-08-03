## v1 hoc router frontend

// web-mvc/src/admin/core/adminRouterFrontend.js

// Import các controller cần thiết
// Trong thực tế, bạn có thể sử dụng dynamic import như trong posts.js
// để chỉ tải code khi cần, nhưng ở đây chúng ta import để làm ví dụ
import { posts } from "../template/pages/posts/posts.js";

// Khởi tạo một đối tượng chứa tất cả các controller của bạn.
// Các controller này sẽ được gọi dựa trên giá trị của tham số 'p'.
const controllers = {
    // Tên key 'posts' phải khớp với giá trị của tham số 'p' trong URL
    posts: posts,
    // Thêm các controller khác ở đây, ví dụ:
    // users: users,
    // products: products
};

// Định nghĩa controller và action mặc định nếu không có trong URL
const defaultControllerName = 'dashboard';
const defaultActionName = 'index';

// Hàm chính để xử lý định tuyến frontend
function adminRouterFrontend() {
    // 1. Lấy chuỗi truy vấn từ URL
    const search = window.location.search;

    // 2. Phân tích chuỗi truy vấn bằng URLSearchParams
    const params = new URLSearchParams(search);

    // Lấy giá trị của 'p' (controller) và 'action'
    const p = params.get('p');
    const action = params.get('action');

    // 3. Xác định controller và action cần gọi
    // Sử dụng controller mặc định nếu không có 'p'
    const controllerName = p || defaultControllerName;
    // Sử dụng action mặc định nếu không có 'action'
    const actionName = action || defaultActionName;

    console.log(`Đang cố gắng gọi: Controller "${controllerName}", Action "${actionName}"`);

    // 4. Tìm và thực thi controller/action tương ứng
    // Kiểm tra xem controller có tồn tại trong đối tượng 'controllers' không
    if (controllers[controllerName]) {
        const controller = controllers[controllerName](); // Lưu ý: posts() trả về một đối tượng, không phải là hàm

        // Kiểm tra xem action có tồn tại trong controller đó không
        if (controller[actionName]) {
            // Lấy thêm các tham số khác từ URL, ví dụ như 'id'
            const id = params.get('id');

            // Gọi action tương ứng.
            // Nếu có 'id' thì truyền vào, không thì gọi không tham số.
            // Bạn có thể mở rộng để xử lý nhiều tham số hơn.
            if (id) {
                console.log(`ID được truyền vào: ${id}`);
                controller[actionName](id); // Gọi hàm với tham số id
            } else {
                controller[actionName](); // Gọi hàm không có tham số
            }
        } else {
            console.error(`Lỗi: Không tìm thấy action "${actionName}" trong controller "${controllerName}"`);
            // TODO: Xử lý lỗi, ví dụ hiển thị trang 404
        }
    } else {
        console.error(`Lỗi: Không tìm thấy controller "${controllerName}"`);
        // TODO: Xử lý lỗi, ví dụ hiển thị trang 404
    }
}

// Gọi hàm router khi DOM đã được tải hoàn toàn
window.addEventListener('DOMContentLoaded', adminRouterFrontend);

// Để hàm có thể được import ở nơi khác nếu cần
export { adminRouterFrontend };

## ver 2

// web-mvc/src/admin/core/adminRouterFrontend.js

// Hàm chính để xử lý định tuyến frontend. Sử dụng async để có thể dùng await
// trong dynamic import.
async function adminRouterFrontend() {
    // Lấy querystring từ URL
    const search = window.location.search;
    const params = new URLSearchParams(search);

    // Lấy tên controller (p) và action từ các tham số
    const controllerName = params.get('p') || 'dashboard'; // Mặc định là 'dashboard'
    const actionName = params.get('action') || 'index'; // Mặc định là 'index'

    console.log(`Đang cố gắng tải: Controller "${controllerName}", Action "${actionName}"`);

    // Xử lý controller dashboard là trường hợp đặc biệt, không cần dynamic import
    if (controllerName === 'dashboard') {
        // TODO: Viết logic để hiển thị trang dashboard
        console.log('Hiển thị trang dashboard.');
        return;
    }

    // Dynamic import controller tương ứng với 'p'
    // Sử dụng try...catch để xử lý trường hợp không tìm thấy file
    try {
        // Xây dựng đường dẫn file dựa trên controllerName
        const controllerPath = `../template/pages/${controllerName}/${controllerName}.js`;
        
        // Dynamic import trả về một Promise, nên ta dùng await
        const controllerModule = await import(controllerPath);

        // Lấy hàm controller từ module đã import
        // Ví dụ: posts từ module posts.js
        const controllerFunction = controllerModule[controllerName];

        // Kiểm tra xem hàm controller có tồn tại không
        if (typeof controllerFunction === 'function') {
            // Gọi hàm controller để lấy đối tượng chứa các actions
            const controller = controllerFunction();
            
            // Kiểm tra xem action có tồn tại trong controller không
            if (typeof controller[actionName] === 'function') {
                // Lấy các tham số khác như 'id' nếu có
                const id = params.get('id');

                // Gọi action tương ứng.
                // Bạn có thể truyền các tham số khác vào đây nếu cần.
                if (id) {
                    console.log(`Đang gọi action "${actionName}" với ID: ${id}`);
                    controller[actionName](id);
                } else {
                    console.log(`Đang gọi action "${actionName}"`);
                    controller[actionName]();
                }

            } else {
                console.error(`Lỗi: Không tìm thấy action "${actionName}" trong controller "${controllerName}"`);
                // TODO: Hiển thị trang lỗi 404 hoặc thông báo
            }
        } else {
            console.error(`Lỗi: File controller "${controllerPath}" không export hàm "${controllerName}"`);
            // TODO: Hiển thị trang lỗi 404 hoặc thông báo
        }

    } catch (error) {
        console.error(`Lỗi khi tải controller "${controllerName}"`, error);
        // TODO: Hiển thị trang lỗi 404 hoặc thông báo
    }
}

// Gắn hàm router vào sự kiện 'DOMContentLoaded' để nó chạy khi trang đã tải xong
window.addEventListener('DOMContentLoaded', adminRouterFrontend);

export { adminRouterFrontend };



