## Để kiểm tra yêu cầu POST

Tuyệt vời, bạn đã thiết lập AdminControllerđể xử lý cả yêu cầu GET và POST cho tuyến đăng nhập và bạn đang hiển thị HTML chính xác cho các yêu cầu GET!

Để kiểm tra yêu cầu POST và nhận {"message":"login post"}phản hồi JSON, bạn sẽ cần một cách để gửi yêu cầu POST đến /admin/loginđiểm cuối của mình. Dưới đây là một vài cách phổ biến để thực hiện việc này, tùy thuộc vào thiết lập của bạn:

1. Sử dụng biểu mẫu HTML (dựa trên trình duyệt)
Đây là cách trực tiếp nhất để kiểm tra từ trình duyệt. Bạn có thể sửa đổi loginPage.jsđể bao gồm một biểu mẫu HTML cơ bản.

JavaScript

// web-mvc/backend/admin/views/loginPage.js

function loginPage() {
    function render() {
        return /* html */ `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Admin Login</title>
                <style>
                    body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f4f4f4; }
                    .login-container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    h1 { text-align: center; color: #333; }
                    form div { margin-bottom: 15px; }
                    label { display: block; margin-bottom: 5px; color: #555; }
                    input[type="text"], input[type="password"] { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
                    button { width: 100%; padding: 10px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
                    button:hover { background-color: #0056b3; }
                </style>
            </head>
            <body>
                <div class="login-container">
                    <h1>Admin Login</h1>
                    <form method="POST" action="/admin/login">
                        <div>
                            <label for="username">Username:</label>
                            <input type="text" id="username" name="username" required>
                        </div>
                        <div>
                            <label for="password">Password:</label>
                            <input type="password" id="password" name="password" required>
                        </div>
                        <button type="submit">Login</button>
                    </form>
                </div>
            </body>
            </html>
        `;
    }
    return {
        render
    };
}

export default loginPage();
Cách kiểm tra:

Đảm bảo máy chủ của bạn đang chạy và xử lý được /admin/logintuyến đường.

Mở trình duyệt của bạn và điều hướng đến http://localhost:your-port/admin/login(thay thế your-portbằng cổng thực tế mà máy chủ của bạn đang chạy).

Bạn sẽ thấy biểu mẫu đăng nhập. Điền một số thông tin giả định và nhấp vào nút "Đăng nhập".

Trình duyệt của bạn sẽ gửi yêu cầu POST và bạn sẽ thấy phản hồi JSON {"message":"login post"}trong trình duyệt. (Lưu ý: Trình duyệt thường cố gắng hiển thị trực tiếp phản hồi JSON nếu đó là nội dung duy nhất).

2. Sử dụng các công cụ như Postman, Insomnia hoặc cURL (Kiểm tra API)
Để thử nghiệm API mạnh mẽ hơn, những công cụ này là không thể thiếu vì chúng cung cấp cho bạn toàn quyền kiểm soát yêu cầu.

Sử dụng Postman/Insomnia:
Tạo yêu cầu mới.

Đặt Phương pháp thành POST.

Nhập URL : http://localhost:your-port/admin/login.

(Tùy chọn nhưng là cách tốt để kiểm tra API): Vào tab "Nội dung", chọn raw, sau đó JSON(hoặc application/x-www-form-urlencodednếu bạn muốn mô phỏng việc gửi biểu mẫu chính xác hơn). Bạn có thể gửi một nội dung JSON đơn giản như sau:

JSON

{
    "username": "admin",
    "password": "password123"
}
Nhấp vào Gửi .

Bạn sẽ thấy {"message":"login post"}phản hồi JSON trong bảng phản hồi.

Sử dụng cURL (Dòng lệnh):
cURL là một công cụ dòng lệnh để thực hiện các yêu cầu mạng.

Mở terminal và chạy:

Đập

curl -X POST http://localhost:your-port/admin/login \
     -H "Content-Type: application/json" \
     -d '{"username": "test", "password": "123"}'
Thay thế your-portbằng cổng máy chủ của bạn.

Giải thích:

-X POST: Chỉ định phương thức HTTP là POST.

http://localhost:your-port/admin/login: URL mục tiêu của bạn.

-H "Content-Type: application/json": Đặt Content-Typetiêu đề, thông báo cho máy chủ rằng nội dung yêu cầu là JSON.

-d '{"username": "test", "password": "123"}': Gửi dữ liệu được chỉ định dưới dạng nội dung yêu cầu.

Lệnh này sẽ xuất {"message":"login post"}trực tiếp ra terminal của bạn.

Các bước tiếp theo cho Logic đăng nhập của bạn:
Sau khi xác nhận yêu cầu POST đang hoạt động, bạn sẽ muốn:

Phân tích cú pháp nội dung yêu cầu: Bạn AdminControllersẽ cần đọc dữ liệu được gửi trong yêu cầu POST (ví dụ: tên người dùng và mật khẩu từ biểu mẫu hoặc JSON). Ví dụ: nếu bạn đang sử dụng một khung hoặc thư viện để xử lý yêu cầu, nó có thể cung cấp req.bodyhoặc tương tự. Nếu không, bạn sẽ cần reqtự phân tích cú pháp (ví dụ: sử dụng req.json()hoặc req.formData()tùy thuộc vào cách dữ liệu được gửi).

Xác thực: So sánh thông tin đăng nhập đã gửi với cơ sở dữ liệu người dùng hoặc danh sách được mã hóa cứng.

Phản hồi: Gửi phản hồi thành công hoặc thất bại (ví dụ: chuyển hướng khi thành công hoặc trả về JSON lỗi khi thất bại).

Bạn muốn thử phương pháp kiểm tra nào trước tiên hoặc bạn muốn có ví dụ về cách phân tích cú pháp nội dung yêu cầu trong AdminController?