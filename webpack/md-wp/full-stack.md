## Quy Trình Triển Khai Composer (không cần trên Production Server)
Tuyệt vời! Việc triển khai Composer mà không cần cài đặt nó trên máy chủ production là một kỹ thuật quan trọng giúp tối ưu hóa môi trường production của bạn. Chúng ta sẽ cùng đi qua một ví dụ cụ thể cho toàn bộ quy trình, từ môi trường phát triển cục bộ đến triển khai trên VPS.

Quy Trình Triển Khai Composer (không cần trên Production Server)
Quy trình này dựa trên nguyên tắc "build once, deploy anywhere" (đóng gói một lần, triển khai ở bất cứ đâu). Các dependencies của PHP sẽ được cài đặt và tối ưu hóa ở môi trường phát triển (hoặc CI/CD) và sau đó được chuyển trực tiếp lên máy chủ production.

Mô hình Môi trường của bạn:
Dev Environment (Local):

OS: WSL (Windows Subsystem for Linux)

Backend: Nginx + PHP-FPM (cho PHP MVC thuần, Controller trả về JSON)

Frontend: Windows + Node.js (Vanilla JS SPA với Webpack)

Composer: Cài đặt trên WSL

.env files: Cho cả dev và prod

Production Environment (VPS):

OS: Linux (ví dụ: Ubuntu Server)

Backend: Nginx + PHP-FPM (chỉ code PHP, không Composer)

Frontend: Code đã được Webpack bundle (JS, CSS, HTML)

Composer: Không cài đặt trực tiếp trên VPS

.env files: Chỉ file .env chứa biến production

Ví dụ Chi tiết các Bước
Hãy giả định cấu trúc dự án như sau:

my-fullstack-app/
├── backend/
│   ├── public/         (Document root của Nginx cho PHP)
│   │   └── index.php
│   ├── app/
│   │   ├── Controllers/
│   │   │   └── ApiController.php
│   │   └── Models/
│   │       └── User.php
│   ├── config/
│   │   └── env_loader.php (PHP tự code đọc .env)
│   ├── composer.json
│   ├── composer.lock
│   └── vendor/         (Thư mục này sẽ được tạo bởi Composer)
├── frontend/
│   ├── public/         (Chứa index.html và assets tĩnh)
│   │   └── index.html
│   ├── src/
│   │   └── main.js
│   ├── config/
│   │   └── env.js      (JS tự code đọc .env)
│   ├── package.json
│   ├── package-lock.json
│   └── webpack.config.js
├── .env                (Biến dùng chung cho cả backend và frontend)
└── .env.production     (Biến ghi đè cho production)
File .env (chung cho Dev):

Đoạn mã

APP_ENV=development
APP_DEBUG=true
DB_HOST=localhost
DB_NAME=my_dev_db
DB_USER=dev_user
DB_PASS=dev_password
APP_BACKEND_URL=http://localhost:80/api # Cho frontend biết URL của backend dev
File .env.production (ghi đè cho Prod):

Đoạn mã

APP_ENV=production
APP_DEBUG=false
DB_HOST=your_prod_db_host
DB_NAME=my_prod_db
DB_USER=prod_user
DB_PASS=very_secret_prod_password
APP_BACKEND_URL=https://api.yourdomain.com # Cho frontend biết URL của backend prod
Giai đoạn 1: Phát triển (Local - WSL + Windows)
Thiết lập Backend (WSL):

Cài đặt PHP, Nginx, PHP-FPM trên WSL: Đảm bảo Composer cũng được cài đặt.

Cấu hình Nginx: Trỏ root đến my-fullstack-app/backend/public. Cấu hình xử lý .php bằng PHP-FPM.

Composer install (trên WSL):

Bash

cd /mnt/c/path/to/my-fullstack-app/backend
composer install --no-dev # Cài đặt các thư viện PHP cần thiết, tạo vendor/ và autoload.php
Lệnh này sẽ tạo thư mục vendor/ và file vendor/autoload.php.

Code PHP:

Trong backend/public/index.php, đảm bảo bạn require __DIR__ . '/../vendor/autoload.php'; để sử dụng autoloader của Composer.

Sử dụng backend/config/env_loader.php để đọc .env (dev) cho PHP.

PHP

// backend/config/env_loader.php
function loadEnv($filePath) {
    // ... logic đọc .env như đã thảo luận ...
    // Đảm bảo load biến từ .env và sau đó ghi đè bằng .env.production nếu có
}

