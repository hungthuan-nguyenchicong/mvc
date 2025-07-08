Bạn có một kịch bản rất phổ biến và là một ví dụ tuyệt vời về cách Composer Autoloading có thể giúp tổ chức code. Khi bạn có 2 bộ mã nguồn PHP riêng biệt (Admin và Client) nằm trong cùng một dự án, bạn nên cấu hình autoload trong composer.json để mỗi bộ có namespace riêng của nó.

Giả sử cấu trúc thư mục dự án của bạn trông như thế này:

your-project/
├── backend/
│   ├── Admin/             <-- Code cho phần quản trị admin
│   │   └── Controller/
│   │       └── DashboardController.php
│   │   └── Model/
│   │       └── AdminUser.php
│   ├── Client/            <-- Code cho phần public client
│   │   └── Controller/
│   │       └── HomeController.php
│   │   └── Model/
│   │       └── Product.php
│   ├── Core/              <-- Các thành phần dùng chung (Router, Database, v.v.)
│   │   └── Router.php
│   ├── vendor/            <-- Composer dependencies
│   ├── composer.json
│   └── index.php          <-- Entry point chính của backend (được public/admin/index.php và public/client/index.php require)
├── public/
│   ├── admin/             <-- Entry point cho Admin (index.php) và tài sản Webpack của Admin
│   │   └── index.php
│   │   └── bundle.js (đã build)
│   ├── client/            <-- Entry point cho Client (index.php)
│   │   └── index.php
│   └── .htaccess / nginx config (rewrites to public/admin/index.php or public/client/index.php)
└── ...
Cấu hình composer.json cho 2 bộ mã nguồn
Bạn sẽ đặt composer.json ở thư mục gốc của backend (your-project/backend/composer.json).

Bạn sẽ định nghĩa các ánh xạ PSR-4 riêng biệt cho từng bộ mã nguồn:

JSON

{
    "name": "your-vendor/your-app",
    "description": "Your MVC application with Admin and Client sections.",
    "type": "project",
    "require": {
        "php": ">=8.1",
        "vlucas/phpdotenv": "^5.6",
        // ... các thư viện khác mà cả Admin và Client dùng
    },
    "autoload": {
        "psr-4": {
            // Namespace cho phần quản trị Admin
            "AdminApp\\": "Admin/",

            // Namespace cho phần công khai Client
            "ClientApp\\": "Client/",

            // Namespace cho các thành phần dùng chung (nếu có)
            "CoreApp\\": "Core/"
            // Hoặc nếu bạn muốn Admin\ và Client\ trực tiếp:
            // "Admin\\": "Admin/",
            // "Client\\": "Client/",
            // "Shared\\": "Core/" // Tên namespace "Core" có thể trùng với các thư viện khác, nên đổi thành "Shared" hoặc "Common"
        }
    },
    "require-dev": {
        "phpunit/phpunit": "^10.0"
    },
    "config": {
        "allow-plugins": {
            "php-http/discovery": true
        }
    }
}
Giải thích:

"AdminApp\\": "Admin/": Điều này có nghĩa là bất kỳ class nào trong namespace AdminApp\ (ví dụ: AdminApp\Controller\DashboardController) sẽ được tìm trong thư mục Admin/ của backend.

"ClientApp\\": "Client/": Tương tự, bất kỳ class nào trong namespace ClientApp\ (ví dụ: ClientApp\Controller\HomeController) sẽ được tìm trong thư mục Client/ của backend.

"CoreApp\\": "Core/": Nếu bạn có các class dùng chung như Router nằm trong thư mục Core/, bạn nên tạo một namespace riêng cho chúng.

Sau khi chỉnh sửa composer.json, hãy chạy composer dump-autoload để cập nhật vendor/autoload.php.

Cách sử dụng các Class trong Code
1. Trong các file của phần Admin (ví dụ: backend/Admin/Controller/DashboardController.php):

PHP

<?php

namespace AdminApp\Controller; // Namespace của class này

// Nếu DashboardController cần sử dụng một Model từ AdminApp
use AdminApp\Model\AdminUser;

// Nếu DashboardController cần sử dụng một Core component
use CoreApp\Router; // Ví dụ

class DashboardController
{
    private $router;

    public function __construct(Router $router) // Ví dụ injection Router
    {
        $this->router = $router;
    }

    public function showDashboard()
    {
        $user = new AdminUser(); // Gọi AdminUser bằng tên ngắn
        // ...
        echo "Admin Dashboard for user: " . $user->getName();
    }
}
2. Trong các file của phần Client (ví dụ: backend/Client/Controller/HomeController.php):

PHP

<?php

namespace ClientApp\Controller; // Namespace của class này

// Nếu HomeController cần sử dụng một Model từ ClientApp
use ClientApp\Model\Product;

// Nếu HomeController cần sử dụng một Core component
use CoreApp\Router; // Ví dụ

class HomeController
{
    private $router;

    public function __construct(Router $router) // Ví dụ injection Router
    {
        $this->router = $router;
    }

    public function showHomePage()
    {
        $product = new Product(); // Gọi Product bằng tên ngắn
        // ...
        echo "Welcome to the client homepage. Latest product: " . $product->getName();
    }
}
3. Trong các file dùng chung (ví dụ: backend/Core/Router.php):

PHP

<?php

namespace CoreApp; // Namespace của class này (là thành phần dùng chung)

// Nếu Router cần sử dụng bất kỳ class nào khác, nó sẽ use chúng
// use AdminApp\Controller\DashboardController; // Có thể cần nếu router điều hướng đến các controller
// use ClientApp\Controller\HomeController;

class Router
{
    public function __construct() {
        echo "Core Router initialized.<br>";
    }

    public function dispatch(string $path)
    {
        if (strpos($path, '/admin') === 0) {
            $controller = new \AdminApp\Controller\DashboardController($this); // Sử dụng tên đầy đủ hoặc use ở đây
            $controller->showDashboard();
        } elseif (strpos($path, '/client') === 0) {
            $controller = new \ClientApp\Controller\HomeController($this);
            $controller->showHomePage();
        } else {
            echo "404 Not Found";
        }
    }
}
Các Entry Point (public/admin/index.php và public/client/index.php)
public/admin/index.php:

PHP

<?php
// Nạp Composer Autoloader
require_once '../../backend/vendor/autoload.php';

// Nạp các class cần thiết cho điểm vào admin
use CoreApp\Router;
use AdminApp\Controller\DashboardController; // Nếu bạn muốn khởi tạo trực tiếp

// Khởi tạo router
$router = new Router();
$router->dispatch('/admin'); // Ví dụ: điều hướng đến phần admin
?>
public/client/index.php:

PHP

<?php
// Nạp Composer Autoloader
require_once '../../backend/vendor/autoload.php';

// Nạp các class cần thiết cho điểm vào client
use CoreApp\Router;
use ClientApp\Controller\HomeController; // Nếu bạn muốn khởi tạo trực tiếp

// Khởi tạo router
$router = new Router();
$router->dispatch('/client'); // Ví dụ: điều hướng đến phần client
?>
Với cấu hình này, Composer sẽ biết cách tìm đúng file class cho từng namespace, giúp bạn tổ chức code một cách rõ ràng và hiệu quả cho cả hai bộ mã nguồn Admin và Client.