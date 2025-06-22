## set up

npm create vite@latest my-vite-app

tham khao

npm install -g npm@11.4.2

.gitignore

## vite + php

Bạn muốn tích hợp dự án Vite của mình để chạy trên cổng 80 (cổng HTTP mặc định) và có điểm vào là public/index.php thay vì trực tiếp từ Vite Dev Server, điều này hoàn toàn khả thi và là một cách tiếp cận phổ biến khi làm việc với backend PHP.

Mục tiêu là:

PHP (qua Nginx/Apache) sẽ phục vụ file index.php tại cổng 80.
File index.php này sẽ chứa các thẻ <script> và <link> trỏ tới các tài nguyên JavaScript/CSS đang được phục vụ bởi Vite Dev Server (ví dụ: http://localhost:5173).
Khi deploy production, PHP vẫn phục vụ index.php, nhưng các tài nguyên JS/CSS sẽ trỏ tới các file đã được Vite build (ví dụ: trong thư mục dist).
Đây là cách bạn có thể thiết lập:

1. Cấu hình Vite cho Public Path
Bạn cần cấu hình vite.config.js để Vite biết được URL cơ sở mà các tài nguyên của nó sẽ được truy cập từ đó. Trong môi trường phát triển, đó là URL của Vite Dev Server.

vite.config.js
JavaScript

import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Base public path for all assets
  // For development, this should point to your Vite dev server URL
  // For production, this will typically be '/' or your CDN path
  base: process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:5173/',

  build: {
    // Output directory for production build
    outDir: 'dist', // This will be your PHP project's public/dist/
    // Ensure that assets are generated relative to the publicPath
    assetsDir: 'assets', // Assets like JS/CSS/images will go into dist/assets/
    // Clear the output directory before building
    emptyOutDir: true,
    // Configuration for Rollup (used internally by Vite for production build)
    rollupOptions: {
      input: {
        // Define your entry points here
        // For a single-page app, it's usually just one entry
        main: resolve(__dirname, 'src/main.js'),
        // You might have other entry points if you're building multiple SPAs or modules
        // Example: admin: resolve(__dirname, 'src/admin.js'),
      },
      output: {
        // Customize output filenames for production if needed
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/chunks/[name].[hash].js',
        assetFileNames: 'assets/[ext]/[name].[hash].[ext]',
      },
    },
  },

  server: {
    // The port Vite dev server will run on
    port: 5173,
    // Allows external access (e.g., from Nginx or other devices on network)
    // You might need to set this to '0.0.0.0' if running in WSL/Docker
    host: 'localhost', // Use '0.0.0.0' for WSL/Docker if localhost doesn't work
    // Do not automatically open browser, as PHP will be the entry point
    open: false,
    // Enable CORS for development to avoid issues when serving from PHP
    cors: true,
  },

  // Other Vite configurations (plugins, etc.)
  plugins: [
    // You might add plugins here, e.g., for framework support or other features
  ],
});
2. Cấu hình PHP để Nhúng Tài nguyên Vite
Bây giờ, file PHP của bạn cần biết cách nhúng các tài nguyên JS/CSS từ Vite Dev Server trong môi trường phát triển, và từ thư mục dist trong môi trường sản phẩm.

Một cách hiệu quả là sử dụng một hàm PHP nhỏ để kiểm tra môi trường và tạo ra các thẻ <script>/<link> phù hợp.

Tạo file public/index.php (hoặc template PHP của bạn)
PHP

<?php
// public/index.php

// Define the environment (you might have a more sophisticated way to do this)
// For simplicity, we check if Vite dev server is running or explicitly set NODE_ENV
$isDev = getenv('APP_ENV') === 'development' || !file_exists(__DIR__ . '/dist/manifest.json');

// Base URL for Vite assets in development
$viteDevServerUrl = 'http://localhost:5173';

