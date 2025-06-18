## học

Việc sử dụng <script type="module" src="/admin/js/app.js"></script> như một điểm khởi đầu (entry point) cho toàn bộ phần View admin, xây dựng bằng Class-based OOP và ES Modules trong Vanilla JS là một cách tiếp cận rất tốt và hiện đại cho một dự án front-end.

Dưới đây là lý do tại sao nó là một ý tưởng hay và cách bạn có thể cấu trúc nó:

Tại sao là một cách tiếp cận tốt?
Modular Hóa (Modularity): ES Modules cho phép bạn chia code JavaScript thành các module nhỏ, có thể tái sử dụng và dễ quản lý. Mỗi module có thể là một class, một hàm, hoặc một tập hợp các biến.
Class-based OOP: Sử dụng classes giúp tổ chức code một cách hướng đối tượng, làm cho code dễ đọc, dễ bảo trì và mở rộng hơn. Bạn có thể định nghĩa các component UI, các tiện ích (utilities), hoặc các dịch vụ (services) dưới dạng class.
Dependency Management: import và export trong ES Modules giúp quản lý các phụ thuộc giữa các module một cách rõ ràng. Bạn biết chính xác module nào phụ thuộc vào module nào.
Hiệu suất: Browser có thể tối ưu việc tải các ES Modules (ví dụ: song song, cache tốt hơn).
Clean Code: Giúp tách biệt logic front-end khỏi logic back-end (PHP), tạo ra một kiến trúc sạch sẽ hơn.
Cấu trúc dự án View Admin với Class-based OOP và ES Modules
Bạn có thể tổ chức thư mục JavaScript của mình như sau:

public/
└── admin/
    └── js/
        ├── app.js             <-- Entry point chính
        ├── modules/
        │   ├── components/
        │   │   ├── Sidebar.js
        │   │   ├── Table.js
        │   │   └── Form.js
        │   ├── services/
        │   │   ├── ApiService.js
        │   │   └── AuthService.js
        │   ├── utils/
        │   │   ├── DomHelper.js
        │   │   └── Validator.js
        │   └── models/
        │       └── User.js
        └── pages/
            ├── DashboardPage.js
            ├── UsersPage.js
            └── SettingsPage.js
Giải thích cấu trúc:
app.js (Entry Point): Đây là file chính mà <script type="module"> của bạn sẽ tải. Nó sẽ chịu trách nhiệm khởi tạo các thành phần chính của ứng dụng và điều hướng dựa trên URL hoặc trạng thái của ứng dụng.

JavaScript

// public/admin/js/app.js
import { AuthService } from './modules/services/AuthService.js';
import { Sidebar } from './modules/components/Sidebar.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { UsersPage } from './pages/UsersPage.js';

class AdminApp {
    constructor() {
        this.authService = new AuthService();
        this.sidebar = new Sidebar('#admin-sidebar'); // Ví dụ: truyền selector của sidebar
        this.init();
    }

    async init() {
        // Khởi tạo các thành phần chung
        this.sidebar.render();

        // Kiểm tra trạng thái đăng nhập
        if (!await this.authService.isLoggedIn()) {
            window.location.href = '/admin/login';
            return;
        }

        // Xử lý định tuyến (routing) dựa trên URL hoặc logic khác
        this.handleRouting();
    }

    handleRouting() {
        const path = window.location.pathname;

        if (path === '/admin/' || path === '/admin/dashboard') {
            const dashboardPage = new DashboardPage();
            dashboardPage.render();
        } else if (path.startsWith('/admin/users')) {
            const usersPage = new UsersPage();
            usersPage.render();
        }
        // Thêm các trường hợp định tuyến khác
        else {
            // Xử lý trang 404 hoặc trang mặc định
            console.warn('Page not found for path:', path);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AdminApp();
});
modules/: Chứa các module tái sử dụng, được phân loại theo chức năng:

components/: Các class đại diện cho các thành phần UI độc lập (ví dụ: thanh điều hướng, bảng, form, modal). Mỗi class sẽ quản lý DOM của riêng nó và các tương tác người dùng.
JavaScript

// public/admin/js/modules/components/Sidebar.js
export class Sidebar {
    constructor(selector) {
        this.element = document.querySelector(selector);
        this.bindEvents();
    }

    render() {
        // Logic để render hoặc cập nhật nội dung sidebar
        if (this.element) {
            this.element.innerHTML = `
                <ul>
                    <li><a href="/admin/dashboard">Dashboard</a></li>
                    <li><a href="/admin/users">Users</a></li>
                    <li><a href="/admin/settings">Settings</a></li>
                    <li><a href="/admin/logout" id="logout-btn">Logout</a></li>
                </ul>
            `;
        }
    }

    bindEvents() {
        if (this.element) {
            this.element.addEventListener('click', (event) => {
                if (event.target.id === 'logout-btn') {
                    event.preventDefault();
                    // Logic logout
                    console.log('Logout clicked');
                }
            });
        }
    }
}
services/: Các class xử lý logic nghiệp vụ, giao tiếp với API back-end, hoặc quản lý trạng thái toàn cục (ví dụ: AuthService để xử lý đăng nhập/đăng xuất, ApiService để gửi request HTTP).
JavaScript

// public/admin/js/modules/services/AuthService.js
export class AuthService {
    constructor() {
        this.csrfToken = null; // Sẽ lấy từ API
    }

