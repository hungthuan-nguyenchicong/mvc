## học
Bạn muốn tìm hiểu sâu hơn về Vanilla JS SPA và cách xây dựng một frontend admin cho các thao tác CRUD, giao tiếp với backend PHP API. Tuyệt vời, đây là một cách tiếp cận mạnh mẽ và linh hoạt!

Vanilla JS SPA là gì?
Vanilla JS SPA (Single-Page Application) là một ứng dụng web mà toàn bộ giao diện người dùng được tải trên một trang HTML duy nhất. Sau đó, JavaScript (code "thuần" mà không cần các framework lớn như React, Angular, Vue) sẽ xử lý tất cả các tương tác, điều hướng và cập nhật nội dung trên trang mà không cần tải lại toàn bộ trang từ máy chủ.

Thay vì mỗi lần người dùng nhấp vào một liên kết, trình duyệt lại gửi một yêu cầu mới đến server và nhận về một trang HTML hoàn toàn mới, SPA sử dụng JavaScript để:

Chặn hành vi mặc định của liên kết: Ngăn trình duyệt chuyển hướng thông thường.
Gửi yêu cầu AJAX: Giao tiếp với server để chỉ lấy dữ liệu (thường là JSON) hoặc các đoạn HTML nhỏ.
Thao tác DOM: JavaScript sẽ tự động cập nhật các phần tử HTML trên trang với dữ liệu hoặc nội dung mới mà nó nhận được.
Quản lý URL: Sử dụng History API của trình duyệt (history.pushState) để thay đổi URL trong thanh địa chỉ, giúp người dùng có thể sử dụng nút "Back/Forward" và bookmark trang.
Cấu trúc và Cách xây dựng Frontend Admin CRUD với Vanilla JS SPA
Để xây dựng một frontend admin CRUD bằng Vanilla JS và giao tiếp với PHP API, chúng ta sẽ cần tổ chức code theo các thành phần chính sau:

1. File HTML chính (index.php hoặc admin.php)
Đây sẽ là trang HTML duy nhất mà trình duyệt tải ban đầu. Nó chứa cấu trúc layout cơ bản của admin và là nơi các file JavaScript của bạn sẽ được tải.

PHP

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    <main class="page-layout">
        <aside class="sidebar">
            <nav class="sidebar-nav">
                <ul class="main-menu">
                    <li><a href="/" class="main-menu-link">Dashboard</a></li>
                    <li>
                        <a href="/products" class="main-menu-link">Quản lý Sản phẩm</a>
                        <ul class="sub-menu">
                            <li><a href="/products/create" class="sub-menu-link">Thêm sản phẩm</a></li>
                        </ul>
                    </li>
                    <li><a href="/users" class="main-menu-link">Quản lý Người dùng</a></li>
                    <hr>
                    <li><a href="/logout" class="main-menu-link">Đăng xuất</a></li>
                </ul>
            </nav>
        </aside>
        <div class="content-area">
            </div>
    </main>

    <script src="/js/app.js"></script>
</body>
</html>
Lưu ý: Các href giờ đây sẽ là đường dẫn "sạch" mà JavaScript sẽ xử lý, không phải query string như trước.

2. JavaScript chính (/js/app.js)
Đây là trái tim của SPA của bạn. Nó sẽ chứa logic routing, fetching data, và thao tác DOM.

JavaScript

// app.js

// --- 1. DOM Elements ---
const contentArea = document.querySelector('.content-area');
const sidebarLinks = document.querySelectorAll('nav.sidebar-nav a');

// --- 2. API Base URL (thay đổi nếu API của bạn nằm ở domain/subdomain khác) ---
const API_BASE_URL = window.location.origin; // Ví dụ: http://your-domain.com

// --- 3. Routing Logic ---
// Định nghĩa các route và hàm để render nội dung tương ứng
const routes = {
    '/': {
        title: 'Dashboard',
        render: async () => {
            return `<h1>Chào mừng đến với Admin Dashboard!</h1><p>Bạn có thể quản lý sản phẩm, người dùng...</p>`;
        }
    },
    '/products': {
        title: 'Quản lý Sản phẩm',
        render: async () => await getProductsListHtml() // Hàm này sẽ fetch data và trả về HTML
    },
    '/products/create': {
        title: 'Thêm Sản phẩm',
        render: async () => await getProductFormHtml('create') // Hàm để lấy form thêm
    },
    '/products/edit': { // Ví dụ cho trang chỉnh sửa (sẽ cần ID)
        title: 'Chỉnh sửa Sản phẩm',
        render: async (id) => await getProductFormHtml('edit', id) // Hàm để lấy form chỉnh sửa
    },
    '/users': {
        title: 'Quản lý Người dùng',
        render: async () => await getUsersListHtml() // Hàm này sẽ fetch data và trả về HTML
    },
    // Thêm các route khác cho các module admin
};

