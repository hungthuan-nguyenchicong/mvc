const fs = require('fs');
const path = require('path');

const oldFileName = '../public/admin/index.html';
const newFileName = '../public/admin/index.php';
const filePath = path.join(__dirname, oldFileName); // Giả sử index.html nằm ở cùng cấp với build.js
const newFilePath = path.join(__dirname, newFileName);

fs.rename(filePath, newFilePath, (err) => {
    if (err) {
        console.error(`Lỗi khi đổi tên file: ${err}`);
    } else {
        console.log(`Đã đổi tên ${oldFileName} thành ${newFileName} thành công!`);
    }
});