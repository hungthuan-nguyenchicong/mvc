## tham khảo

Chắc chắn rồi! Nếu bạn đang sử dụng shared hosting và không có quyền truy cập vào file cấu hình Nginx (hoặc Apache/LiteSpeed global config), bạn cần sử dụng file .htaccess để đạt được hiệu quả tương tự.

Tuy nhiên, có một số điểm quan trọng cần lưu ý:

Nginx không hỗ trợ .htaccess: Nginx không đọc file .htaccess. Nếu shared host của bạn sử dụng Nginx, bạn không thể dùng .htaccess để cấu hình rewrite/routing. Trong trường hợp này, bạn phải yêu cầu nhà cung cấp hosting hỗ trợ cấu hình hoặc chuyển sang hosting có hỗ trợ Nginx configuration/server block tùy chỉnh.
Apache và LiteSpeed hỗ trợ .htaccess: Cả Apache và LiteSpeed đều hỗ trợ .htaccess. LiteSpeed được thiết kế để tương thích cao với .htaccess của Apache.
Giả sử hosting của bạn dùng Apache hoặc LiteSpeed, đây là cách bạn có thể cấu hình file .htaccess để đạt được mục tiêu của bạn (có hai điểm vào riêng biệt cho client và admin).

Cấu hình .htaccess cho Apache/LiteSpeed
Bạn sẽ cần hai file .htaccess: một trong thư mục public/ và một trong thư mục admin/.

Cấu trúc thư mục (nhắc lại):

mvc/
├── App/
├── Core/
├── public/                <-- Public folder cho Client
│   ├── .htaccess         <-- .htaccess cho Client
│   └── index.php         <-- Entry point cho Client
└── admin/                 <-- Public folder cho Admin
    ├── .htaccess         <-- .htaccess cho Admin
    └── index.php         <-- Entry point cho Admin
1. File mvc/public/.htaccess (cho Client/Frontend)
File này sẽ nằm trong thư mục public/ và sẽ xử lý tất cả các yêu cầu không phải /admin.

Apache

# mvc/public/.htaccess

<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase / # Hoặc đường dẫn gốc của ứng dụng của bạn nếu không phải root domain. Ví dụ: /my-app/

    # Ngăn chặn truy cập các file ẩn (.htaccess, .env, .git, v.v.)
    RewriteRule "^\." - [F,L]

    # Ngăn chặn truy cập các thư mục nhạy cảm bên ngoài public (nếu có)
    # Ví dụ: nếu App, Core nằm cùng cấp với public
    RewriteRule "^(App|Core)/" - [F,L]

    # Kiểm tra xem yêu cầu có phải là file hoặc thư mục tồn tại không
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    
    # Nếu không phải file/thư mục, chuyển hướng tất cả các yêu cầu đến index.php
    # Ngoại trừ các yêu cầu bắt đầu bằng /admin
    RewriteCond %{REQUEST_URI} !^/admin(/.*)?$ [NC] # Đảm bảo không xử lý /admin
    RewriteRule ^(.*)$ index.php [L]
</IfModule>

# Cấu hình PHP (tùy chọn, tùy vào host của bạn)
# <IfModule mod_php7.c>
#   php_value display_errors On
#   php_value upload_max_filesize 100M
#   php_value post_max_size 100M
# </IfModule>
Giải thích:

RewriteEngine On: Bật module rewrite.
RewriteBase /: Đặt thư mục gốc cho các quy tắc rewrite. Rất quan trọng trên shared hosting.
RewriteCond %{REQUEST_FILENAME} !-f và RewriteCond %{REQUEST_FILENAME} !-d: Kiểm tra xem yêu cầu có khớp với một file hoặc thư mục vật lý tồn tại không.
RewriteCond %{REQUEST_URI} !^/admin(/.*)?$ [NC]: Quan trọng! Quy tắc này đảm bảo rằng các yêu cầu bắt đầu bằng /admin sẽ không được xử lý bởi file .htaccess này. Nó sẽ được chuyển đến thư mục gốc của webserver và hy vọng được xử lý bởi .htaccess trong thư mục admin/ của bạn.
RewriteRule ^(.*)$ index.php [L]: Nếu không phải file/thư mục và không phải /admin, chuyển hướng tất cả các yêu cầu đến index.php.
2. File mvc/admin/.htaccess (cho Admin/Backend)
File này sẽ nằm trong thư mục admin/ và sẽ xử lý tất cả các yêu cầu bắt đầu bằng /admin.

Apache

# mvc/admin/.htaccess

