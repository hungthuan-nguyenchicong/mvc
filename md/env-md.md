## env

Hoàn toàn có thể code tay (tự viết hàm PHP) để phân tích cú pháp file .env mà không cần dùng thư viện như vlucas/phpdotenv. Tuy nhiên, có một số điểm bạn cần cân nhắc về độ phức tạp và khả năng xử lý các trường hợp ngoại lệ.

Viết code tay sẽ giúp bạn hiểu rõ hơn cách thức hoạt động của một trình phân tích cú pháp .env đơn giản.

Cách code tay để đọc file .env trong PHP
Bạn có thể tạo một hàm đơn giản để đọc file .env, phân tích từng dòng và đặt các biến vào $_ENV hoặc $_SERVER (hoặc cả hai).

1. Tạo file .env
Ví dụ file .env của bạn nằm ở thư mục gốc của dự án:

APP_ENV=development
DB_HOST="localhost"
DB_NAME=my_app_db
DB_USER=dev_user
DB_PASSWORD='my_secret_password_with_spaces'
PORT=8080
DEBUG=true
2. Viết hàm PHP để đọc .env
Bạn có thể đặt hàm này vào một file riêng (ví dụ: app/Helpers/EnvLoader.php) và sau đó include nó vào bootstrap của ứng dụng, hoặc đặt trực tiếp vào file bootstrap của bạn.

PHP

<?php
// app/Helpers/EnvLoader.php (hoặc file bootstrap của bạn)

/**
 * Tải các biến môi trường từ file .env vào $_ENV và $_SERVER.
 *
 * @param string $filePath Đường dẫn tuyệt đối đến thư mục chứa file .env.
 * @param string $fileName Tên file .env (mặc định là '.env').
 * @return void
 */
function loadEnv($filePath, $fileName = '.env') {
    $envFile = rtrim($filePath, '/') . '/' . $fileName;

    if (!file_exists($envFile)) {
        // Có thể ném ngoại lệ hoặc ghi log nếu file không tồn tại
        // error_log("Error: .env file not found at " . $envFile);
        return;
    }

    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    foreach ($lines as $line) {
        // Bỏ qua các dòng comment
        $line = trim($line);
        if (empty($line) || str_starts_with($line, '#')) {
            continue;
        }

        // Tách khóa và giá trị
        $parts = explode('=', $line, 2); // Giới hạn 2 phần để xử lý giá trị có dấu '='

        if (count($parts) === 2) {
            $key = trim($parts[0]);
            $value = trim($parts[1]);

            // Xử lý giá trị trong dấu nháy đơn hoặc nháy kép
            if (str_starts_with($value, "'") && str_ends_with($value, "'")) {
                $value = substr($value, 1, -1);
            } elseif (str_starts_with($value, '"') && str_ends_with($value, '"')) {
                $value = substr($value, 1, -1);
                // Xử lý các ký tự escape trong chuỗi nháy kép (ví dụ: \n, \r, \t, \$)
                $value = str_replace(['\\n', '\\r', '\\t', '\\$'], ["\n", "\r", "\t", "$"], $value);
            }

            // Đặt biến vào $_ENV và $_SERVER
            // Sử dụng putenv() để biến có sẵn cho getenv()
            putenv("{$key}={$value}");
            $_ENV[$key] = $value;
            $_SERVER[$key] = $value;
        }
    }
}
3. Gọi hàm loadEnv trong Bootstrap của ứng dụng
Giả sử file public/index.php là điểm vào chính của bạn, và file .env nằm ở thư mục cha (../.env).

PHP

<?php
// public/index.php

// Đường dẫn tới thư mục gốc dự án (chứa file .env)
$projectRoot = __DIR__ . '/../';

// Bao gồm file chứa hàm loadEnv (nếu bạn đặt nó ở file riêng)
require_once $projectRoot . 'app/Helpers/EnvLoader.php';

// Tải các biến môi trường
loadEnv($projectRoot);

// --- Bây giờ, bạn có thể truy cập các biến môi trường ---
// var_dump(getenv('APP_ENV'));
// var_dump($_ENV['DB_HOST']);
// var_dump($_SERVER['DB_PASSWORD']);

// Ví dụ về việc sử dụng biến APP_ENV và VITE_DEV_SERVER_URL
$isDev = (getenv('APP_ENV') === 'development');
$viteDevServerUrl = getenv('VITE_DEV_SERVER_URL') ?: 'http://localhost:5173'; // Fallback nếu biến không có

// --- Phần còn lại của logic PHP của bạn để render HTML và nhúng Vite assets ---
// (Giống như đã thảo luận trước đây, sử dụng $isDev và $viteDevServerUrl)