// Function to generate Vite asset tags
function vite_asset($entryPoint, $isDev, $viteDevServerUrl, $manifestPath) {
    $html = '';

    if ($isDev) {
        // In development, load the Vite client and then the entry point
        // The Vite client will handle HMR and module resolution
        $html .= '<script type="module" src="' . $viteDevServerUrl . '/@vite/client"></script>' . "\n";
        $html .= '<script type="module" src="' . $viteDevServerUrl . '/' . $entryPoint . '"></script>' . "\n";
    } else {
        // In production, read from manifest.json to get hashed asset paths
        // This requires `vite-plugin-manifest` or similar if Vite doesn't generate it by default
        if (!file_exists($manifestPath)) {
            error_log('Vite manifest.json not found at: ' . $manifestPath);
            return '';
        }
        $manifest = json_decode(file_get_contents($manifestPath), true);

        if (!isset($manifest[$entryPoint])) {
            error_log('Entry point "' . $entryPoint . '" not found in manifest.json');
            return '';
        }

        $entry = $manifest[$entryPoint];

        // Load CSS assets
        if (isset($entry['css'])) {
            foreach ($entry['css'] as $cssFile) {
                $html .= '<link rel="stylesheet" href="/dist/' . $cssFile . '">' . "\n";
            }
        }

        // Load JavaScript entry point
        $html .= '<script type="module" src="/dist/' . $entry['file'] . '"></script>' . "\n";

        // Preload imports (optional, for better performance)
        if (isset($entry['imports'])) {
            foreach ($entry['imports'] as $import) {
                if (isset($manifest[$import]['file'])) {
                    $html .= '<link rel="modulepreload" href="/dist/' . $manifest[$import]['file'] . '">' . "\n";
                }
            }
        }
    }
    return $html;
}

// Path to the Vite manifest.json in production
$manifestPath = __DIR__ . '/dist/manifest.json';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP + Vite App</title>
    <?php echo vite_asset('src/main.js', $isDev, $viteDevServerUrl, $manifestPath); ?>
</head>
<body>
    <div id="app"></div>
    <h1>Hello from PHP!</h1>
    <p>This content is served by PHP, but the frontend is powered by Vite.</p>
</body>
</html>
Lưu ý quan trọng cho PHP:

$isDev: Đây là cách đơn giản để kiểm tra môi trường. Trong một ứng dụng PHP thực tế, bạn sẽ dùng biến môi trường (ví dụ: $_ENV['APP_ENV']) hoặc một hằng số cấu hình.
Manifest file: Đối với production build, Vite sẽ tạo ra các file với tên băm (hashed filenames) để tối ưu caching. Để PHP biết tên file cuối cùng, bạn cần Vite tạo ra một file manifest.json.
Thêm Vite plugin: Để Vite tạo manifest.json, bạn cần cài đặt và sử dụng @vitejs/plugin-legacy (nếu bạn cần hỗ trợ trình duyệt cũ hơn) hoặc một plugin tương tự có chức năng tạo manifest (thường tích hợp sẵn với build.manifest option, nhưng có thể cần bật rõ ràng).
Trong vite.config.js: Đảm bảo build.manifest được set là true:
JavaScript

export default defineConfig({
  // ...
  build: {
    manifest: true, // This is crucial for production to generate manifest.json
    // ...
  },
});
Đường dẫn: Đảm bảo đường dẫn tới manifest.json trong PHP là chính xác (__DIR__ . '/dist/manifest.json').
3. Cấu hình Nginx (hoặc Apache)
Bạn cần cấu hình máy chủ web của mình (Nginx là lựa chọn tốt cho file tĩnh và proxy) để:

