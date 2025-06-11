## tham khao

Ok, tôi đã hiểu rõ ý tưởng của bạn! Bạn muốn có hai điểm vào (entry point) khác nhau cho ứng dụng của mình:

/public/index.php: Xử lý các yêu cầu của phía client (frontend).
/admin/index.php (hoặc tương tự): Xử lý các yêu cầu của phía quản trị (backend admin).
Bạn đang gặp vấn đề khi cố gắng truy cập /admin/index.php và nhận được URL không đúng hoặc không chạy được router admin của bạn.

Đây là cách bạn cần cấu hình Nginx và tổ chức lại các file PHP để đạt được mục tiêu này, cùng với việc giải thích tại sao bạn lại gặp lỗi "trả về URL không đúng".

Cấu trúc thư mục mong muốn (phỏng đoán)
mvc/
├── App/
│   ├── Controllers/
│   │   ├── AdminController.php
│   │   └── ClientController.php
│   └── Views/
│       ├── Admin/
│       └── Client/
├── Core/
│   ├── RouteClient.php   <-- Route cho client
│   └── RouteAdmin.php    <-- Route cho admin
├── public/                <-- Public folder cho Client
│   ├── index.php         <-- Entry point cho Client
│   ├── css/
│   ├── js/
│   └── ...
└── admin/                 <-- Public folder cho Admin (hoặc có thể là thư mục khác ngoài public)
    ├── index.php         <-- Entry point cho Admin
    ├── css/
    ├── js/
    └── ...
Hoặc, phổ biến hơn, bạn có thể chỉ có một thư mục public duy nhất và dùng router để phân biệt /admin và các route khác. Nhưng nếu bạn muốn hai điểm vào vật lý riêng biệt, thì cách trên là một phương án.

Vấn đề hiện tại: root trong Nginx và try_files
Trong cấu hình Nginx hiện tại của bạn:

Nginx

root /var/www/html/mvc/public; # <= Dòng này rất quan trọng
# ...
location / {
    try_files $uri $uri/ /index.php?$query_string;
}
root /var/www/html/mvc/public; nghĩa là Nginx sẽ coi thư mục public là gốc của toàn bộ website.
Khi bạn truy cập http://localhost/, nó sẽ tìm public/index.php.
Khi bạn truy cập http://localhost/admin/login, Nginx sẽ tìm public/admin/login (nếu không tìm thấy, nó sẽ chuyển đến public/index.php).
Vấn đề: Nếu bạn có một thư mục vật lý /var/www/html/mvc/admin/ và bạn cố gắng truy cập http://localhost/admin/index.php, Nginx sẽ tìm public/admin/index.php, chứ không phải /var/www/html/mvc/admin/index.php.
Vì vậy, URL http://localhost/admin/index.php sẽ không trỏ đến đúng file mà bạn muốn làm điểm vào cho backend admin.

Giải pháp 1: Sử dụng Alias trong Nginx (Nếu bạn muốn 2 thư mục vật lý riêng biệt)
Cách này cho phép bạn định nghĩa một tiền tố URL (prefix) sẽ trỏ đến một thư mục khác không phải là root chính.

Cấu hình Nginx (/etc/nginx/sites-available/localhost.conf):

Nginx

