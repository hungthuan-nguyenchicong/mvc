## check_auth

Việc chỉ phục vụ các file tĩnh dưới /admin/ khi session admin = true là một yêu cầu bảo mật hợp lý. Tuy nhiên, Nginx bản thân nó không thể trực tiếp đọc hoặc hiểu trạng thái session của PHP (hoặc bất kỳ ngôn ngữ phía server nào). Session được quản lý bởi ứng dụng backend (PHP trong trường hợp này).

Để đạt được yêu cầu này, bạn cần kết hợp Nginx với backend (PHP) của mình thông qua một cơ chế kiểm tra xác thực. Có hai cách tiếp cận chính:

Cách 1: Sử dụng Nginx Internal Redirect và PHP để kiểm tra quyền (Recommended)

Đây là cách an toàn và linh hoạt nhất. Nginx sẽ không tự phục vụ file tĩnh một cách mù quáng. Thay vào đó, nó sẽ luôn gửi yêu cầu qua PHP để PHP kiểm tra session. Nếu session hợp lệ, PHP sẽ "yêu cầu" Nginx phục vụ file tĩnh.

Cấu hình Nginx:

Nginx

server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html/mvc/public;
    index index.html index.php index.htm;
    charset utf-8;

    # BLOCK NÀY QUAN TRỌNG: Xử lý tất cả các request trong /admin/
    location /admin/ {
        # Đầu tiên, cố gắng tìm file tĩnh chính xác hoặc index của thư mục
        # Nếu không tìm thấy, CHUYỂN HƯỚNG NỘI BỘ (internal redirect) đến một script PHP
        # Script PHP này sẽ chịu trách nhiệm kiểm tra session và sau đó
        # yêu cầu Nginx phục vụ file tĩnh thật sự (nếu có quyền)
        try_files $uri $uri/ /admin/check_auth.php?$query_string;
    }

    # Location cho SPA tại /admin/views/
    # (Nếu bạn muốn /admin/views/ có session riêng hoặc không cần bảo vệ session giống admin chung,
    # nhưng nếu nó là một phần của admin thì nên để nó rơi vào /admin/ block trên)
    # Nếu muốn /admin/views/ cũng qua check_auth, thì bạn có thể bỏ block này và để /admin/ handle.
    # Hoặc nếu /admin/views/ là một SPA khác không cần session admin, thì giữ nguyên.
    # Ví dụ, nếu /admin/views/ là frontend cho admin, thì nó vẫn cần bảo vệ bởi session.
    # -> Nên bỏ block này và để /admin/ check_auth.php xử lý.
    # location /admin/views/ {
    #     try_files $uri $uri/ /admin/views/index.html?$query_string;
    # }

    # Location cho trang web chính (root)
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # PHP-FPM handler (chung cho tất cả các file .php)
    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_index index.php;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param REQUEST_URI $request_uri;
        include fastcgi_params;
    }

    # Quan trọng: Đường dẫn này để Nginx phục vụ file tĩnh sau khi PHP đã kiểm tra quyền
    location @serve_admin_asset {
        # Không cần try_files vì PHP đã xác định file tồn tại và có quyền
        # Nginx chỉ việc phục vụ file tại $uri ban đầu
        # Nếu file không tồn tại, PHP đã phải xử lý lỗi 404 trước đó
        alias $document_root$request_uri; # Sử dụng alias hoặc root tùy cấu trúc của bạn
                                          # Nếu $document_root đã đủ, có thể dùng root $document_root;
        internal; # Chỉ có thể được gọi bởi internal redirect, không trực tiếp từ client
    }


    # Các cấu hình khác
    location ~ /\. { deny all; }
    location ~* /(composer\.(json|lock)|\.git|CHANGELOG|Makefile|README\.md|schema\.sql|tests?|bin|vendor)/ { deny all; }
    error_page 404 /404.html;
    location = /404.html { internal; }
}
File PHP (/var/www/html/mvc/public/admin/check_auth.php):

PHP

<?php
// Bắt đầu session
session_start();

