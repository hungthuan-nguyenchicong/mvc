// web-mvc/backend/admin/controller.js/LoginController.js

import { loginPage } from "../views/login/login-page";
import crypto from 'crypto'; // Để tạo nonce ngẫu nhiên
class LoginController {
    // constructor(req) {
    //     this.req = req;
    // }

    async index() {
        //return new Response('login ctl index')
        // tajo nonce
        const nonce = crypto.randomBytes(16).toString('base64');

        return new Response(await loginPage(nonce),{headers:{
            'Content-Type':'text/html; charset=utf-8', 
            // CSP Header đã sửa: nonce là nguồn của script-src và style-src
            'Content-Security-Policy': `default-src 'self'; style-src 'unsafe-inline'; script-src 'self' 'nonce-${nonce}';`}, status:200})
    }

    async login(req) {
        //let postData;
        let username = null;
        let password = null;
        try {
            const formData = await req.formData(); 
            username = formData.get('username');
            password = formData.get('password');
        } catch (error) {
            console.error(error);
        }
        return Response.json({mess:"ok", username:username, password:password});
    }
}

export {LoginController}