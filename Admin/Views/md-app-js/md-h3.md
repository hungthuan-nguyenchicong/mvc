# h3
Tuyệt vời! Bạn đã nắm bắt đúng bản chất của mô hình kết hợp SSR (PHP) và CSE (JavaScript). Bây giờ, hãy đi sâu vào cách bạn có thể thực hiện việc tải các phần nhỏ (như post-index.php, post-create.php) vào load-content mà không tải lại trang, đồng thời tích hợp JavaScript cho từng phần.

Chiến lược tích hợp PHP Partial Views với JavaScript
Mục tiêu của bạn là PHP sẽ render các "mảnh" HTML (post-index.php, post-create.php) và JavaScript sẽ fetch chúng để chèn vào một vùng (load-content) trên trang admin/index.php mà không cần tải lại toàn bộ trang.

1. PHP Backend: Tạo các "Partial Views"
Đầu tiên, bạn cần cấu hình PHP để có thể trả về các "partial HTML" này.

Tạo các View riêng lẻ:
Bạn sẽ có các file PHP chỉ chứa HTML cho một phần cụ thể của trang, ví dụ:

Admin/Views/partials/post-index.php
Admin/Views/partials/post-create.php
Admin/Views/partials/user-list.php
... (và bất kỳ file CSS/JS cục bộ nào liên quan đến chúng, sẽ nói thêm bên dưới).
Thêm các Route (trong RouteAdmin):
Bạn cần thêm các route trong RouteAdmin để PHP có thể phục vụ các partial view này. Đây có thể là các endpoint mới mà JavaScript của bạn sẽ gọi.

PHP

// Trong RouteAdmin.php
class RouteAdmin {
    // ... (phần hiện có)

    public function __construct() {
        // ... (phần hiện có)

        switch ($this->uri) {
            // ... (các case hiện có)

            // Các route mới cho Partial Views
            case '/admin/partial/posts/index/':
                $this->AdminController->getPartialView('posts/post-index');
                break;
            case '/admin/partial/posts/create/':
                $this->AdminController->getPartialView('posts/post-create');
                break;
            case '/admin/partial/users/index/':
                $this->AdminController->getPartialView('users/user-list');
                break;
            // ... thêm các partial view khác
            default:
                // ... (xử lý 404)
                break;
        }
        // ...
    }
}
Phương thức mới trong AdminController để phục vụ Partial Views:
Bạn sẽ cần một phương thức trong AdminController để xử lý các yêu cầu này.

PHP

// Trong AdminController.php
class AdminController {
    // ... (các phương thức hiện có)

    public function getPartialView($viewName) {
        if (!Session::get('admin')) {
            header('Location: /admin/login/');
            exit;
        }

        // Đường dẫn đến file partial view
        $filePath = root() . 'Admin/Views/partials/' . $viewName . '.php';

        if (is_file($filePath)) {
            // Có thể truyền dữ liệu từ model vào view nếu cần
            // Ví dụ: $data = $this->adminModel->getPosts();
            // ob_start(); // Bắt đầu buffer đầu ra
            // include $filePath;
            // $htmlContent = ob_get_clean(); // Lấy nội dung buffer
            // echo $htmlContent;

            // Để đơn giản, chỉ include trực tiếp
            include $filePath;
            exit; // Đảm bảo chỉ trả về nội dung của partial view
        } else {
            http_response_code(404);
            echo "Partial view not found: " . htmlspecialchars($viewName);
            exit;
        }
    }
}
Lưu ý:

root(): Hãy chắc chắn hàm này trả về đường dẫn gốc chính xác đến thư mục Admin/Views.
Bạn có thể truyền dữ liệu từ model vào partial view bằng cách sử dụng extract($data); trước khi include $filePath; nếu view đó cần dữ liệu động từ PHP (ví dụ: danh sách bài viết).
2. HTML (admin/index.php): Vùng chứa nội dung
File admin/index.php (hoặc layout chính của admin) sẽ có một vùng trống để chứa nội dung động.

HTML

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="/admin/css/main.css">
</head>
<body>
    <div id="admin-sidebar">
        <a href="#" data-page-path="/admin/partial/posts/index/" class="nav-link">Quản lý Bài viết</a>
        <a href="#" data-page-path="/admin/partial/posts/create/" class="nav-link">Tạo Bài viết Mới</a>
        <a href="#" data-page-path="/admin/partial/users/index/" class="nav-link">Quản lý Người dùng</a>
    </div>

    <div id="main-content">
        <div id="load-content">
            <p>Welcome to the Admin Panel. Please select an option from the sidebar.</p>
        </div>
    </div>

    <script type="module" src="/admin/js/app.js"></script>
</body>
</html>
3. JavaScript (app.js và các Class liên quan): Fetch và Quản lý nội dung
Đây là phần quan trọng nhất để JavaScript có thể tải và quản lý các partial view.

app.js (hoặc một Page Manager): Sẽ chịu trách nhiệm lắng nghe sự kiện từ sidebar và fetch nội dung.

JavaScript