// Hàm xử lý khi URL thay đổi (do click hoặc back/forward)
async function handleRoute() {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    let contentHtml = '';
    let pageTitle = 'Admin Dashboard';

    // Xử lý các trường hợp đặc biệt như '/products/edit?id=X'
    let currentRoute = routes[path];
    if (!currentRoute) {
        // Kiểm tra nếu có base path như /products/edit/
        const baseRoutePath = Object.keys(routes).find(routePath => path.startsWith(routePath + '/'));
        if (baseRoutePath && baseRoutePath.endsWith('/edit')) { // Hoặc các pattern khác
            const id = path.split('/').pop(); // Lấy ID từ URL (ví dụ: /products/edit/123 -> 123)
            currentRoute = routes[baseRoutePath];
            if (currentRoute && id) {
                 contentHtml = await currentRoute.render(id);
                 pageTitle = currentRoute.title;
            }
        }
    }

    if (currentRoute) {
        pageTitle = currentRoute.title;
        if (!contentHtml) { // Nếu chưa được xử lý bởi logic ID
           contentHtml = await currentRoute.render();
        }
    } else {
        pageTitle = '404 - Không tìm thấy';
        contentHtml = '<h1>404 - Không tìm thấy trang</h1><p>URL không tồn tại.</p>';
        history.replaceState(null, '', '/404'); // Thay thế URL thành /404
    }

    contentArea.innerHTML = contentHtml;
    document.title = pageTitle;
    activateSidebarLink(window.location.pathname); // Cập nhật active link
}

// Hàm điều hướng
function navigateTo(path, id = null) {
    let targetPath = path;
    if (id) {
        targetPath += `/${id}`; // Thêm ID vào URL nếu có (e.g., /products/edit/123)
    }
    history.pushState(null, '', targetPath); // Thay đổi URL trong thanh địa chỉ
    handleRoute(); // Xử lý route mới
}

// --- 4. Sidebar Activation Logic ---
function activateSidebarLink(currentPath) {
    sidebarLinks.forEach(link => {
        link.classList.remove('active', 'link-parent');
        const linkHref = link.getAttribute('href');

        // So sánh linkHref với currentPath. Có thể cần logic phức tạp hơn cho match đầy đủ
        // Ví dụ: /products match /products, /products/create match /products/create
        if (currentPath === linkHref || (currentPath.startsWith(linkHref) && linkHref !== '/')) {
            link.classList.add('active');
            if (link.classList.contains('sub-menu-link')) {
                const parentLi = link.closest('.sub-menu').closest('li');
                if (parentLi) {
                    const parentLink = parentLi.querySelector('.main-menu-link');
                    if (parentLink) {
                        parentLink.classList.add('link-parent');
                    }
                }
            }
        }
    });
}

// --- 5. Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    // Lắng nghe sự kiện click trên các liên kết sidebar
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = e.currentTarget.getAttribute('href');
            // Xử lý các liên kết không phải SPA (ví dụ: logout)
            if (href === '/logout') {
                return; // Cho phép trình duyệt xử lý
            }
            e.preventDefault(); // Ngăn chặn tải lại trang
            navigateTo(href);
        });
    });

    // Lắng nghe sự kiện popstate (khi người dùng nhấn nút Back/Forward)
    window.addEventListener('popstate', handleRoute);

    // Xử lý route khi trang tải lần đầu
    handleRoute();
});

// --- 6. Helper functions for Fetching Data and Rendering HTML ---

