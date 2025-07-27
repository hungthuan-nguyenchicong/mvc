## file test build ssr

Tuyệt vời\! Chúng ta hãy xây dựng một bài test cơ bản để thấy rõ cách `vite-html-minify-plugin` và Vite SSR hoạt động cùng nhau, đồng thời xác nhận `html-minifier-terser` tự động xử lý nội dung trong `<script>` và `<style>` mà không cần regex phức tạp.

-----

### Cấu Trúc File Dự Án Mẫu

Hãy tạo cấu trúc thư mục sau:

```
your-project/
├── backend/
│   └── admin/
│       └── views/
│           ├── login/
│           │   ├── login-page.js  // File SSR chính
│           │   └── utils.js       // Chứa getFunctionBodyString
│           └── dashboard/
│               └── dashboard-page.js // File SSR thứ hai để test
├── vite.config.js
└── vite-html-minify-plugin.js
```

-----

### 1\. `vite-html-minify-plugin.js`

File này sẽ chứa plugin Vite tùy chỉnh của chúng ta. Không có thay đổi nào so với phiên bản cuối cùng bạn có, nó đã rất chuẩn.

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
};

export function htmlMinifyPlugin() {
    return {
        name: 'html-minify-plugin',
        async transform(code, id) {
            // Chỉ áp dụng cho các file trong thư mục 'views'
            if (id.includes('backend/admin/views/') && (id.endsWith('.js') || id.endsWith('.ts'))) {
                let modifiedCode = code;
                const htmlTemplateRegex = /(\/\*\s*html\s*\*\/\s*`)([\s\S]*?)(`)/g;
                const matches = [...code.matchAll(htmlTemplateRegex)];

                for (const match of matches) {
                    const prefix = match[1];
                    const htmlContent = match[2];
                    const suffix = match[3];

                    try {
                        const minifiedHtml = await htmlMinifier(htmlContent, defaultMinifyOptions);
                        const escapedFullMatch = match[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        modifiedCode = modifiedCode.replace(new RegExp(escapedFullMatch, 'g'), `${prefix}${minifiedHtml}${suffix}`);
                    } catch (e) {
                        this.error(`Failed to minify HTML in ${id}: ${e.message}.`, e.loc);
                    }
                }
                return {
                    code: modifiedCode,
                    map: null
                };
            }
            return null;
        }
    };
}
```

-----

### 2\. `vite.config.js`

File cấu hình Vite chính của chúng ta. Nó sẽ định nghĩa hai điểm vào SSR để test.

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { htmlMinifyPlugin } from './vite-html-minify-plugin.js';

export default defineConfig({
    root: '.', // Đặt thư mục gốc của dự án
    plugins: [htmlMinifyPlugin()], // Kích hoạt plugin HTML minify
    build: {
        outDir: 'dist/server', // Thư mục đầu ra cho bản build SSR
        emptyOutDir: true,     // Xóa thư mục đầu ra trước khi build
        ssr: true,             // Kích hoạt chế độ SSR build

        // Cấu hình Rollup để xử lý nhiều điểm vào SSR
        rollupOptions: {
            input: {
                // Điểm vào SSR 1: Trang đăng nhập
                'login-page-bundle': 'backend/admin/views/login/login-page.js',
                // Điểm vào SSR 2: Trang Dashboard
                'dashboard-page-bundle': 'backend/admin/views/dashboard/dashboard-page.js',
            },
            output: {
                // Đảm bảo tên file đầu ra khớp với tên trong 'input'
                entryFileNames: '[name].js',
                // Định dạng CJS thường dùng cho Node.js server
                format: 'cjs',
            },
            // Externalize các thư viện lớn mà server sẽ tự có hoặc không cần bundle
            // Điều này giữ cho bundle SSR nhỏ hơn.
            external: ['html-minifier-terser'], // Vì html-minifier-terser chỉ dùng trong plugin (build-time), không cần chạy trong runtime
        },
        minify: 'terser', // Minify mã JavaScript cuối cùng của bundle SSR bằng Terser
    },
});
```

-----

### 3\. File SSR và Utility

#### `backend/admin/views/login/utils.js`

Hàm tiện ích để trích xuất và làm sạch thân hàm JavaScript.

```javascript
// backend/admin/views/login/utils.js

export function getFunctionBodyString(func) {
    const funcString = func.toString();
    const bodyMatch = funcString.match(/\{([\s\S]*)\}/);

    if (bodyMatch && bodyMatch[1]) {
        let jsCode = bodyMatch[1];
        // Xóa comment dòng đơn
        jsCode = jsCode.replace(/\/\/.*$/gm, '');
        // Xóa comment đa dòng
        jsCode = jsCode.replace(/\/\*[\s\S]*?\*\//g, '');
        // Thay thế nhiều khoảng trắng/xuống dòng thành một khoảng trắng và trim
        jsCode = jsCode.replace(/\s+/g, ' ').trim();
        return jsCode;
    }
    return '';
}
```

#### `backend/admin/views/login/login-page.js`

File SSR đầu tiên, sẽ tạo ra HTML với JS và CSS inline. Chúng ta sẽ viết nó cực kỳ gọn gàng để thấy hiệu quả minify.

```javascript
// backend/admin/views/login/login-page.js
import { getFunctionBodyString } from './utils.js';

const styleFrontend = /* html */`
    <style>
        h1 { color: red; }
        #login { color: blue; }
        .container { max-width: 800px; margin: 0 auto; }
    </style>
`;

function loginScript() {
    (function() {
        const title = document.createElement('h1');
        title.innerHTML = 'Login Page';
        document.body.appendChild(title);
        const form = document.createElement('form');
        form.id = 'login';
        const label = document.createElement('label');
        label.textContent = 'Username: ';
        const input = document.createElement('input');
        input.name = 'username';
        label.appendChild(input);
        form.appendChild(label);
        document.body.appendChild(form);
        // Đây là comment trong hàm JS, sẽ bị getFunctionBodyString xóa
    })();
}

function analyticsScript() {
    console.log('Analytics loaded for login page!');
    // Một comment khác
}

function loginPage() {
    function render() {
        // Lấy thân các hàm JS đã được làm sạch
        const loginJsBody = getFunctionBodyString(loginScript);
        const analyticsJsBody = getFunctionBodyString(analyticsScript);

        // *** ĐIỀU QUAN TRỌNG: Viết template literal HTML CỰC KỲ GỌN ***
        // Không có xuống dòng, khoảng trắng thừa hay comment bạn tự thêm vào
        // trong nội dung thẻ <script> hay <style>.
        return /* html */`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta content="width=device-width,initial-scale=1"name="viewport"><title>Login Page</title>${styleFrontend}</head><body><div class="container"><h1>Welcome to Login!</h1></div><script>${loginJsBody}${analyticsJsBody};</script></body></html>`;
    }
    return { render };
}

export { loginPage };
```

#### `backend/admin/views/dashboard/dashboard-page.js`

File SSR thứ hai, minh họa việc xử lý nhiều điểm vào.

```javascript
// backend/admin/views/dashboard/dashboard-page.js
import { getFunctionBodyString } from '../login/utils.js'; // Tái sử dụng utility

const dashboardStyle = /* html */`
    <style>
        body { background-color: #f0f0f0; }
        h1 { color: green; }
        .info { font-size: 1.2em; }
    </style>
`;

function dashboardJs() {
    console.log('Dashboard script executed.');
    document.body.appendChild(document.createElement('p')).textContent = 'Content loaded!';
    // Comment này cũng sẽ bị xóa
}

function dashboardPage() {
    function render() {
        const jsBody = getFunctionBodyString(dashboardJs);

        // Cũng viết gọn gàng cho template literal này
        return /* html */`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta content="width=device-width,initial-scale=1"name="viewport"><title>Dashboard</title>${dashboardStyle}</head><body><h1>Dashboard Content</h1><p class="info">This is your dashboard.</p><script>${jsBody};</script></body></html>`;
    }
    return { render };
}

export { dashboardPage };
```

-----

### Các Bước Test

1.  **Tạo các file và thư mục** như cấu trúc đã cho.
2.  **Cài đặt các dependencies:**
    ```bash
    npm install vite html-minifier-terser # hoặc bun install vite html-minifier-terser
    ```
3.  **Thêm script vào `package.json`:**
    ```json
    {
      "name": "your-project",
      "version": "1.0.0",
      "scripts": {
        "build:ssr": "vite build"
      },
      "devDependencies": {
        "vite": "^5.0.0",
        "html-minifier-terser": "^7.0.0"
      }
    }
    ```
4.  **Chạy lệnh build:**
    ```bash
    npm run build:ssr # hoặc bun run build:ssr
    ```

-----

### Kiểm Tra Kết Quả

Sau khi build xong, hãy kiểm tra thư mục `dist/server`. Bạn sẽ thấy hai file: `login-page-bundle.js` và `dashboard-page-bundle.js`.

**Mở các file `.js` này** và kiểm tra chuỗi HTML bên trong. Bạn sẽ thấy:

  * **HTML, CSS và JavaScript inline được minified triệt để.**
  * **Các comment JavaScript** (như `// Đây là comment trong hàm JS`) đã bị `getFunctionBodyString` loại bỏ trước khi chèn vào HTML.
  * **Các comment HTML** (như \`\` nếu bạn có) cũng sẽ bị `html-minifier-terser` loại bỏ.
  * **Không có xuống dòng hay khoảng trắng thừa** bên trong các thẻ `<script>` hay `<style>` mà bạn đã viết gọn gàng trong template literal của hàm `render`.

Điều này chứng minh rằng `html-minifier-terser` đã tự động "phục vụ" các điểm vào SSR của bạn, xử lý tất cả các phần tử HTML, CSS, và JS inline một cách hiệu quả mà không cần bạn phải cấu hình regex phức tạp để nó "bắt" `<script>` hay `<style>` - nó đã biết cách làm điều đó rồi\!