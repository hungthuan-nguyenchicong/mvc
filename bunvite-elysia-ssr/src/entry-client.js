// src/entry-client.js
// Chúng ta không cần import appView hay data ở đây vì HTML đã được render.
// Chỉ cần thêm logic tương tác vào DOM đã có.

console.log('Client-side script loaded for hydration.');

// Đảm bảo mã này chỉ chạy trên trình duyệt
if (typeof document !== 'undefined') {
    const button = document.getElementById('myButton');
    const clickCountElement = document.getElementById('clickCount');
    let count = 0;

    // Lấy số đếm ban đầu nếu có từ SSR (ví dụ này không truyền, nhưng trong thực tế có thể)
    // const initialCount = parseInt(clickCountElement.textContent.replace('Đã click: ', '').replace(' lần', '')) || 0;
    // count = initialCount;

    if (button && clickCountElement) {
        button.addEventListener('click', () => {
            count++;
            clickCountElement.textContent = `Đã s click: ${count} lần`;
            console.log('Nút đã được click (Client-side)!');
        });
    }
}