// Ví dụ: Lấy danh sách sản phẩm và trả về HTML
async function getProductsListHtml() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const products = await response.json(); // Nhận dữ liệu JSON

        let html = '<h2>Danh sách Sản phẩm</h2>';
        html += '<button id="createProductBtn">Thêm Sản phẩm Mới</button>';
        html += '<table border="1" style="width:100%; border-collapse: collapse;">';
        html += '<thead><tr><th>ID</th><th>Tên</th><th>Giá</th><th>Thao tác</th></tr></thead>';
        html += '<tbody>';
        products.forEach(product => {
            html += `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.price}</td>
                    <td>
                        <button class="edit-product-btn" data-id="${product.id}">Sửa</button>
                        <button class="delete-product-btn" data-id="${product.id}">Xóa</button>
                    </td>
                </tr>
            `;
        });
        html += '</tbody></table>';

        // Gắn sự kiện sau khi HTML được chèn vào DOM
        setTimeout(() => { // Dùng setTimeout để đảm bảo HTML đã có trong DOM
            const createBtn = document.getElementById('createProductBtn');
            if (createBtn) {
                createBtn.addEventListener('click', () => navigateTo('/products/create'));
            }

            document.querySelectorAll('.edit-product-btn').forEach(btn => {
                btn.addEventListener('click', (e) => navigateTo(`/products/edit`, e.target.dataset.id));
            });

            document.querySelectorAll('.delete-product-btn').forEach(btn => {
                btn.addEventListener('click', (e) => deleteProduct(e.target.dataset.id));
            });
        }, 0); // setTimeout 0ms để chạy sau khi DOM được cập nhật

        return html;
    } catch (error) {
        console.error('Lỗi khi tải danh sách sản phẩm:', error);
        return `<p>Không thể tải danh sách sản phẩm: ${error.message}</p>`;
    }
}

// Ví dụ: Lấy form sản phẩm (thêm/sửa)
async function getProductFormHtml(mode, id = null) {
    let product = {};
    if (mode === 'edit' && id) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            product = await response.json();
        } catch (error) {
            console.error('Lỗi khi tải thông tin sản phẩm để sửa:', error);
            return `<p>Không thể tải thông tin sản phẩm: ${error.message}</p>`;
        }
    }

    let html = `<h2>${mode === 'create' ? 'Thêm' : 'Chỉnh sửa'} Sản phẩm</h2>`;
    html += `<form id="productForm">
                <input type="hidden" name="id" value="${product.id || ''}">
                <label for="name">Tên sản phẩm:</label><br>
                <input type="text" id="name" name="name" value="${product.name || ''}" required><br><br>
                <label for="price">Giá:</label><br>
                <input type="number" id="price" name="price" value="${product.price || ''}" step="0.01" required><br><br>
                <button type="submit">${mode === 'create' ? 'Thêm' : 'Cập nhật'}</button>
                <button type="button" id="cancelProductForm">Hủy</button>
            </form>`;

    // Gắn sự kiện submit form
    setTimeout(() => {
        const form = document.getElementById('productForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                submitProductForm(form, mode);
            });
        }
        const cancelBtn = document.getElementById('cancelProductForm');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => navigateTo('/products'));
        }
    }, 0);

    return html;
}

// Ví dụ: Submit form thêm/sửa sản phẩm
async function submitProductForm(form, mode) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const id = data.id;

    let url = `${API_BASE_URL}/api/products`;
    let method = 'POST';

    if (mode === 'edit' && id) {
        url = `${API_BASE_URL}/api/products/${id}`;
        method = 'PUT'; // Hoặc PATCH
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                // Thêm headers xác thực nếu cần (ví dụ: 'Authorization': 'Bearer YOUR_TOKEN')
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message || `${mode === 'create' ? 'Thêm' : 'Cập nhật'} sản phẩm thành công!`);
            navigateTo('/products'); // Quay lại danh sách sản phẩm
        } else {
            alert(`Lỗi: ${result.message || 'Không thể thực hiện thao tác.'}`);
            console.error('API Error:', result);
        }
    } catch (error) {
        alert('Đã xảy ra lỗi mạng hoặc server.');
        console.error('Fetch error:', error);
    }
}

// Ví dụ: Xóa sản phẩm
async function deleteProduct(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
            method: 'DELETE',
            // Thêm headers xác thực nếu cần
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message || 'Xóa sản phẩm thành công!');
            handleRoute(); // Tải lại danh sách sau khi xóa
        } else {
            alert(`Lỗi: ${result.message || 'Không thể xóa sản phẩm.'}`);
            console.error('API Error:', result);
        }
    } catch (error) {
        alert('Đã xảy ra lỗi mạng hoặc server.');
        console.error('Fetch error:', error);
    }
}