// Load .env dev
loadEnv(__DIR__ . '/../../.env');
// Sau đó, nếu cần, load .env.production để ghi đè (cho deploy sau này)
// (Không cần làm điều này trong quá trình dev nếu bạn chỉ muốn dev env)
Lưu ý: Khi phát triển, bạn thường chỉ muốn các biến dev. Logic đọc .env.production sẽ quan trọng hơn ở bước triển khai.

Thiết lập Frontend (Windows):

Cài đặt Node.js và npm/yarn trên Windows.

Cài đặt Webpack và các loader/plugin:

Bash

cd C:\path\to\my-fullstack-app\frontend
npm install # hoặc yarn install
Code JavaScript: Viết code Vanilla JS của bạn trong frontend/src/.

Webpack Config (frontend/webpack.config.js):

Sử dụng frontend/config/env.js để đọc file .env (chung cho cả backend/frontend) và truyền các biến công khai vào webpack.DefinePlugin.

JavaScript

// frontend/config/env.js
const path = require('path');
const fs = require('fs');

function loadEnvVariables(envFilePath, prodEnvFilePath) {
    let parsedEnv = {};
    // Logic đọc envFilePath (.env)
    if (fs.existsSync(envFilePath)) {
        // ... đọc và parse .env vào parsedEnv ...
    }

    // Logic đọc prodEnvFilePath (.env.production) và ghi đè
    if (fs.existsSync(prodEnvFilePath)) {
        const prodEnvContent = fs.readFileSync(prodEnvFilePath, 'utf-8');
        prodEnvContent.split('\n').forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine.length === 0 || trimmedLine.startsWith('#')) return;
            const parts = trimmedLine.split('=', 2);
            if (parts.length === 2) {
                const key = parts[0].trim();
                let value = parts[1].trim();
                // ... xử lý quote ...
                parsedEnv[key] = value; // Ghi đè biến từ .env.production
            }
        });
    }

    // Trả về các biến PUBLIC cho frontend
    return {
        'process.env.APP_BACKEND_URL': JSON.stringify(parsedEnv.APP_BACKEND_URL || ''),
        'process.env.APP_ENV': JSON.stringify(parsedEnv.APP_ENV || 'development'), // Quan trọng cho dev/prod
        // ... các biến khác
    };
}

module.exports = loadEnvVariables;
JavaScript

// frontend/webpack.config.js
// ... imports ...
const loadEnvVariables = require('./config/env');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    const baseEnvPath = path.resolve(__dirname, '../.env'); // .env chung
    const prodEnvPath = path.resolve(__dirname, '../.env.production'); // .env production

    // Load env variables. Pass both paths.
    const frontendEnvVariables = loadEnvVariables(baseEnvPath, prodEnvPath);

    // ... other webpack config ...

    plugins: [
        // ... other plugins ...
        new webpack.DefinePlugin(frontendEnvVariables),
    ],
    // ...
};
Chạy npm run dev để phát triển.

Giai đoạn 2: Triển khai (Deployment - VPS)
Đây là phần quan trọng nhất để hiểu Composer không cần trên Production Server.

Chuẩn bị Source Code cho Deployment (trên môi trường Local hoặc CI/CD Server):

Đảm bảo bạn đang ở thư mục gốc của dự án (my-fullstack-app/).

Cài đặt Composer Dependencies cho Production:

Bash

cd backend
composer install --no-dev --optimize-autoloader # Rất quan trọng!
# --no-dev: Không tải các dependencies chỉ dành cho môi trường dev.
# --optimize-autoloader: Tạo classmap tĩnh để tối ưu tốc độ autoloading.
Build Frontend cho Production:

Bash

cd ../frontend
npm run build # Sẽ chạy webpack với mode production
Lệnh này sẽ tạo thư mục frontend/dist/ với các file JS/CSS/HTML đã được tối ưu hóa.

Đóng gói Dự án:

Quay lại thư mục gốc dự án (my-fullstack-app/).

Tạo một file nén (ví dụ: .zip hoặc .tar.gz) của toàn bộ dự án, bao gồm thư mục backend/vendor/ và frontend/dist/.

