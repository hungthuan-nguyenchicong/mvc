## html-minifier-terser

Bạn có một quan điểm rất thực tế và quan trọng\! Bạn muốn **server-side bundle của bạn gọn gàng và hiệu quả nhất có thể**, không muốn nó phải mang theo và thực thi thêm một thư viện (như `html-minifier-terser`) chỉ để minify HTML **mỗi khi một request đến**. Mục tiêu là để quá trình build xử lý việc đó.

-----

### Phân tích lại vấn đề và mục tiêu

Bạn đang tìm cách để:

1.  **Minify HTML, CSS, và JS inline** tại thời điểm **build**, không phải tại thời điểm **runtime** trên server.
2.  Giữ cho bundle SSR của bạn nhỏ gọn và tập trung vào logic render cốt lõi.

Vấn đề là, như bạn đã nói, Vite và các công cụ build JS như Rollup (mà Vite dựa vào) chủ yếu tối ưu hóa **mã JavaScript** (và CSS, assets nếu chúng được import theo cách truyền thống). Chúng không coi các **chuỗi HTML** được định nghĩa trong JS template literals là HTML thực sự cần được minify. Chuỗi chỉ là chuỗi trong mắt của bundler.

-----

### Giải pháp: Plugin Build Custom (Rollup Plugin)

Để giải quyết vấn đề này, chúng ta cần một bước xử lý **trong quá trình build của Vite (Rollup)**. Cách tốt nhất để làm điều này là viết một **Rollup plugin tùy chỉnh**. Plugin này sẽ:

1.  Tìm các file mà bạn muốn xử lý (ví dụ: `login-page.js` hoặc `entry-server.js`).
2.  Trong giai đoạn `transform` của Rollup, nó sẽ nhận nội dung của file JS đó.
3.  Sử dụng RegEx (như bạn đã gợi ý) hoặc một parser HTML nhẹ để tìm các template literals chứa HTML.
4.  Áp dụng `html-minifier-terser` (hoặc một minifier HTML khác) cho các chuỗi HTML này.
5.  Trả về mã JS đã được sửa đổi, nơi các chuỗi HTML thô được thay thế bằng chuỗi HTML đã minify.

Với cách này, khi bundle SSR của bạn được tạo ra, các chuỗi HTML đã nằm ở dạng minify, và bạn không cần `html-minifier-terser` chạy trên server runtime nữa.

-----

### Triển khai Rollup Plugin tùy chỉnh

Hãy tạo một file plugin mới, ví dụ: `vite-html-minify-plugin.js` ở thư mục gốc của dự án.

#### 1\. Tạo `vite-html-minify-plugin.js`

```javascript
// vite-html-minify-plugin.js
import { minify as htmlMinifier } from 'html-minifier-terser';

const defaultMinifyOptions = {
    collapseWhitespace: true,
    removeComments: true,
    minifyCSS: true,
    minifyJS: {
        compress: true,
        mangle: true,
    },
    sortAttributes: true,
    sortClassName: true,
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    conservativeCollapse: false,
    decodeEntities: true,
    html5: true,
    keepClosingSlash: false,
    removeTagWhitespace: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
    trimCustomFragments: true,
    processConditionalComments: true,
    removeEmptyAttributes: true,
};

export function htmlMinifyPlugin() {
    return {
        name: 'html-minify-plugin', // Tên plugin
        // hook 'transform' sẽ được gọi cho mỗi module đã được load
        async transform(code, id) {
            // Chỉ áp dụng cho các file mà bạn muốn minify HTML
            // Điều chỉnh đường dẫn regex cho phù hợp với cấu trúc project của bạn
            if (id.includes('backend/admin/views/login/') && (id.endsWith('.js') || id.endsWith('.ts'))) {
                let modifiedCode = code;

                // Regex để tìm các template literals được đánh dấu là /* html */`...`
                // Đây là một cách đơn giản, có thể cần phức tạp hơn cho các trường hợp phức tạp
                const htmlTemplateRegex = /\/\*\s*html\s*\*\/\s*`([\s\S]*?)`/g;

                const matches = [...code.matchAll(htmlTemplateRegex)];

                for (const match of matches) {
                    const fullMatch = match[0]; // Toàn bộ phần /* html */`...`
                    const htmlContent = match[1]; // Nội dung bên trong backticks

                    try {
                        // Minify nội dung HTML
                        const minifiedHtml = await htmlMinifier(htmlContent, defaultMinifyOptions);
                        // Thay thế chuỗi HTML gốc bằng chuỗi đã minify, giữ nguyên /* html */``
                        // Đảm bảo escape các ký tự đặc biệt trong chuỗi để RegEx không bị lỗi
                        const escapedFullMatch = fullMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        modifiedCode = modifiedCode.replace(new RegExp(escapedFullMatch, 'g'), `/* html */\`${minifiedHtml}\``);
                    } catch (e) {
                        this.warn(`Failed to minify HTML in ${id}: ${e.message}`);
                    }
                }
                return {
                    code: modifiedCode,
                    map: null // hoặc tạo sourcemap nếu cần
                };
            }
            return null; // Trả về null nếu không muốn xử lý file này
        }
    };
}
```

#### 2\. Cập nhật `vite.config.js`

Bạn sẽ cần import và sử dụng plugin này.

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { htmlMinifyPlugin } from './vite-html-minify-plugin.js'; // Import plugin

export default defineConfig({
    root: '.',
    plugins: [htmlMinifyPlugin()], // THÊM PLUGIN VÀO ĐÂY
    build: {
        outDir: 'dist/server',
        emptyOutDir: true,
        ssr: 'backend/admin/views/login/login-page.js', // Giữ nguyên điểm vào SSR
        minify: 'terser', // Vẫn minify JS code của bundle
        rollupOptions: {
            input: {
                'login-page-ssr-bundle': resolve(__dirname, 'backend/admin/views/login/login-page.js'),
            },
            output: {
                format: 'cjs',
                entryFileNames: '[name].js',
            },
            // Không cần externalize html-minifier-terser nữa nếu nó chỉ dùng trong plugin
            // và không được import vào runtime bundle.
            // Tuy nhiên, để an toàn, vẫn có thể giữ lại externalize.
            // external: ['html-minifier-terser'],
        },
    },
});
```