// (Tương tự viết các hàm getUsersListHtml, getUserFormHtml, submitUserForm, deleteUser)
async function getUsersListHtml() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/users`);
        const users = await response.json();
        let html = '<h2>Danh sách Người dùng</h2>';
        html += '<table border="1" style="width:100%; border-collapse: collapse;">';
        // ... Render bảng người dùng tương tự như sản phẩm
        html += '</table>';
        return html;
    } catch (error) {
        console.error('Lỗi khi tải danh sách người dùng:', error);
        return `<p>Không thể tải danh sách người dùng: ${error.message}</p>`;
    }
}
3. Backend PHP (Routes -> Controller -> Model API)
PHP của bạn sẽ hoạt động như một RESTful API, nhận yêu cầu HTTP và trả về JSON.

a. Cấu hình Routes (ví dụ api.php hoặc trong router chính)
Bạn sẽ cần một router PHP để định tuyến các yêu cầu API đến đúng Controller và Method.

PHP

// Ví dụ file api.php hoặc một phần của hệ thống routing chính của bạn

require_once './../App/Controllers/ProductApiController.php';
require_once './../App/Controllers/UserApiController.php';

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Định tuyến API
if (strpos($uri, '/api/') === 0) { // Chỉ xử lý các request bắt đầu bằng /api/
    $pathSegments = explode('/', trim($uri, '/'));
    $resource = $pathSegments[1]; // products, users, etc.
    $id = isset($pathSegments[2]) ? $pathSegments[2] : null;

    header('Content-Type: application/json'); // Luôn trả về JSON

    switch ($resource) {
        case 'products':
            $controller = new ProductApiController();
            if ($method === 'GET' && $id) {
                echo $controller->show($id);
            } elseif ($method === 'GET') {
                echo $controller->index();
            } elseif ($method === 'POST') {
                echo $controller->store();
            } elseif ($method === 'PUT' && $id) { // PUT/PATCH thường cần ID
                echo $controller->update($id);
            } elseif ($method === 'DELETE' && $id) {
                echo $controller->destroy($id);
            } else {
                http_response_code(405);
                echo json_encode(['message' => 'Method Not Allowed']);
            }
            break;
        case 'users':
            $controller = new UserApiController();
            // Tương tự cho Users
            break;
        default:
            http_response_code(404);
            echo json_encode(['message' => 'API Resource Not Found']);
            break;
    }
    exit; // Quan trọng: dừng script sau khi trả về JSON API
}
// Nếu không phải là API request, tiếp tục xử lý routing cho trang HTML chính (index.php)
b. Controller (ví dụ ProductApiController.php)
Controller sẽ nhận dữ liệu, gọi Model, và trả về phản hồi JSON.

PHP

// App/Controllers/ProductApiController.php
require_once './../App/Models/ProductModel.php'; // Giả sử có ProductModel

class ProductApiController {
    private $productModel;

    public function __construct() {
        $this->productModel = new ProductModel();
    }

    // GET /api/products
    public function index() {
        $products = $this->productModel->getAll();
        // Kiểm tra lỗi nếu cần
        return json_encode($products);
    }

    // GET /api/products/{id}
    public function show($id) {
        $product = $this->productModel->getById($id);
        if ($product) {
            return json_encode($product);
        } else {
            http_response_code(404);
            return json_encode(['message' => 'Product not found']);
        }
    }

    // POST /api/products
    public function store() {
        $input = json_decode(file_get_contents('php://input'), true); // Lấy JSON từ body request
        // Validate input $input['name'], $input['price']
        if (empty($input['name']) || empty($input['price'])) {
            http_response_code(400); // Bad Request
            return json_encode(['message' => 'Name and price are required']);
        }
        $newProductId = $this->productModel->create($input);
        if ($newProductId) {
            http_response_code(201); // Created
            return json_encode(['message' => 'Product created successfully', 'id' => $newProductId]);
        } else {
            http_response_code(500); // Internal Server Error
            return json_encode(['message' => 'Failed to create product']);
        }
    }

    // PUT /api/products/{id}
    public function update($id) {
        $input = json_decode(file_get_contents('php://input'), true);
        // Validate input
        $updated = $this->productModel->update($id, $input);
        if ($updated) {
            http_response_code(200); // OK
            return json_encode(['message' => 'Product updated successfully']);
        } else {
            http_response_code(404); // Not Found hoặc 500
            return json_encode(['message' => 'Product not found or failed to update']);
        }
    }

    // DELETE /api/products/{id}
    public function destroy($id) {
        $deleted = $this->productModel->delete($id);
        if ($deleted) {
            http_response_code(200); // OK
            return json_encode(['message' => 'Product deleted successfully']);
        } else {
            http_response_code(404); // Not Found
            return json_encode(['message' => 'Product not found or failed to delete']);
        }
    }
}
c. Model (ví dụ ProductModel.php)
Model chịu trách nhiệm tương tác với cơ sở dữ liệu.

PHP

// App/Models/ProductModel.php
class ProductModel {
    private $db; // PDO connection hoặc tương tự

    public function __construct() {
        // Khởi tạo kết nối DB ở đây
        // $this->db = new PDO(...);
    }

    public function getAll() {
        // SELECT * FROM products
        // return $this->db->query("SELECT * FROM products")->fetchAll(PDO::FETCH_ASSOC);
        return [
            ['id' => 1, 'name' => 'Sản phẩm A', 'price' => 10.50],
            ['id' => 2, 'name' => 'Sản phẩm B', 'price' => 20.00]
        ]; // Dữ liệu giả định
    }

    public function getById($id) {
        // SELECT * FROM products WHERE id = :id
        // return $this->db->prepare("SELECT * FROM products WHERE id = ?")->execute([$id])->fetch(PDO::FETCH_ASSOC);
        $products = $this->getAll();
        foreach ($products as $p) {
            if ($p['id'] == $id) return $p;
        }
        return null; // Dữ liệu giả định
    }

    public function create($data) {
        // INSERT INTO products (name, price) VALUES (:name, :price)
        return rand(100, 999); // ID giả định
    }

    public function update($id, $data) {
        // UPDATE products SET name = :name, price = :price WHERE id = :id
        return true; // Kết quả giả định
    }

    public function delete($id) {
        // DELETE FROM products WHERE id = :id
        return true; // Kết quả giả định
    }
}
Tóm lại:
Mô hình Vanilla JS SPA với PHP API là một cách tuyệt vời để xây dựng ứng dụng admin hiện đại:

Frontend (Vanilla JS): Đảm nhiệm việc hiển thị UI, routing phía client, và gọi API.
Backend (PHP MVC): Biến thành một bộ API RESTful, tập trung vào xử lý logic nghiệp vụ và trả về JSON.
Cách này tách biệt rõ ràng các phần của ứng dụng, giúp việc phát triển linh hoạt hơn, dễ dàng mở rộng và mang lại trải nghiệm người dùng mượt mà hơn rất nhiều so với mô hình tải lại trang truyền thống.

## hoc class

Tuyệt vời! Bạn đã có một câu hỏi rất hợp lý về việc tổ chức code JavaScript của mình. Có, bạn hoàn toàn có thể và nên chia nhỏ các phần JS này thành các module hoặc class riêng biệt, sau đó import hoặc khởi tạo chúng trong một file app.js chính.

Việc này tương tự như cách bạn tổ chức các class trong PHP và require chúng vào một file chính. Trong JavaScript hiện đại, chúng ta thường sử dụng ES Modules (import/export) để đạt được điều này.

Tại sao nên chia nhỏ JavaScript?
Tính tổ chức (Modularity): Mỗi module/class chịu trách nhiệm cho một phần cụ thể (ví dụ: ProductManager, UserManager, Router).
Dễ bảo trì: Khi có lỗi hoặc cần thay đổi, bạn biết chính xác file nào cần chỉnh sửa.
Tái sử dụng code: Các hàm hoặc logic chung có thể được đóng gói và tái sử dụng ở nhiều nơi.
Dễ đọc hơn: File app.js chính sẽ ngắn gọn hơn, chỉ tập trung vào việc khởi tạo và điều phối các module khác.
Phát triển hợp tác: Nhiều nhà phát triển có thể làm việc trên các module khác nhau mà ít xung đột hơn.
Cách chia nhỏ JavaScript bằng ES Modules
Để sử dụng ES Modules, bạn cần đảm bảo rằng file script chính của bạn được đánh dấu với type="module" trong HTML:

HTML

<script type="module" src="/js/app.js"></script>
Sau đó, bạn có thể tạo các file JavaScript riêng biệt:

1. File Router (js/router.js)
Chứa logic định tuyến và quản lý việc hiển thị nội dung.

JavaScript

// js/router.js

import { activateSidebarLink } from './sidebar.js'; // Import logic sidebar
import { getProductsListHtml, getProductFormHtml } from './productManager.js'; // Import product functions
import { getUsersListHtml } from './userManager.js'; // Import user functions
// Import các hàm khác khi bạn tạo thêm module

const contentArea = document.querySelector('.content-area');

// Định nghĩa các route và hàm để render nội dung tương ứng
export const routes = {
    '/': {
        title: 'Dashboard',
        render: async () => `<h1>Chào mừng đến với Admin Dashboard!</h1><p>Bạn có thể quản lý sản phẩm, người dùng...</p>`
    },
    '/products': {
        title: 'Quản lý Sản phẩm',
        render: async () => await getProductsListHtml()
    },
    '/products/create': {
        title: 'Thêm Sản phẩm',
        render: async () => await getProductFormHtml('create')
    },
    '/products/edit': {
        title: 'Chỉnh sửa Sản phẩm',
        render: async (id) => await getProductFormHtml('edit', id)
    },
    '/users': {
        title: 'Quản lý Người dùng',
        render: async () => await getUsersListHtml()
    },
};

// Hàm xử lý khi URL thay đổi (do click hoặc back/forward)
export async function handleRoute() {
    const path = window.location.pathname;
    let contentHtml = '';
    let pageTitle = 'Admin Dashboard';
    let currentRoute = routes[path];

    if (!currentRoute) {
        const baseRoutePath = Object.keys(routes).find(routePath => path.startsWith(routePath + '/'));
        if (baseRoutePath && baseRoutePath.endsWith('/edit')) {
            const id = path.split('/').pop();
            currentRoute = routes[baseRoutePath];
            if (currentRoute && id) {
                 contentHtml = await currentRoute.render(id);
                 pageTitle = currentRoute.title;
            }
        }
    }

    if (currentRoute) {
        pageTitle = currentRoute.title;
        if (!contentHtml) {
           contentHtml = await currentRoute.render();
        }
    } else {
        pageTitle = '404 - Không tìm thấy';
        contentHtml = '<h1>404 - Không tìm thấy trang</h1><p>URL không tồn tại.</p>';
        history.replaceState(null, '', '/404');
    }

    contentArea.innerHTML = contentHtml;
    document.title = pageTitle;
    activateSidebarLink(window.location.pathname);
}

// Hàm điều hướng
export function navigateTo(path, id = null) {
    let targetPath = path;
    if (id) {
        targetPath += `/${id}`;
    }
    history.pushState(null, '', targetPath);
    handleRoute();
}

2. File Sidebar (js/sidebar.js)
Chứa logic kích hoạt link sidebar.

JavaScript

// js/sidebar.js

const sidebarLinks = document.querySelectorAll('nav.sidebar-nav a');

export function activateSidebarLink(currentPath) {
    sidebarLinks.forEach(link => {
        link.classList.remove('active', 'link-parent');
        const linkHref = link.getAttribute('href');

        if (currentPath === linkHref || (currentPath.startsWith(linkHref) && linkHref !== '/')) {
            link.classList.add('active');
            if (link.classList.contains('sub-menu-link')) {
                const parentLi = link.closest('.sub-menu').closest('li');
                if (parentLi) {
                    const parentLink = parentLi.querySelector('.main-menu-link');
                    if (parentLink) {
                        parentLink.classList.add('link-parent');
                    }
                }
            }
        }
    });
}

export function setupSidebarListeners(navigateToCallback) {
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = e.currentTarget.getAttribute('href');
            if (href === '/logout') {
                return;
            }
            e.preventDefault();
            navigateToCallback(href); // Sử dụng callback để gọi navigateTo từ router
        });
    });
}
3. File Product Manager (js/productManager.js)
Chứa các hàm liên quan đến quản lý sản phẩm (fetch, render, submit form).

JavaScript

// js/productManager.js

import { API_BASE_URL } from './config.js'; // Giả sử API_BASE_URL nằm trong file config.js
import { navigateTo, handleRoute } from './router.js'; // Import để điều hướng và refresh route

// Ví dụ: Lấy danh sách sản phẩm và trả về HTML
export async function getProductsListHtml() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/products`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const products = await response.json();

        let html = '<h2>Danh sách Sản phẩm</h2>';
        html += '<button id="createProductBtn">Thêm Sản phẩm Mới</button>';
        html += '<table border="1" style="width:100%; border-collapse: collapse;">';
        html += '<thead><tr><th>ID</th><th>Tên</th><th>Giá</th><th>Thao tác</th></tr></thead>';
        html += '<tbody>';
        products.forEach(product => {
            html += `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.price}</td>
                    <td>
                        <button class="edit-product-btn" data-id="${product.id}">Sửa</button>
                        <button class="delete-product-btn" data-id="${product.id}">Xóa</button>
                    </td>
                </tr>
            `;
        });
        html += '</tbody></table>';

        // Gắn sự kiện sau khi HTML được chèn vào DOM
        // Quan trọng: Sử dụng Event Delegation hoặc gắn lại sự kiện
        // Cách setTimeout (0) là một hack để đảm bảo DOM đã được update
        // Một cách tốt hơn là trả về HTML và gắn event listener sau khi innerHTML
        // Tuy nhiên, với trường hợp này, vì các nút luôn tồn tại sau khi render,
        // việc gắn lại là cần thiết.
        setTimeout(() => {
            const createBtn = document.getElementById('createProductBtn');
            if (createBtn) {
                createBtn.addEventListener('click', () => navigateTo('/products/create'));
            }

            document.querySelectorAll('.edit-product-btn').forEach(btn => {
                btn.addEventListener('click', (e) => navigateTo(`/products/edit`, e.target.dataset.id));
            });

            document.querySelectorAll('.delete-product-btn').forEach(btn => {
                btn.addEventListener('click', (e) => deleteProduct(e.target.dataset.id));
            });
        }, 0);

        return html;
    } catch (error) {
        console.error('Lỗi khi tải danh sách sản phẩm:', error);
        return `<p>Không thể tải danh sách sản phẩm: ${error.message}</p>`;
    }
}