Quan trọng: Loại bỏ các file nhạy cảm hoặc không cần thiết cho production như node_modules, .git, package.json, composer.json (nếu không cần chỉnh sửa trên prod), v.v., khỏi gói nén để giảm kích thước.
Lưu ý: composer.json và package.json thường được giữ lại để tiện cho việc debug hoặc cập nhật sau này, nhưng node_modules thì chắc chắn nên loại bỏ.

Tạo file .env cho Production:

Tạo một file .env chỉ chứa các biến môi trường production trên VPS. File này không bao giờ được commit lên Git và phải được bảo vệ chặt chẽ.

Bạn có thể tạo thủ công trên VPS hoặc sử dụng một công cụ quản lý biến môi trường (như Ansible Vault, HashiCorp Vault) nếu quy trình phức tạp hơn.

Ví dụ: /var/www/yourdomain.com/.env (hoặc /var/www/yourdomain.com/my-fullstack-app/.env).

Triển khai lên VPS:

Sử dụng scp, rsync, SFTP hoặc một công cụ triển khai tự động (như Capistrano, Deployer, Jenkins) để tải file nén lên VPS.

Giải nén file đó vào thư mục webroot của bạn (ví dụ: /var/www/yourdomain.com/my-fullstack-app).

Di chuyển file .env.production (từ bước 1 trên local) hoặc tạo file .env trực tiếp trên VPS tại thư mục gốc dự án.

Cấu hình Nginx trên VPS:

Cấu hình Nginx để phục vụ các file tĩnh từ my-fullstack-app/frontend/dist (cho frontend SPA).

Cấu hình Nginx để phục vụ các request PHP từ my-fullstack-app/backend/public/index.php (cho backend PHP-FPM).

Khởi động lại/Reload Nginx và PHP-FPM trên VPS.

Tác động của ".env" và Plugin trong quá trình Build/Deploy:
DefinePlugin (Frontend Webpack):

Khi bạn chạy npm run build trên môi trường local (hoặc CI/CD), webpack.config.js của bạn sẽ đọc cả .env và .env.production. Logic bạn viết trong frontend/config/env.js sẽ ưu tiên các biến từ .env.production.

Kết quả là, trong bản build frontend (frontend/dist/main.js), process.env.APP_BACKEND_URL sẽ được thay thế bằng https://api.yourdomain.com, và process.env.APP_ENV sẽ là production.

Điều này giúp code frontend tự động kết nối đúng đến backend production mà không cần thay đổi code thủ công.

env_loader.php (Backend PHP):

Khi ứng dụng PHP chạy trên VPS, env_loader.php sẽ đọc file .env (chứa các biến production) mà bạn đã đặt trên VPS.

Các biến này sẽ được nạp vào môi trường PHP và được sử dụng bởi Controllers và Models của bạn (ví dụ: DB_HOST, DB_NAME).

Với quy trình này, bạn đã tách biệt hoàn toàn môi trường phát triển và môi trường production, tối ưu hóa cả quá trình build lẫn triển khai, và quan trọng nhất là không cần cài đặt Composer hay Node.js trên máy chủ production, giúp giảm thiểu rủi ro bảo mật và đơn giản hóa môi trường server.

## Những File Chắc Chắn Nên Loại Bỏ khỏi Bản Deploy:
Bạn muốn biết liệu có thể loại bỏ tất cả các file nhạy cảm hoặc không cần thiết cho production khỏi gói nén khi triển khai dự án hay không.

Hoàn toàn có thể loại bỏ hầu hết các file không cần thiết cho production để giảm kích thước gói nén và tăng cường bảo mật. Đây là một thực hành tốt được gọi là "tối ưu hóa bản deploy" hoặc "deploy-ready package".

Tuy nhiên, có một vài lưu ý quan trọng về những file bạn đề cập:

Những File Chắc Chắn Nên Loại Bỏ khỏi Bản Deploy:
node_modules/: Chứa tất cả các dependencies của Node.js/JavaScript mà chỉ cần thiết cho quá trình phát triển và build frontend. Chúng không cần thiết trên máy chủ production và có kích thước rất lớn.

.git/: Thư mục chứa lịch sử Git của dự án. Không cần thiết cho ứng dụng chạy trên production và có thể chứa thông tin nhạy cảm.

package-lock.json / yarn.lock: Các file khóa dependency của Node.js. Chỉ cần thiết khi chạy npm install hoặc yarn install.

