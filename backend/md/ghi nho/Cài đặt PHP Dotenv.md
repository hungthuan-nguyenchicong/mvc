## Cài đặt PHP Dotenv

Để cài đặt và sử dụng PHP Dotenv, bạn cần thực hiện các bước sau. Dotenv là một thư viện cho phép bạn tải các biến môi trường từ một tệp .env vào biến toàn cục $_ENV hoặc $_SERVER của PHP. Điều này rất hữu ích để giữ các thông tin nhạy cảm như khóa API, thông tin kết nối cơ sở dữ liệu tách biệt khỏi mã nguồn của bạn.

1. Yêu cầu Tiên quyết
Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt:

PHP: Phiên bản PHP 7.1 trở lên. (Bạn có PHP 8.3.6, vậy là quá tốt).

Composer: Công cụ quản lý gói cho PHP. (Bạn đã cài đặt thành công ở các bước trước).

2. Cài đặt PHP Dotenv
Bạn sẽ sử dụng Composer để thêm Dotenv vào dự án của mình.

Mở Terminal (hoặc Command Prompt trên Windows).

Điều hướng đến thư mục gốc của dự án PHP của bạn. Nếu bạn chưa có dự án, hãy tạo một thư mục mới:

Bash

mkdir my_php_app
cd my_php_app
Chạy lệnh Composer để yêu cầu Dotenv:

Bash

composer require vlucas/phpdotenv
Lệnh này sẽ tải xuống thư viện Dotenv và tạo (hoặc cập nhật) các tệp composer.json và composer.lock cùng với thư mục vendor/ trong dự án của bạn. Thư mục vendor/ chứa tất cả các thư viện mà dự án của bạn yêu cầu.

3. Sử dụng PHP Dotenv
Sau khi cài đặt, bạn có thể bắt đầu sử dụng Dotenv để tải các biến môi trường.

Tạo tệp .env:
Trong thư mục gốc của dự án của bạn (ngang hàng với tệp composer.json), tạo một tệp mới tên là .env.

Lưu ý quan trọng: Không bao giờ commit tệp .env này lên các hệ thống kiểm soát phiên bản (như Git) vì nó chứa thông tin nhạy cảm. Hãy thêm .env vào tệp .gitignore của bạn.

Ví dụ về nội dung tệp .env:

DB_HOST=localhost
DB_NAME=my_database
DB_USER=root
DB_PASS=my_strong_password
API_KEY=your_super_secret_api_key_123
APP_DEBUG=true
Lưu ý: Các giá trị không có dấu cách hoặc ký tự đặc biệt không cần đặt trong dấu ngoặc kép. Nếu có dấu cách hoặc ký tự đặc biệt, hãy đặt chúng trong dấu ngoặc kép (ví dụ: APP_NAME="My Awesome App").

Tạo tệp PHP để tải và sử dụng các biến môi trường:
Trong thư mục gốc của dự án, tạo một tệp PHP mới, ví dụ: index.php.

Thêm đoạn mã sau vào index.php:

PHP

<?php

// Tự động tải tất cả các lớp của Composer (bao gồm Dotenv)
require __DIR__ . '/vendor/autoload.php';

// Tạo một phiên bản mới của Dotenv
// Truyền đường dẫn đến thư mục chứa tệp .env của bạn
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);

// Tải các biến môi trường
$dotenv->load();

// Bây giờ bạn có thể truy cập các biến môi trường qua $_ENV hoặc $_SERVER
echo "DB Host: " . $_ENV['DB_HOST'] . PHP_EOL;
echo "DB User: " . $_SERVER['DB_USER'] . PHP_EOL;
echo "API Key: " . $_ENV['API_KEY'] . PHP_EOL;

// Các biến boolean hoặc số sẽ được tải dưới dạng chuỗi, bạn có thể cần chuyển đổi chúng
$appDebug = filter_var($_ENV['APP_DEBUG'], FILTER_VALIDATE_BOOLEAN);
echo "App Debug: " . ($appDebug ? 'true' : 'false') . PHP_EOL;

// Ví dụ về việc sử dụng các quy tắc xác thực (validation)
try {
    $dotenv->required(['DB_HOST', 'DB_USER', 'DB_PASS'])->notEmpty();
    $dotenv->required('API_KEY')->notEmpty()->isAlphanumeric(); // Ví dụ: yêu cầu chỉ chứa chữ cái và số
    echo "Các biến môi trường bắt buộc đã được xác minh." . PHP_EOL;
} catch (Dotenv\Exception\ValidationException $e) {
    echo "Lỗi xác minh biến môi trường: " . $e->getMessage() . PHP_EOL;
}
?>
Chạy tệp PHP của bạn:
Mở terminal trong thư mục dự án và chạy:

Bash

php index.php
Bạn sẽ thấy đầu ra tương tự như sau:

DB Host: localhost
DB User: root
API Key: your_super_secret_api_key_123
App Debug: true
Các biến môi trường bắt buộc đã được xác minh.
Giải thích quan trọng
createImmutable(__DIR__): __DIR__ là một hằng số ma thuật của PHP, trả về đường dẫn thư mục của tệp hiện tại. createImmutable() tạo một phiên bản Dotenv không thay đổi các biến môi trường đã tồn tại trong hệ thống. createMutable() sẽ ghi đè các biến môi trường hệ thống nếu có trùng tên.

$dotenv->load(): Phương thức này thực hiện việc tải các biến từ tệp .env vào $_ENV và $_SERVER.

Truy cập biến: Sau khi tải, bạn có thể truy cập các biến bằng $_ENV['TEN_BIEN'] hoặc $_SERVER['TEN_BIEN']. $_ENV thường được ưa dùng hơn.

Xác thực biến (->required()): Dotenv cho phép bạn xác định các biến môi trường bắt buộc và thêm các quy tắc xác thực như notEmpty(), isBoolean(), isInteger(), isUrl(), v.v. Nếu một biến bắt buộc bị thiếu hoặc không đáp ứng quy tắc, một ValidationException sẽ được ném ra.

.gitignore: Đảm bảo tệp .env của bạn được thêm vào .gitignore để tránh bị commit lên kho lưu trữ mã nguồn của bạn.
Mở tệp .gitignore trong thư mục gốc của dự án (hoặc tạo nó nếu chưa có) và thêm dòng này:

.env
/vendor/
Bây giờ bạn đã biết cách cài đặt và sử dụng PHP Dotenv để quản lý các biến môi trường của mình một cách an toàn và hiệu quả! Bạn có muốn tạo một dự án PHP mới và thử nghiệm việc này không?