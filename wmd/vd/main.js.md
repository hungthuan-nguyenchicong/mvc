## // public/js/main.js
import { Router } from './router.js'; // Import Router
import { DashboardPage } from './pages/DashboardPage.js'; // Import các trang
import { UsersPage } from './pages/UsersPage.js';
import { ProductsPage } from './pages/ProductsPage.js';

// Định nghĩa các route cho SPA
const routes = [
    { path: '/', view: DashboardPage }, // Trang Dashboard
    { path: '/users', view: UsersPage }, // Trang danh sách người dùng
    { path: '/users/new', view: UsersPage }, // Trang thêm người dùng mới
    { path: '/users/edit/{id}', view: UsersPage }, // Trang chỉnh sửa người dùng với tham số ID
    { path: '/products', view: ProductsPage }, // Trang quản lý sản phẩm
    // { path: '/products/new', view: ProductsPage },
    // { path: '/products/edit/{id}', view: ProductsPage },
    // ... Thêm các route khác nếu cần
];

// Khởi tạo Router với các route đã định nghĩa
const router = new Router(routes);