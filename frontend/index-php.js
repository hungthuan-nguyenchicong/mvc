// ./index-php.js
const fs = require('fs');
const path = require('path');

class IndexPhp {
    // ... (constructor và các phần khác giữ nguyên nếu bạn muốn)

    content() {
        // Đây là nội dung PHP của bạn với các khoảng trắng thừa
        const rawContent = `
            <?php
            require_once '../../backend/index.php'
            ?>
        `;
        
        // Sử dụng .trim() để loại bỏ các khoảng trắng thừa ở đầu và cuối
        return rawContent.trim();
    }

    createFile() {
        const directoryPath = path.join(__dirname, '../public/admin');

        fs.mkdir(directoryPath, { recursive: true }, (err) => {
            if (err) {
                console.error('Lỗi khi tạo thư mục:', err);
                return;
            }

            const fileName = 'index.php';
            const fullPath = path.join(directoryPath, fileName);
            const fileContent = this.content(); // Lấy nội dung đã được trim

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