composer.lock: Tương tự như package-lock.json nhưng cho PHP. Nó đảm bảo các dependencies PHP được cài đặt chính xác phiên bản. Nếu bạn đã chạy composer install --no-dev --optimize-autoloader và copy thư mục vendor/, thì composer.lock không cần thiết cho runtime.

Các file cấu hình riêng tư hoặc nhạy cảm của môi trường dev: Ví dụ: .env.development, config.local.js, debug.ini, v.v., nếu chúng không phải là file .env chính cho production.

Các file tạm thời hoặc file build trung gian: Ví dụ: temp/, cache/ (nếu không dùng cho production), các file map (.map) của JavaScript/CSS (mặc dù đôi khi chúng hữu ích cho việc debug production).

Tài liệu dự án, ảnh thiết kế, file tests: docs/, design/, tests/, __tests__/, v.v.

Những File Cần Cân Nhắc Kỹ Trước Khi Loại Bỏ:
composer.json:

Tại sao nên giữ lại: Nếu bạn muốn có khả năng chạy composer install hoặc composer update trực tiếp trên máy chủ production trong tương lai (ví dụ, để vá lỗi nóng, hoặc quy trình CI/CD của bạn yêu cầu), thì việc giữ composer.json là cần thiết.

Tại sao có thể loại bỏ: Nếu quy trình triển khai của bạn là "build once, deploy anywhere" và bạn không bao giờ chạy Composer trên production, thì composer.json không cần thiết cho ứng dụng chạy. Việc loại bỏ nó giúp giảm kích thước và bảo mật hơn một chút.

package.json:

Tại sao nên giữ lại: Tương tự như composer.json. Nếu bạn muốn chạy npm install hoặc có các script quản lý frontend trên production, bạn sẽ cần nó.

Tại sao có thể loại bỏ: Nếu tất cả các tài nguyên frontend đã được build vào dist/ và bạn không cần npm trên production, bạn có thể loại bỏ nó.

Cách Thực Hiện Việc Loại Bỏ File
Bạn có thể sử dụng các công cụ nén (như zip, tar) với các tùy chọn loại trừ file, hoặc sử dụng các công cụ triển khai chuyên nghiệp (như rsync, Jenkins, GitLab CI/CD, GitHub Actions) để xác định rõ những gì cần đóng gói.

Ví dụ với tar trên Linux/WSL:

Bash

# Giả định bạn đang ở thư mục gốc của dự án: my-fullstack-app/

# Tạo một thư mục tạm để copy những gì cần thiết
mkdir deploy_package
rsync -a backend/ frontend/ deploy_package/

# Xóa các file không cần thiết trong thư mục tạm
rm -rf deploy_package/backend/node_modules
rm -rf deploy_package/backend/.git # Nếu bạn copy .git vào backend
rm -f deploy_package/backend/composer.lock # Nếu không cần trên prod
# (Cân nhắc rm -f deploy_package/backend/composer.json nếu bạn chắc chắn)

rm -rf deploy_package/frontend/node_modules
rm -rf deploy_package/frontend/src # Source code đã được build vào dist
rm -f deploy_package/frontend/package-lock.json
# (Cân nhắc rm -f deploy_package/frontend/package.json nếu bạn chắc chắn)
# Đảm bảo giữ lại frontend/dist/

# Tạo file nén từ thư mục tạm
tar -czvf my-fullstack-app-prod.tar.gz -C deploy_package .

# Xóa thư mục tạm
rm -rf deploy_package
Lời Khuyên:
Luôn hướng tới việc loại bỏ càng nhiều càng tốt: Điều này giúp giảm dung lượng tải lên VPS, tiết kiệm không gian đĩa, và quan trọng nhất là giảm bề mặt tấn công tiềm ẩn (ít file hơn, ít nguy cơ rò rỉ thông tin hoặc bị khai thác).

Đầu tư vào CI/CD: Các hệ thống Continuous Integration/Continuous Deployment (CI/CD) như Jenkins, GitLab CI/CD, GitHub Actions, CircleCI... được thiết kế để tự động hóa quy trình này một cách an toàn và hiệu quả. Chúng có thể tạo ra các "artifact" (sản phẩm đóng gói) chỉ chứa những gì cần thiết cho production.

Lưu ý về .env: File .env chứa các biến môi trường production không bao giờ được đóng gói cùng với code và không được đưa vào hệ thống kiểm soát phiên bản (Git). Nó nên được tạo hoặc cung cấp riêng biệt trên máy chủ production để đảm bảo an toàn.

