## Namespace

Chắc chắn rồi! Namespace trong PHP là một tính năng cực kỳ quan trọng giúp tổ chức code, tránh xung đột tên giữa các lớp, hàm và hằng số, đặc biệt khi bạn làm việc với các thư viện bên thứ ba hoặc dự án lớn.

1. Namespace là gì?
Hãy hình dung thư mục máy tính của bạn. Bạn có thể có nhiều tệp tin cùng tên ở các thư mục khác nhau (ví dụ: /documents/report.doc và /images/report.jpg). Namespace trong PHP hoạt động tương tự: nó cung cấp một "không gian tên" để nhóm các phần tử liên quan (lớp, interface, trait, hàm, hằng số) lại với nhau, cho phép bạn sử dụng cùng một tên cho các phần tử khác nhau miễn là chúng ở trong các namespace khác nhau.

Mục đích chính:

Tránh xung đột tên (name collision): Khi bạn sử dụng nhiều thư viện khác nhau, có khả năng hai thư viện định nghĩa hai lớp có cùng tên (ví dụ: Logger). Namespace giúp phân biệt chúng (ví dụ: Monolog\Logger và Psr\Log\Logger).

Tổ chức code: Giúp cấu trúc code của bạn một cách logic, dễ đọc và dễ bảo trì hơn.

2. Cách khai báo Namespace
Bạn khai báo namespace ở đầu tệp PHP bằng từ khóa namespace.

Cú pháp cơ bản:

PHP

<?php

namespace MyProject\Database; // Khai báo namespace cho tệp này

class Connection
{
    // ...
}

function connect()
{
    // ...
}

const DSN = 'mysql:host=localhost';

?>
Một tệp PHP chỉ nên có một khai báo namespace.

Tuyên bố namespace phải là câu lệnh đầu tiên trong tệp PHP, ngoại trừ khai báo declare (ví dụ: declare(strict_types=1);).

3. Cách sử dụng các phần tử trong Namespace
Có một vài cách để sử dụng các lớp, hàm, hằng số từ một namespace khác.

a. Sử dụng tên đầy đủ (Fully Qualified Name)
Đây là cách an toàn nhất nhưng cũng dài nhất. Bạn bao gồm toàn bộ đường dẫn namespace từ gốc.

PHP

<?php

require __DIR__ . '/vendor/autoload.php'; // Đảm bảo Composer autoloader đã được tải

// Giả sử có một lớp Connection trong namespace MyProject\Database
// và Dotenv\Dotenv từ thư viện vlucas/phpdotenv

$dbConnection = new MyProject\Database\Connection(); // Sử dụng tên đầy đủ
$dotenv = new Dotenv\Dotenv(); // Sử dụng tên đầy đủ
?>
b. Sử dụng từ khóa use (Recommended)
Từ khóa use cho phép bạn "nhập" một namespace hoặc một lớp cụ thể vào phạm vi hiện tại, giúp bạn có thể sử dụng tên ngắn hơn sau đó.

PHP

<?php

require __DIR__ . '/vendor/autoload.php';

use MyProject\Database\Connection; // Nhập lớp Connection
use Dotenv\Dotenv;                 // Nhập lớp Dotenv
use Dotenv\Exception\ValidationException; // Nhập lớp ngoại lệ cụ thể

// Có thể nhóm nhiều "use" cùng namespace:
// use MyProject\Database\{Connection, QueryBuilder};

// Có thể đặt alias nếu có xung đột tên hoặc muốn tên ngắn hơn:
// use MyProject\Database\Connection as DBConnection;

$dbConnection = new Connection(); // Sử dụng tên ngắn gọn sau khi đã "use"
$dotenv = Dotenv::createImmutable(__DIR__); // Sử dụng tên ngắn gọn

try {
    // ...
} catch (ValidationException $e) { // Sử dụng tên ngắn gọn cho ngoại lệ
    echo "Lỗi: " . $e->getMessage();
}

// Nếu dùng alias
// $anotherConnection = new DBConnection();
?>
c. Sử dụng trong cùng một Namespace
Nếu bạn đang ở trong một namespace và muốn sử dụng một lớp/hàm/hằng số khác trong cùng namespace đó, bạn chỉ cần gọi tên ngắn gọn.

src/MyProject/Database/Connection.php

PHP

<?php

namespace MyProject\Database;

class Connection
{
    public function __construct()
    {
        echo "Kết nối database đã được tạo.\n";
    }
}
src/MyProject/Database/QueryBuilder.php

PHP

<?php

namespace MyProject\Database;