export async function getProductFormHtml(mode, id = null) {
    let product = {};
    if (mode === 'edit' && id) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/products/${id}`);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            product = await response.json();
        } catch (error) {
            console.error('Lỗi khi tải thông tin sản phẩm để sửa:', error);
            return `<p>Không thể tải thông tin sản phẩm: ${error.message}</p>`;
        }
    }

    let html = `<h2>${mode === 'create' ? 'Thêm' : 'Chỉnh sửa'} Sản phẩm</h2>`;
    html += `<form id="productForm">
                <input type="hidden" name="id" value="${product.id || ''}">
                <label for="name">Tên sản phẩm:</label><br>
                <input type="text" id="name" name="name" value="${product.name || ''}" required><br><br>
                <label for="price">Giá:</label><br>
                <input type="number" id="price" name="price" value="${product.price || ''}" step="0.01" required><br><br>
                <button type="submit">${mode === 'create' ? 'Thêm' : 'Cập nhật'}</button>
                <button type="button" id="cancelProductForm">Hủy</button>
            </form>`;

    setTimeout(() => {
        const form = document.getElementById('productForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                submitProductForm(form, mode);
            });
        }
        const cancelBtn = document.getElementById('cancelProductForm');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => navigateTo('/products'));
        }
    }, 0);

    return html;
}

export async function submitProductForm(form, mode) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const id = data.id;

    let url = `${API_BASE_URL}/api/products`;
    let method = 'POST';

    if (mode === 'edit' && id) {
        url = `${API_BASE_URL}/api/products/${id}`;
        method = 'PUT';
    }

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message || `${mode === 'create' ? 'Thêm' : 'Cập nhật'} sản phẩm thành công!`);
            navigateTo('/products');
        } else {
            alert(`Lỗi: ${result.message || 'Không thể thực hiện thao tác.'}`);
            console.error('API Error:', result);
        }
    } catch (error) {
        alert('Đã xảy ra lỗi mạng hoặc server.');
        console.error('Fetch error:', error);
    }
}

export async function deleteProduct(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
            method: 'DELETE',
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message || 'Xóa sản phẩm thành công!');
            handleRoute();
        } else {
            alert(`Lỗi: ${result.message || 'Không thể xóa sản phẩm.'}`);
            console.error('API Error:', result);
        }
    } catch (error) {
        alert('Đã xảy ra lỗi mạng hoặc server.');
        console.error('Fetch error:', error);
    }
}
4. File User Manager (js/userManager.js)
Tương tự như productManager.js, nhưng dành cho người dùng.

JavaScript

// js/userManager.js

import { API_BASE_URL } from './config.js';

export async function getUsersListHtml() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/users`);
        const users = await response.json();
        let html = '<h2>Danh sách Người dùng</h2>';
        html += '<table border="1" style="width:100%; border-collapse: collapse;">';
        html += '<thead><tr><th>ID</th><th>Tên</th><th>Email</th><th>Thao tác</th></tr></thead>';
        html += '<tbody>';
        users.forEach(user => {
            html += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>
                        <button class="edit-user-btn" data-id="${user.id}">Sửa</button>
                        <button class="delete-user-btn" data-id="${user.id}">Xóa</button>
                    </td>
                </tr>
            `;
        });
        html += '</tbody></table>';

        setTimeout(() => {
            // Gắn event listeners cho các nút user (tương tự như productManager)
        }, 0);

        return html;
    } catch (error) {
        console.error('Lỗi khi tải danh sách người dùng:', error);
        return `<p>Không thể tải danh sách người dùng: ${error.message}</p>`;
    }
}

// ... các hàm khác cho quản lý người dùng (getUserFormHtml, submitUserForm, deleteUser)
5. File Config (js/config.js)
Chứa các hằng số dùng chung.

JavaScript

// js/config.js
export const API_BASE_URL = window.location.origin;
// export const AUTH_TOKEN = 'YOUR_JWT_TOKEN_HERE'; // Ví dụ nếu dùng token
6. File app.js (file chính để khởi tạo)
File này sẽ đơn giản hơn nhiều, chỉ chịu trách nhiệm import và khởi tạo các module khác.

JavaScript

// js/app.js

import { handleRoute, navigateTo } from './router.js';
import { setupSidebarListeners } from './sidebar.js';

// Khởi tạo ứng dụng khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    // Thiết lập lắng nghe sự kiện click cho sidebar, truyền navigateTo để chúng có thể điều hướng
    setupSidebarListeners(navigateTo);

    // Lắng nghe sự kiện popstate (khi người dùng nhấn nút Back/Forward)
    window.addEventListener('popstate', handleRoute);

    // Xử lý route khi trang tải lần đầu
    handleRoute();
});

Giải thích và Lời khuyên quan trọng:
import và export: Đây là cú pháp của ES Modules. Các module JavaScript hiện đại sử dụng export để cung cấp các hàm, biến hoặc class ra bên ngoài, và import để sử dụng chúng trong các file khác.
setTimeout(() => {}, 0);: Đây là một "hack" phổ biến trong Vanilla JS khi bạn innerHTML nội dung động và cần gắn sự kiện cho các phần tử mới được tạo ra. setTimeout(func, 0) đẩy func vào cuối hàng đợi sự kiện, đảm bảo nó chạy sau khi trình duyệt đã kịp xử lý việc cập nhật DOM của innerHTML.
Cách tốt hơn (tùy phức tạp): Đối với các bảng dữ liệu có nhiều nút, Event Delegation thường là lựa chọn tốt hơn. Thay vì gắn sự kiện cho từng nút edit-product-btn hoặc delete-product-btn sau mỗi lần render, bạn có thể gắn một lắng nghe sự kiện duy nhất vào một phần tử cha (ví dụ: contentArea hoặc document.body).
JavaScript

// Ví dụ Event Delegation trong app.js hoặc một file eventManager.js
contentArea.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-product-btn')) {
        navigateTo(`/products/edit`, e.target.dataset.id);
    } else if (e.target.classList.contains('delete-product-btn')) {
        deleteProduct(e.target.dataset.id); // Gọi hàm deleteProduct
    } else if (e.target.id === 'createProductBtn') {
        navigateTo('/products/create');
    }
    // Thêm các loại nút khác ở đây
});
Với Event Delegation, bạn chỉ cần thiết lập lắng nghe sự kiện một lần khi trang tải. Các nút được thêm vào sau này qua innerHTML sẽ tự động hoạt động mà không cần gắn lại sự kiện.
Quản lý Form: Việc gửi form bằng fetch và nhận phản hồi JSON là chuẩn mực. Đừng quên xử lý Content-Type: application/json và JSON.stringify(data) khi gửi dữ liệu POST/PUT.
Xác thực (Authentication): Nếu admin của bạn yêu cầu đăng nhập, bạn sẽ cần cơ chế để gửi access token (ví dụ: JWT) trong header của các yêu cầu fetch tới API để xác thực người dùng.
Xử lý lỗi: Luôn kiểm tra response.ok và try...catch để bắt lỗi mạng và lỗi API.
Chia nhỏ code JS theo cách này sẽ làm cho ứng dụng SPA Vanilla JS của bạn dễ quản lý, dễ đọc và dễ mở rộng hơn rất nhiều!