## AuthService.js

// web-mvc/backend/admin/services/AuthService.js

class AuthService {
    static ADMIN_COOKIE_NAME = 'adminLoggedIn'; // Tên cookie
    static COOKIE_EXPIRATION_SECONDS = 3600; // 1 giờ = 3600 giây

    /**
     * Tạo cookie xác thực admin
     * @param {Response} response Trả về đối tượng Response để thêm header Set-Cookie
     * @returns {Response} Response đã thêm cookie
     */
    static setAdminCookie(response) {
        // Thiết lập cookie 'adminLoggedIn=true'
        // path=/ để cookie có hiệu lực trên toàn bộ domain
        // HttpOnly để ngăn chặn truy cập từ JavaScript client-side (tăng bảo mật)
        // Max-Age để thiết lập thời gian hết hạn (tính bằng giây)
        // Secure (true) chỉ gửi cookie qua HTTPS (nên bật trong production)
        // SameSite=Lax hoặc Strict để bảo vệ CSRF
        
        const cookieOptions = [
            `${AuthService.ADMIN_COOKIE_NAME}=true`,
            `Path=/`,
            `Max-Age=${AuthService.COOKIE_EXPIRATION_SECONDS}`,
            `HttpOnly`,
            // `Secure`, // Bỏ comment nếu chạy qua HTTPS
            `SameSite=Lax` 
        ];

        // Lấy headers hiện có, hoặc tạo mới nếu chưa có
        const headers = new Headers(response.headers);
        headers.append('Set-Cookie', cookieOptions.join('; '));

        // Trả về một Response mới với headers đã cập nhật
        // (không thể sửa đổi trực tiếp Response object sau khi nó đã được tạo)
        return new Response(response.body, { status: response.status, headers: headers });
    }

    /**
     * Xóa cookie xác thực admin
     * @param {Response} response Trả về đối tượng Response để thêm header Set-Cookie
     * @returns {Response} Response đã thêm cookie
     */
    static clearAdminCookie(response) {
        const cookieOptions = [
            `${AuthService.ADMIN_COOKIE_NAME}=;`, // Đặt giá trị rỗng
            `Path=/`,
            `Max-Age=0`, // Đặt Max-Age=0 để xóa cookie ngay lập tức
            `HttpOnly`,
            // `Secure`,
            `SameSite=Lax`
        ];
        
        const headers = new Headers(response.headers);
        headers.append('Set-Cookie', cookieOptions.join('; '));
        return new Response(response.body, { status: response.status, headers: headers });
    }

    /**
     * Kiểm tra xem người dùng có phải admin dựa trên cookie không
     * @param {Request} request Đối tượng Request chứa header Cookie
     * @returns {boolean} True nếu cookie adminLoggedIn=true tồn tại, ngược lại false
     */
    static isAdminLoggedIn(request) {
        const cookieHeader = request.headers.get('Cookie');
        if (!cookieHeader) {
            return false;
        }

        // Phân tích cú pháp chuỗi cookie
        const cookies = cookieHeader.split(';').map(cookie => cookie.trim());
        
        // Kiểm tra xem có cookie 'adminLoggedIn=true' không
        return cookies.includes(`${AuthService.ADMIN_COOKIE_NAME}=true`);
    }
}

export { AuthService };