

# Có vẻ như bạn đang thử nghiệm với closure, đây là một khái niệm tuyệt vời để hiểu trong JavaScript!

Trong loginPage.jstập tin của bạn, bạn có:

JavaScript

// web-mvc/backend/admin/views/login-page.js

function loginPage() {
    function render() {
        return /* html */ `
            <h1>Login</h1>
        `;
    }
}

export default loginPage();
Cảnh báo TypeScript 'loginPage' is declared but its value is never read.ts(6133)xuất hiện là do khi bạn gọi loginPage()câu export defaultlệnh, loginPage bản thân hàm không trả về bất kỳ giá trị nào được sử dụng ở nơi khác sau khi nó được gọi. Quan trọng hơn, renderhàm bên trong loginPagecũng không được trả về hoặc gọi, khiến nó không thể truy cập được từ bên ngoài.

Chúng ta hãy cấu trúc lại phần này để chứng minh một closure hiệu quả hơn, trong đó loginPagehàm hoạt động như một nhà máy trả về một hàm khác (như renderhoặc một phương thức có thể truy cập render):

Hiểu về Closures với loginPageví dụ của bạn
Một closure xảy ra khi một hàm bên trong nhớ và có thể truy cập vào các biến từ hàm bên ngoài (bao quanh), ngay cả sau khi hàm bên ngoài đã thực thi xong.

Sau đây là cách bạn có thể sửa đổi loginPageđể sử dụng đúng cách một lệnh đóng, cho phép bạn thực hiện exportmột việc hữu ích mà sau đó bạn có thể gọi ở nơi khác:

JavaScript

// web-mvc/backend/admin/views/login-page.js

function createLoginPage() { // Renamed for clarity: this "creates" the login page handler
    // 'render' is defined within the scope of 'createLoginPage'
    // It "closes over" any variables defined in 'createLoginPage' (though none exist here yet)
    function render() {
        return /* html */ `
            <h1>Login</h1>
            <p>Welcome to the admin login page.</p>
        `;
    }

    // This is where the closure magic happens for export:
    // We return an object that contains a reference to the 'render' function.
    // When you call 'createLoginPage()', it returns this object.
    // The 'render' function within this object still has access to its lexical environment (where it was defined).
    return {
        renderPage: render // We're exposing the inner 'render' function as 'renderPage'
    };
}

// When you export createLoginPage(), you're exporting the factory function itself.
// export default createLoginPage;

// If you want to export the *result* of calling createLoginPage(),
// then you're exporting the object { renderPage: render }.
// This is likely what you intended based on your original `export default loginPage();`
export default createLoginPage();
Cách sử dụng trong một tập tin khác:
Bây giờ, trong một phần khác của ứng dụng (ví dụ: logic định tuyến), bạn có thể nhập và sử dụng nó:

JavaScript

// web-mvc/backend/admin/core/AdminRoutes.js (Example usage)

import loginPageView from '../views/login-page.js'; // Notice the default import name can be anything

const AdminRoutes = {
    '/admin/login': req => {
        // Here, loginPageView is the object { renderPage: render } that was exported.
        // We can now call the 'renderPage' method on it.
        const htmlContent = loginPageView.renderPage();
        return new Response(htmlContent, {
            headers: { 'Content-Type': 'text/html' }
        });
    },
    // ... other routes
};

export default AdminRoutes;
Tóm tắt về Thay đổi và Khái niệm Đóng cửa:
createLoginPageHàm: Đây là hàm bên ngoài của bạn. Khi chạy, nó sẽ định nghĩa renderhàm bên trong.

renderHàm: Đây là hàm bên trong. Ngay cả sau khi createLoginPagethực thi xong, nó rendervẫn "ghi nhớ" môi trường của nó (phạm vi của createLoginPage).

Đối tượng trả về: Bằng cách trả về một đối tượng { renderPage: render }, về cơ bản bạn đang cung cấp một giao diện cho renderhàm từ bên ngoài createLoginPage. Khi bạn gọi loginPageView.renderPage(), bạn đang thực thi renderhàm đó, hàm này vẫn có thể truy cập vào bất kỳ thứ gì nằm trong createLoginPagephạm vi của ' (nếu có bất kỳ biến nào được định nghĩa ở đó).

Mẫu này rất phổ biến trong JavaScript để tạo mô-đun, nhà máy và quản lý trạng thái riêng tư trong các hàm.

Bạn có muốn thử một ví dụ trong đó hàm bên trong thao tác với một biến từ phạm vi bên ngoài để xem closure hoạt động như thế nào không?