// web-mvc/src/admin/core/quill/handlers/linkQuill.js

function linkQuill() {
    // 1. Lấy con trỏ của Quill editor
    const quill = this.quill;

    // 2. Lấy vùng chọn hiện tại
    const range = quill.getSelection();

    // Kiểm tra xem có vùng chọn nào không
    if (range) {
        // 3. Hiển thị hộp thoại nhập URL
        const url = prompt("Nhập URL cho link:");

        // 4. Nếu người dùng nhập URL
        if (url) {
            // 5. Áp dụng định dạng link cho vùng chọn
            quill.format('link', url, 'user');
        }
    } else {
        // Nếu không có vùng chọn, chỉ cần trỏ chuột vào
        // (Đây là logic mặc định, bạn có thể tùy chỉnh)
        quill.format('link', null); 
    }
}

export { linkQuill };