Phục vụ các yêu cầu PHP (.php) cho PHP-FPM.
Proxy các yêu cầu tài nguyên frontend (JS, CSS) tới Vite Dev Server (http://localhost:5173) trong môi trường phát triển.
Phục vụ các file tĩnh đã được build từ thư mục dist trong môi trường sản phẩm.
Ví dụ cấu hình Nginx (cho môi trường phát triển)
Giả sử dự án PHP của bạn nằm ở /var/www/html/my-php-vite-app/ và thư mục gốc của web server là public/.

Nginx

server {
    listen 80;
    server_name localhost; # Hoặc tên miền dev của bạn

    root /var/www/html/my-php-vite-app/public; # Thư mục public của dự án PHP

    index index.php index.html;

    # Xử lý các file PHP
    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock; # Thay bằng socket của PHP-FPM của bạn
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param PATH_INFO $fastcgi_path_info;
    }

    # Proxy các yêu cầu đến Vite Dev Server trong môi trường phát triển
    # Kiểm tra URL để đảm bảo chỉ proxy các tài nguyên Vite
    # Các file entry point Vite sẽ được served trực tiếp từ root của Vite dev server
    location ~ ^/(src|node_modules|@vite)/ { # Ví dụ: /src/main.js, /node_modules/vue/, /@vite/client
        proxy_pass http://localhost:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_no_cache 1;
        proxy_cache_bypass 1;
    }

    # Khi bạn build cho production, các tài nguyên sẽ nằm trong /dist/
    location /dist/ {
        alias /var/www/html/my-php-vite-app/public/dist/; # Đảm bảo đường dẫn alias đúng
        try_files $uri $uri/ =404;
        expires max; # Caching tốt cho production assets
        add_header Cache-Control "public";
    }

    # Định tuyến tất cả các request khác đến index.php (cho routing của PHP framework)
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
}
Lưu ý quan trọng cho Nginx:

location ~ ^/(src|node_modules|@vite)/: Đây là một regex để bắt các yêu cầu mà Vite Dev Server sẽ phục vụ. Vite Dev Server thường phục vụ các file trực tiếp từ src/ hoặc node_modules/ và client của Vite (@vite/client).
location /dist/: Khối này sẽ phục vụ các file đã được build trong thư mục dist khi bạn ở môi trường production.
4. Quy trình làm việc
Trong môi trường phát triển:
Chạy máy chủ PHP của bạn: Khởi động Nginx và PHP-FPM để phục vụ dự án PHP của bạn trên cổng 80.
Bash

sudo systemctl start nginx
sudo systemctl start php8.2-fpm # Hoặc phiên bản PHP của bạn
Chạy Vite Dev Server: Trong terminal của dự án Vite (JS/SCSS), chạy:
Bash

npm run dev
Truy cập ứng dụng: Mở trình duyệt và truy cập http://localhost. Nginx sẽ phục vụ index.php, và các thẻ script/link trong index.php sẽ trỏ đến Vite Dev Server, cho phép bạn tận hưởng HMR.
Để build cho môi trường sản phẩm:
Chạy lệnh build của Vite:
Bash

npm run build
Vite sẽ tạo thư mục dist/ trong public/ của dự án PHP của bạn, chứa các file JS/CSS đã được tối ưu hóa và băm tên.
Đảm bảo biến môi trường APP_ENV được set là production (hoặc PHP không tìm thấy manifest.json trong dist/) để script PHP của bạn nhúng các file từ dist/.
Deploy code PHP và thư mục dist lên máy chủ production. Nginx sẽ tự động phục vụ các file từ dist/ khi nhận được yêu cầu http://your-domain/dist/.
Với thiết lập này, bạn sẽ có một quy trình phát triển mượt mà và một quy trình triển khai hiệu quả cho ứng dụng PHP + Vite của mình!

## up date

Bạn hoàn toàn đúng khi nói Vite tự thân đã giống như một dự án frontend hoàn chỉnh rồi! Tuy nhiên, yêu cầu của bạn rất hợp lý: bạn muốn tận dụng sức mạnh của Vite (tốc độ, khả năng xử lý ES Modules, CSS preprocessors) chỉ để bundle các file JS và CSS của mình, mà không cần nó tạo ra một dự án frontend độc lập với index.html riêng.

Đây là một kịch bản phổ biến khi bạn có một backend truyền thống (như PHP) chịu trách nhiệm render HTML, và bạn chỉ muốn Vite quản lý việc biên dịch và tối ưu hóa các tài sản frontend.