Việc loại bỏ các file không cần thiết không chỉ là giảm kích thước mà còn là một phần quan trọng của quy trình bảo mật và tối ưu hóa triển khai.

## Script Node.js để Chuẩn Bị Triển Khai (node-deploy.js)

Tuyệt vời! Tạo một script Node.js để tự động hóa việc xóa các file không cần thiết trước khi đóng gói triển khai là một ý tưởng rất hay. Điều này giúp bạn có một quy trình nhất quán và ít lỗi hơn.

Dưới đây là một ví dụ về file node-deploy.js mà bạn có thể sử dụng. Script này sẽ thực hiện việc dọn dẹp các thư mục và file không cần thiết trong cả dự án frontend và backend của bạn.

Script Node.js để Chuẩn Bị Triển Khai (node-deploy.js)
File này sẽ được đặt ở thư mục gốc của dự án của bạn (ngang hàng với backend/ và frontend/).

node-deploy.js

JavaScript

const fs = require('fs-extra'); // Sử dụng fs-extra để dễ dàng xử lý thư mục
const path = require('path');
const archiver = require('archiver'); // Để tạo file nén (zip/tar)

// --- Cấu hình Đường dẫn ---
const projectRoot = __dirname;
const backendPath = path.join(projectRoot, 'backend');
const frontendPath = path.join(projectRoot, 'frontend');
const deployTempPath = path.join(projectRoot, 'deploy_temp'); // Thư mục tạm để chuẩn bị file deploy
const outputPath = path.join(projectRoot, 'my-fullstack-app-prod.zip'); // Tên file nén đầu ra

// --- Danh sách các File/Thư mục cần LOẠI BỎ trong thư mục tạm sau khi copy ---
const filesToExcludeInTemp = [
    // Global (trong deploy_temp)
    '.git',
    '.DS_Store', // macOS specific
    'node_modules', // Sẽ được loại bỏ trong frontend/backend
    // Backend specific (trong deploy_temp/backend)
    'backend/composer.lock', // Nếu bạn không cần trên prod
    'backend/.env', // Chỉ dùng cho dev, prod dùng .env riêng trên server
    'backend/tests',
    // Frontend specific (trong deploy_temp/frontend)
    'frontend/node_modules',
    'frontend/src', // Source code JS đã được bundle vào frontend/dist
    'frontend/package-lock.json',
    'frontend/.env', // Chỉ dùng cho dev
    'frontend/webpack.config.js', // File config của webpack
    'frontend/config', // Các file config js của frontend env
    'frontend/.gitignore',
];

async function prepareForDeployment() {
    try {
        console.log('--- Bắt đầu chuẩn bị gói triển khai ---');

        // 1. Tạo thư mục tạm để copy các file cần thiết
        console.log(`1. Tạo thư mục tạm: ${deployTempPath}`);
        await fs.emptyDir(deployTempPath); // Xóa nếu đã tồn tại và tạo mới

        // 2. Copy toàn bộ dự án vào thư mục tạm
        console('2. Copy dự án vào thư mục tạm...');
        await fs.copy(projectRoot, deployTempPath, {
            filter: (src) => {
                // Loại trừ thư mục deploy_temp chính nó khi copy
                return src !== deployTempPath;
            }
        });

        // 3. Xóa các file/thư mục không cần thiết trong thư mục tạm
        console('3. Xóa các file/thư mục không cần thiết...');
        for (const item of filesToExcludeInTemp) {
            const itemPath = path.join(deployTempPath, item);
            if (await fs.pathExists(itemPath)) {
                await fs.remove(itemPath);
                console.log(`   - Đã xóa: ${itemPath}`);
            }
        }

        // Đảm bảo thư mục dist của frontend được giữ lại
        const frontendDistPath = path.join(deployTempPath, 'frontend', 'dist');
        if (!(await fs.pathExists(frontendDistPath))) {
            console.warn(`Cảnh báo: Thư mục frontend/dist/ không tồn tại trong gói tạm. Frontend có thể không hoạt động.`);
        }

        // 4. Tạo file nén (zip)
        console(`4. Tạo file nén: ${outputPath}`);
        const output = fs.createWriteStream(outputPath);
        const archive = archiver('zip', {
            zlib: { level: 9 } // Mức độ nén cao nhất
        });

        output.on('close', () => {
            console.log(`Kích thước gói nén: ${archive.pointer() / 1024 / 1024} MB`);
            console.log('--- Gói triển khai đã được tạo thành công! ---');
            fs.remove(deployTempPath); // Xóa thư mục tạm sau khi nén
            console.log(`Đã xóa thư mục tạm: ${deployTempPath}`);
        });

        archive.on('warning', (err) => {
            if (err.code === 'ENOENT') {
                console.warn('Cảnh báo Archiver:', err);
            } else {
                throw err;
            }
        });

        archive.on('error', (err) => {
            throw err;
        });

        archive.pipe(output);

        // Thêm nội dung từ thư mục tạm vào file nén
        archive.directory(deployTempPath, false); // false để không thêm thư mục gốc của deploy_temp vào trong zip
        await archive.finalize();

    } catch (error) {
        console.error('Lỗi trong quá trình chuẩn bị triển khai:', error);
        // Đảm bảo xóa thư mục tạm nếu có lỗi
        if (await fs.pathExists(deployTempPath)) {
            await fs.remove(deployTempPath);
            console.log(`Đã dọn dẹp thư mục tạm sau lỗi: ${deployTempPath}`);
        }
        process.exit(1); // Thoát với mã lỗi
    }
}

