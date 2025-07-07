## import

Để import (hay sử dụng) một file JavaScript (createFile.js) vào một file JavaScript khác (build.js) trong Node.js, bạn sẽ sử dụng hệ thống module của Node.js. Node.js hỗ trợ hai hệ thống module chính:

CommonJS (module.exports và require()): Đây là hệ thống module truyền thống và mặc định của Node.js.

ES Modules (export và import): Đây là tiêu chuẩn module của JavaScript hiện đại, được hỗ trợ trong Node.js phiên bản mới hơn.

Chúng ta sẽ xem xét cả hai cách.

Cách 1: Sử dụng CommonJS (phổ biến trong Node.js)
Bước 1: Chỉnh sửa createFile.js để export chức năng

Để một file có thể được require bởi file khác, nó cần phải "export" các hàm hoặc biến mà nó muốn chia sẻ.

JavaScript

// createFile.js
const fs = require('fs');

function createPhpInfoFile(fileName = 'info.php') { // Đóng gói logic vào một hàm và nhận tên file làm tham số
    const fileContent = `<?php

// This is a simple PHP info file

echo "<h1>Hello from Node.js created PHP file!</h1>";
echo "<p>Current date and time: " . date("Y-m-d H:i:s") . "</p>";

// You can add more PHP code here, e.g., phpinfo();
// phpinfo(); // Uncomment this line to display full PHP info

?>`;

    fs.writeFile(fileName, fileContent, (err) => {
        if (err) {
            console.error('Lỗi khi tạo file:', err);
            return;
        }
        console.log(`File '${fileName}' đã được tạo thành công!`);
    });
}

// Export hàm này để có thể được sử dụng ở các file khác
module.exports = createPhpInfoFile;
Bước 2: Sử dụng createPhpInfoFile trong build.js

JavaScript

// build.js
const createPhpInfoFile = require('./createFile.js'); // Import hàm từ createFile.js

// Bây giờ bạn có thể gọi hàm để tạo file info.php
console.log('Bắt đầu quá trình build...');
createPhpInfoFile('build_info.php'); // Gọi hàm để tạo file info.php với tên khác
console.log('Quá trình build hoàn tất.');

// Bạn cũng có thể gọi nó nhiều lần hoặc với các tên file khác nhau
// createPhpInfoFile('another_info.php');
Giải thích:

Trong createFile.js, chúng ta đóng gói toàn bộ logic tạo file vào một hàm tên là createPhpInfoFile.

Dòng module.exports = createPhpInfoFile; là quan trọng. Nó cho phép hàm createPhpInfoFile có thể được truy cập từ các file JavaScript khác.

Trong build.js, const createPhpInfoFile = require('./createFile.js'); sẽ "nhập" những gì được export từ createFile.js vào biến createPhpInfoFile.

Lưu ý đường dẫn: './createFile.js' là đường dẫn tương đối đến file createFile.js từ vị trí của build.js. Nếu chúng ở cùng cấp thư mục thì đường dẫn này là đúng.

Cách chạy:
Mở terminal và chạy node build.js.

Cách 2: Sử dụng ES Modules (cần cấu hình Node.js hoặc đổi đuôi .mjs)
Để sử dụng import và export theo tiêu chuẩn ES Modules trong Node.js, bạn có hai lựa chọn chính:

Đổi đuôi file thành .mjs: Node.js sẽ tự động coi các file .mjs là ES Modules.

Thêm "type": "module" vào package.json: Điều này sẽ làm cho tất cả các file .js trong dự án của bạn được coi là ES Modules.

Lựa chọn A: Đổi đuôi file thành .mjs

Bước 1: Chỉnh sửa createFile.mjs để export chức năng

JavaScript

// createFile.mjs
import fs from 'fs'; // Sử dụng import thay vì require

export function createPhpInfoFile(fileName = 'info.php') { // Sử dụng export
    const fileContent = `<?php

// This is a simple PHP info file

echo "<h1>Hello from Node.js created PHP file!</h1>";
echo "<p>Current date and time: " . date("Y-m-d H:i:s") . "</p>";

?>`;

    fs.writeFile(fileName, fileContent, (err) => {
        if (err) {
            console.error('Lỗi khi tạo file:', err);
            return;
        }
        console.log(`File '${fileName}' đã được tạo thành công!`);
    });
}
Bước 2: Sử dụng createPhpInfoFile trong build.mjs

JavaScript

// build.mjs
import { createPhpInfoFile } from './createFile.mjs'; // Sử dụng import với destructuring nếu export không phải là default

console.log('Bắt đầu quá trình build...');
createPhpInfoFile('build_info_es.php'); // Gọi hàm để tạo file info.php
console.log('Quá trình build hoàn tất.');
Cách chạy:
Mở terminal và chạy node build.mjs.

Lựa chọn B: Thêm "type": "module" vào package.json

Bước 1: Khởi tạo package.json nếu chưa có

Nếu bạn chưa có file package.json trong thư mục gốc dự án của mình, hãy tạo nó bằng cách chạy:

Bash

npm init -y
Bước 2: Thêm "type": "module"

Mở file package.json và thêm dòng "type": "module":

JSON

{
  "name": "my-project",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module", // Thêm dòng này
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
Bước 3: Chỉnh sửa createFile.js để export chức năng (như ES Modules)

Giữ nguyên tên file là .js nhưng viết code theo cú pháp ES Modules:

JavaScript

// createFile.js
import fs from 'fs';

export function createPhpInfoFile(fileName = 'info.php') {
    const fileContent = `<?php

// This is a simple PHP info file

echo "<h1>Hello from Node.js created PHP file!</h1>";
echo "<p>Current date and time: " . date("Y-m-d H:i:s") . "</p>";

?>`;

    fs.writeFile(fileName, fileContent, (err) => {
        if (err) {
            console.error('Lỗi khi tạo file:', err);
            return;
        }
        console.log(`File '${fileName}' đã được tạo thành công!`);
    });
}
Bước 4: Sử dụng createPhpInfoFile trong build.js (như ES Modules)

Giữ nguyên tên file là .js nhưng viết code theo cú pháp ES Modules:

JavaScript

// build.js
import { createPhpInfoFile } from './createFile.js';

console.log('Bắt đầu quá trình build...');
createPhpInfoFile('build_info_es.php');
console.log('Quá trình build hoàn tất.');
Cách chạy:
Mở terminal và chạy node build.js.

Tóm lại:

CommonJS (require/module.exports) là lựa chọn an toàn và phổ biến nhất cho hầu hết các dự án Node.js hiện tại, đặc biệt là với các phiên bản Node.js cũ hơn.

ES Modules (import/export) là tiêu chuẩn hiện đại hơn và được khuyến khích sử dụng trong các dự án mới, nhưng yêu cầu cấu hình thêm (đuôi .mjs hoặc "type": "module" trong package.json).

Hãy chọn phương pháp phù hợp với dự án và phiên bản Node.js của bạn.