Cách Sử Dụng Vite Chỉ Để Bundle JS và CSS (không tạo index.html riêng)
Để đạt được điều này, bạn cần cấu hình vite.config.js để nó hoạt động như một "asset bundler" thay vì một "application bundler".

1. Cấu trúc Dự án (Ví dụ)
Giả sử bạn có một dự án PHP như sau:

my-php-project/
├── public/
│   ├── index.php    # File PHP chính sẽ nhúng JS/CSS
│   └── .htaccess    # Hoặc cấu hình Nginx
├── frontend/        # Đây là thư mục chứa code Vite của bạn
│   ├── src/
│   │   ├── main.js    # Điểm vào JS
│   │   ├── admin.js   # Một điểm vào JS khác (nếu có)
│   │   ├── styles.scss  # Điểm vào SCSS
│   │   └── components/
│   │       └── ...
│   ├── package.json
│   ├── vite.config.js
│   └── tsconfig.json (nếu dùng TypeScript)
└── composer.json    # Hoặc các file PHP khác
2. Cấu hình vite.config.js
File vite.config.js trong thư mục frontend/ sẽ là chìa khóa. Bạn sẽ tập trung vào phần build.rollupOptions.input và build.outDir.

JavaScript

// frontend/vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Không cần 'base' cho môi trường phát triển nếu bạn không phục vụ HTML từ Vite
  // 'base' chỉ cần khi bạn muốn Vite tạo ra các đường dẫn tương đối trong CSS/JS
  // hoặc khi bạn cần deploy các file tĩnh trên một subpath.
  // Nếu PHP của bạn sẽ nhúng các file từ /dist/assets/, thì base có thể là '/' hoặc rỗng.
  base: '/',

  build: {
    // Thư mục đầu ra cho các file đã bundle.
    // Đặt nó vào public/dist/ của dự án PHP của bạn.
    outDir: '../public/dist', // Ra ngoài thư mục frontend/, rồi vào public/dist
    
    // Tự động dọn dẹp thư mục đầu ra trước khi build
    emptyOutDir: true,

    // Cần bật manifest để PHP biết được tên file đã băm trong production
    manifest: true,

    // Tắt tính năng tự động sao chép index.html mặc định của Vite
    // Đây là điểm QUAN TRỌNG để Vite không tự tạo HTML.
    rollupOptions: {
      input: {
        // Định nghĩa rõ ràng TẤT CẢ các điểm vào mà bạn muốn Vite bundle.
        // Vite sẽ xử lý tất cả các import/require từ các điểm vào này.
        // Đặt tên key theo ý muốn (ví dụ: 'main', 'admin', 'styles')
        // Đường dẫn value phải là đường dẫn tuyệt đối hoặc tương đối từ thư mục gốc của Vite (frontend/)
        main: resolve(__dirname, 'src/main.js'),
        admin: resolve(__dirname, 'src/admin.js'), // Nếu có một entry point JS khác
        styles: resolve(__dirname, 'src/styles.scss'), // Điểm vào cho CSS/SCSS
      },
      output: {
        // Tùy chỉnh tên file đầu ra để dễ quản lý trong thư mục dist/
        // [name] sẽ là tên key bạn đặt ở trên (main, admin, styles)
        // [hash] là mã băm để caching
        entryFileNames: 'assets/js/[name].[hash].js', // JS files will go into dist/assets/js/
        chunkFileNames: 'assets/js/chunks/[name].[hash].js', // Splitted JS chunks
        assetFileNames: (assetInfo) => {
          // CSS files will go into dist/assets/css/
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/css/[name].[hash].[ext]';
          }
          // Other assets (images, fonts) will go into dist/assets/img/ or similar
          return 'assets/[ext]/[name].[hash].[ext]';
        },
      },
    },
  },

  server: {
    // Vite Dev Server sẽ chạy trên cổng này
    port: 5173,
    host: 'localhost', // Sử dụng '0.0.0.0' nếu gặp vấn đề với WSL/Docker
    // Không tự động mở trình duyệt vì PHP sẽ là điểm vào
    open: false,
    // Cho phép CORS để tránh lỗi khi PHP (trên cổng khác) yêu cầu tài nguyên từ Vite Dev Server
    cors: true,
    // Proxy API requests nếu cần (ví dụ: từ frontend gọi API PHP)
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:80', // Proxy requests to your PHP server
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ''),
    //   },
    // },
  },

  // Cấu hình cho việc xử lý các file (nếu cần, Sass tự động nhận diện nếu cài đặt)
  // Ví dụ: Cài đặt Sass: npm install sass --save-dev
  css: {
    preprocessorOptions: {
      scss: {
        // Thêm các tùy chọn Sass nếu cần, ví dụ: globalData
        // additionalData: `@import "src/variables.scss";`
      },
    },
  },

  // Các plugins khác (nếu dùng framework như React, Vue)
  // plugins: [react()],
});
3. Sửa đổi package.json
Trong thư mục frontend/, file package.json của bạn sẽ trông giống thế này:

JSON

// frontend/package.json
{
  "name": "my-frontend-assets",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",        // Khởi chạy Vite Dev Server
    "build": "vite build" // Tạo bản build production
  },
  "devDependencies": {
    "sass": "^1.x.x",     // Cần nếu bạn dùng SCSS
    "vite": "^5.x.x"
  }
}
4. File CSS/SCSS và JS của bạn
Trong frontend/src/:

main.js:
JavaScript

import './styles.scss'; // Import SCSS của bạn
// import './another-js-module.js';

document.addEventListener('DOMContentLoaded', () => {
    const appElement = document.getElementById('app');
    if (appElement) {
        appElement.innerHTML = '<h2>Frontend JS loaded by Vite!</h2>';
    }
    console.log('Main JS loaded.');
});
styles.scss:
SCSS

body {
  font-family: sans-serif;
  background-color: #e0f2f7; // Light blue
  color: #263238;
}

#app {
  padding: 20px;
  margin-top: 50px;
  border: 1px solid #b0bec5;
  border-radius: 8px;
  background-color: white;
  text-align: center;
}
5. Nhúng các Asset vào public/index.php
PHP sẽ đọc file manifest.json được tạo ra bởi Vite sau khi build để biết đường dẫn tới các file JS/CSS đã được băm.

public/index.php:

PHP

<?php
// public/index.php

// Define environment. In production, you'd typically set APP_ENV in your server config.
$isDev = (getenv('APP_ENV') === 'development'); // Set APP_ENV=development in your .env or server config for dev
$viteDevServerUrl = 'http://localhost:5173'; // Make sure this matches your vite.config.js port

/**
 * Generates HTML tags for Vite assets.
 *
 * @param string $entryPoint The original path to your entry point (e.g., 'src/main.js').
 * @param bool $isDev True if in development mode.
 * @param string $viteDevServerUrl The URL of the Vite development server.
 * @param string $manifestPath Absolute path to manifest.json in production.
 * @return string HTML script/link tags.
 */
function vite_asset($entryPoint, $isDev, $viteDevServerUrl, $manifestPath) {
    $html = '';

    if ($isDev) {
        // In development, load Vite client and then the entry point from dev server
        $html .= '<script type="module" src="' . $viteDevServerUrl . '/@vite/client"></script>' . "\n";
        $html .= '<script type="module" src="' . $viteDevServerUrl . '/' . $entryPoint . '"></script>' . "\n";
    } else {
        // In production, read from manifest.json
        if (!file_exists($manifestPath)) {
            error_log('Vite manifest.json not found at: ' . $manifestPath);
            return '';
        }
        $manifest = json_decode(file_get_contents($manifestPath), true);

        if (!isset($manifest[$entryPoint])) {
            error_log('Entry point "' . $entryPoint . '" not found in manifest.json');
            return '';
        }

        $entry = $manifest[$entryPoint];

        // Load CSS assets
        if (isset($entry['css'])) {
            foreach ($entry['css'] as $cssFile) {
                // Adjust path as per your Nginx/Apache config (e.g., /dist/assets/css/...)
                $html .= '<link rel="stylesheet" href="/dist/' . $cssFile . '">' . "\n";
            }
        }

        // Load JavaScript entry point
        // Adjust path as per your Nginx/Apache config (e.g., /dist/assets/js/...)
        $html .= '<script type="module" src="/dist/' . $entry['file'] . '"></script>' . "\n";

        // Preload imports (optional, for better performance)
        if (isset($entry['imports'])) {
            foreach ($entry['imports'] as $import) {
                if (isset($manifest[$import]['file'])) {
                    $html .= '<link rel="modulepreload" href="/dist/' . $manifest[$import]['file'] . '">' . "\n";
                }
            }
        }
    }
    return $html;
}

