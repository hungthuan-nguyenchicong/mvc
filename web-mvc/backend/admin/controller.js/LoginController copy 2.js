// web-mvc/backend/admin/controller.js/LoginController.js
import { LoginModel } from "../models/LoginModel";
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
        let response = {};
        try {
            const formData = await req.formData(); 
            username = formData.get('username');
            password = formData.get('password');
            if (await loginModelInstance.validate(username, password)) {
                response.status = 200;
            } else {
                response.status = 500;
            }
        } catch (error) {
            console.error('eror', error);
        }
        return Response.json(response);
    }
}

export {LoginController}