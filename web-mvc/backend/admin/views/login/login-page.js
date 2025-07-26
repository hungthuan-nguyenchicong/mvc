// web-mvc/backend/admin/views/login/login-page.js

function loginPage() {
    // Định nghĩa Class như bình thường
    class ClientModule {
        constructor() {
            this.message = "ClientModule initialized!";
            console.log("ClientModule constructor running.");
        }
        init() {
            console.log(this.message);
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.addEventListener('submit', (event) => {
                    event.preventDefault();
                    console.log('Form submitted from ClientModule!');
                    alert('Login process initiated!');
                });
            } else {
                console.log('Login form not found on the page.');
            }
        }
        cleanup() {
            console.log("ClientModule cleanup called.");
        }
    }

    function render() {
        // Lấy mã nguồn của TOÀN BỘ Class ClientModule
        const tesstClassRender = ClientModule.toString(); 

        // Lấy mã nguồn của một PHƯƠNG THỨC cụ thể trong Class
        const initMethodRender = ClientModule.prototype.init.toString();

        return /* html */ `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Login Page with Class Test</title>
            </head>
            <body>
                <h1>Login Form</h1>
                <form id="loginForm">
                    <input type="text" placeholder="Username">
                    <input type="password" placeholder="Password">
                    <button type="submit">Login</button>
                </form>
                
                <script>
                    console.log("--- Bắt đầu các Script nhúng từ Class ---");

                    // BƯỚC 1: ĐỊNH NGHĨA CLASS. CHỈ CẦN CHÈN MÃ NGUỒN CỦA CLASS DECLARATION.
                    // KHÔNG CẦN ()() Ở ĐÂY! Class sẽ tự động được định nghĩa trong phạm vi script.
                    console.log("\\n--- Định nghĩa Class ClientModule ---");
                    ${tesstClassRender} 
                    // Lúc này, ClientModule đã là một class hợp lệ trong phạm vi này.

                    // BƯỚC 2: SỬ DỤNG CLASS SAU KHI NÓ ĐÃ ĐƯỢC ĐỊNH NGHĨA.
                    console.log("\\n--- Sử dụng Class ClientModule ---");
                    // Bạn có thể tạo instance và gọi phương thức của nó.
                    const clientInstance = new ClientModule(); 
                    clientInstance.init(); 

                    // Test Phương thức: Nhúng và thực thi chỉ PHƯƠNG THỨC 'init' của Class.
                    // Cái này vẫn dùng ()() vì initMethodRender là một function expression.
                    console.log("\\n--- Nhúng và chạy phương thức init() trực tiếp (vẫn dùng IIFE) ---");


                    console.log("\\n--- Kết thúc các Script nhúng từ Class ---");
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