$manifestPath = __DIR__ . '/dist/manifest.json'; // Path to the generated manifest.json
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PHP + Vite Assets</title>
    <?php
    echo vite_asset('src/main.js', $isDev, $viteDevServerUrl, $manifestPath);
    echo vite_asset('src/styles.scss', $isDev, $viteDevServerUrl, $manifestPath); // Nếu styles.scss là một entry point riêng
    // Nếu bạn muốn styles.scss được import trong main.js, bạn chỉ cần gọi main.js ở trên
    ?>
</head>
<body>
    <div id="app"></div>
    <h1>Chào mừng từ PHP!</h1>
    <p>Các tài nguyên JS và CSS được xử lý bởi Vite.</p>
</body>
</html>
6. Cấu hình Nginx (hoặc Apache)
Bạn sẽ cần một cấu hình Nginx tương tự như đã thảo luận trước đây, để:

Xử lý các file .php.
Proxy các yêu cầu frontend đến Vite Dev Server trong phát triển (ví dụ: location /src/, location /@vite/).
Phục vụ các file đã được build từ public/dist/assets/ trong sản phẩm.
<!-- end list -->

Nginx

server {
    listen 80;
    server_name localhost;

    root /var/www/html/my-php-project/public; # Thư mục public của dự án PHP

    index index.php;

    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock; # Adjust your PHP-FPM socket
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param PATH_INFO $fastcgi_path_info;
    }

    # Proxy requests to Vite Dev Server for development
    location ~ ^/(src|@vite|node_modules)/ {
        proxy_pass http://localhost:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_no_cache 1;
        proxy_cache_bypass 1;
    }

    # Serve built assets from public/dist/ in production
    location /dist/ {
        alias /var/www/html/my-php-project/public/dist/;
        try_files $uri $uri/ =404;
        expires max;
        add_header Cache-Control "public, immutable";
    }

    # Catch-all for PHP routing
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
}
Quy trình làm việc:
Trong phát triển:

Chạy máy chủ PHP/Nginx của bạn (trên cổng 80).
Trong thư mục frontend/, chạy npm run dev (khởi động Vite Dev Server trên cổng 5173).
Truy cập http://localhost trong trình duyệt. PHP sẽ phục vụ index.php, và nó sẽ nhúng tài nguyên từ Vite Dev Server. Khi bạn sửa code frontend, HMR sẽ hoạt động.
Trong sản phẩm:

Trong thư mục frontend/, chạy npm run build. Vite sẽ tạo thư mục public/dist/ với các file JS/CSS đã được tối ưu hóa và băm tên, cùng với manifest.json.
Đảm bảo môi trường APP_ENV của PHP được đặt thành production (hoặc kiểm tra sự tồn tại của manifest.json).
Deploy toàn bộ dự án PHP của bạn, bao gồm thư mục public/dist/. Nginx sẽ phục vụ các file đã được build từ public/dist/ một cách trực tiếp và hiệu quả.
Với cách tiếp cận này, bạn có thể tách biệt rõ ràng việc phát triển frontend (với tốc độ và tiện ích của Vite) khỏi backend PHP của mình, đồng thời vẫn có một quy trình triển khai hiệu quả.

## hoc them