// Giả định hàm kiểm tra session admin
function isAdminLoggedIn() {
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

// Lấy URI gốc mà Nginx ban đầu muốn phục vụ
$original_uri = $_SERVER['REQUEST_URI'];
$document_root = $_SERVER['DOCUMENT_ROOT']; // /var/www/html/mvc/public

// Đường dẫn tương đối đến file mà Nginx đang yêu cầu
// Ví dụ: /admin/css/style.css
$relative_path_to_file = $original_uri;

// Đường dẫn tuyệt đối đến file
$absolute_file_path = $document_root . $relative_path_to_file;

// Kiểm tra nếu người dùng là admin
if (isAdminLoggedIn()) {
    // Nếu là admin, kiểm tra xem file có tồn tại không
    if (file_exists($absolute_file_path) && is_file($absolute_file_path)) {
        // Nếu tồn tại, bảo Nginx phục vụ file đó
        // (Chú ý: đây không phải là chuyển hướng HTTP, mà là ra lệnh cho Nginx)
        // Dùng X-Accel-Redirect để Nginx phục vụ file internal
        // Đường dẫn trong X-Accel-Redirect phải là đường dẫn nội bộ của Nginx.
        // Trong trường hợp này, chúng ta muốn Nginx phục vụ file từ chính root của nó
        // nên có thể dùng lại $original_uri.
        header('X-Accel-Redirect: ' . $original_uri);
        exit;
    } else {
        // File không tồn tại hoặc không phải là file (ví dụ: thư mục)
        // Bạn có thể xử lý lỗi 404 ở đây hoặc để Nginx tự xử lý nếu nó là fallback cuối cùng
        // Với SPA, nếu đó là một đường dẫn SPA, bạn sẽ muốn gửi về index.html
        // Nếu đó là một API call, PHP router sẽ xử lý.

        // Đây là điểm phức tạp: Nếu nó là một đường dẫn SPA (vd: /admin/dashboard)
        // và không phải là file tĩnh, bạn muốn trả về index.html của SPA.
        // Nhưng nếu là một API call, bạn muốn PHP router xử lý.

        // Phương án tốt nhất cho SPA là:
        // Nếu path không phải là file/folder tĩnh, VÀ KHÔNG PHẢI LÀ FILE .php, thì trả về index.html.
        // Đây là logic đơn giản hóa cho file tĩnh:
        if (pathinfo($relative_path_to_file, PATHINFO_EXTENSION) === '' || !file_exists($absolute_file_path)) {
            // Có thể đây là một đường dẫn SPA (không phải file tĩnh)
            // hoặc một file tĩnh không tồn tại.
            // Chuyển hướng đến index.html của SPA
            header('Location: /admin/index.html', true, 302); // Chuyển hướng HTTP
            exit;
        } else {
            // File tĩnh được yêu cầu nhưng không tìm thấy (ví dụ: lỗi cấu hình)
            header("HTTP/1.0 404 Not Found");
            exit;
        }
    }
} else {
    // Người dùng không phải admin, chuyển hướng đến trang đăng nhập admin
    // Hoặc trả về lỗi 403 Forbidden
    header('Location: /admin/login/', true, 302); // Hoặc bạn có thể dùng /login
    exit;
}
?>
Cách 2: Sử dụng auth_request module của Nginx (Phức tạp hơn, nhưng hiệu quả cao)

auth_request module cho phép Nginx gửi một subrequest đến một backend (ví dụ: script PHP) để xác thực. Nếu subrequest trả về 2xx, Nginx sẽ phục vụ request gốc; nếu không (ví dụ: 401, 403), Nginx sẽ từ chối.

Cấu hình Nginx:

Nginx

server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html/mvc/public;
    index index.html index.php index.htm;
    charset utf-8;

    # Định nghĩa endpoint xác thực (PHP script)
    location = /_auth {
        internal; # Chỉ có thể gọi nội bộ bởi Nginx
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root/admin/check_auth_request.php; # Script xác thực
        include fastcgi_params;
    }

    # Block cho các file tĩnh trong admin
    location ~* ^/admin/(.+)\.(js|css|png|jpg|jpeg|gif|ico|svg|eot|ttf|woff|woff2)$ {
        auth_request /_auth; # Yêu cầu xác thực qua /_auth

        # Nếu xác thực thành công, Nginx sẽ tiếp tục phục vụ file tĩnh
        expires 30d;
        add_header Cache-Control "public, no-transform";
        try_files $uri =404;
    }

    # Block cho SPA trong admin (các đường dẫn không phải file tĩnh)
    location /admin/ {
        auth_request /_auth; # Yêu cầu xác thực qua /_auth

        # Sau khi xác thực, Nginx sẽ xử lý như một SPA thông thường
        try_files $uri $uri/ /admin/index.html?$query_string;
    }

    # Location cho trang web chính (root)
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # PHP-FPM handler (chung cho tất cả các file .php)
    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_index index.php;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param REQUEST_URI $request_uri;
        include fastcgi_params;
    }

    # Các cấu hình khác
    location ~ /\. { deny all; }
    location ~* /(composer\.(json|lock)|\.git|CHANGELOG|Makefile|README\.md|schema\.sql|tests?|bin|vendor)/ { deny all; }
    error_page 404 /404.html;
    location = /404.html { internal; }
}
File PHP (/var/www/html/mvc/public/admin/check_auth_request.php):