prepareForDeployment();
Các bước cài đặt và sử dụng:
Cài đặt thư viện cần thiết:
Trước tiên, bạn cần cài đặt fs-extra và archiver vì chúng không phải là module tích hợp của Node.js.

Bash

npm install fs-extra archiver
Đặt file node-deploy.js:
Đặt file này ở thư mục gốc của dự án (my-fullstack-app/).

Thêm vào package.json (tùy chọn, để tiện lợi):
Bạn có thể thêm một script vào package.json ở thư mục gốc của dự án để dễ dàng chạy:

JSON

// my-fullstack-app/package.json
{
  "name": "my-fullstack-app",
  "version": "1.0.0",
  "scripts": {
    "deploy:prepare": "node node-deploy.js"
  },
  "devDependencies": {
    "fs-extra": "^x.x.x", // Đảm bảo phiên bản đúng
    "archiver": "^x.x.x"
  }
}
Thực hiện các lệnh build trước khi chạy script này:

Bạn cần đảm bảo rằng các bước build frontend và cài đặt Composer đã hoàn tất trước khi chạy node-deploy.js.

Bash

# 1. Chạy composer install cho backend (tạo vendor/)
cd backend
composer install --no-dev --optimize-autoloader
cd ..

# 2. Build frontend (tạo dist/)
cd frontend
npm install # Nếu chưa cài
npm run build # Lệnh này sẽ chạy webpack --mode production
cd ..

# 3. Chạy script để tạo gói deploy
npm run deploy:prepare # Nếu bạn đã thêm script vào package.json
# Hoặc: node node-deploy.js
Giải thích các phần quan trọng:
fs-extra: Một thư viện cực kỳ hữu ích mở rộng module fs của Node.js, giúp làm việc với file và thư mục dễ dàng hơn nhiều (ví dụ: fs.emptyDir, fs.copy, fs.remove, fs.pathExists).

archiver: Thư viện cho phép bạn tạo các file nén (.zip, .tar, v.v.) một cách lập trình.

deployTempPath: Một thư mục tạm thời được tạo ra. Tất cả các file cần thiết cho deployment sẽ được copy vào đây trước, sau đó các file không mong muốn sẽ bị xóa. Cuối cùng, thư mục này sẽ được nén lại. Cách này an toàn hơn so với việc xóa trực tiếp trong thư mục dự án gốc.

filesToExcludeInTemp: Mảng này chứa danh sách các đường dẫn (tương đối từ deploy_temp/) mà bạn muốn loại bỏ. Hãy tùy chỉnh nó cho phù hợp với cấu trúc dự án và yêu cầu của bạn.

archive.directory(deployTempPath, false): Lệnh này thêm toàn bộ nội dung của deployTempPath vào file nén. false đảm bảo rằng thư mục deploy_temp không trở thành thư mục gốc bên trong file .zip.

Script này sẽ tạo ra một file my-fullstack-app-prod.zip ở thư mục gốc của dự án của bạn, chứa tất cả code đã được tối ưu hóa và chỉ những gì cần thiết cho production. Bạn có thể tải file .zip này lên VPS và giải nén.

