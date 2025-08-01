## nonce csp header

// LoginController.js
import { loginPage } from "../views/login/login-page.js";
import crypto from 'crypto';

class LoginController {
    async index() {
        const nonce = crypto.randomBytes(16).toString('base64');
        let cspHeader = '';

        if (process.env.NODE_ENV === 'development') {
            cspHeader = `default-src 'self' http://localhost:4000; script-src 'self' http://localhost:4000; style-src 'self' http://localhost:4000;`;
            // Trong dev, chúng ta không dùng nonce cho inline vì không có inline script/style
            // Bạn có thể cân nhắc thêm 'unsafe-inline' nếu Vite inject inline style
            // Nhưng tốt nhất là giữ cho CSS của Vite là file riêng
        } else {
            cspHeader = `default-src 'self'; style-src 'self' 'nonce-${nonce}'; script-src 'self' 'nonce-${nonce}';`;
        }

        return new Response(await loginPage(nonce), {
            headers: {
                'Content-Type': 'text/html; charset=utf-8', 
                'Content-Security-Policy': cspHeader // Sử dụng CSP đã xác định
            }, 
            status: 200
        });
    }
    // ...
}

## note

cspHeader = `default-src 'self'; script-src 'self' http://localhost:4000; style-src 'unsafe-inline' http://localhost:4000 `

cspHeader = `default-src 'self'; style-src 'self' 'nonce-${nonce}'; script-src 'self' 'nonce-${nonce}';`;


## use
        hmr = await scriptFrontend(nonce);

            ${style(nonce)}

    function style(nonce) {

        <style nonce="${nonce}">

async function scriptFrontend(nonce) {

    <script nonce="${nonce}">