class QueryBuilder
{
    public function __construct()
    {
        // Có thể sử dụng Connection trực tiếp vì nó cùng namespace
        $connection = new Connection();
        echo "Query builder đã được khởi tạo.\n";
    }
}
index.php

PHP

<?php

require __DIR__ . '/vendor/autoload.php';

use MyProject\Database\QueryBuilder; // Chỉ cần nhập QueryBuilder

$builder = new QueryBuilder(); // QueryBuilder sẽ tự động gọi Connection
?>
4. Cấu trúc thư mục và Namespace (PSR-4)
Cách tốt nhất để sử dụng namespace là tuân thủ chuẩn PSR-4 autoloading, mà Composer hỗ trợ rất tốt.

Nguyên tắc chính của PSR-4:

Mỗi namespace cấp cao nhất (top-level namespace) tương ứng với một thư mục gốc.

Mỗi dấu gạch chéo ngược (\) trong namespace tương ứng với một thư mục con.

Tên lớp phải khớp với tên tệp PHP chứa nó.

Ví dụ:

Giả sử bạn có cấu trúc thư mục và namespace như sau:

my_php_app/
├── composer.json
├── index.php
├── src/
│   ├── MyApp/           <- Tương ứng với namespace MyApp\
│   │   ├── Models/      <- Tương ứng với namespace MyApp\Models\
│   │   │   └── User.php
│   │   └── Controllers/ <- Tương ứng với namespace MyApp\Controllers\
│   │       └── HomeController.php
└── vendor/
    └── autoload.php
Nội dung composer.json:

Để Composer biết cách autoload các lớp trong src/MyApp/, bạn thêm phần autoload vào composer.json của dự án bạn:

JSON

{
    "require": {
        "vlucas/phpdotenv": "^5.6"
    },
    "autoload": {
        "psr-4": {
            "MyApp\\": "src/MyApp/" // Ánh xạ namespace MyApp\ tới thư mục src/MyApp/
        }
    }
}
Sau khi sửa đổi composer.json, hãy chạy:

Bash

composer dump-autoload
Lệnh này sẽ cập nhật autoloader của Composer để nó biết cách tìm các lớp trong namespace MyApp\.

Nội dung các tệp PHP:

src/MyApp/Models/User.php

PHP

<?php

namespace MyApp\Models; // Namespace đầy đủ cho lớp này

class User
{
    public function getName()
    {
        return "John Doe";
    }
}
src/MyApp/Controllers/HomeController.php

PHP

<?php

namespace MyApp\Controllers; // Namespace đầy đủ cho lớp này

use MyApp\Models\User; // Nhập lớp User từ namespace khác

class HomeController
{
    public function index()
    {
        $user = new User();
        echo "Xin chào từ HomeController! Người dùng: " . $user->getName() . "\n";
    }
}
index.php (tệp chính của ứng dụng)

PHP

<?php

require __DIR__ . '/vendor/autoload.php'; // Tải autoloader của Composer

use MyApp\Controllers\HomeController; // Nhập HomeController

$controller = new HomeController();
$controller->index();
?>
5. Các lưu ý thêm
Namespace toàn cục: Nếu bạn không khai báo namespace trong một tệp, các lớp/hàm/hằng số trong tệp đó sẽ nằm trong namespace toàn cục (global namespace). Để tham chiếu các phần tử trong global namespace từ một namespace khác, bạn có thể tiền tố bằng \ (ví dụ: new \DateTime();).

Hàm và Hằng số trong Namespace: Không chỉ lớp, interface, trait, mà cả hàm và hằng số cũng có thể nằm trong namespace.

PHP

namespace MyProject\Helpers;

function greet($name) {
    return "Hello, " . $name;
}

const PI = 3.14;
Để sử dụng:

PHP

use function MyProject\Helpers\greet;
use const MyProject\Helpers\PI;

echo greet("World") . "\n";
echo PI . "\n";
Tránh lẫn lộn use và namespace:

namespace khai báo namespace của tệp hiện tại.

use nhập các lớp/hàm/hằng số từ namespace khác vào phạm vi hiện tại để sử dụng tên ngắn gọn.

Bằng cách sử dụng namespace một cách nhất quán và tuân thủ PSR-4 với Composer, bạn sẽ có một cấu trúc dự án PHP sạch sẽ, dễ mở rộng và dễ làm việc với các thư viện khác. Bạn có muốn thử tạo một cấu trúc dự án nhỏ với namespace không?

## psr-4

thêm
"autoload": {
        "psr-4": {
            "MyApp\\": "src/MyApp/"
        }
    }

composer dump-autoload