## Script node-deploy.js Tích Hợp Build và Đóng Gói

Chắc chắn rồi! Bạn có thể tích hợp các lệnh composer install và npm run build trực tiếp vào script Node.js này. Điều này sẽ tạo ra một quy trình build và đóng gói hoàn chỉnh trong một script duy nhất, rất tiện lợi cho tự động hóa.

Dưới đây là phiên bản cập nhật của node-deploy.js bao gồm các bước này:

Script node-deploy.js Tích Hợp Build và Đóng Gói
JavaScript

const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');
const { exec } = require('child_process'); // Để chạy các lệnh shell

// --- Cấu hình Đường dẫn ---
const projectRoot = __dirname;
const backendPath = path.join(projectRoot, 'backend');
const frontendPath = path.join(projectRoot, 'frontend');
const deployTempPath = path.join(projectRoot, 'deploy_temp');
const outputPath = path.join(projectRoot, 'my-fullstack-app-prod.zip');

// --- Danh sách các File/Thư mục cần LOẠI BỎ trong thư mục tạm sau khi copy ---
const filesToExcludeInTemp = [
    // Global (trong deploy_temp)
    '.git',
    '.DS_Store',
    // Backend specific (trong deploy_temp/backend)
    'backend/composer.lock', // Nếu bạn không cần trên prod
    'backend/.env', // Chỉ dùng cho dev, prod dùng .env riêng trên server
    'backend/tests',
    'backend/node_modules', // Dù Composer không dùng, nhưng nếu bạn có thư mục này
    // Frontend specific (trong deploy_temp/frontend)
    'frontend/node_modules', // Chắc chắn loại bỏ
    'frontend/src', // Source code JS đã được bundle vào frontend/dist
    'frontend/package-lock.json',
    'frontend/.env', // Chỉ dùng cho dev
    'frontend/webpack.config.js',
    'frontend/config',
    'frontend/.gitignore',
];

