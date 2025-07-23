// src/main.js
// Đây là mã JavaScript chạy ở phía trình duyệt (client-side).

console.log("Client-side JavaScript đã tải.");

// Đảm bảo DOM đã được tải đầy đủ trước khi thao tác với các phần tử
document.addEventListener('DOMContentLoaded', () => {
    const counterButton = document.getElementById('counter-button');
    const appMessage = document.getElementById('app-message');
    let count = 0;

    const appDiv = document.getElementById('app');

    // Kiểm tra xem các phần tử có tồn tại trước khi thao tác với chúng
    if (appDiv) {
        if (appMessage) {
            appMessage.textContent = "Phần as 'app' đã được render từ máy chủ và bây giờ được 'hydrate' bởi client-side JS.";
        } else {
            console.warn("Phần tử với id 'app-message' không được tìm thấy.");
        }
    } else {
        if (appMessage) {
            appMessage.textContent = "Phần 'app' không được render từ máy chủ, chỉ có client-side JS hoạt động.";
        } else {
            console.warn("Phần tử với id 'app-message' không được tìm thấy.");
        }

        // Tạo và chèn div #app nếu nó không được SSR
        const ssrPlaceholder = document.getElementById('app-ssr-placeholder'); // Placeholder này không có trong HTML hiện tại của bạn
        const newAppDiv = document.createElement('div');
        newAppDiv.id = 'app';
        newAppDiv.innerHTML = `<h1>Chào mừng từ Client!</h1><p>Ứng dụng được khởi tạo hoàn toàn từ client.</p>`;

        // Cần một phần tử cha để chèn newAppDiv
        // Nếu không có ssrPlaceholder, chúng ta có thể chèn vào body hoặc một container khác
        if (ssrPlaceholder) {
            ssrPlaceholder.appendChild(newAppDiv);
        } else {
            // Chèn vào body nếu không có placeholder cụ thể
            document.body.prepend(newAppDiv);
            console.warn("Không tìm thấy phần tử với id 'app-ssr-placeholder'. Đã chèn #app vào đầu body.");
        }
    }

    if (counterButton) {
        counterButton.addEventListener('click', () => {
            count++;
            counterButton.textContent = `Nhấn vào đây: ${count}`;
        });
    } else {
        console.warn("Phần tử với id 'counter-button' không được tìm thấy.");
    }

    const clientMessage = document.getElementById('client-message');
    if (clientMessage) {
        clientMessage.style.color = '#10b981'; // Màu xanh lá cây
    } else {
        console.warn("Phần tử với id 'client-message' không được tìm thấy.");
    }
});
