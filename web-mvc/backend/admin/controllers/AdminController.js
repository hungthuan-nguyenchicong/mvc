// web-mvc/backend/admin/controllers/AdminController.js

// import loginPage from "../views/loginPage"; // Bạn không cần import loginPage vào controller này nữa
                                            // vì loginPage đã tự xử lý logic client-side

class AdminController {
    constructor(req) {
        this.req = req;
    }

    async index() {
        return new Response('adm ctl index');
    }

    async login() {
        if (this.req.method === 'POST') {
            try {
                // 1. Đọc dữ liệu POST từ request body
                // Nếu bạn gửi FormData từ HTML form, bạn có thể dùng req.formData()
                const formData = await this.req.formData();

                // Lấy giá trị username và password
                const username = formData.get('username');
                const password = formData.get('password');

                console.log('Received POST data:');
                console.log('Username:', username);
                console.log('Password:', password);

                // 2. Xử lý Logic (ví dụ đơn giản: kiểm tra username/password cứng)
                if (username === 'admin' && password === '123') {
                    // Trả về JSON khi đăng nhập thành công
                    return Response.json({
                        message: "Login successful",
                        user: username,
                        status: 'success'
                    });
                } else {
                    // Trả về JSON khi đăng nhập thất bại
                    return Response.json({
                        message: "Invalid username or password",
                        status: 'error'
                    }, { status: 401 }); // Trả về status 401 Unauthorized
                }

            } catch (error) {
                console.error("Error parsing form data or during login:", error);
                return Response.json({
                    message: "Server error during login",
                    error: error.message,
                    status: 'error'
                }, { status: 500 }); // Trả về status 500 Internal Server Error
            }
        }
        
        // Logic cho GET request (hiển thị trang login)
        // Bạn cần một cách để render loginPage ở đây.
        // Có thể bạn sẽ tạo một hàm riêng để render view và gọi nó.
        // Ví dụ: import renderLoginPage from "../views/loginPage";
        // const html = renderLoginPage.render(); // Hoặc cách bạn đã thiết lập trước đó
        
        // *** Lưu ý quan trọng: ***
        // Với cách bạn đang export loginPage() ở client-side script,
        // thì ở đây bạn không cần render nó nữa.
        // Tuy nhiên, nếu bạn muốn dùng AdminController để trả về HTML cho GET request,
        // bạn cần một cơ chế render HTML từ server.
        // Tạm thời, tôi sẽ giả định rằng bạn đã có một cách để lấy HTML của trang login.
        
        // Ví dụ tạm thời:
        // Để không bị lỗi nếu không có loginPage imported ở đây
        // Trong thực tế, bạn sẽ import và gọi hàm render từ loginPage.js
        const loginPageModule = await import('../views/loginPage.js'); // Dynamic import
        const loginPageRenderer = loginPageModule.default; // Lấy default export (object {render})
        
        const html = loginPageRenderer.render(); // Gọi hàm render
        
        return new Response(html, {
            headers: { 'Content-Type': 'text/html' }
        });
    }
}

export default AdminController;