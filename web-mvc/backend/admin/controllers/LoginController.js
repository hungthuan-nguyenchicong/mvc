// web-mvc/backend/admin/controller.js/LoginController.js
import { LoginModel } from "../models/LoginModel";
import { loginPage } from "../views/login/login-page";
import crypto from 'crypto'; // Để tạo nonce ngẫu nhiên
import { CookieManager } from "../../core/CookieManager";
class LoginController {
    // constructor(req) {
    //     this.req = req;
    // }

    async index() {
        //return new Response('login ctl index')
        // tajo nonce
        const nonce = crypto.randomBytes(16).toString('base64');
        let cspHeader = null;
        if (import.meta.env.NODE_ENV === 'development') {
            cspHeader = ``
        } else {
            cspHeader = `default-src 'self'; style-src 'self' 'nonce-${nonce}'; script-src 'self' 'nonce-${nonce}';`;
        }
        return new Response(await loginPage(nonce), {
            headers:{
                'Content-Type':'text/html; charset=utf-8', 
                // CSP Header đã sửa: nonce là nguồn của script-src và style-src
                'Content-Security-Policy': cspHeader
            }, 
            status:200
        })
    }

    async login(req) {
        const loginModelInstance = new LoginModel();
        //let postData;
        let username = null;
        let password = null;
        //let response = {};
        //let status = {}
        // Khởi tạo CookieManager với headers từ request
        const cookieManagerInstance = new CookieManager(req.headers);
        try {
            const formData = await req.formData(); 
            username = formData.get('username');
            password = formData.get('password');
            if (await loginModelInstance.validate(username, password)) {
                // Đăng nhập thành công, thiết lập cookie
                cookieManagerInstance.set('session_token', 'your_secure_token', {
                    maxAge: 3600,
                    httpOnly: true,
                    secure: true,
                    path: '/admin/'
                });
                cookieManagerInstance.set('user_id', username, {
                    maxAge: 3600,
                    path: '/admin/'
                });
                //return Response.redirect("/admin/")

                //window.location = '/admin/'
                //status = {status: 302, headers: {'location': '/admin/login'}};
                //status.status = 302;
                const res = Response.json({status: 302});
                // Gắn tất cả các header Set-Cookie vào response trước khi gửi đi

                const setCookieHeaders = cookieManagerInstance.getSetCookieHeaders();
                for (const header of setCookieHeaders) {
                    res.headers.append('Set-Cookie', header);
                }
                //console.log(res)
                return res;

            } else {
                // Sử dụng mã lỗi 401 Unauthorized khi đăng nhập thất bại
                return Response.json({message: 'tài khoản hoặc mật khẩu không đúng'}, {status:401});
            }
        } catch (error) {
            console.error('eror', error);
        }
        //const res =  Response.json(response, status);

        // // Gắn tất cả các header Set-Cookie vào response trước khi gửi đi

        // const setCookieHeaders = cookieManagerInstance.getSetCookieHeaders();

        // for (const header of setCookieHeaders) {
        //     res.headers.append('Set-Cookie', header);
        // }
        // //console.log(res)
        // return res;
    }
    async logout(req) {
        // Khởi tạo CookieManager
        const cookieManagerInstance = new CookieManager(req.headers);

        // Xóa cookie bằng cách đặt Max-Age = 0
        cookieManagerInstance.delete('session_token', {path: '/admin/'});
        cookieManagerInstance.delete('user_id', {path: '/admin/'});
        //const res = new Response('Logged out successfully');
        const res = new Response(null, {
            status: 302,
            headers: {
                'location': '/admin/login'
            }
        });
        // Gắn header Set-Cookie để xóa cookie trên trình duyệt
        const setCookieHeaders = cookieManagerInstance.getSetCookieHeaders();
        for (const header of setCookieHeaders) {
            res.headers.append('Set-Cookie', header);
        }
        //console.log(res)
        return res;
    }
}

export {LoginController}