// public/admin/js/app.js
import { AuthService } from './modules/services/AuthService.js';
import { Sidebar } from './modules/components/Sidebar.js';
// Import các class Page (PostIndexPage, PostCreatePage)
import { PostIndexPage } from './pages/PostIndexPage.js';
import { PostCreatePage } from './pages/PostCreatePage.js';
import { UsersPage } from './pages/UsersPage.js';

class AdminApp {
    constructor() {
        this.authService = new AuthService();
        this.sidebar = new Sidebar('#admin-sidebar');
        this.loadContentArea = document.getElementById('load-content');
        this.currentPageInstance = null; // Giữ tham chiếu đến instance của trang hiện tại
        this.init();
    }

    async init() {
        this.sidebar.render();
        await this.authService.fetchCsrfToken(); // Lấy CSRF token

        this.bindNavigationEvents();

        // Tải trang mặc định khi khởi động ứng dụng (ví dụ: Dashboard hoặc Posts Index)
        // Lấy URL từ đường dẫn hiện tại nếu bạn muốn hỗ trợ tải lại trang
        const initialPath = window.location.pathname === '/admin/' ? '/admin/partial/posts/index/' : window.location.pathname;
        this.loadPage(initialPath); // Tải nội dung ban đầu
    }

    bindNavigationEvents() {
        this.sidebar.element.addEventListener('click', async (event) => {
            const targetLink = event.target.closest('a[data-page-path]');
            if (targetLink) {
                event.preventDefault();
                const pagePath = targetLink.dataset.pagePath;
                this.loadPage(pagePath);
                // Cập nhật URL trong trình duyệt mà không tải lại trang
                // history.pushState(null, '', pagePath.replace('/partial', '')); // Tùy chọn: URL đẹp hơn
            }
        });
    }

    async loadPage(pagePath) {
        if (!this.loadContentArea) return;

        // Xóa instance trang cũ (nếu có) để giải phóng tài nguyên/event listeners
        if (this.currentPageInstance && typeof this.currentPageInstance.destroy === 'function') {
            this.currentPageInstance.destroy();
        }
        this.currentPageInstance = null; // Reset

        try {
            // Hiển thị loading indicator
            this.loadContentArea.innerHTML = '<p>Loading...</p>';

            const response = await fetch(pagePath, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest', // Báo hiệu đây là AJAX request
                    'X-CSRF-TOKEN': this.authService.getCsrfToken() // Gửi CSRF token
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const htmlContent = await response.text();
            this.loadContentArea.innerHTML = htmlContent;

            // Sau khi HTML được load, khởi tạo logic JS cho trang đó
            this.initializePageLogic(pagePath);

        } catch (error) {
            console.error('Failed to load page content:', error);
            this.loadContentArea.innerHTML = '<p style="color: red;">Error loading content. Please try again.</p>';
        }
    }

    initializePageLogic(pagePath) {
        // Dựa vào pagePath, khởi tạo class JS tương ứng
        if (pagePath.includes('posts/index')) {
            this.currentPageInstance = new PostIndexPage(this.authService);
            this.currentPageInstance.init();
        } else if (pagePath.includes('posts/create')) {
            this.currentPageInstance = new PostCreatePage(this.authService);
            this.currentPageInstance.init();
        } else if (pagePath.includes('users/index')) {
            this.currentPageInstance = new UsersPage(this.authService);
            this.currentPageInstance.init();
        }
        // Thêm các điều kiện khác cho các trang/partial views của bạn
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AdminApp();
});
Các Class Page (ví dụ: PostIndexPage.js, PostCreatePage.js):
Mỗi partial view sẽ có một class JavaScript riêng chịu trách nhiệm cho các tương tác trong phần đó.

JavaScript

// public/admin/js/pages/PostIndexPage.js
import { Table } from '../modules/components/Table.js'; // Nếu bạn có component Table chung

export class PostIndexPage {
    constructor(authService) {
        this.authService = authService;
        this.container = document.querySelector('#post-index-container'); // Selector cho container chính của partial view này
        this.table = null; // Để lưu trữ instance của Table
    }

    init() {
        // PHP đã render HTML cho #post-index-container
        // Giờ JS sẽ thêm các tương tác và tải dữ liệu nếu cần
        console.log('PostIndexPage initialized');

        // Khởi tạo một Table component bên trong partial view này
        // Giả sử có một element #posts-table bên trong #post-index-container
        this.table = new Table('#posts-table', {
            apiEndpoint: '/admin/api/posts', // API để lấy dữ liệu bài viết
            headers: ['ID', 'Title', 'Author', 'Actions'],
            authService: this.authService // Truyền authService để Table có thể lấy CSRF token
        });
        this.table.fetchData(); // Tải dữ liệu ban đầu cho bảng bài viết

        this.bindEvents();
    }

