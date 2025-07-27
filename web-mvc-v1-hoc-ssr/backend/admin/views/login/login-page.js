function loginPage() {
    function render() {
        // Sử dụng hàm tiện ích để lấy phần thân của hàm
        const scriptFrontendBody = getFunctionBodyString(scriptFrontend);
        const testRenderBody = getFunctionBodyString(testRender);
        const tesstScriptComment = testScript();
        return  /* html */ `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            <!-- style -->
            ${styleFrontend}
        </head>
        <body>
            <script>
                //Chèn trực tiếp phần thân của hàm
                /** chu thich */
                ${testRenderBody}
                // Gọi hàm scriptFrontend sau khi chèn
                ${scriptFrontendBody}
            </script>
            ${tesstScriptComment}
        </body>
        </html>
        `
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

function testScript() {
    return /* html */ `
        <script>
            // tesst comment
            console.log('testScript')
        </script>
    `;
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
// function getFunctionBodyString(func) {
//     const funcString = func.toString();
//     const bodyMatch = funcString.match(/\{([\s\S]*)\}/);
//     if (bodyMatch && bodyMatch[1]) {
//         return bodyMatch[1].trim();
//     }
//     return '';
// }

// backend/admin/views/login/utils.js

// NO LONGER import { minify as terserMinify } from 'terser'; // REMOVE THIS IMPORT

export function getFunctionBodyString(func) {
    const funcString = func.toString();
    //const bodyMatch = funcString.match(/\{([\s\S]*)\}/);
    const bodyMatch = funcString.match(/\{([\s\S]*)\}/);
    //console.log(bodyMatch);
    if (bodyMatch && bodyMatch[1]) {
        let jsCode = bodyMatch[1];
        //console.log(jsCode)
        // Perform basic cleanup: remove comments and collapse excess whitespace.
        // This makes the string cleaner for html-minifier-terser.
        jsCode = jsCode.replace(/\/\/.*$/gm, ''); // Remove single-line comments
        //console.log(jsCode)
        jsCode = jsCode.replace(/\/\*[\s\S]*?\*\//g, ''); // Remove multi-line comments
        jsCode = jsCode.replace(/\s+/g, ' ').trim(); // Collapse and trim whitespace
        //console.log(jsCode)
        return jsCode; // Return the cleaned (but not fully minified) JS string
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
