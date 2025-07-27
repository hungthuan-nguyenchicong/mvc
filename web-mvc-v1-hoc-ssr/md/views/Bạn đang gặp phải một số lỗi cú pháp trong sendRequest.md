## Bạn đang gặp phải một số lỗi cú pháp trong sendRequest

Bạn đang gặp phải một số lỗi cú pháp trong sendRequesthàm của mình, chủ yếu liên quan đến cách bạn gọi fetchvà định nghĩa method. Hãy cùng sửa những lỗi đó.

Sau đây là bản phân tích lỗi và mã đã sửa:

Giải thích lỗi:
BuildError: Expected ")" but found "{":

JavaScript

const response = await fetch('/admin/login' { // Missing a comma here
Khi fetchsử dụng đối số thứ hai ( initđối tượng), nó cần được phân tách bằng dấu phẩy khỏi URL.

BuildError: Expected ";" but found ":":

JavaScript

method: post, // `post` should be a string 'POST'
postcần phải là một chuỗi ký tự 'POST'vì nó là một giá trị trong đối tượng JavaScript, không phải là một biến.

BuildError: Expected "finally" but found ")": Lỗi này là kết quả của việc thiếu dấu phẩy trong fetchlệnh gọi. Khi các fetchđối số được phân tách chính xác, lỗi này sẽ được giải quyết.

BuildError: Expected "{" but found "const": Đây cũng là một chuỗi. Trình phân tích cú pháp bị nhầm lẫn vì lệnh fetchgọi không được đóng đúng cách.

BuildError: Unexpected catch: Một chuỗi lỗi cú pháp khác từ trước.

Các vấn đề khác:
btnLogin.preventDefault();: Bạn đang cố gọi preventDefault()một phần tử nút, chứ không phải một đối tượng sự kiện. preventDefault()nên được gọi trên eventđối tượng trong trình lắng nghe sự kiện để dừng hành vi gửi biểu mẫu mặc định.

sendRequestlocation : Hiện tại, sendRequestđược định nghĩa bên trong loginPage nhưng không được trả về hoặc đính kèm vào bất kỳ trình lắng nghe sự kiện nào. Nó sẽ không bao giờ được gọi. Để nó hoạt động, bạn cần:

Trả về sendRequesttừ loginPage()(ví dụ: như một phần của đối tượng bạn xuất).

Đính kèm vào trình lắng nghe sự kiện sendRequestcủa biểu mẫu sau khi HTML được hiển thị và biểu mẫu đã tồn tại trong DOM. Điều này ngụ ý cần phải thực thi JavaScript phía máy khách.submit

Đã sửa loginPage.jscho JS phía máy khách
Để sendRequestthực sự thực thi chức năng này ở phía máy khách khi biểu mẫu được gửi, bạn cần:

Bao gồm JavaScript trực tiếp trong HTML được trả về bởi render.

Đính kèm trình lắng nghe sự kiện vào biểu mẫu.

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
                    <h1>Login</h1>
                    <form id="loginForm" action="/admin/login" method="POST">
                        <div>
                            <label for="username">User Name <input type="text" id="username" name="username"></label><br>
                        </div>
                        <div>
                            <label for="password">Password <input type="password" id="password" name="password"></label><br>
                        </div>
                        <button type="submit">Login</button>
                    </form>
                    <div id="responseMessage" style="margin-top: 20px; color: green;"></div>
                </div>

                <script>
                    // This script runs on the client-side after the HTML is loaded
                    document.addEventListener('DOMContentLoaded', () => {
                        const form = document.getElementById('loginForm');
                        const responseMessageDiv = document.getElementById('responseMessage');

                        form.addEventListener('submit', async (event) => {
                            event.preventDefault(); // Prevent default form submission

                            const formData = new FormData(form);

                            try {
                                const response = await fetch('/admin/login', { // Corrected: comma after URL
                                    method: 'POST', // Corrected: 'POST' as a string
                                    body: formData
                                });
                                
                                const result = await response.json();
                                console.log(result);
                                responseMessageDiv.textContent = JSON.stringify(result); // Display response
                                responseMessageDiv.style.color = 'green';
                            } catch (error) {
                                console.error('Error during fetch:', error);
                                responseMessageDiv.textContent = 'Error: ' + error.message;
                                responseMessageDiv.style.color = 'red';
                            }
                        });
                    });
                </script>
            </body>
            </html>
        `;
    }
    return {
        render
    };
}

export default loginPage();
Những thay đổi chính:
ID biểu mẫu: Đã thay đổi id="login"để id="loginForm"tránh xung đột tiềm ẩn và làm cho biểu mẫu cụ thể hơn.

fetchCú pháp:

fetch('/admin/login', { ... })- Thêm dấu phẩy giữa URL và đối tượng tùy chọn.

method: 'POST'- Đã đổi postthành chuỗi 'POST'.

Bao gồm tập lệnh phía máy khách:

Logic sendRequesthiện được nhúng trực tiếp vào <script>thẻ bên trong HTML được trả về bởi render. Tập lệnh này sẽ được thực thi trên trình duyệt của người dùng.

document.addEventListener('DOMContentLoaded', ...)đảm bảo tập lệnh chỉ chạy sau khi toàn bộ tài liệu HTML được tải và phân tích.

Trình lắng nghe sự kiện được đính kèm vào submitsự kiện của biểu mẫu.

event.preventDefault()được gọi trên đối tượng sự kiện để ngăn trình duyệt thực hiện tải lại trang theo cách truyền thống khi gửi biểu mẫu.

Hiển thị phản hồi: Thêm divwith id="responseMessage"để hiển thị phản hồi JSON trực tiếp trên trang để có phản hồi trực quan.

inputtypes: Đã thay đổi type="text"từ nhập mật khẩu thành type="password"bảo mật. Đã thêm idthuộc tính vào đầu vào để dễ truy cập hơn ( label for="id").

Bây giờ, khi bạn điều hướng đến /admin/logintrình duyệt, bạn sẽ thấy biểu mẫu. Khi bạn gửi biểu mẫu, JavaScript bên trong trang sẽ chặn việc gửi, gửi POSTyêu cầu AJAX và hiển thị phản hồi JSON trên trang.