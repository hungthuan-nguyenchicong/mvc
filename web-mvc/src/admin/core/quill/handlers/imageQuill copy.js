// web-mvc/src/admin/core/quill/handlers/imageQuill.js
function imageQuill() {
    // 1. Lấy con trỏ của Quill
    const quill = this.quill;

    // 2. Lắng nghe sự kiện useImage
    document.addEventListener('useImage', (e) => {
        // Lấy thông tin từ sự kiện
        const { imageUrl, imageAlt, imageCaption } = e.detail;
        
        // 3. Sử dụng Quill API để chèn Blot
        const range = quill.getSelection(true);
        if (range) {
            // Chèn Blot tùy chỉnh tại vị trí con trỏ
            quill.insertEmbed(range.index, 'figure', { imageUrl, imageAlt, imageCaption }, Quill.sources.USER);
            
            // Di chuyển con trỏ xuống một dòng mới sau khi chèn ảnh
            quill.setSelection(range.index + 1);
        }
    }, { once: true }); // Dùng { once: true } để chỉ lắng nghe một lần

    // 4. Kích hoạt logic hiển thị hộp thoại upload (nếu có)
    // Ví dụ: Kích hoạt một sự kiện khác hoặc gọi một hàm để mở modal upload
    // const uploadEvent = new CustomEvent('showImageUploadModal');
    // document.dispatchEvent(uploadEvent);
}
export { imageQuill };