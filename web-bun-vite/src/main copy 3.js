// src/main.js
// Đây là mã JavaScript chạy ở phía trình duyệt (client-side).


if (import.meta.hot) {
  import.meta.hot.accept();
}
console.log("Client-side JavaScript đã tải.");

// Đảm bảo DOM đã được tải đầy đủ trước khi thao tác với các phần tử
document.addEventListener('DOMContentLoaded', () => {
    // Lấy tham chiếu đến các phần tử HTML bằng ID của chúng
    const counterButton = document.getElementById('counter-button');
    const appMessage = document.getElementById('app-message');
    const clientMessage = document.getElementById('client-message');

    let count = 0; // Biến đếm cho nút

    // Cảnh báo: Để tránh các cảnh báo "không được tìm thấy" trong console,
    // vui lòng đảm bảo rằng các phần tử với ID 'app-message', 'counter-button',
    // và 'client-message' được render trong HTML ban đầu từ máy chủ Bun SSR.
    // Ví dụ, trong hàm renderAppOnServer của server.js, bạn có thể có cấu trúc tương tự:
    // `<div id="app">
    //    <p id="app-message">Nội dung này được render từ máy chủ.</p>
    //    <button id="counter-button">Nhấn vào đây: 0</button>
    //    <p id="client-message">Thông báo từ client-side.</p>
    // </div>`

    // Cập nhật nội dung của phần tử tin nhắn ứng dụng
    if (appMessage) {
        appMessage.textContent = "Phần 'app' đã được render từ máy chủ và bây giờ được 'hydrate' bởi client-side JS.";
    } else {
        console.warn("Phần tử với id 'app-message' không được tìm thấy. Vui lòng đảm bảo nó được SSR.");
    }

    // Gắn trình nghe sự kiện cho nút đếm
    if (counterButton) {
        counterButton.textContent = `Nhấn vào đây: ${count}`; // Đặt nội dung ban đầu cho nút
        counterButton.addEventListener('click', () => {
            count++;
            counterButton.textContent = `Nhấn vào đây: ${count}`;
        });
    } else {
        console.warn("Phần tử với id 'counter-button' không được tìm thấy. Vui lòng đảm bảo nó được SSR.");
    }

    // Cập nhật kiểu và nội dung của phần tử tin nhắn client
    if (clientMessage) {
        clientMessage.style.color = '#10b981'; // Màu xanh lá cây
        clientMessage.textContent = "Thông báo từ client-side.";
    } else {
        console.warn("Phần tử với id 'client-message' không được tìm thấy. Vui lòng đảm bảo nó được SSR.");
    }
});