PHP

<?php
// Bắt đầu session (rất quan trọng để đọc session_id từ cookie của trình duyệt)
session_start();

// Giả định hàm kiểm tra session admin
function isAdminLoggedIn() {
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

if (isAdminLoggedIn()) {
    // Trả về mã 200 OK nếu người dùng đã đăng nhập
    http_response_code(200);
    // Có thể thêm header để báo cho Nginx cache kết quả xác thực (nếu muốn)
    // header('X-Auth-Cache-Control: public, max-age=60');
} else {
    // Trả về 401 Unauthorized hoặc 403 Forbidden
    // Nginx sẽ chặn request gốc và trả về lỗi này cho client
    http_response_code(403);
    // Tùy chọn: Chuyển hướng client đến trang đăng nhập
    header('Location: /admin/login/', true, 302);
}
exit;
?>
Ưu và nhược điểm của các cách:

Cách 1 (Internal Redirect với check_auth.php):

Ưu điểm: Đơn giản hơn để triển khai logic trong PHP. PHP có toàn quyền kiểm soát việc trả về file, chuyển hướng, hoặc trả về lỗi.

Nhược điểm: Mọi request (kể cả file tĩnh) đều phải "chạm" vào PHP, có thể tạo thêm một chút overhead so với auth_request nếu PHP script không được tối ưu. Logic trong PHP có thể phức tạp nếu bạn muốn phân biệt giữa file tĩnh và đường dẫn SPA.

Cách 2 (auth_request):

Ưu điểm: Hiệu suất cao hơn vì PHP script chỉ được gọi để xác thực, không phải để phục vụ file. Nginx tự phục vụ file nếu xác thực thành công. Chia tách rõ ràng trách nhiệm giữa Nginx (phục vụ) và PHP (xác thực).

Nhược điểm: Phức tạp hơn một chút để cấu hình Nginx và PHP script xác thực cần trả về mã HTTP thích hợp. Không dễ dàng để PHP tự quyết định chuyển hướng sang index.html của SPA nếu đó không phải là file tĩnh.

Lời khuyên:

Nếu bạn muốn kiểm soát chặt chẽ nhất và hiệu suất tốt nhất cho các file tĩnh, Cách 2 (auth_request) là lựa chọn chuyên nghiệp hơn.

Nếu bạn thấy auth_request quá phức tạp, Cách 1 (Internal Redirect) là một giải pháp khả thi và phổ biến, đặc biệt khi bạn đã có một PHP router mạnh mẽ. Khi sử dụng Cách 1, bạn cần đảm bảo rằng check_auth.php của bạn có thể phân biệt giữa request cho file tĩnh và request cho đường dẫn SPA để đưa ra phản hồi phù hợp (phục vụ file tĩnh, hoặc chuyển hướng đến index.html của SPA, hoặc báo lỗi).

Quan trọng: Dù dùng cách nào, hãy đảm bảo rằng session_start() được gọi ở đầu script PHP của bạn để PHP có thể truy cập thông tin session từ cookie của người dùng.

## ver 2

server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html/mvc/public; # Đảm bảo root này chính xác
    index index.html index.php index.htm;
    charset utf-8;

    # Định nghĩa endpoint xác thực NỘI BỘ mà Nginx sẽ gọi
    # Bây giờ nó trỏ tới một đường dẫn ảo, không phải file vật lý
    location = /_auth {
        internal; # Chỉ có thể gọi nội bộ bởi Nginx

        # Đường dẫn này sẽ được PHP router của bạn xử lý
        # Chúng ta cần đảm bảo Nginx biết nó cần được chuyển tới PHP
        # Bằng cách sử dụng một internal redirect về /admin/index.php
        # và truyền đường dẫn /admin/check-auth làm URI gốc
        rewrite ^ /admin/index.php break; # Chuyển hướng nội bộ tới admin/index.php

        # Các tham số FastCGI cho PHP-FPM
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root/admin/index.php; # Điểm vào của admin PHP
        fastcgi_param REQUEST_URI /admin/check-auth; # Quan trọng: truyền URI xác thực vào PHP
        include fastcgi_params;
    }

    # 1. Bảo vệ các file tĩnh của SPA Admin (bao gồm index.html)
    location ~* ^/admin/views/(.+)\.(html|js|css|png|jpg|jpeg|gif|ico|svg|eot|ttf|woff|woff2)$ {
        auth_request /_auth;
        expires 30d;
        add_header Cache-Control "public, no-transform";
        try_files $uri =404;
    }

    # 2. Xử lý các đường dẫn SPA trong /admin/views/ không phải là file tĩnh
    location /admin/views/ {
        auth_request /_auth;
        try_files $uri $uri/ /admin/views/index.html?$query_string;
    }

    # 3. Location cho các đường dẫn PHP admin (bao gồm cả các API hoặc routes do PHP router xử lý)
    #    Tất cả các request đến /admin/ (ngoại trừ /admin/views/ và file tĩnh đã được xử lý trên)
    #    sẽ được chuyển tới admin/index.php để router PHP xử lý.
    #    auth_request ở đây để bảo vệ các đường dẫn API admin.
    location /admin/ {
        auth_request /_auth; # Bảo vệ tất cả các đường dẫn admin khác (PHP, API)

        # Cố gắng tìm file tĩnh hoặc thư mục trước
        # Nếu không, chuyển hướng nội bộ đến admin/index.php
        try_files $uri $uri/ /admin/index.php?$query_string;
    }

    # 4. Location cho trang web chính (root)
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # PHP-FPM handler (chung cho tất cả các file .php)
    # Đặt cuối cùng để đảm bảo các try_files hoặc auth_request được xử lý trước.
    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_index index.php;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        # Đảm bảo truyền REQUEST_URI gốc (hoặc URI sau rewrite) vào PHP
        fastcgi_param REQUEST_URI $request_uri;
        include fastcgi_params;
    }

    # ... Các cấu hình khác như deny access, error_page ...
}

