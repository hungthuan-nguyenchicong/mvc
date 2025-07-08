<?php 
use Admin\Core\Router;

// $routerInstance = new Router();

require_once 'functions.php';
//require_once root().'backend/admin/core/Router.php';


// Tự động tải tất cả các lớp của Composer (bao gồm Dotenv)
require root() . 'backend/vendor/autoload.php';


// Now you can freely use classes from your 'Admin' namespace
// use Admin\Core\Router;

$routerInstance = new Router(); // This will now call the constructor and echo 1

echo "Router instantiated successfully using Composer!";

// Tạo một phiên bản mới của Dotenv
// Truyền đường dẫn đến thư mục chứa tệp .env của bạn
// $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);

// // Tải các biến môi trường
// $dotenv->load();

// // Bây giờ bạn có thể truy cập các biến môi trường qua $_ENV hoặc $_SERVER
// echo "DB Host: " . $_ENV['DB_HOST'] . PHP_EOL;
// echo "DB User: " . $_SERVER['DB_USER'] . PHP_EOL;
// echo "API Key: " . $_ENV['API_KEY'] . PHP_EOL;

// // Các biến boolean hoặc số sẽ được tải dưới dạng chuỗi, bạn có thể cần chuyển đổi chúng
// $appDebug = filter_var($_ENV['APP_DEBUG'], FILTER_VALIDATE_BOOLEAN);
// echo "App Debug: " . ($appDebug ? 'true' : 'false') . PHP_EOL;

// // Ví dụ về việc sử dụng các quy tắc xác thực (validation)
// try {
//     $dotenv->required(['DB_HOST', 'DB_USER', 'DB_PASS'])->notEmpty();
//     $dotenv->required('API_KEY')->notEmpty()->isAlphanumeric(); // Ví dụ: yêu cầu chỉ chứa chữ cái và số
//     echo "Các biến môi trường bắt buộc đã được xác minh." . PHP_EOL;
// } catch (Dotenv\Exception\ValidationException $e) {
//     echo "Lỗi xác minh biến môi trường: " . $e->getMessage() . PHP_EOL;
// }