Bạn nhận thấy đúng rồi! Khi bạn khởi tạo một dự án Vite bằng lệnh npm create vite@latest my-vite-app, ban đầu bạn sẽ không thấy file vite.config.js được tạo ra mặc định.

Đây là một phần của triết lý "Zero Configuration" của Vite.

Tại sao không có vite.config.js mặc định?
Vite được thiết kế để hoạt động "ngay lập tức" với các cấu hình phổ biến mà không cần bất kỳ file cấu hình nào. Nó có các mặc định thông minh cho hầu hết các trường hợp sử dụng cơ bản của Vanilla JS, Vue, React, v.v. Điều này giúp người mới bắt đầu có thể nhảy vào code ngay mà không bị choáng ngợp bởi một file cấu hình phức tạp từ đầu (điều thường xảy ra với Webpack).

Vậy khi nào thì cần tạo vite.config.js?
Bạn chỉ cần tự tạo (hoặc thêm vào nếu bạn đã có sẵn template có file này) và cấu hình file vite.config.js khi bạn muốn thay đổi các thiết lập mặc định hoặc thêm các tính năng nâng cao cho dự án của mình.

Các trường hợp phổ biến cần tạo vite.config.js:

Thay đổi cổng của Dev Server: Mặc định là 5173, bạn muốn đổi sang 3000 chẳng hạn.
JavaScript

import { defineConfig } from 'vite';
export default defineConfig({
  server: {
    port: 3000,
  },
});
Cấu hình publicPath (base URL): Rất quan trọng khi bạn tích hợp với backend PHP như chúng ta đã thảo luận, để các tài nguyên frontend được nhúng đúng cách.
JavaScript

import { defineConfig } from 'vite';
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/dist/' : 'http://localhost:5173/',
});
Tùy chỉnh thư mục đầu ra (outDir): Nếu bạn muốn bản build cuối cùng được đặt ở một thư mục khác với mặc định (dist). Ví dụ, ../public/dist để tích hợp PHP.
JavaScript

import { defineConfig } from 'vite';
export default defineConfig({
  build: {
    outDir: '../public/dist',
  },
});
Định nghĩa nhiều điểm vào (Entry Points): Khi bạn không muốn Vite chỉ bundle từ main.js mà còn muốn tạo các bundle riêng cho các file JS/CSS khác (như admin.js, styles.scss riêng biệt).
JavaScript

import { defineConfig } from 'vite';
import { resolve } from 'path';
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/main.js'),
        admin: resolve(__dirname, 'src/admin.js'),
        styles: resolve(__dirname, 'src/styles.scss'),
      },
    },
  },
});
Thêm Plugins: Để hỗ trợ các framework (React, Vue), xử lý hình ảnh, nén file, v.v.
JavaScript

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Ví dụ
export default defineConfig({
  plugins: [react()],
});
Cấu hình Proxy API: Khi bạn muốn Dev Server của Vite chuyển tiếp các yêu cầu API đến backend của bạn.
JavaScript

import { defineConfig } from 'vite';
export default defineConfig({
  server: {
    proxy: {
      '/api': 'http://localhost:80', // Proxy requests /api to your PHP server
    },
  },
});
Cách tạo vite.config.js
Nếu bạn cần tùy chỉnh, bạn chỉ cần tạo một file tên là vite.config.js (hoặc vite.config.ts nếu bạn dùng TypeScript) ở thư mục gốc của dự án Vite và điền cấu hình vào đó.

Ví dụ một file vite.config.js cơ bản nhất để bắt đầu tùy chỉnh:

JavaScript

// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  // Các tùy chọn cấu hình của bạn sẽ ở đây
  // Ví dụ:
  // server: {
  //   port: 3000,
  // },
  // build: {
  //   outDir: 'build_output',
  // },
  // plugins: [],
});
Vite sẽ tự động phát hiện và sử dụng file này khi bạn chạy npm run dev hoặc npm run build.

Hy vọng điều này làm rõ hơn về cách Vite quản lý cấu hình và khi nào bạn cần can thiệp!