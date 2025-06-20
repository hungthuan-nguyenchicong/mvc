# Cấu Trúc Thư Mục Cơ Bản

admin-dashboard/
├── public/                 // Chứa điểm vào ứng dụng và tài nguyên tĩnh
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── api.js
│   │   ├── router.js
│   │   ├── main.js
│   │   ├── components/
│   │   │   ├── UserList.js
│   │   │   └── UserForm.js
│   │   └── pages/
│   │       ├── DashboardPage.js
│   │       ├── UsersPage.js
│   │       └── ProductsPage.js
│   ├── .htaccess           // Quy tắc Rewrite URL cho Apache
│   └── index.php           // Điểm vào chính của ứng dụng PHP
├── app/                    // Chứa mã nguồn PHP của ứng dụng
│   ├── Core/               // Các lớp lõi
│   │   ├── Controller.php
│   │   ├── Database.php
│   │   ├── Request.php
│   │   ├── Response.php
│   │   └── Router.php
│   ├── Models/             // Các lớp Model chung (có thể bỏ qua với HMVC)
│   ├── Modules/            // Các Module (HMVC)
│   │   ├── Users/
│   │   │   ├── UserController.php
│   │   │   └── User.php    // Model cho module Users
│   │   └── Products/
│   │       ├── ProductController.php
│   │       └── Product.php // Model cho module Products
│   ├── config/             // Các file cấu hình
│   │   └── database.php
│   └── init.php            // File khởi tạo ứng dụng PHP
└── README.md