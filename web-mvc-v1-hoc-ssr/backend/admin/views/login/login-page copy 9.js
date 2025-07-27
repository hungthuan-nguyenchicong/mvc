// web-mvc/backend/admin/views/login/login-page.js
import { minify as htmlMinifier } from 'html-minifier-terser'; // Đảm bảo import thư viện

function loginPage() {
    function render() {
        // Sử dụng hàm tiện ích để lấy phần thân của hàm
        const scriptFrontendBody = getFunctionBodyString(scriptFrontend);
        const testRenderBody = getFunctionBodyString(testRender);

        return /* html */ `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            ${styleFrontend}
        </head>
        <body>
            <script>
                // Chèn trực tiếp phần thân của hàm
                ${testRenderBody}
                ${scriptFrontendBody}; // Gọi hàm scriptFrontend sau khi chèn
            </script>
        </body>
        </html>
        `;
    }
    return {render}
}

const styleFrontend = /* html */`
    <style>
        h1 {
            color: red;
        }
        #login {
            color: blue;
        }
    </style>
`;

function testRender() {
    console.log(1)
}

function scriptFrontend() {
    // Để hàm scriptFrontend chạy khi được chèn vào HTML,
    // nó cần được gói trong một IIFE (Immediately Invoked Function Expression)
    // hoặc bạn có thể gọi hàm render() của nó trực tiếp.
    // Ở đây, tôi sẽ sửa đổi để nó tự thực thi khi được chèn.
    (function() {
        // login h1
        const title = document.createElement('h1');
        title.innerHTML= 'Login';
        document.body.appendChild(title);
        // login form
        const form = document.createElement('form');
        form.id = 'login';
        //---username---
        // login form label
        const usernameLabel = document.createElement('label');
        usernameLabel.textContent = 'Username:  ';
        // login form label input
        const usernameInput = document.createElement('input');
        usernameInput.name = 'username';
        usernameInput.autocomplete = 'username'
        usernameLabel.appendChild(usernameInput);

        form.appendChild(usernameLabel);
        document.body.appendChild(form);
    })(); // Gọi ngay lập tức
}

export {loginPage};

// Thêm hàm tiện ích vào đây hoặc vào một file tiện ích riêng
function getFunctionBodyString(func) {
    const funcString = func.toString();
    const bodyMatch = funcString.match(/\{([\s\S]*)\}/);
    if (bodyMatch && bodyMatch[1]) {
        return bodyMatch[1].trim();
    }
    return '';
}

export async function render() {
    const testRenderBody = getFunctionBodyString(testRender);
    const scriptFrontendBody = getFunctionBodyString(scriptFrontend);

    // Bước 1: Tạo chuỗi HTML thô
    const rawHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>SSR Login Page</title>
            ${styleFrontend}
        </head>
        <body>
            <div id="app"></div>
            <script>
                ${testRenderBody}
                ${scriptFrontendBody}
            </script>
        </body>
        </html>
    `;

    // Bước 2: Minify chuỗi HTML thô bằng html-minifier-terser
    const minifiedHtml = await htmlMinifier(rawHtml, {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: {
            compress: true,
            mangle: true,
        },
        sortAttributes: true,
        sortClassName: true,
    });

    return minifiedHtml;
}