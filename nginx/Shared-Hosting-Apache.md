## Shared Hosting Apache
Tuyệt vời, câu hỏi rất hay! Việc áp dụng tương tự với Shared Hosting Apache sẽ có một số khác biệt đáng kể so với Nginx, đặc biệt là với phương pháp X-Accel-Redirect.

Apache không có tính năng tương đương trực tiếp với X-Accel-Redirect của Nginx. Tuy nhiên, bạn vẫn có thể bảo vệ tệp tĩnh dựa trên session admin bằng cách kết hợp .htaccess và một script PHP proxy.

1. Phương pháp PHP Proxy với .htaccess (Tương tự X-Accel-Redirect về nguyên lý)
Đây là cách phổ biến và hiệu quả nhất trên Shared Hosting Apache. Ý tưởng vẫn là chuyển hướng tất cả các yêu cầu đến tệp .js trong thư mục admin thông qua một script PHP proxy.

Bước 1: Cấu hình Apache với .htaccess
Tạo một tệp .htaccess trong thư mục /public/admin/js/ của bạn.

/public/admin/js/.htaccess:

Apache

# Bật rewrite engine
RewriteEngine On

# Ngăn truy cập trực tiếp các tệp .js
# Thay thế mọi yêu cầu đến bất kỳ tệp .js nào
# trong thư mục này bằng yêu cầu đến script PHP proxy.
# Ví dụ: /public/admin/js/main.js sẽ được xử lý bởi /php_proxy_scripts/js_proxy.php?file=main.js
RewriteRule ^(.*\.js)$ /php_proxy_scripts/js_proxy.php?file=$1 [L,QSA]
Giải thích:

RewriteEngine On: Bật module rewrite của Apache.
RewriteRule ^(.*\.js)$ /php_proxy_scripts/js_proxy.php?file=$1 [L,QSA]:
^(.*\.js)$: Khớp với bất kỳ yêu cầu nào kết thúc bằng .js. (.*) sẽ bắt tên tệp (ví dụ main.js).
/php_proxy_scripts/js_proxy.php?file=$1: Chuyển hướng yêu cầu nội bộ đến script PHP proxy của bạn, truyền tên tệp đã bắt được vào tham số file.
[L]: L (Last) báo hiệu Apache dừng xử lý các luật RewriteRule khác nếu luật này khớp.
[QSA]: QSA (Query String Append) đảm bảo rằng bất kỳ tham số truy vấn gốc nào từ URL ban đầu (nếu có) sẽ được giữ lại và thêm vào URL mới.
Bước 2: Tạo script PHP Proxy (php_proxy_scripts/js_proxy.php)
Script PHP này sẽ tương tự như phiên bản fpassthru() đã đề cập trước đó, vì Apache không có X-Accel-Redirect.

Tạo một thư mục mới bên ngoài thư mục public của bạn (ví dụ: php_proxy_scripts/) để chứa script proxy này. Điều này quan trọng để ngăn Apache hoặc người dùng truy cập trực tiếp script này mà không thông qua cơ chế kiểm tra.

php_proxy_scripts/js_proxy.php:

PHP

<?php
session_start();

// --- LOGIC KIỂM TRA SESSION ADMIN ---
// Thay thế bằng logic kiểm tra session admin thực tế của bạn.
if (!isset($_SESSION['is_admin']) || $_SESSION['is_admin'] !== true) {
    header("HTTP/1.0 403 Forbidden");
    exit("Access Denied.");
}

// --- XỬ LÝ PHỤC VỤ TỆP JS ---
$requested_file = $_GET['file'] ?? '';

// Xây dựng đường dẫn tuyệt đối đến tệp JavaScript
// Đảm bảo đường dẫn này khớp với vị trí thực tế của tệp trên máy chủ của bạn
// __DIR__ là đường dẫn của script PHP này (e.g., /path/to/your/project/php_proxy_scripts/)
// '/../public/admin/js/' là đường dẫn tương đối từ script này đến thư mục JS
$file_path = __DIR__ . '/../public/admin/js/' . basename($requested_file);

// Kiểm tra xem tệp có tồn tại và là tệp hợp lệ không
if (!file_exists($file_path) || !is_file($file_path)) {
    header("HTTP/1.0 404 Not Found");
    exit("File not found.");
}

// Mở tệp ở chế độ đọc nhị phân
$file_handle = fopen($file_path, 'rb');
if ($file_handle === false) {
    header("HTTP/1.0 500 Internal Server Error");
    exit("Could not open file.");
}

// Đặt header Content-Type thích hợp
header('Content-Type: application/javascript');
header('Content-Length: ' . filesize($file_path));
header('Accept-Ranges: bytes'); // Tùy chọn: hỗ trợ resume download

// Vô hiệu hóa bộ đệm đầu ra của PHP để gửi dữ liệu trực tiếp
// Điều này quan trọng để tránh bộ đệm giữ lại dữ liệu trong RAM
if (ob_get_level()) {
    ob_end_clean();
}

// Đọc và in ra nội dung của tệp từng phần (hiệu quả về RAM)
fpassthru($file_handle);

// Đóng con trỏ tệp
fclose($file_handle);

exit();
?>
Lưu ý quan trọng cho Shared Hosting Apache:
AllowOverride All: Để .htaccess hoạt động, máy chủ Apache phải được cấu hình để cho phép AllowOverride All trong tệp cấu hình Apache chính (ví dụ: httpd.conf hoặc cấu hình Virtual Host) cho thư mục gốc của bạn. Trên Shared Hosting, điều này thường đã được cấu hình sẵn, nhưng nếu .htaccess không hoạt động, đây là điểm đầu tiên cần kiểm tra.
Đường dẫn tương đối: Đảm bảo đường dẫn đến script PHP proxy (/php_proxy_scripts/js_proxy.php) là đúng. Nó phải là đường dẫn tương đối từ gốc tài liệu của bạn (ví dụ: nếu public nằm trong htdocs, thì php_proxy_scripts cũng phải nằm ở một vị trí mà Apache có thể ánh xạ).
Vị trí script PHP: Luôn đặt script PHP proxy (js_proxy.php) ở một thư mục bên ngoài thư mục public hoặc một thư mục mà bạn đã chặn truy cập trực tiếp bằng .htaccess để tăng cường bảo mật.
Hiệu suất: Mặc dù fpassthru() hiệu quả hơn readfile(), việc Apache phải chuyển hướng yêu cầu và PHP phải khởi động, kiểm tra session, và truyền tệp vẫn sẽ tốn tài nguyên hơn so với việc Nginx phục vụ tệp tĩnh trực tiếp (như trong trường hợp X-Accel-Redirect). Tuy nhiên, đây là giải pháp tốt nhất bạn có thể thực hiện trên Apache Shared Hosting để bảo vệ dựa trên session.
Với các bước này, bạn có thể thiết lập bảo vệ tệp JavaScript trong thư mục admin trên Shared Hosting Apache, đảm bảo chỉ những session admin hợp lệ mới có thể truy cập chúng.