    async fetchCsrfToken() {
        try {
            const response = await fetch('/admin/csrf');
            const data = await response.json();
            if (data.csrf) {
                this.csrfToken = data.csrf;
                return true;
            }
        } catch (error) {
            console.error('Error fetching CSRF token:', error);
        }
        return false;
    }

    async isLoggedIn() {
        // Giả định session admin được kiểm tra từ phía server
        // hoặc bạn có thể kiểm tra một cookie/local storage token
        // Đối với ví dụ này, ta dựa vào việc có token CSRF hay không
        // hoặc một API endpoint kiểm tra trạng thái đăng nhập
        return this.csrfToken !== null || await this.fetchCsrfToken();
    }

    async login(username, password) {
        if (!this.csrfToken && !await this.fetchCsrfToken()) {
            console.error('CSRF token not available.');
            return { status: 'error', message: 'CSRF token error' };
        }

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('csrf_token', this.csrfToken); // Thêm CSRF token vào request

        try {
            const response = await fetch('/admin/login', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest' // Dấu hiệu là AJAX request
                }
            });
            const data = await response.json();
            if (data.status === 'success') {
                await this.fetchCsrfToken(); // Cập nhật CSRF token sau khi đăng nhập thành công
                return { status: 'success' };
            } else if (data.status === 'csrf') {
                 console.error('CSRF token invalid during login.');
                 return { status: 'error', message: 'Invalid CSRF token' };
            } else {
                return { status: 'error', message: 'Invalid credentials' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { status: 'error', message: 'Network error' };
        }
    }

    async logout() {
        // Gửi request logout đến server
        try {
            const response = await fetch('/admin/logout');
            if (response.ok) {
                this.csrfToken = null; // Xóa token cục bộ
                window.location.href = '/admin/login';
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    }
}
utils/: Các hàm hoặc class tiện ích chung không liên quan đến logic nghiệp vụ cụ thể (ví dụ: xử lý DOM, validation, định dạng ngày tháng).
models/: (Tùy chọn) Nếu bạn có các cấu trúc dữ liệu phức tạp trên front-end, bạn có thể tạo các class model để biểu diễn chúng.
pages/: Các class đại diện cho các trang hoặc "views" cụ thể trong phần admin. Mỗi class trang sẽ chịu trách nhiệm khởi tạo các component và logic cụ thể cho trang đó.

JavaScript

// public/admin/js/pages/DashboardPage.js
import { Table } from '../modules/components/Table.js'; // Ví dụ một component Table

export class DashboardPage {
    constructor() {
        this.element = document.querySelector('#dashboard-content');
    }

    render() {
        if (this.element) {
            this.element.innerHTML = `
                <h1>Dashboard</h1>
                <p>Welcome to the admin dashboard!</p>
                <div id="latest-users-table"></div>
            `;
            // Khởi tạo các component con cho trang này
            const latestUsersTable = new Table('#latest-users-table', {
                headers: ['ID', 'Name', 'Email'],
                data: [
                    [1, 'John Doe', 'john@example.com'],
                    [2, 'Jane Smith', 'jane@example.com']
                ]
            });
            latestUsersTable.render();
        }
    }
}
Cách thức hoạt động với PHP Back-end:
PHP Render View: PHP (trong AdminController::index(), login()) vẫn sẽ render các file HTML cơ bản (admin-index.php, admin-login.php).
HTML Includes <script type="module">: Trong các file HTML này, bạn sẽ include file app.js của bạn:
HTML

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    </head>
<body>
    <div id="admin-sidebar"></div>
    <div id="main-content">
        <div id="dashboard-content"></div>
        <div id="users-content"></div>
    </div>

    <script type="module" src="/admin/js/app.js"></script>
</body>
</html>
JavaScript Takeover: Khi trang tải, app.js sẽ được thực thi. Nó sẽ chịu trách nhiệm:
Khởi tạo các component chung (sidebar, header, footer).
Kiểm tra trạng thái đăng nhập (thông qua API call đến back-end).
Xử lý định tuyến (routing) phía client-side (thay đổi nội dung trang mà không cần tải lại toàn bộ trang) dựa trên URL hoặc sự kiện người dùng.
Gọi các API endpoint của PHP để lấy/gửi dữ liệu.
Điều quan trọng cần nhớ:
CSRF Token: Bạn đã có cơ chế CSRF. Đảm bảo rằng JavaScript của bạn có thể lấy và gửi CSRF token với mỗi request POST/PUT/DELETE. AuthService ví dụ trên đã có phần xử lý này.
API Endpoints: PHP Controller của bạn (ví dụ AdminController) sẽ cần có các phương thức để xử lý các yêu cầu AJAX từ JavaScript (ví dụ: /admin/api/users, /admin/api/products/).
Routing: Đối với một "Single Page Application" (SPA) trong admin, bạn sẽ cần một thư viện routing JavaScript nhẹ hoặc tự xây dựng logic routing dựa trên window.location.pathname và history.pushState() để thay đổi URL mà không tải lại trang.
Áp dụng Class-based OOP và ES Modules sẽ giúp phần front-end của admin trở nên mạnh mẽ, dễ phát triển và bảo trì hơn rất nhiều.