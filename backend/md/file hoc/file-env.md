## .env

Bạn đang sử dụng các biến môi trường trong file .env để cấu hình ứng dụng của mình. Đây là một phương pháp rất tốt để quản lý cấu hình bảo mật.

Dưới đây là giải thích về cách sử dụng API_KEY và cách bạn có thể cấu hình người dùng (users) khác nhau cho phần admin và public.

1. Giải thích và cách sử dụng API_KEY
API_KEY=your_super_secret_api_key_123 là một biến môi trường dùng để lưu trữ một khóa bí mật (secret key). Khóa này thường được sử dụng để xác thực (authentication) hoặc ủy quyền (authorization) cho các yêu cầu API.

Mục đích sử dụng API_KEY:
Bảo mật API: Khi ứng dụng của bạn gọi đến một dịch vụ API bên ngoài (ví dụ: Google Maps, dịch vụ thanh toán), bạn cần gửi API_KEY này để chứng minh bạn có quyền truy cập.

Bảo vệ API nội bộ: Ngược lại, nếu bạn cung cấp một API, bạn có thể yêu cầu người dùng hoặc các dịch vụ khác gửi API_KEY này trong tiêu đề yêu cầu (request header). Bạn sẽ kiểm tra xem khóa đó có khớp với $_ENV['API_KEY'] trong hệ thống của bạn hay không để xác nhận yêu cầu đó là hợp lệ.

Cách sử dụng trong PHP:
Sau khi file .env được tải (như trong lớp Model trước đó), bạn có thể truy cập giá trị này trong code PHP bằng cách sử dụng siêu biến toàn cục $_ENV:

PHP

// Lấy giá trị API_KEY từ biến môi trường
$apiKey = $_ENV['API_KEY']; 

// Ví dụ: Sử dụng API Key để gửi yêu cầu đến một dịch vụ bên ngoài
$response = send_request_to_service($apiKey);

// Ví dụ: Xác thực yêu cầu đến API nội bộ
if (isset($_SERVER['HTTP_X_API_KEY']) && $_SERVER['HTTP_X_API_KEY'] === $_ENV['API_KEY']) {
    // Cho phép truy cập
} else {
    // Từ chối truy cập
    http_response_code(401);
}
2. Cấu hình người dùng khác nhau cho Admin và Public
Nếu bạn muốn sử dụng các tài khoản database khác nhau cho phần Admin và phần Public (ví dụ: để phân quyền truy cập database ở cấp độ user), bạn có thể định nghĩa các biến môi trường riêng biệt trong file .env.

Bước 1: Định nghĩa các biến trong .env
Bạn có thể thêm các biến môi trường cụ thể cho Admin và Public như sau:

Ini, TOML

# Cấu hình Database cho khu vực Public (người dùng thông thường)
DB_PUBLIC_HOST=localhost
DB_PUBLIC_USER=user_public
DB_PUBLIC_PASS=public_pass_123
DB_PUBLIC_NAME=mvcdb_public

# Cấu hình Database cho khu vực Admin (quản trị viên)
DB_ADMIN_HOST=localhost
DB_ADMIN_USER=user_admin
DB_ADMIN_PASS=admin_pass_456
DB_ADMIN_NAME=mvcdb_admin
Bước 2: Sử dụng các biến trong ứng dụng PHP
Trong code PHP, bạn sẽ xác định xem yêu cầu hiện tại thuộc về khu vực Admin hay Public, sau đó sử dụng bộ thông tin đăng nhập tương ứng để thiết lập kết nối cơ sở dữ liệu.

Ví dụ, trong lớp Model hoặc một lớp kết nối database khác, bạn có thể tạo một hàm để chọn thông tin đăng nhập:

PHP

// Giả định rằng bạn có một biến $is_admin_area để xác định khu vực hiện tại
$is_admin_area = true; // hoặc false tùy thuộc vào URL/Route

if ($is_admin_area) {
    // Sử dụng thông tin cho Admin
    $dbHost = $_ENV['DB_ADMIN_HOST'];
    $dbUser = $_ENV['DB_ADMIN_USER'];
    $dbPass = $_ENV['DB_ADMIN_PASS'];
    $dbName = $_ENV['DB_ADMIN_NAME'];
} else {
    // Sử dụng thông tin cho Public
    $dbHost = $_ENV['DB_PUBLIC_HOST'];
    $dbUser = $_ENV['DB_PUBLIC_USER'];
    $dbPass = $_ENV['DB_PUBLIC_PASS'];
    $dbName = $_ENV['DB_PUBLIC_NAME'];
}

// Tiến hành kết nối PDO với các biến đã chọn ($dbHost, $dbUser, ...)
$dsn = "mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4";
// ... (code kết nối PDO)
Bằng cách này, bạn có thể quản lý các tài khoản database khác nhau dựa trên biến môi trường và sử dụng chúng trong các phần khác nhau của ứng dụng.