// ... (Hàm vite_asset và cấu trúc HTML) ...
Ưu và nhược điểm của việc code tay đọc .env
Ưu điểm:
Không phụ thuộc bên ngoài: Bạn không cần cài đặt Composer hay bất kỳ thư viện nào, giảm bớt dependencies.
Hiểu rõ cơ chế: Bạn tự mình kiểm soát hoàn toàn logic đọc file, giúp bạn hiểu sâu hơn cách các biến môi trường được tải.
Dự án rất nhỏ: Đối với các dự án PHP rất nhỏ, đơn giản, chỉ có vài biến môi trường cơ bản, việc này có thể đủ.
Nhược điểm:
Thiếu các tính năng nâng cao: Thư viện như phpdotenv xử lý rất nhiều trường hợp phức tạp mà code tay đơn giản sẽ bỏ qua:
Nhiều loại dấu ngoáy: Xử lý các chuỗi có dấu nháy đơn, nháy kép, và chuỗi không có dấu nháy.
Giá trị trống: Khóa có giá trị rỗng.
Dòng trống và comment: Bỏ qua các dòng trống và dòng bắt đầu bằng #. (Đoạn code trên đã xử lý được một phần này).
Biến có khoảng trắng: Giá trị biến có khoảng trắng cần phải được bao bởi dấu nháy. (Code trên đã xử lý đơn giản).
Biến lồng nhau: Ví dụ: DB_URL=mysql://${DB_USER}:${DB_PASS}@${DB_HOST}.
Ký tự đặc biệt: Xử lý các ký tự escape như \n, \r, \t, \$, \#.
Các biến đã tồn tại: Quyết định ghi đè hay không ghi đè các biến môi trường đã được định nghĩa.
Validation: Kiểm tra xem tất cả các biến bắt buộc đã được khai báo hay chưa.
Môi trường thử nghiệm: Có các chế độ tải riêng cho môi trường thử nghiệm.
Dễ phát sinh lỗi: Việc tự viết và duy trì parser có thể dễ gây ra lỗi nếu cú pháp file .env không tuân thủ chính xác những gì parser của bạn mong đợi.
Tốn thời gian: Đối với các dự án lớn hơn, việc tự viết và kiểm thử một parser mạnh mẽ sẽ tốn nhiều thời gian hơn là sử dụng một thư viện đã được kiểm chứng.
Lời khuyên:

Mặc dù có thể code tay, nhưng việc sử dụng thư viện vlucas/phpdotenv vẫn được khuyến nghị mạnh mẽ, ngay cả với các dự án PHP thuần. Lý do là vì nó:

Đáng tin cậy: Đã được kiểm chứng và sử dụng rộng rãi, xử lý hầu hết các trường hợp phức tạp và tiêu chuẩn của file .env.
Dễ bảo trì: Bạn không phải lo lắng về việc code parser, chỉ cần sử dụng API của thư viện.
Hiệu quả: Được tối ưu hóa về hiệu suất.
Cài đặt đơn giản: Composer làm cho việc cài đặt và quản lý thư viện rất dễ dàng.
Tuy nhiên, nếu bạn chỉ muốn một giải pháp tối giản nhất cho vài biến đơn giản và muốn tránh Composer bằng mọi giá, thì hàm loadEnv ở trên là một điểm khởi đầu tốt để bạn tự viết parser của mình.

## hoc thêm biến môi trường

Tuyệt vời! Việc quản lý môi trường là rất quan trọng, và bạn hoàn toàn có thể tự code để xử lý ba môi trường cơ bản: development, production, và test trong PHP MVC thuần mà không cần thư viện.

1. Thiết lập Cấu trúc File .env
Để quản lý 3 môi trường, chúng ta sẽ sử dụng 3 file .env riêng biệt, mỗi file chứa cấu hình cho một môi trường. Bạn sẽ cần chỉ định file .env nào sẽ được tải.

Cấu trúc thư mục ví dụ:

my-php-project/
├── .env.development  # Cấu hình cho môi trường phát triển
├── .env.production   # Cấu hình cho môi trường sản phẩm
├── .env.test         # Cấu hình cho môi trường kiểm thử
├── public/
│   ├── index.php     # Điểm vào chính của ứng dụng
├── config/
│   └── app.php       # File cấu hình ứng dụng
├── app/
│   └── Helpers/
│       └── EnvLoader.php # File chứa hàm loadEnv()
└── .gitignore
Nội dung các file .env:

.env.development:

APP_ENV=development
DB_HOST=localhost
DB_NAME=dev_db
DB_USER=dev_user
DB_PASS=dev_pass
VITE_DEV_SERVER_URL=http://localhost:5173
.env.production:

APP_ENV=production
DB_HOST=your_prod_db_host
DB_NAME=prod_db
DB_USER=prod_user
DB_PASS=your_strong_prod_pass
VITE_DEV_SERVER_URL=
.env.test:

APP_ENV=test
DB_HOST=localhost
DB_NAME=test_db
DB_USER=test_user
DB_PASS=test_pass
VITE_DEV_SERVER_URL=
2. Hàm loadEnv nâng cao (trong app/Helpers/EnvLoader.php)
Chúng ta sẽ điều chỉnh hàm loadEnv để nó nhận vào tên môi trường và tải file .env.{env_name} tương ứng.

PHP

<?php
// app/Helpers/EnvLoader.php

/**
 * Tải các biến môi trường từ file .env.{envName} hoặc .env (mặc định)
 * vào $_ENV và $_SERVER.
 *
 * @param string $projectRoot Đường dẫn tuyệt đối đến thư mục gốc của dự án (chứa các file .env).
 * @param string $envName Tên môi trường (e.g., 'development', 'production', 'test').
 * Nếu rỗng, sẽ cố gắng tìm file .env (mặc định).
 * @return void
 */
function loadEnv(string $projectRoot, string $envName = ''): void
{
    $envFileName = '.env';
    if (!empty($envName)) {
        $envFileName .= '.' . $envName;
    }

    $envFile = rtrim($projectRoot, '/') . '/' . $envFileName;

    if (!file_exists($envFile) || !is_readable($envFile)) {
        // Có thể ném ngoại lệ hoặc ghi log nếu file không tồn tại/không đọc được
        error_log("Error: .env file not found or not readable at " . $envFile);
        return;
    }

    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    foreach ($lines as $line) {
        $line = trim($line);
        // Bỏ qua các dòng comment và dòng trống
        if (empty($line) || str_starts_with($line, '#')) {
            continue;
        }

        $parts = explode('=', $line, 2);

        if (count($parts) === 2) {
            $key = trim($parts[0]);
            $value = trim($parts[1]);

            // Xử lý giá trị trong dấu nháy đơn hoặc nháy kép
            if (str_starts_with($value, "'") && str_ends_with($value, "'")) {
                $value = substr($value, 1, -1);
            } elseif (str_starts_with($value, '"') && str_ends_with($value, '"')) {
                $value = substr($value, 1, -1);
                // Xử lý các ký tự escape trong chuỗi nháy kép
                $value = str_replace(['\\n', '\\r', '\\t', '\\$'], ["\n", "\r", "\t", "$"], $value);
            }

            // Đặt biến vào $_ENV và $_SERVER
            // putenv() giúp getenv() có thể truy cập
            putenv("{$key}={$value}");
            $_ENV[$key] = $value;
            $_SERVER[$key] = $value;
        }
    }
}
3. Quản lý Môi trường trong public/index.php
Đây là nơi bạn sẽ quyết định môi trường nào đang hoạt động. Có nhiều cách để làm điều này:

Phương pháp A: Dựa vào Biến Môi trường của Server
Đây là cách phổ biến nhất và mạnh mẽ nhất cho môi trường Production/Staging, nơi bạn có thể thiết lập biến môi trường ở cấp độ server (Nginx/Apache/Docker).

Ví dụ cấu hình Nginx (cho Production/Staging):

Nginx

server {
    listen 80;
    server_name your_domain.com;
    root /var/www/html/my-php-project/public;

    # Set environment variable for PHP-FPM
    fastcgi_param APP_ENV production; # <-- Thêm dòng này cho môi trường production
    # fastcgi_param APP_ENV development; # <-- Hoặc dòng này cho môi trường development

    # ... các cấu hình khác ...
}
Và trong public/index.php:

PHP

<?php
// public/index.php

require_once __DIR__ . '/../app/Helpers/EnvLoader.php';

// Xác định môi trường dựa vào biến môi trường của server
// Mặc định là 'development' nếu không được đặt
$currentEnv = getenv('APP_ENV') ?: 'development';

// Tải các biến môi trường cho môi trường hiện tại
loadEnv(__DIR__ . '/../', $currentEnv);

// Bây giờ bạn có thể truy cập các biến môi trường
// echo getenv('APP_ENV');
// echo getenv('DB_HOST');

// Cấu hình Vite assets dựa trên môi trường
$isDev = (getenv('APP_ENV') === 'development');
$viteDevServerUrl = getenv('VITE_DEV_SERVER_URL') ?: 'http://localhost:5173'; // Fallback nếu biến không có

// ... (phần còn lại của hàm vite_asset và HTML) ...
Ưu điểm:

Chắc chắn và bảo mật: Môi trường được xác định bởi server, khó bị giả mạo.
Tách biệt cấu hình: Các cài đặt nhạy cảm không nằm trong code.
Nhược điểm:

Yêu cầu quyền truy cập và cấu hình server (Nginx/Apache/Docker).
Khó khăn hơn khi chuyển đổi nhanh giữa các môi trường trong quá trình phát triển cục bộ mà không cần sửa cấu hình server.
Phương pháp B: Dựa vào Tên Host (Hostname) cho môi trường phát triển cục bộ
Đây là một cách phổ biến để tự động phát hiện môi trường development khi bạn làm việc trên máy cục bộ.

Và trong public/index.php:

PHP

<?php
// public/index.php

require_once __DIR__ . '/../app/Helpers/EnvLoader.php';

// Mặc định là 'production'
$currentEnv = 'production';

// Kiểm tra hostname để xác định môi trường phát triển
$localHostnames = ['localhost', '127.0.0.1', 'my-dev-domain.test']; // Thêm các hostname dev của bạn vào đây
if (isset($_SERVER['HTTP_HOST']) && in_array($_SERVER['HTTP_HOST'], $localHostnames)) {
    $currentEnv = 'development';
}

// Nếu muốn môi trường 'test' cụ thể, có thể thêm một điều kiện nữa, ví dụ:
// if (isset($_SERVER['HTTP_HOST']) && $_SERVER['HTTP_HOST'] === 'test.my-domain.com') {
//     $currentEnv = 'test';
// }

// Tải các biến môi trường cho môi trường hiện tại
loadEnv(__DIR__ . '/../', $currentEnv);

// ... (phần còn lại của logic PHP của bạn để render HTML và nhúng Vite assets) ...
Ưu điểm:

Tự động chuyển đổi sang dev mode khi bạn truy cập bằng localhost.
Không cần cấu hình server phức tạp cho dev mode.
Nhược điểm:

Dựa vào hostname có thể không hoàn hảo cho mọi trường hợp (ví dụ: chia sẻ môi trường dev trên mạng nội bộ).
Không hoàn toàn tường minh về môi trường test nếu bạn không có hostname riêng.
Phương pháp C: Sử dụng một file Cờ (Flag file) cho môi trường test hoặc tạm thời
Để kích hoạt môi trường test hoặc một môi trường tạm thời, bạn có thể tạo một file cờ cụ thể.

Và trong public/index.php:

PHP

<?php
// public/index.php

require_once __DIR__ . '/../app/Helpers/EnvLoader.php';

// Mặc định là 'production'
$currentEnv = 'production';

// Kiểm tra hostname cho dev mode
$localHostnames = ['localhost', '127.0.0.1'];
if (isset($_SERVER['HTTP_HOST']) && in_array($_SERVER['HTTP_HOST'], $localHostnames)) {
    $currentEnv = 'development';
}

// Kiểm tra sự tồn tại của file cờ cho test mode (ví dụ: .testmode)
// Bạn sẽ tạo/xóa file này thủ công hoặc qua script CI/CD
if (file_exists(__DIR__ . '/../.testmode')) {
    $currentEnv = 'test';
}

// Tải các biến môi trường cho môi trường hiện tại
loadEnv(__DIR__ . '/../', $currentEnv);

// ... (phần còn lại của logic PHP của bạn để render HTML và nhúng Vite assets) ...
Ưu điểm:

Rất linh hoạt để kích hoạt các môi trường cụ thể bằng cách tạo một file đơn giản.
Nhược điểm:

Cần nhớ tạo/xóa file cờ.
4. Tổng kết và Lời khuyên
Để quản lý 3 môi trường cơ bản (development, production, test) trong PHP MVC thuần:

Sử dụng các file .env.{env_name} để chứa cấu hình cho từng môi trường.
Dùng hàm loadEnv() (đã cải tiến) để đọc file .env tương ứng.
Xác định $currentEnv trong public/index.php bằng một trong các phương pháp trên (hoặc kết hợp chúng) để quyết định file .env nào sẽ được tải.
Lời khuyên cho bạn:

Để production: Luôn xác định APP_ENV=production ở cấp độ máy chủ (Nginx fastcgi_param, Apache SetEnv, hoặc trong cấu hình Docker). Đây là cách an toàn và tin cậy nhất.
Để development: Dùng phương pháp kiểm tra hostname (localhost, 127.0.0.1) để tự động kích hoạt development mode khi bạn làm việc cục bộ.
Để test: Nếu bạn có một môi trường kiểm thử riêng biệt, lý tưởng nhất là xác định APP_ENV=test ở cấp độ server cho môi trường đó. Nếu không thể, bạn có thể dùng file cờ (.testmode) hoặc một hostname cụ thể cho môi trường test.
Bằng cách này, bạn sẽ có một hệ thống quản lý môi trường mạnh mẽ và linh hoạt cho dự án PHP MVC thuần của mình!