<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /admin/ # Rất quan trọng! Đặt base là /admin/

    # Ngăn chặn truy cập các file ẩn
    RewriteRule "^\." - [F,L]

    # Kiểm tra xem yêu cầu có phải là file hoặc thư mục tồn tại không
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    
    # Nếu không phải file/thư mục, chuyển hướng tất cả các yêu cầu đến index.php trong thư mục admin
    RewriteRule ^(.*)$ index.php [L]
</IfModule>

# Cấu hình PHP (tùy chọn)
# <IfModule mod_php7.c>
#   php_value display_errors On
# </IfModule>
Giải thích:

RewriteBase /admin/: Đây là điểm khác biệt chính. Nó nói rằng các quy tắc rewrite trong file này áp dụng cho các URI bắt đầu bằng /admin/.
RewriteRule ^(.*)$ index.php [L]: Bất kỳ yêu cầu nào đến /admin/... mà không khớp với file/thư mục vật lý nào trong thư mục admin/ sẽ được chuyển hướng đến index.php trong chính thư mục admin/.
Thay đổi trong PHP
public/index.php:

Sẽ gọi RouteClient.php (hoặc logic client trực tiếp).
URL $_SERVER['REQUEST_URI'] sẽ là / hoặc /some-client-route.
Bạn cần đảm bảo đường dẫn require_once đến RouteClient.php là chính xác từ public/index.php.
admin/index.php:

Đây là file index.php nằm trong thư mục admin/.
Nó sẽ gọi RouteAdmin.php (hoặc logic admin trực tiếp).
Quan trọng: Khi request được rewrite đến admin/index.php thông qua .htaccess, $this->uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH); vẫn sẽ trả về URI gốc, ví dụ /admin/login. Router trong RouteAdmin.php của bạn sẽ cần xử lý URI này.
Bạn cần đảm bảo đường dẫn require_once đến RouteAdmin.php là chính xác từ admin/index.php.
Ví dụ file admin/index.php:

PHP

<?php
// admin/index.php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Đường dẫn đến RouteAdmin.php (giả sử nằm trong mvc/Core/)
require_once __DIR__ . '/../Core/RouteAdmin.php'; 

// Khởi tạo router Admin
new RouteAdmin();
?>
Các bước triển khai trên Shared Hosting
Tải file .htaccess lên: Tạo hai file .htaccess với nội dung trên và tải chúng vào thư mục public/ và admin/ của bạn.
Tải file index.php: Đảm bảo public/index.php và admin/index.php đã được cập nhật với logic require_once của bạn.
Tải các file Route và Controller: Đảm bảo Core/RouteClient.php, Core/RouteAdmin.php, App/Controllers/ClientController.php, App/Controllers/AdminController.php (và các file khác) được tải lên đúng vị trí.
Kiểm tra đường dẫn require_once: Hãy kiểm tra kỹ lưỡng các đường dẫn tương đối trong PHP (ví dụ: __DIR__ . '/../Core/RouteAdmin.php') để đảm bảo chúng trỏ đến đúng file sau khi đã triển khai lên hosting.
Truy cập URL:
http://yourdomain.com/ (hoặc /your-app/): Sẽ chạy public/index.php và router client.
http://yourdomain.com/admin/ (hoặc /your-app/admin/): Sẽ chạy admin/index.php và router admin.
http://yourdomain.com/admin/login: Sẽ chạy admin/index.php, và router admin của bạn sẽ nhận URI là /admin/login.
Lưu ý quan trọng:

Module mod_rewrite: Hosting của bạn phải bật module mod_rewrite cho Apache. Hầu hết các shared hosting đều bật sẵn.
AllowOverride: Thư mục của bạn trên host phải có AllowOverride All được cấu hình để Apache đọc .htaccess. Hầu hết shared hosting cũng đã thiết lập điều này.
LiteSpeed: LiteSpeed sẽ tự động đọc các file .htaccess tương tự như Apache.
Cách này phức tạp hơn một chút so với giải pháp Nginx đơn giản nhưng là cách chuẩn để xử lý routing trên shared hosting với Apache/LiteSpeed.

## ver 2

Nếu bạn đặt toàn bộ cấu trúc mvc/ vào thư mục html/ và muốn html/.htaccess xử lý việc điều hướng mặc định tới public/, đồng thời vẫn giữ hai thư mục public/ và admin/ riêng biệt, thì có một số thay đổi đáng kể trong các file .htaccess.

Cấu trúc thư mục mới:

html/                          <-- Đây là web root của bạn
├── .htaccess                  <-- .htaccess chính ở đây
├── mvc/
│   ├── App/
│   ├── Core/
│   ├── public/                <-- Public folder cho Client
│   │   ├── .htaccess         <-- .htaccess con cho Client (sẽ đơn giản hơn)
│   │   └── index.php         <-- Entry point cho Client
│   └── admin/                 <-- Public folder cho Admin
│       ├── .htaccess         <-- .htaccess con cho Admin (sẽ đơn giản hơn)
│       └── index.php         <-- Entry point cho Admin
Trong cấu trúc này, html/ là thư mục gốc mà web server (Apache/LiteSpeed) trỏ đến.

Các file .htaccess cần thay đổi
1. File html/.htaccess (File .htaccess chính)
File này sẽ nằm ở thư mục gốc của web server (html/) và có nhiệm vụ:

Chuyển hướng các yêu cầu mặc định (ví dụ: http://yourdomain.com/) tới mvc/public/.
Chuyển hướng các yêu cầu /admin/ tới mvc/admin/.
Apache

# html/.htaccess

<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase / # Base của toàn bộ ứng dụng là root domain

    # Ngăn chặn truy cập các file/thư mục nhạy cảm ở cấp cao nhất
    # Nếu bạn có các file .env, .git ở ngoài thư mục html, hãy bảo vệ chúng!
    RewriteRule "^\.(env|git|svn|htacccess|htpasswd|json|yml|yaml)$" - [F,L]

    # Quy tắc đầu tiên: Nếu yêu cầu bắt đầu bằng /admin/ (hoặc chỉ /admin)
    # Rewrite nó sang thư mục mvc/admin/
    RewriteRule ^admin/?(.*)$ mvc/admin/$1 [L]

    # Quy tắc thứ hai: Mọi yêu cầu còn lại (không phải /admin)
    # Rewrite chúng sang thư mục mvc/public/
    # (Đảm bảo quy tắc này nằm SAU quy tắc /admin)
    RewriteRule ^(.*)$ mvc/public/$1 [L]
</IfModule>
Giải thích:

RewriteRule ^admin/?(.*)$ mvc/admin/$1 [L]: Khi có yêu cầu http://yourdomain.com/admin/something, Apache sẽ chuyển nó nội bộ thành http://yourdomain.com/mvc/admin/something.
RewriteRule ^(.*)$ mvc/public/$1 [L]: Mọi yêu cầu khác (ví dụ: http://yourdomain.com/some-page hoặc http://yourdomain.com/) sẽ được chuyển nội bộ thành http://yourdomain.com/mvc/public/some-page hoặc http://yourdomain.com/mvc/public/.
Thứ tự của các RewriteRule rất quan trọng. Quy tắc /admin/ phải đứng trước.
2. File html/mvc/public/.htaccess (File .htaccess cho Client)
File này sẽ đơn giản hơn rất nhiều vì html/.htaccess đã chuyển hướng đúng đến thư mục public/. File này chỉ cần xử lý routing trong phạm vi của public/.

Apache

# html/mvc/public/.htaccess

<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /mvc/public/ # Rất quan trọng! Base là đường dẫn thật đến public

    # Ngăn chặn truy cập các file ẩn bên trong public
    RewriteRule "^\." - [F,L]

    # Nếu yêu cầu không phải file hoặc thư mục tồn tại
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    
    # Chuyển hướng đến index.php trong thư mục public
    RewriteRule ^(.*)$ index.php [L]
</IfModule>
Giải thích:

RewriteBase /mvc/public/: Điều này nói với Apache rằng các quy tắc rewrite trong file này đang hoạt động trong ngữ cảnh của đường dẫn /mvc/public/.
Các quy tắc còn lại là chuẩn cho một framework PHP: chuyển hướng các yêu cầu không khớp với file/thư mục vật lý đến index.php.
3. File html/mvc/admin/.htaccess (File .htaccess cho Admin)
Tương tự như public/.htaccess, file này cũng sẽ đơn giản hơn.

Apache

# html/mvc/admin/.htaccess

<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /mvc/admin/ # Rất quan trọng! Base là đường dẫn thật đến admin

    # Ngăn chặn truy cập các file ẩn bên trong admin
    RewriteRule "^\." - [F,L]

    # Nếu yêu cầu không phải file hoặc thư mục tồn tại
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    
    # Chuyển hướng đến index.php trong thư mục admin
    RewriteRule ^(.*)$ index.php [L]
</IfModule>
Giải thích:

RewriteBase /mvc/admin/: Đặt base là đường dẫn vật lý đến thư mục admin/.
Các quy tắc còn lại tương tự như public/.htaccess.
Thay đổi trong PHP (giữ nguyên so với Giải pháp 1 trước đó)
public/index.php:

PHP

<?php
// html/mvc/public/index.php
// Đây là entry point cho client
require_once __DIR__ . '/../Core/RouteClient.php'; // Đường dẫn tương đối từ public/index.php
new RouteClient();
?>
admin/index.php:

PHP

<?php
// html/mvc/admin/index.php
// Đây là entry point cho admin
require_once __DIR__ . '/../Core/RouteAdmin.php'; // Đường dẫn tương đối từ admin/index.php
new RouteAdmin();
?>
Core/RouteClient.php và Core/RouteAdmin.php:

Logic của các router này vẫn không đổi.
parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH); sẽ vẫn trả về URI gốc mà người dùng đã gõ vào trình duyệt (ví dụ /some-client-route hoặc /admin/login), vì .htaccess thực hiện rewrite nội bộ chứ không phải redirect (không thay đổi URL trên trình duyệt). Điều này là tốt.
Đảm bảo đường dẫn require_once đến Controller trong các file Route này là chính xác từ vị trí của chúng.
Tóm tắt thay đổi và các bước triển khai
File html/.htaccess: Mới và quan trọng nhất, nó điều hướng các yêu cầu ban đầu.
File html/mvc/public/.htaccess: Đơn giản hơn, chỉ lo việc routing trong public/.
File html/mvc/admin/.htaccess: Đơn giản hơn, chỉ lo việc routing trong admin/.
Các file PHP (index.php, Route, Controller): Giữ nguyên logic routing, chỉ cần đảm bảo các đường dẫn require_once hoặc include là chính xác.
Các bước triển khai:

Upload toàn bộ thư mục mvc/ vào thư mục html/ của bạn trên shared host.
Tạo và tải lên file .htaccess vào thư mục html/.
Tạo và tải lên file .htaccess vào thư mục html/mvc/public/.
Tạo và tải lên file .htaccess vào thư mục html/mvc/admin/.
Truy cập:
http://yourdomain.com/ (hoặc http://yourdomain.com/some-client-route) sẽ chạy qua html/mvc/public/index.php.
http://yourdomain.com/admin/ (hoặc http://yourdomain.com/admin/login) sẽ chạy qua html/mvc/admin/index.php.
Cách này là cách thông thường để cấu hình các dự án MVC với các điểm vào khác nhau trên Apache/LiteSpeed bằng .htaccess.

## ver 3

Đúng, bạn có thể tạo một hiệu ứng tương tự alias của Nginx trong Apache/LiteSpeed bằng cách sử dụng module mod_rewrite và một quy tắc .htaccess. Tuy nhiên, cú pháp và cách hoạt động sẽ khác một chút so với alias của Nginx.

Mục tiêu của bạn là:

Khi truy cập /uploads/, nó sẽ trỏ đến html/mvc/public/uploads/ (tương tự alias của Nginx).
Admin có thể sử dụng đường dẫn URL /uploads/ để truy cập ảnh.
Để làm được điều này, bạn cần thêm một quy tắc vào file .htaccess chính của bạn (ở cấp html/.htaccess).

Cấu hình html/.htaccess để xử lý /uploads/
Bạn sẽ thêm một quy tắc RewriteRule mới vào file html/.htaccess của bạn. Quy tắc này phải được đặt trước các quy tắc điều hướng chung cho /admin/ và /public/.

Cấu trúc thư mục:

html/                          <-- Đây là web root của bạn
├── .htaccess                  <-- .htaccess chính ở đây (sẽ sửa đổi)
├── mvc/
│   ├── App/
│   ├── Core/
│   ├── public/                <-- Public folder cho Client
│   │   ├── .htaccess         <-- Không cần thay đổi
│   │   └── index.php
│   │   └── uploads/          <-- Nơi chứa ảnh
│   └── admin/                 <-- Public folder cho Admin
│       ├── .htaccess         <-- Không cần thay đổi
│       └── index.php
File html/.htaccess (đã sửa đổi):

Apache

# html/.htaccess

<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase / 

    # Ngăn chặn truy cập các thư mục nhạy cảm bên trong mvc/
    RewriteRule "^mvc/(App|Core)/" - [F,L]

    # --- Quy tắc điều hướng chính ---

    # 1. Quy tắc MỚI: Xử lý các yêu cầu đến /uploads/
    # Chuyển hướng /uploads/ten-file.jpg sang /mvc/public/uploads/ten-file.jpg
    # Quy tắc này phải đứng TRƯỚC các quy tắc /admin/ và public/
    RewriteRule "^uploads/(.*)$" "mvc/public/uploads/$1" [L]

    # 2. Nếu yêu cầu bắt đầu bằng /admin (ví dụ: yourdomain.com/admin/login)
    RewriteRule "^admin/?(.*)$" "mvc/admin/$1" [L]

    # 3. Mọi yêu cầu còn lại (không phải /uploads và không phải /admin)
    # Rewrite chúng sang thư mục mvc/public/
    RewriteRule "^(.*)$" "mvc/public/$1" [L]

</IfModule>

# Cấu hình PHP chung (tùy chọn)
# <IfModule mod_php7.c>
#   php_value display_errors On
# </IfModule>
Giải thích thay đổi:

RewriteRule "^uploads/(.*)$" "mvc/public/uploads/$1" [L]:
^uploads/(.*)$: Đây là regex khớp với bất kỳ URL nào bắt đầu bằng /uploads/ (ví dụ: /uploads/my-image.jpg, /uploads/subfolder/another-image.png). (.*) chụp lại phần còn lại của đường dẫn sau /uploads/.
"mvc/public/uploads/$1": Apache sẽ chuyển hướng nội bộ yêu cầu này đến đường dẫn vật lý html/mvc/public/uploads/ và nối thêm phần đã chụp được ($1).
Ví dụ: /uploads/my-image.jpg sẽ được xử lý như thể bạn yêu cầu /mvc/public/uploads/my-image.jpg.
[L]: Cờ "Last" đảm bảo rằng nếu quy tắc này khớp, Apache sẽ dừng xử lý các quy tắc RewriteRule tiếp theo trong file .htaccess này.
Tại sao phải đặt nó đầu tiên?

Vì các quy tắc RewriteRule được xử lý theo thứ tự. Nếu bạn đặt quy tắc /uploads/ sau quy tắc ^(.*)$ mvc/public/$1, thì yêu cầu /uploads/image.jpg sẽ bị quy tắc chung kia xử lý trước và chuyển thành /mvc/public/uploads/image.jpg, điều này vẫn đúng. Tuy nhiên, nếu bạn có một quy tắc khác muốn xử lý /uploads/ một cách đặc biệt, việc đặt nó đầu tiên là an toàn nhất để đảm bảo ưu tiên.

Trong trường hợp này, vì uploads nằm trong public, việc đặt quy tắc này trước hay sau quy tắc /public không tạo ra sự khác biệt về kết quả cuối cùng đối với việc hiển thị ảnh. Tuy nhiên, nếu sau này bạn muốn uploads được xử lý bởi một file PHP đặc biệt mà không phải router chung của public, thì việc đặt nó riêng là cần thiết.

.htaccess con (public/.htaccess và admin/.htaccess)
Các file html/mvc/public/.htaccess và html/mvc/admin/.htaccess sẽ không cần thay đổi gì so với các phiên bản trước đó. Chúng chỉ chịu trách nhiệm định tuyến các yêu cầu đã được chuyển hướng đến thư mục của chúng sang index.php tương ứng.

html/mvc/public/.htaccess: Sẽ tiếp tục chuyển mọi yêu cầu (không phải file/thư mục vật lý) trong phạm vi public/ đến public/index.php.
html/mvc/admin/.htaccess: Sẽ tiếp tục chuyển mọi yêu cầu (không phải file/thư mục vật lý) trong phạm vi admin/ đến admin/index.php.
Trong Code PHP của bạn
1. Khi upload ảnh (trong AdminController):

Bạn sẽ lưu đường dẫn vào database là /uploads/ten_file.jpg.

PHP

// Ví dụ trong AdminController.php khi xử lý upload
define('UPLOAD_PHYSICAL_DIR', __DIR__ . '/../../../public/uploads/'); 
// ^^^ Đường dẫn vật lý từ AdminController đến public/uploads/

// ... (code xử lý upload file) ...

if (move_uploaded_file($_FILES['image']['tmp_name'], UPLOAD_PHYSICAL_DIR . $fileName)) {
    // Lưu đường dẫn này vào database
    $imagePathForDatabase = '/uploads/' . $fileName; 
    // Bây giờ bạn có thể dùng đường dẫn này trong cả admin và client view
    // và nó sẽ được xử lý bởi quy tắc /uploads/ trong html/.htaccess
}
2. Khi hiển thị ảnh (trong View của Admin hoặc Client):

Bạn chỉ cần sử dụng đường dẫn /uploads/ten_file.jpg trực tiếp trong thẻ <img>.

HTML

<img src="<?php echo htmlspecialchars($product->image_url); ?>" alt="Product Image">
Với cấu hình này, bạn đã tạo ra một "alias" cho thư mục uploads có thể truy cập bằng URL /uploads/, rất tiện lợi cho việc quản lý và hiển thị tài nguyên tĩnh.