## ver 3

server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html/mvc/public; # Đảm bảo root này chính xác
    index index.html index.php index.htm;
    charset utf-8;

    # Định nghĩa endpoint xác thực NỘI BỘ
    location = /_auth {
        internal;
        rewrite ^ /admin/index.php break;
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root/admin/index.php;
        fastcgi_param REQUEST_URI /admin/check-auth;
        include fastcgi_params;
    }

    # --- BLOCK ƯU TIÊN 1: Bảo vệ và cấu hình caching cho file tĩnh của ADMIN ---
    # Bao gồm index.html và tất cả các tài nguyên JS/CSS/Images của SPA admin.
    # Đặt block này LÊN TRÊN block public để nó được ưu tiên.
    location ~* ^/admin/(.+)\.(html|js|css|png|jpg|jpeg|gif|ico|svg|eot|ttf|woff|woff2)$ {
        auth_request /_auth; # Yêu cầu xác thực qua /_auth

        # Đặt Cache-Control thành no-store, no-cache cho các tài nguyên admin
        expires off; # Tắt Expires để Cache-Control được ưu tiên
        add_header Cache-Control "no-store, no-cache, must-revalidate";
        add_header Pragma "no-cache"; # Cho các proxy/client cũ

        try_files $uri =404; # Đảm bảo file tồn tại
    }

    # --- BLOCK ƯU TIÊN 2: Xử lý các đường dẫn SPA trong /admin/ (không phải file tĩnh) ---
    # Ví dụ: /admin/dashboard, /admin/users/123
    # Nginx sẽ kiểm tra block này nếu request không khớp với block file tĩnh admin ở trên.
    location /admin/ {
        auth_request /_auth; # Bảo vệ tất cả các đường dẫn admin khác (kể cả các routes SPA ảo)

        # Cố gắng tìm file tĩnh hoặc thư mục trước
        # Nếu không, chuyển hướng nội bộ đến admin/index.php (cho PHP router)
        # hoặc /admin/index.html (nếu đây là một SPA thuần túy)
        # Đối với SPA:
        try_files $uri $uri/ /admin/index.html?$query_string;
        # Đối với PHP Router:
        # try_files $uri $uri/ /admin/index.php?$query_string;
    }


    # --- BLOCK ƯU TIÊN 3: Cấu hình caching cho file tĩnh của PUBLIC (toàn bộ trang web) ---
    # Block này sẽ xử lý tất cả các file tĩnh CÒN LẠI trên website không thuộc /admin/.
    # Đặt block này sau các block `/admin/` để đảm bảo ưu tiên.
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|eot|ttf|woff|woff2)$ {
        expires 30d; # Cache 30 ngày cho các tài nguyên public
        add_header Cache-Control "public, no-transform, max-age=2592000"; # max-age tương ứng 30 ngày
        try_files $uri =404; # Đảm bảo file tồn tại
    }

    # --- BLOCK ƯU TIÊN 4: Xử lý các đường dẫn PHP chung ---
    # Đảm bảo block này nằm sau các block `try_files` để chúng có thể hoạt động.
    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_index index.php;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param REQUEST_URI $request_uri;
        include fastcgi_params;
    }

    # --- BLOCK ƯU TIÊN 5: Trang web chính (root) ---
    location / {
        try_files $uri $uri/ /index.php?$query_string; # Hoặc /index.html nếu là SPA chính
    }

    # ... Các cấu hình khác như deny access, error_page ...
    location ~ /\. { deny all; }
    location ~* /(composer\.(json|lock)|\.git|CHANGELOG|Makefile|README\.md|schema\.sql|tests?|bin|vendor)/ { deny all; }
    error_page 404 /404.html;
    location = /404.html { internal; }
}

## ver 4

// Ví dụ xử lý Fetch trong JavaScript
fetch('/admin/views/')
    .then(response => {
        // Kiểm tra xem phản hồi có phải là 302 (hoặc 401) và có header Location hay không
        // Lưu ý: Trong Fetch API, bạn có thể không truy cập được trực tiếp vào header Location nếu yêu cầu được chuyển hướng.
        // Tuy nhiên, nếu server trả về 401 và chúng ta nhận 302 (do cấu hình Nginx), 
        // chúng ta có thể kiểm tra response.status.
        
        if (response.status === 302 || response.status === 401) {
            // Thực hiện chuyển hướng trình duyệt thủ công
            // Nếu bạn biết URL đích là /admin/login
            window.location.href = '/admin/login';
            
            // Hoặc nếu bạn muốn đọc URL từ header Location (nếu có thể truy cập)
            // const location = response.headers.get('Location');
            // if (location) {
            //     window.location.href = location;
            // }
        } else if (response.ok) {
            // Xử lý khi yêu cầu thành công (ví dụ: đăng nhập thành công hoặc đã được cấp phép)
            // ...
        } else {
            // Xử lý các lỗi khác
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });