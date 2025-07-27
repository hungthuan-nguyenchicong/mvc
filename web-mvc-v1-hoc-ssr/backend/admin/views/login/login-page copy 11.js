// web-mvc/backend/admin/views/login/login-page.js
//import { minify as htmlMinifier } from 'html-minifier-terser'; // Đảm bảo import thư viện
// src/utils/minifyHtml.js
//import { minify as htmlMinifier } from 'html-minifier-terser';

// Định nghĩa các tùy chọn minification HTML ở đây
// const defaultMinifyOptions = {
//     collapseWhitespace: true,
//     removeComments: true,
//     minifyCSS: true,
//     minifyJS: {
//         compress: true,
//         mangle: true,
//     },
//     sortAttributes: true,
//     sortClassName: true,
//     collapseBooleanAttributes: true,
//     collapseInlineTagWhitespace: true,
//     conservativeCollapse: false,
//     decodeEntities: true,
//     html5: true,
//     keepClosingSlash: false,
//     removeTagWhitespace: true,
//     removeRedundantAttributes: true,
//     removeScriptTypeAttributes: true,
//     removeStyleLinkTypeAttributes: true,
//     useShortDoctype: true,
//     trimCustomFragments: true,
//     processConditionalComments: true,
//     removeEmptyAttributes: true,
//     // removeEmptyElements: false, // Cẩn thận với tùy chọn này
// };

// /**
//  * Minify một chuỗi HTML với các tùy chọn mặc định.
//  * @param {string} htmlString Chuỗi HTML cần minify.
//  * @returns {Promise<string>} Chuỗi HTML đã được minify.
//  */
// // export async function minifyHtmlString(htmlString) {
// //     return await htmlMinifier(htmlString, defaultMinifyOptions);
// // }
// async function minifyHtmlString(htmlString) {
//     return await htmlMinifier(htmlString, defaultMinifyOptions);
// }

function loginPage() {
    function render() {
        // Sử dụng hàm tiện ích để lấy phần thân của hàm
        const scriptFrontendBody = getFunctionBodyString(scriptFrontend);
        const testRenderBody = getFunctionBodyString(testRender);

        return  /* html */ `
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
        //return await minifyHtmlString(rawHtml)
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

// backend/admin/views/login/utils.js
// import { minify as terserMinify } from 'terser'; // Import Terser

// export function getFunctionBodyString(func) {
//     const funcString = func.toString();
//     const bodyMatch = funcString.match(/\{([\s\S]*)\}/);
//     if (bodyMatch && bodyMatch[1]) {
//         let jsCode = bodyMatch[1].trim();

//         try {
//             // Minify JavaScript bằng Terser ngay tại đây
//             const result = terserMinify(jsCode, {
//                 compress: true,
//                 mangle: true,
//             });
//             if (result.code) {
//                 return result.code; // Trả về mã JS đã minify
//             }
//         } catch (e) {
//             console.warn("Error minifying JS in getFunctionBodyString:", e.message);
//             // Fallback: Nếu có lỗi, trả về code gốc để không phá vỡ build
//             return jsCode;
//         }
//     }
//     return '';
// }