server {
    listen 80;
    server_name localhost;

    # Root mặc định cho phía client
    root /var/www/html/mvc/public;
    index index.php index.html index.htm;

    # Log files
    access_log /var/log/nginx/client_access.log;
    error_log /var/log/nginx/client_error.log warn;

    # Cấu hình cho client-side (frontend)
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Cấu hình cho admin-side (backend)
    location /admin/ {
        # Alias sẽ thay thế '/admin/' trong URI bằng đường dẫn này
        alias /var/www/html/mvc/admin/; # <-- Thay đổi đường dẫn này cho thư mục admin của bạn
        index index.php; # Đảm bảo nó tìm index.php trong thư mục admin
        
        # Cấu hình FastCGI cho PHP-FPM trong phần admin
        location ~ ^/admin/(.+\.php)$ { # Chỉ xử lý các file .php trong /admin/
            alias /var/www/html/mvc/admin/; # Đảm bảo alias được lặp lại ở đây
            try_files $uri =404; # Kiểm tra file PHP có tồn tại không

            fastcgi_pass unix:/var/run/php/php8.3-fpm.sock; # Kiểm tra phiên bản PHP
            include fastcgi_params;
            fastcgi_param SCRIPT_FILENAME $request_filename; # <== Rất quan trọng với alias
            # Dùng $request_filename thay vì $document_root$fastcgi_script_name
            # vì $document_root sẽ không còn đúng khi dùng alias.
            # $request_filename sẽ là đường dẫn file vật lý sau khi alias được áp dụng.
        }
    }

    # Cấu hình xử lý các file .php còn lại (cho client, nếu có)
    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }

    # ... Các cấu hình ngăn chặn truy cập file nhạy cảm khác ...
    location ~ /\. { deny all; }
    location ~ /(conf|nginx) { deny all; }
    location ~ /\.(env|git|svn|htacccess|htpasswd|json|yml|yaml)$ { deny all; }

    error_page 404 /404.html;
    location = /404.html { internal; }
    error_page 500 502 503 504 /50x.html;
    location = /50x.html { internal; }
}
Thay đổi trong PHP:

public/index.php: Sẽ chứa logic gọi RouteClient.php.

PHP

<?php
// public/index.php
require_once __DIR__ . '/../Core/RouteClient.php';
new RouteClient();
?>
admin/index.php: Đây sẽ là entry point mới cho admin.

PHP

<?php
// admin/index.php
require_once __DIR__ . '/../Core/RouteAdmin.php';
new RouteAdmin();
?>
Lưu ý: Đường dẫn __DIR__ . '/../Core/RouteAdmin.php' giả định admin/ và Core/ nằm ngang hàng trong thư mục mvc/.

Core/RouteAdmin.php:

$this->uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH); vẫn đúng.
Tuy nhiên, khi bạn truy cập http://localhost/admin/login, $this->uri sẽ là /admin/login.
Router của bạn sẽ cần xử lý /admin/login cho các route admin.
Đường dẫn require_once './../../App/Controllers/AdminController.php'; trong RouteAdmin.php phải đúng so với vị trí của file RouteAdmin.php. (__DIR__ . '/../../App/Controllers/AdminController.php')
Cách truy cập:

Client: http://localhost/ hoặc http://localhost/some-client-route
Admin: http://localhost/admin/ (sẽ chạy admin/index.php) hoặc http://localhost/admin/login (router trong admin/index.php sẽ xử lý /admin/login)
Giải pháp 2: Một thư mục public duy nhất, định tuyến phức tạp hơn trong PHP
Đây là cách phổ biến nhất với các Framework PHP (Laravel, Symfony). Bạn chỉ có một thư mục public làm root và một file index.php duy nhất. Logic phân biệt client/admin nằm hoàn toàn trong PHP router.

Cấu hình Nginx (/etc/nginx/sites-available/localhost.conf):

Nginx

server {
    listen 80;
    server_name localhost;

    root /var/www/html/mvc/public; # Chỉ có một thư mục public
    index index.php index.html index.htm;

    # Log files
    access_log /var/log/nginx/combined_access.log;
    error_log /var/log/nginx/combined_error.log warn;

    location / {
        try_files $uri $uri/ /index.php?$query_string; # Tất cả yêu cầu đều đến public/index.php
    }

    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        # ... các tham số FastCGI khác
    }

    # ... Các cấu hình ngăn chặn truy cập file nhạy cảm khác ...
}
Thay đổi trong PHP:

public/index.php: Đây là điểm vào duy nhất. Nó sẽ chứa logic để gọi đúng router (Client hoặc Admin) dựa trên URI.

PHP

<?php
// public/index.php

error_reporting(E_ALL);
ini_set('display_errors', 1);

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Chuẩn hóa URI (tùy chọn)
$uri = ($uri === '/') ? '/' : rtrim($uri, '/');