#### 3\. Cập nhật `backend/admin/views/login/login-page.js`

Bây giờ, bạn không cần `minifyHtmlString` chạy trong hàm `render` nữa, vì việc minify đã được xử lý ở giai đoạn build. Hàm `render` có thể trở thành synchronous (không `async`) nếu nó không còn gọi các hàm `async` nào khác.

```javascript
// web-mvc/backend/admin/views/login/login-page.js

// KHÔNG IMPORT html-minifier-terser hay minifyHtmlString ở đây nữa.
// Plugin sẽ xử lý việc đó.

// Hàm tiện ích để lấy phần thân của hàm
function getFunctionBodyString(func) {
    const funcString = func.toString();
    const bodyMatch = funcString.match(/\{([\s\S]*)\}/);
    if (bodyMatch && bodyMatch[1]) {
        return bodyMatch[1].trim();
    }
    return '';
}

export const styleFrontend = /* html */`
    <style>
        h1 { /* This CSS will be minified by the plugin */
            color: red;
        }
        #login {
            color: blue;
        }
    </style>
`;

function testRenderClient() {
    console.log("Client script 1 executed!"); // This JS will be minified by the plugin
}

function scriptFrontendClient() {
    (function() {
        const title = document.createElement('h1');
        title.innerHTML= 'Login Page (Minified at Build-time)';
        document.body.appendChild(title);

        const form = document.createElement('form');
        form.id = 'login-form-id';

        const usernameLabel = document.createElement('label');
        usernameLabel.textContent = 'Username: ';
        const usernameInput = document.createElement('input');
        usernameInput.name = 'username';
        usernameInput.autocomplete = 'username';
        usernameLabel.appendChild(usernameInput);

        form.appendChild(usernameLabel);
        document.body.appendChild(form);
        console.log("Client script 2 executed and DOM manipulated!");
    })();
}

// Bây giờ hàm render có thể là synchronous (nếu không có async ops khác)
export function render() { // KHÔNG CẦN async NỮA nếu không có await bên trong
    const scriptFrontendBody = getFunctionBodyString(scriptFrontendClient);
    const testRenderBody = getFunctionBodyString(testRenderClient);

    // Chuỗi HTML này SẼ ĐƯỢC MINIFY BỞI PLUGIN TRONG QUÁ TRÌNH BUILD
    // nên không cần gọi minifyHtmlString() ở đây nữa
    const finalHtml = /* html */ `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Build-time Minified SSR Page</title>
            ${styleFrontend}
        </head>
        <body>
            <div id="app"></div>
            <script>
                ${testRenderBody}
                ${scriptFrontendBody};
            </script>
        </body>
        </html>
    `;

    return finalHtml; // Trả về chuỗi HTML đã được minify từ build-time
}
```

#### 4\. `backend/admin/controllers/LoginController.js` (Rất đơn giản)

```javascript
// web-mvc/backend/admin/controllers/LoginController.js

// Import hàm render trực tiếp từ file SSR entry point
import { render } from "../views/login/login-page.js"; // Đảm bảo đường dẫn đúng

export class LoginController {
    async index() {
        // Gọi hàm render. Vì render giờ có thể không async (nếu không có async ops khác),
        // nhưng an toàn nhất vẫn là await nó vì nó có thể là async trong tương lai
        // hoặc nếu nó vẫn gọi các async sub-function.
        const htmlContent = await render();

        return new Response(htmlContent, { headers: { 'Content-Type': 'text/html' } });
    }
}
```

-----

### Các bước kiểm tra

1.  **Cài đặt `html-minifier-terser`**:
    ```bash
    bun add --dev html-minifier-terser
    ```
2.  **Chạy build**:
    ```bash
    bun run build:server-test
    ```
3.  **Kiểm tra file bundle đầu ra (`dist/server/login-page-ssr-bundle.js`)**: Mở file này. Bạn sẽ thấy rằng các chuỗi HTML bên trong (đặc biệt là nội dung của `styleFrontend` và phần JavaScript trong `<script>` tag) đã được nén/minify. Điều này xác nhận plugin đã hoạt động.
4.  **Chạy server**:
    ```bash
    bun run start:server-test
    ```
5.  **Truy cập trang**: Kiểm tra mã nguồn trang trên trình duyệt. Nó sẽ hiển thị HTML đã minify, nhưng lần này quá trình minify đã diễn ra trong giai đoạn build, không phải runtime.

Cách tiếp cận này hiệu quả hơn rất nhiều cho các ứng dụng SSR hiệu năng cao, vì nó giảm thiểu công việc CPU cho server trong mỗi request.