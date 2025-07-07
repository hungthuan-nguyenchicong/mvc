## tao file

class IndexPhp {
    // ... (constructor giữ nguyên)

    content() {
        // Nội dung PHP của bạn với thụt lề để dễ đọc trong JS
        const rawPhpCode = `
            <?php
            phpinfo();
            ?>
        `;
        
        // Sử dụng hàm cleanPhpString để xử lý
        return cleanPhpString(rawPhpCode);
    }

    createFile() {
        const directoryPath = path.join(__dirname, '../public/admin');

        fs.mkdir(directoryPath, { recursive: true }, (err) => {
            if (err) {
                console.error('Lỗi khi tạo thư mục:', err);
                return;
            }

            const fileName = 'infor.php';
            const fullPath = path.join(directoryPath, fileName);
            const fileContent = this.content();

            fs.writeFile(fullPath, fileContent, (error) => {
                if (error) {
                    console.error(`Lỗi khi tạo file '${fullPath}':`, error);
                    return;
                }
                console.log(`File '${fullPath}' đã được tạo thành công!`);
            });
        });
    }
}

module.exports = new IndexPhp();

## doc và copy

Có, Node.js hoàn toàn có thể đọc nội dung của một file .php và sau đó viết lại nội dung đó vào một file khác, hoặc chỉnh sửa nội dung rồi mới viết lại. Quá trình này về cơ bản giống như "copy and paste" nhưng được thực hiện bằng code.

Bạn sẽ sử dụng module fs (File System) của Node.js cho việc này.

Dưới đây là một ví dụ minh họa:

Tình huống:
Bạn có một file PHP tên là original.php và muốn đọc nội dung của nó, sau đó viết nội dung đó (hoặc nội dung đã chỉnh sửa) vào một file mới tên là copied.php.

Bước 1: Chuẩn bị file original.php (tạo thủ công)

PHP

<?php
// original.php
echo "Hello from original PHP file!";
$name = "World";
echo "My name is " . $name . "!";
?>
Bước 2: Viết script Node.js để đọc và ghi file

JavaScript

// readWritePhp.js
const fs = require('fs');
const path = require('path');

const originalFilePath = path.join(__dirname, 'original.php');
const copiedFilePath = path.join(__dirname, 'copied.php'); // File đích
const modifiedFilePath = path.join(__dirname, 'modified.php'); // File đích đã chỉnh sửa

// --- Hàm đọc và ghi file cơ bản (giống copy-paste) ---
function copyPhpFile() {
    fs.readFile(originalFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Lỗi khi đọc file gốc:', err);
            return;
        }

        console.log('Nội dung file gốc đã đọc:\n', data);

        // Viết nội dung đã đọc vào file mới
        fs.writeFile(copiedFilePath, data, (err) => {
            if (err) {
                console.error('Lỗi khi ghi file sao chép:', err);
                return;
            }
            console.log(`File '${copiedFilePath}' đã được sao chép thành công!`);
        });
    });
}

// --- Hàm đọc, chỉnh sửa và ghi file ---
function modifyAndWritePhpFile() {
    fs.readFile(originalFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Lỗi khi đọc file gốc:', err);
            return;
        }

        console.log('\n--- Bắt đầu chỉnh sửa nội dung ---');
        let modifiedContent = data;

        // Ví dụ chỉnh sửa: thêm một dòng comment mới
        modifiedContent = modifiedContent.replace('<?php', '<?php\n// This line was added by Node.js script');

        // Ví dụ chỉnh sửa: thay thế một từ
        modifiedContent = modifiedContent.replace('original', 'Node.js-modified');

        console.log('Nội dung sau khi chỉnh sửa:\n', modifiedContent);

        // Ghi nội dung đã chỉnh sửa vào file mới
        fs.writeFile(modifiedFilePath, modifiedContent, (err) => {
            if (err) {
                console.error('Lỗi khi ghi file đã chỉnh sửa:', err);
                return;
            }
            console.log(`File '${modifiedFilePath}' đã được tạo với nội dung chỉnh sửa thành công!`);
        });
    });
}

// Thực thi các hàm
copyPhpFile();
modifyAndWritePhpFile();
Bước 3: Chạy script Node.js

Mở terminal tại thư mục chứa các file trên và chạy:

Bash

node readWritePhp.js
Kết quả:

Bạn sẽ thấy output trong console hiển thị nội dung file gốc và nội dung sau khi chỉnh sửa.

Trong cùng thư mục, bạn sẽ tìm thấy hai file mới:

copied.php: Chứa nội dung y hệt original.php.

modified.php: Chứa nội dung đã được Node.js chỉnh sửa.

Giải thích:

fs.readFile(filePath, 'utf8', callback):

Đọc nội dung của file tại filePath.

'utf8' là encoding để đảm bảo đọc đúng ký tự.

callback được gọi khi quá trình đọc hoàn tất, với hai tham số: err (nếu có lỗi) và data (nội dung file dưới dạng chuỗi).

fs.writeFile(filePath, content, callback):

Ghi content vào file tại filePath.

Nếu file chưa tồn tại, nó sẽ được tạo. Nếu đã tồn tại, nội dung cũ sẽ bị ghi đè.

callback được gọi sau khi quá trình ghi hoàn tất.

.replace(): Phương thức chuỗi JavaScript này được sử dụng để tìm kiếm và thay thế các phần của chuỗi, rất hữu ích cho việc chỉnh sửa nội dung file.

Như vậy, Node.js hoàn toàn có khả năng đọc, thao tác và ghi lại nội dung của bất kỳ file văn bản nào, bao gồm cả file .php. Đây là một kỹ thuật cơ bản và rất mạnh mẽ trong Node.js để tự động hóa các tác vụ liên quan đến file.