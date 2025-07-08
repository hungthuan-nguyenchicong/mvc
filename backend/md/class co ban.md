# Tuyệt vời! Tiếp tục với chủ đề namespace và use là rất quan trọng để tổ chức code trong các dự án lớn như MVC.

Với cấu trúc Controller.php -> class Controller và AdminController -> class extends Controller, đây là cách bạn nên đặt namespace và use các class:

1. Xác định cấu trúc thư mục và Namespace
Trước tiên, hãy xác định cách bạn tổ chức các file Controller trong thư mục. Một cấu trúc phổ biến là:

src/
├── Controller/
│   ├── Controller.php         <-- Base Controller
│   └── AdminController.php    <-- Extends Base Controller
└── Model/
│   └── User.php
└── ... (các modules khác)
Dựa trên cấu trúc này, chúng ta sẽ ánh xạ chúng tới các namespace trong composer.json (sử dụng PSR-4). Giả sử src/ ánh xạ tới namespace App\ (hoặc một namespace chung nào đó cho ứng dụng của bạn, ví dụ YourApp\).

Ví dụ composer.json (trong thư mục gốc của dự án, hoặc thư mục backend của bạn):

JSON

{
    "autoload": {
        "psr-4": {
            "App\\": "src/" // Ánh xạ namespace App\ tới thư mục src/
        }
    }
}
Sau khi thêm hoặc thay đổi composer.json, bạn cần chạy composer dump-autoload (hoặc composer install/composer update).

2. Định nghĩa Base Controller (Controller.php)
File: src/Controller/Controller.php

PHP

<?php

namespace App\Controller; // Controller.php nằm trong thư mục src/Controller/ nên namespace là App\Controller

class Controller // Đây là base class cho các controller khác
{
    // Constructor chung, các phương thức chung, properties chung
    // Ví dụ: view rendering, common helper methods
    public function __construct()
    {
        // ...
    }

    protected function render(string $template, array $data = []): string
    {
        // Ví dụ một hàm render template cơ bản
        // return 'Rendering ' . $template . ' with data: ' . json_encode($data);
        return "Rendering template: {$template}";
    }
}
3. Định nghĩa Admin Controller (AdminController.php)
File: src/Controller/AdminController.php

PHP

<?php

namespace App\Controller; // AdminController.php cũng nằm trong thư mục src/Controller/ nên namespace là App\Controller

// Vì AdminController muốn kế thừa từ App\Controller\Controller,
// và cả hai đều nằm trong cùng namespace App\Controller,
// nên không cần 'use' statement cho Controller ở đây.
// Tuy nhiên, thêm 'use' cho rõ ràng cũng không sai.

// Cách 1: Không cần 'use' vì cùng namespace
class AdminController extends Controller
{
    public function __construct()
    {
        parent::__construct(); // Luôn gọi constructor của class cha nếu bạn định nghĩa constructor riêng
        // ...
    }

    public function index()
    {
        return $this->render('admin/dashboard.html.twig', ['title' => 'Admin Dashboard']);
    }

    public function manageUsers()
    {
        return $this->render('admin/users.html.twig');
    }
}

/*
// Cách 2: Có thể thêm 'use' cho rõ ràng (cũng không sai, nhưng thường không cần)
// use App\Controller\Controller; // Dòng này có thể thêm vào, nhưng không bắt buộc
// class AdminController extends Controller
// {
//     // ...
// }
*/
4. Cách sử dụng các Controller từ bên ngoài (ví dụ: index.php hoặc Router)
File: public/index.php (hoặc file router chính của bạn)

PHP

<?php

// 1. Tải Composer autoloader
require __DIR__ . '/../vendor/autoload.php'; // Hoặc đường dẫn phù hợp với project của bạn

// 2. Sử dụng các Controller bạn muốn truy cập
use App\Controller\Controller;       // Nếu bạn muốn dùng Controller trực tiếp (ít phổ biến)
use App\Controller\AdminController;  // Quan trọng: Sử dụng AdminController

// 3. Khởi tạo và gọi phương thức
$adminController = new AdminController();
$output = $adminController->index();
echo $output;

echo "\n";

// Bạn cũng có thể khởi tạo Base Controller nếu cần
// $baseController = new Controller();
// echo $baseController->render('base/page.html');
Giải thích nguyên tắc:
Namespace (Không gian tên):

namespace dùng để nhóm các class, interface, function và constant lại với nhau để tránh xung đột tên.

Mỗi file PHP thường chỉ nên có một khai báo namespace ở đầu file (ngay sau <?php).

namespace thường được đặt theo cấu trúc thư mục của file đó, tuân theo quy ước PSR-4.

Use Statement:

use dùng để "nhập" một class, interface, trait, hoặc function từ một namespace khác vào namespace hiện tại, cho phép bạn gọi chúng bằng tên ngắn gọn (alias).

Khi nào cần use?

Khi bạn muốn sử dụng một class từ một namespace khác với namespace của file hiện tại.

Khi bạn kế thừa (extends) hoặc triển khai (implements) một class/interface từ một namespace khác.

Khi nào không cần use?

Khi bạn sử dụng một class nằm cùng trong namespace hiện tại của file đó. (Như ví dụ AdminController extends Controller ở trên, vì cả hai đều là App\Controller).

Khi bạn gọi một class bằng tên đầy đủ của nó (fully qualified name), ví dụ: new \App\Controller\AdminController(); (nhưng việc này làm code dài dòng).

Tóm lại:

Đặt namespace cho mỗi file class dựa trên vị trí của nó trong thư mục (theo quy ước PSR-4).

Sử dụng use statement khi bạn cần tham chiếu đến một class từ một namespace khác.

Trong trường hợp của AdminController extends Controller, vì chúng nằm trong cùng một namespace (App\Controller), bạn không bắt buộc phải use App\Controller\Controller; trong AdminController.php, nhưng việc thêm nó cũng không gây hại và có thể giúp đọc code rõ ràng hơn cho một số người.