    bindEvents() {
        // Ví dụ: lắng nghe sự kiện click nút "Xóa" trên một bài viết
        if (this.container) {
            this.container.addEventListener('click', async (event) => {
                if (event.target.classList.contains('delete-post-btn')) {
                    const postId = event.target.dataset.postId;
                    if (confirm(`Are you sure you want to delete post ${postId}?`)) {
                        // Gọi API xóa bài viết
                        const result = await this.authService.apiCall(`/admin/api/posts/${postId}`, 'DELETE');
                        if (result.success) {
                            console.log(`Post ${postId} deleted`);
                            this.table.fetchData(); // Tải lại dữ liệu bảng
                        } else {
                            console.error('Failed to delete post:', result.message);
                        }
                    }
                }
            });
        }
    }

    // Phương thức để dọn dẹp (quan trọng khi chuyển trang)
    destroy() {
        console.log('PostIndexPage destroyed');
        // Gỡ bỏ event listeners nếu cần thiết để tránh memory leaks
        // (Trong ví dụ đơn giản này, trình duyệt sẽ tự dọn dẹp các listener bên trong #load-content khi nội dung bị thay thế)
        // Nếu có các timers, external listeners, bạn cần dọn dẹp ở đây.
    }
}
JavaScript

// public/admin/js/pages/PostCreatePage.js

export class PostCreatePage {
    constructor(authService) {
        this.authService = authService;
        this.form = document.querySelector('#post-create-form'); // PHP đã render form này
        this.messageElement = document.querySelector('#post-create-message');
    }

    init() {
        if (this.form) {
            this.bindEvents();
        }
    }

    bindEvents() {
        this.form.addEventListener('submit', async (event) => {
            event.preventDefault();
            this.messageElement.textContent = ''; // Clear previous messages

            const formData = new FormData(this.form);
            formData.append('csrf_token', this.authService.getCsrfToken()); // Thêm CSRF token

            try {
                // Giả sử có một API endpoint để tạo bài viết mới
                const response = await fetch('/admin/api/posts', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });

                const data = await response.json();

                if (data.status === 'success') {
                    this.messageElement.textContent = 'Post created successfully!';
                    this.messageElement.style.color = 'green';
                    this.form.reset(); // Xóa form
                    // Có thể chuyển hướng hoặc tải lại bảng bài viết
                    // window.location.href = '/admin/#posts';
                } else {
                    this.messageElement.textContent = data.message || 'Error creating post.';
                    this.messageElement.style.color = 'red';
                }
            } catch (error) {
                console.error('Error creating post:', error);
                this.messageElement.textContent = 'Network error. Could not create post.';
                this.messageElement.style.color = 'red';
            }
        });
    }

    destroy() {
        console.log('PostCreatePage destroyed');
        // Dọn dẹp listeners nếu cần
    }
}
4. CSS/JS cục bộ cho Partial Views (Tùy chọn)
Nếu một partial view có CSS hoặc JS rất cụ thể mà bạn không muốn load global, bạn có thể:

CSS: Embed trực tiếp trong file partial view (<style>...</style>) hoặc tạo các file CSS riêng và @import chúng vào main CSS của bạn. Nếu là file riêng, bạn có thể thêm <link rel="stylesheet" href="/admin/css/partial-post-index.css"> vào partial view. Tuy nhiên, việc này sẽ làm tăng số lượng HTTP request. Cách tốt hơn là quản lý CSS bằng các build tool (Webpack, Vite, Rollup) nếu bạn có dự án lớn.
JS: Không nên thêm <script> tag trực tiếp vào các partial view nếu bạn đang sử dụng ES Modules và Class-based OOP. Thay vào đó, logic JS cho partial view đó nên được đóng gói trong một Class riêng (như PostIndexPage.js) và được kích hoạt bởi app.js sau khi HTML của partial view được chèn vào DOM.
Tóm lại quy trình
PHP Renders admin/index.php: Tạo khung layout chính, sidebar, và một vùng load-content rỗng. Kèm theo đó là app.js.
app.js khởi động:
Thiết lập các thành phần chung (sidebar).
Lắng nghe sự kiện click từ sidebar (sử dụng data-page-path để biết cần load partial nào).
Gọi loadPage() để tải nội dung trang mặc định.
Khi người dùng click vào Sidebar Link:
app.js chặn hành vi mặc định của link.
Gửi một yêu cầu fetch đến endpoint PHP của partial view (ví dụ: /admin/partial/posts/index/).
PHP Controller nhận yêu cầu, render nội dung của Admin/Views/partials/post-index.php (có thể bao gồm dữ liệu ban đầu từ database) và trả về HTML.
app.js nhận HTML, chèn nó vào #load-content.
Quan trọng: app.js sau đó xác định loại partial view vừa được load (dựa vào pagePath hoặc id / class trong HTML) và khởi tạo instance của Class JS tương ứng (PostIndexPage.js).
PostIndexPage.js sẽ tìm các phần tử DOM bên trong #load-content (ví dụ: bảng, form), gắn các event listeners và thực hiện các hành động JS (ví dụ: gọi API để tải dữ liệu bảng).
Mô hình này giúp bạn có được sự linh hoạt của việc tải nội dung động mà không tải lại trang, đồng thời vẫn giữ được khả năng render HTML ban đầu từ PHP và tận dụng cấu trúc OOP cho JavaScript.