// Nếu URI bắt đầu bằng /admin, chuyển đến Admin Router
if (strpos($uri, '/admin') === 0) {
    require_once __DIR__ . '/../Core/RouteAdmin.php';
    new RouteAdmin();
} else {
    // Mọi thứ khác chuyển đến Client Router
    require_once __DIR__ . '/../Core/RouteClient.php';
    new RouteClient();
}
?>
Core/RouteAdmin.php: Router này sẽ xử lý các URI bắt đầu bằng /admin.

PHP

<?php
// Core/RouteAdmin.php

class RouteAdmin {
    private $method;
    private $uri;
    private $AdminController;

    public function __construct() {
        $this->method = $_SERVER['REQUEST_METHOD'];
        $rawUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $this->uri = ($rawUri === '/') ? '/' : rtrim($rawUri, '/'); // Chuẩn hóa URI

        // print_r($this->uri); // Để debug

        require_once __DIR__ . '/../../App/Controllers/AdminController.php';
        $this->AdminController = new AdminController();

        if ($this->method === 'GET' || $this->method === 'POST') {
            switch ($this->uri) {
                case '/admin': // http://localhost/admin
                    $this->AdminController->index();
                    break;
                case '/admin/login': // http://localhost/admin/login
                    $this->AdminController->login();
                    break;
                case '/admin/logout':
                    $this->AdminController->logout();
                    break;
                // Thêm các route admin khác
                default:
                    http_response_code(404);
                    echo 'Admin Page 404 not found (URI: ' . htmlspecialchars($this->uri) . ')';
                    break;
            }
        } else {
            http_response_code(405);
            echo 'Method Not Allowed';
            exit;
        }
    }
}
?>
Core/RouteClient.php: Router này sẽ xử lý các URI khác.

PHP

<?php
// Core/RouteClient.php

class RouteClient {
    private $method;
    private $uri;
    private $ClientController; // Tạo ClientController tương tự AdminController

    public function __construct() {
        $this->method = $_SERVER['REQUEST_METHOD'];
        $rawUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $this->uri = ($rawUri === '/') ? '/' : rtrim($rawUri, '/');

        // print_r($this->uri); // Để debug

        require_once __DIR__ . '/../../App/Controllers/ClientController.php'; // Tạo ClientController
        $this->ClientController = new ClientController();

        if ($this->method === 'GET' || $this->method === 'POST') {
            switch ($this->uri) {
                case '/': // http://localhost/
                    $this->ClientController->home();
                    break;
                case '/about': // http://localhost/about
                    $this->ClientController->about();
                    break;
                // Thêm các route client khác
                default:
                    http_response_code(404);
                    echo 'Client Page 404 not found (URI: ' . htmlspecialchars($this->uri) . ')';
                    break;
            }
        } else {
            http_response_code(405);
            echo 'Method Not Allowed';
            exit;
        }
    }
}
?>
Khuyến nghị
Tôi khuyên dùng Giải pháp 2 (một thư mục public duy nhất và phân chia route trong public/index.php). Đây là phương pháp chuẩn và phổ biến nhất trong các framework MVC hiện đại.

Đơn giản hóa Nginx: Nginx chỉ cần biết một thư mục root và chuyển mọi thứ không phải file/thư mục vật lý đến index.php.
Dễ quản lý: Toàn bộ logic định tuyến nằm trong PHP, dễ dàng debug và mở rộng.
URL thân thiện: URL sẽ là http://localhost/admin/login chứ không phải http://localhost/admin/index.php/login.
Hãy thử áp dụng Giải pháp 2, và nhớ:

Kiểm tra cú pháp Nginx: sudo nginx -t
Tải lại Nginx: sudo systemctl reload nginx
Kiểm tra PHP-FPM: sudo systemctl status php8.3-fpm
Kiểm tra lại đường dẫn require_once: Đảm bảo chúng là chính xác từ file hiện tại đến file mục tiêu.
Nếu bạn thử Giải pháp 2 và vẫn gặp lỗi "không lấy được URL" hoặc 404, hãy kiểm tra output của print_r($uri); trong public/index.php để xem $uri thực sự là gì.