// Hàm tiện ích để chạy lệnh shell
function runCommand(command, cwd) {
    return new Promise((resolve, reject) => {
        console.log(`Running command: ${command} in ${cwd || 'current directory'}`);
        const child = exec(command, { cwd });

        child.stdout.on('data', (data) => {
            process.stdout.write(data);
        });

        child.stderr.on('data', (data) => {
            process.stderr.write(data);
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Command failed with code ${code}: ${command}`));
            }
        });
    });
}

async function prepareForDeployment() {
    try {
        console.log('--- Bắt đầu quy trình Build và Chuẩn bị Triển khai ---');

        // 0. Thực hiện Clean trước (tùy chọn nhưng nên có)
        console.log('0. Dọn dẹp thư mục dist và vendor cũ...');
        await fs.remove(path.join(frontendPath, 'dist'));
        await fs.remove(path.join(backendPath, 'vendor'));
        console.log('   - Đã dọn dẹp.');

        // 1. Chạy Composer Install cho Backend
        console.log('1. Cài đặt Composer Dependencies cho Backend...');
        await runCommand('composer install --no-dev --optimize-autoloader', backendPath);
        console.log('   - Composer Install hoàn tất.');

        // 2. Build Frontend
        console.log('2. Build Frontend với Webpack...');
        // Đảm bảo npm install đã chạy ở thư mục frontend trước đó trong env dev/CI/CD
        // Nếu không, bạn có thể thêm: await runCommand('npm install', frontendPath);
        await runCommand('npm run build', frontendPath);
        console.log('   - Frontend Build hoàn tất.');

        // 3. Tạo thư mục tạm để copy các file cần thiết
        console.log(`3. Tạo thư mục tạm: ${deployTempPath}`);
        await fs.emptyDir(deployTempPath);

        // 4. Copy toàn bộ dự án vào thư mục tạm
        console.log('4. Copy dự án vào thư mục tạm...');
        await fs.copy(projectRoot, deployTempPath, {
            filter: (src) => {
                // Loại trừ thư mục deploy_temp chính nó khi copy
                // và các thư mục node_modules, .git ở cấp projectRoot
                const relativePath = path.relative(projectRoot, src);
                if (relativePath === 'deploy_temp' ||
                    relativePath === '.git' ||
                    relativePath === 'node_modules') {
                    return false;
                }
                return true;
            }
        });

        // 5. Xóa các file/thư mục không cần thiết trong thư mục tạm
        console.log('5. Xóa các file/thư mục không cần thiết trong gói tạm...');
        for (const item of filesToExcludeInTemp) {
            const itemPath = path.join(deployTempPath, item);
            if (await fs.pathExists(itemPath)) {
                await fs.remove(itemPath);
                console.log(`   - Đã xóa: ${itemPath}`);
            }
        }

        // Đảm bảo thư mục dist của frontend được giữ lại
        const frontendDistPath = path.join(deployTempPath, 'frontend', 'dist');
        if (!(await fs.pathExists(frontendDistPath))) {
            console.warn(`Cảnh báo: Thư mục frontend/dist/ không tồn tại trong gói tạm. Frontend có thể không hoạt động.`);
        }

        // 6. Tạo file nén (zip)
        console.log(`6. Tạo file nén: ${outputPath}`);
        const output = fs.createWriteStream(outputPath);
        const archive = archiver('zip', {
            zlib: { level: 9 } // Mức độ nén cao nhất
        });

        output.on('close', () => {
            console.log(`Kích thước gói nén: ${archive.pointer() / 1024 / 1024} MB`);
            console.log('--- Gói triển khai đã được tạo thành công! ---');
            fs.remove(deployTempPath); // Xóa thư mục tạm sau khi nén
            console.log(`Đã xóa thư mục tạm: ${deployTempPath}`);
        });

        archive.on('warning', (err) => {
            if (err.code === 'ENOENT') {
                console.warn('Cảnh báo Archiver:', err);
            } else {
                throw err;
            }
        });

        archive.on('error', (err) => {
            throw err;
        });

        archive.pipe(output);

        // Thêm nội dung từ thư mục tạm vào file nén
        archive.directory(deployTempPath, false); // false để không thêm thư mục gốc của deploy_temp vào trong zip
        await archive.finalize();

    } catch (error) {
        console.error('Lỗi trong quá trình chuẩn bị triển khai:', error);
        if (await fs.pathExists(deployTempPath)) {
            await fs.remove(deployTempPath);
            console.log(`Đã dọn dẹp thư mục tạm sau lỗi: ${deployTempPath}`);
        }
        process.exit(1);
    }
}

prepareForDeployment();
Cập nhật các bước sử dụng:
Cài đặt thư viện cần thiết: (Chỉ cần chạy một lần)

Bash

npm install fs-extra archiver
Đặt file node-deploy.js:
Đặt file này ở thư mục gốc của dự án (my-fullstack-app/).

Cập nhật package.json (ở thư mục gốc của dự án):
Thêm script để tiện lợi chạy lệnh.

JSON

// my-fullstack-app/package.json
{
  "name": "my-fullstack-app",
  "version": "1.0.0",
  "scripts": {
    "deploy": "node node-deploy.js"
  },
  "devDependencies": {
    "fs-extra": "^x.x.x",
    "archiver": "^x.x.x"
  }
}
Chạy quy trình triển khai:
Bây giờ, bạn chỉ cần chạy một lệnh duy nhất từ thư mục gốc của dự án:

Bash

npm run deploy
Giải thích các thay đổi:
const { exec } = require('child_process');: Module này được thêm vào để cho phép script Node.js chạy các lệnh shell (như composer và npm).

runCommand(command, cwd) function: Một hàm tiện ích được tạo ra để bọc lệnh exec. Nó giúp chạy các lệnh theo kiểu Promise (async/await) và hiển thị output/error từ các lệnh con ra console.

Thứ tự các bước:

Bước 0 (Dọn dẹp cũ): Thêm bước xóa thư mục dist và vendor cũ. Điều này đảm bảo rằng mỗi lần bạn chạy script, bạn đang bắt đầu với một trạng thái sạch sẽ, tránh các vấn đề do các file cũ.

Bước 1 (Composer): Lệnh composer install --no-dev --optimize-autoloader được chạy trong thư mục backendPath.

Bước 2 (Webpack): Lệnh npm run build được chạy trong thư mục frontendPath.

Các bước tạo thư mục tạm, copy, xóa file và tạo zip tương tự như trước.

Với script này, bạn đã tạo ra một quy trình CI/CD thủ công đơn giản nhưng hiệu quả, cho phép bạn tạo ra một gói triển khai sẵn sàng chỉ với một lệnh duy nhất.