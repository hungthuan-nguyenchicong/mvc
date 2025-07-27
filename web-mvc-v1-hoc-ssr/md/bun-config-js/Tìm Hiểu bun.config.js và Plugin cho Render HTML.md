## Tìm Hiểu bun.config.js và Plugin cho Render HTML

Bạn đã đưa ra một điểm rất hay. Đúng vậy, việc thêm logic build vào mã nguồn chính của ứng dụng (như trong hàm `build` mà tôi đã đề xuất) không phải là cách lý tưởng cho cấu hình production. Mục tiêu của chúng ta là tận dụng tối đa khả năng của Bun Bundler và các tính năng như `bun.config.js` và plugin để tự động hóa và tối ưu hóa quy trình.

-----

### Tìm Hiểu `bun.config.js` và Plugin cho Render HTML

Bạn hoàn toàn đúng khi đề cập đến `bun.config.js` và hệ thống plugin của Bun. Đây chính là con đường đúng đắn để xử lý các tác vụ phức tạp như pre-rendering và minify HTML/CSS/JS một cách tự động trong quá trình build.

**Tuy nhiên, có một điểm quan trọng cần làm rõ:**

  * **`bun.config.js` chủ yếu tập trung vào việc cấu hình quá trình bundling cho các module JavaScript/TypeScript.** Nó xử lý các file đầu vào, đầu ra, minification, loader, và alias.
  * **Bun Bundler, theo thiết kế hiện tại, không phải là một "HTML renderer" hay "HTML templating engine" bẩm sinh.** Nó không tự động thực thi mã JavaScript của bạn (như `loginPage().render()`) để tạo ra một chuỗi HTML hoàn chỉnh tại thời điểm build. Nhiệm vụ chính của nó là chuyển đổi và tối ưu hóa các file JS/TS.
  * **Các plugin của Bun** được thiết kế để mở rộng khả năng của bundler, ví dụ: xử lý các loại file không phải JS/TS (như CSS, ảnh), hoặc thực hiện các biến đổi trên mã JS/TS. Hiện tại, không có plugin Bun chính thức nào được thiết kế để trực tiếp "render" một chuỗi HTML từ JavaScript và sau đó minify nó như một phần của quy trình build thông thường chỉ với `bun.config.js`.

Điều này có nghĩa là, để đạt được mục tiêu của bạn (pre-render HTML và minify mọi thứ), chúng ta vẫn cần một "bước" nào đó để thực thi JavaScript của bạn và lấy chuỗi HTML đầu ra. Dù không muốn nhúng trực tiếp vào mã nguồn chính, chúng ta vẫn cần một **script build độc lập** hoặc một **Bun plugin tùy chỉnh** để thực hiện bước render HTML này.

-----

### Các Cách Tiếp Cận Với `bun.config.js` và Plugin

Dựa trên tài liệu của Bun và mục tiêu của bạn, đây là các cách tiếp cận khả thi, đi kèm ví dụ và test:

#### 1\. Sử dụng `bun.config.js` kết hợp một Script Build Độc Lập (Recommended)

Đây là cách tiếp cận linh hoạt nhất và thực tế nhất hiện tại.

**Ý tưởng:**

  * Sử dụng `bun.config.js` để cấu hình việc minify các file JS/CSS riêng lẻ (nếu bạn có các file JS/CSS độc lập).
  * Tạo một **script Bun riêng** (ví dụ: `build-html.js` như đã đề xuất) để thực hiện tác vụ pre-rendering (gọi `loginPage().render()`) và sau đó minify HTML kết quả bằng thư viện như `html-minifier-terser`. Script này sẽ được chạy sau khi Bun bundler hoàn tất công việc của nó.

**Lý do Recommended:**

  * **Phân tách rõ ràng:** Bun Bundler lo việc bundle và minify JS/TS. Script riêng lo việc render HTML và minify toàn bộ HTML.
  * **Kiểm soát hoàn toàn:** Bạn có toàn quyền kiểm soát logic rendering và minification HTML.
  * **Dễ triển khai:** Không cần tạo plugin Bun phức tạp.

**Ví dụ cấu trúc dự án:**

```
.
├── backend/
│   └── admin/
│       └── views/
│           └── login/
│               ├── login-page.js
│               └── utils.js (chứa getFunctionBodyString)
├── bun.config.js
├── package.json
└── build-html.js
```

**`backend/admin/views/login/login-page.js` (Cập nhật để export đầy đủ)**

```javascript
// backend/admin/views/login/login-page.js

import { getFunctionBodyString } from './utils.js'; // Giả định utils.js có getFunctionBodyString

function loginPage() {
    function render(cssContent, testJsContent, scriptJsContent) {
        return /* html */ `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login Page</title>
            ${cssContent}
        </head>
        <body>
            <script>
                ${testJsContent}
                ${scriptJsContent}
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
            color: #ff0000;
        }
        #login {
            color: #0000ff;
        }
    </style>
`;

function testRender() {
    console.log("Test render executed!");
}

function scriptFrontend() {
    (function() {
        const title = document.createElement('h1');
        title.innerHTML= 'Login';
        document.body.appendChild(title);
        const form = document.createElement('form');
        form.id = 'login';
        const usernameLabel = document.createElement('label');
        usernameLabel.textContent = 'Username: ';
        const usernameInput = document.createElement('input');
        usernameInput.name = 'username';
        usernameInput.autocomplete = 'username';
        usernameLabel.appendChild(usernameInput);
        form.appendChild(usernameLabel);
        document.body.appendChild(form);
        console.log("Script frontend executed and DOM manipulated!");
    })();
}

export { loginPage, testRender, scriptFrontend, styleFrontend };
```

**`backend/admin/views/login/utils.js`**

```javascript
// backend/admin/views/login/utils.js
export function getFunctionBodyString(func) {
    const funcString = func.toString();
    const bodyMatch = funcString.match(/\{([\s\S]*)\}/);
    if (bodyMatch && bodyMatch[1]) {
        return bodyMatch[1].trim();
    }
    return '';
}
```

**`build-html.js` (Script Build Độc Lập)**

```javascript
// build-html.js
import { loginPage, testRender, scriptFrontend, styleFrontend } from './backend/admin/views/login/login-page.js';
import { getFunctionBodyString } from './backend/admin/views/login/utils.js';
import * as htmlMinifier from 'html-minifier-terser'; // Sử dụng import * as

async function buildHtmlPage() {
    console.log("Starting HTML build process...");

    // 1. Minify JavaScript code using Bun.build for individual script parts
    const testRenderBundle = await Bun.build({
        entrypoints: [new Blob([getFunctionBodyString(testRender)])],
        minify: {
            whitespace: true,
            identifiers: true,
            syntax: true,
        },
        target: "browser",
        format: "iife", // Ensure it's an IIFE to run automatically
    });
    const testRenderMinified = await testRenderBundle.outputs[0].text();

    const scriptFrontendBundle = await Bun.build({
        entrypoints: [new Blob([getFunctionBodyString(scriptFrontend)])],
        minify: {
            whitespace: true,
            identifiers: true,
            syntax: true,
        },
        target: "browser",
        format: "iife", // Ensure it's an IIFE to run automatically
    });
    const scriptFrontendMinified = await scriptFrontendBundle.outputs[0].text();

    // 2. Render the full HTML string
    const renderedHtml = loginPage().render(
        styleFrontend, // Style is already a string, can be minified by html-minifier-terser
        testRenderMinified,
        scriptFrontendMinified
    );

    // 3. Minify the entire HTML, including inline CSS and JS
    const minifiedHtml = await htmlMinifier.minify(renderedHtml, {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true, // Minify inline <style> tags
        minifyJS: {      // Minify inline <script> tags
            // Options for JS minification within HTML
            compress: true,
            mangle: true,
        },
        // More options for HTML minification
        sortAttributes: true,
        sortClassName: true,
    });

    // 4. Write the minified HTML to an output directory
    const outdir = './out';
    await Bun.mkdir(outdir, { recursive: true }); // Ensure directory exists
    await Bun.write(`${outdir}/login-page.html`, minifiedHtml);

    console.log(`login-page.html built and minified successfully at ${outdir}/login-page.html`);
}

// Execute the build script
buildHtmlPage().catch(error => {
    console.error("HTML build failed:", error);
    process.exit(1);
});
```

**`bun.config.js` (Optional, nếu bạn có các script JS/TS khác cần Bun xử lý)**

```javascript
// bun.config.js
export default {
    // Đây là nơi bạn cấu hình Bun Bundler cho các file JS/TS thông thường
    // Ví dụ: nếu bạn có một main.js khác không phải là phần của HTML inline
    entrypoints: [], // Để trống nếu chỉ dùng build-html.js để sinh ra HTML
    outdir: './dist', // Thư mục output cho các bản build JS/TS thông thường
    minify: true,
    target: "browser",
    plugins: [
        // Các plugin khác nếu cần, ví dụ: để xử lý CSS modules, ảnh, v.v.
    ],
};
```

**`package.json` (Thêm script để dễ chạy)**

```json
{
  "name": "web-mvc-project",
  "version": "1.0.0",
  "main": "index.js",
  "module": "index.js",
  "scripts": {
    "build": "bun run build-html.js"
  },
  "dependencies": {
    "html-minifier-terser": "^7.1.0"
  },
  "devDependencies": {}
}
```

**Để chạy:**

```bash
bun install
bun run build
```

Sau khi chạy, bạn sẽ có file `out/login-page.html` đã được pre-render và minify hoàn chỉnh.

-----

#### 2\. Viết Bun Plugin Tùy Chỉnh (Nâng cao)

Bạn có thể viết một Bun plugin để "can thiệp" vào quá trình load hoặc resolve của Bun Bundler.

**Ý tưởng:**

  * Tạo một plugin Bun để xử lý một loại file "ảo" nào đó (ví dụ: `.html.js`) hoặc một loader tùy chỉnh.
  * Khi Bun Bundler gặp file này, plugin sẽ thực thi code JavaScript (tương tự như `build-html.js`), render HTML, minify HTML, và trả về nội dung HTML đã minify như một chuỗi.
  * Tuy nhiên, việc này khá phức tạp vì plugin Bundler thường trả về mã JavaScript để Bundler xử lý tiếp, chứ không phải một file HTML hoàn chỉnh. Để biến nó thành một file HTML, bạn vẫn cần cơ chế ghi file ra đĩa.

**Khó khăn:**

  * **Phức tạp hơn:** Yêu cầu hiểu sâu về API của Bun Bundler plugin.
  * **Không phải mục đích chính:** Các plugin Bundler thường tập trung vào việc biến đổi các module thành JavaScript để bundling, chứ không phải sinh ra một file HTML độc lập. Bạn sẽ cần một plugin kiểu `onEnd` hoặc `onStart` để thực hiện tác vụ bên ngoài bundling.

**Cân nhắc:** Cách này thường chỉ dùng khi bạn có một quy trình build rất đặc thù và muốn tích hợp chặt chẽ vào Bun Bundler mà không cần script riêng. Với trường hợp của bạn, script riêng đơn giản hơn nhiều.

-----

### Ví dụ Test (Để kiểm tra kết quả)

Sau khi chạy `bun run build`, bạn có thể kiểm tra file `out/login-page.html`:

```bash
cat ./out/login-page.html
```

Bạn sẽ thấy một chuỗi HTML rất ngắn gọn, không có khoảng trắng thừa, không có comment, và các script/style đã được nén tối đa.

**Ví dụ output (đã minify):**

```html
<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Login Page</title><style>h1{color:red}#login{color:blue}</style></head><body><script>console.log("Test render executed!");(function(){const t=document.createElement("h1");t.innerHTML="Login",document.body.appendChild(t);const e=document.createElement("form");e.id="login";const n=document.createElement("label");n.textContent="Username: ";const c=document.createElement("input");c.name="username",c.autocomplete="username",n.appendChild(c),e.appendChild(n),document.body.appendChild(e),console.log("Script frontend executed and DOM manipulated!")})();</script></body></html>
```

(Lưu ý: màu sắc `red` và `blue` có thể được minify thành mã hex `#ff0000` và `#0000ff` bởi `html-minifier-terser`).

-----

### Tổng Kết

Mặc dù `bun.config.js` cung cấp cấu hình mạnh mẽ cho Bun Bundler, nó không trực tiếp xử lý việc pre-rendering HTML. Giải pháp tối ưu nhất cho trường hợp của bạn là sử dụng một **script Bun độc lập** (`build-html.js`) để gọi hàm render của bạn, thực hiện minification các phần JavaScript/CSS, và sau đó sử dụng một thư viện như `html-minifier-terser` để minify toàn bộ chuỗi HTML cuối cùng.

Điều này mang lại sự phân tách rõ ràng giữa việc bundling JavaScript (nếu có các script khác) và việc sinh ra HTML tĩnh, đồng thời đảm bảo rằng tất cả các tài nguyên được minify tối đa cho môi trường production.

Bạn có muốn đi sâu hơn vào việc tùy chỉnh `html-minifier-terser` hoặc có bất kỳ câu hỏi nào khác về quy trình build này không?

## Cấu hình vite.config.js cho dự án của bạn

Bạn hoàn toàn đúng khi nhận định rằng việc "built" theo nghĩa rộng, bao gồm cả dev server, HMR (Hot Module Replacement), và tối ưu hóa HTML/CSS/JS toàn diện cho production, không phải là trọng tâm chính của **Bun Bundler** một mình. Bun Bundler xuất sắc trong việc bundling và minifying JavaScript/TypeScript một cách hiệu quả, nhưng nó không phải là một framework phát triển đầy đủ như Vite.

-----

### Lý do Vite là lựa chọn tốt hơn cho quy trình phát triển và build toàn diện

**Vite** được xây dựng để cung cấp một trải nghiệm phát triển hiện đại và nhanh chóng, đồng thời cũng cung cấp quy trình build tối ưu cho production. Nó giải quyết nhiều vấn đề mà bạn đang gặp phải:

  * **Dev Server Nhanh Chóng:** Vite sử dụng native ES Modules trong phát triển, giúp khởi động server cực nhanh và HMR tức thì.
  * **Built-in HTML/CSS/JS Optimization:** Vite sử dụng Rollup làm bundler cơ sở cho production build, đi kèm với các plugin và cấu hình mặc định để tự động minify HTML, CSS, và JavaScript, bao gồm cả các inline script và style.
  * **Asset Handling:** Dễ dàng xử lý các tài sản như hình ảnh, font, v.v.
  * **Plugin Ecosystem:** Hệ sinh thái plugin mạnh mẽ cho phép mở rộng chức năng dễ dàng.

Với kịch bản của bạn, nơi bạn đang tạo ra HTML động từ JavaScript và muốn tối ưu hóa mọi thứ, Vite là một lựa chọn tuyệt vời vì nó được thiết kế để xử lý chính xác những loại tác vụ này.

-----

### Cấu hình `vite.config.js` cho dự án của bạn

Để chuyển đổi dự án của bạn sang sử dụng Vite, chúng ta cần một cách để Vite "hiểu" rằng `loginPage().render()` sẽ sinh ra HTML chính. Vite thường mong đợi một file HTML làm điểm vào chính. Tuy nhiên, chúng ta có thể sử dụng một plugin Vite hoặc một cách tiếp cận tùy chỉnh để Vite có thể render và tối ưu hóa chuỗi HTML của bạn.

Đây là cách tiếp cận đề xuất:

1.  **Chuyển `loginPage` thành một module JavaScript mà Vite có thể import.**
2.  **Tạo một file `.html` làm entry point cho Vite.**
3.  **Sử dụng một plugin Vite để "nhúng" nội dung được render từ `loginPage` vào file HTML này trong quá trình build.**

**Cấu trúc dự án mới:**

```
.
├── src/
│   ├── backend/
│   │   └── admin/
│   │       └── views/
│   │           └── login/
│   │               ├── login-page.js
│   │               └── utils.js
│   └── main.js           <-- Điểm vào JavaScript cho Vite
├── index.html            <-- Điểm vào HTML chính cho Vite
├── vite.config.js
├── package.json
```

**1. `src/backend/admin/views/login/utils.js` (Không thay đổi)**

```javascript
// src/backend/admin/views/login/utils.js
export function getFunctionBodyString(func) {
    const funcString = func.toString();
    const bodyMatch = funcString.match(/\{([\s\S]*)\}/);
    if (bodyMatch && bodyMatch[1]) {
        return bodyMatch[1].trim();
    }
    return '';
}
```

**2. `src/backend/admin/views/login/login-page.js` (Cập nhật)**

Chúng ta sẽ điều chỉnh `loginPage` để nó trả về một hàm có thể được gọi để sinh HTML. **Quan trọng:** Các hàm `testRender` và `scriptFrontend` sẽ được xuất ra để Vite có thể tối ưu hóa chúng riêng biệt, hoặc được xử lý như các chuỗi khi chúng ta cần chúng inline. Với Vite, chúng ta có thể để chúng là các hàm JavaScript bình thường và để Vite xử lý việc tối ưu hóa khi chúng được nhúng.

Để đơn giản, chúng ta sẽ để `testRender` và `scriptFrontend` như các hàm bình thường, và `loginPage` sẽ trả về HTML.

```javascript
// src/backend/admin/views/login/login-page.js

// styleFrontend vẫn là một chuỗi HTML chứa CSS
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

// testRender không cần là IIFE nếu nó được chèn vào <script> và chạy
function testRender() {
    console.log("Test render executed from Vite!");
}

// scriptFrontend có thể là một hàm bình thường, và chúng ta sẽ gọi nó từ HTML
// hoặc biến nó thành IIFE nếu muốn nó tự chạy ngay khi được tải
function scriptFrontend() {
    // Để hàm này chạy khi được chèn vào HTML, chúng ta sẽ gọi nó
    // trong thẻ script hoặc biến nó thành IIFE
    (function() {
        // login h1
        const title = document.createElement('h1');
        title.innerHTML= 'Login (Vite)';
        document.body.appendChild(title);
        // login form
        const form = document.createElement('form');
        form.id = 'login';
        //---username---
        // login form label
        const usernameLabel = document.createElement('label');
        usernameLabel.textContent = 'Username: ';
        // login form label input
        const usernameInput = document.createElement('input');
        usernameInput.name = 'username';
        usernameInput.autocomplete = 'username';
        usernameLabel.appendChild(usernameInput);

        form.appendChild(usernameLabel);
        document.body.appendChild(form);
        console.log("Script frontend executed from Vite!");
    })();
}

// Hàm này sẽ được dùng để tạo ra HTML
export function generateLoginPageHtml() {
    // Để Vite minify JS, chúng ta sẽ không dùng getFunctionBodyString ở đây
    // Thay vào đó, chúng ta sẽ để Vite xử lý các script sau
    return /* html */ `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Vite Login Page</title>
            ${styleFrontend}
        </head>
        <body>
            <div id="app"></div>
            <script type="module">
                // Trong môi trường Vite, chúng ta có thể import trực tiếp các hàm
                import { testRender, scriptFrontend } from '/src/backend/admin/views/login/login-page.js';

                testRender();
                scriptFrontend(); // Gọi hàm để thực thi logic DOM
            </script>
        </body>
        </html>
    `;
}
```

**3. `src/main.js` (Điểm vào JS cho Vite - có thể trống nếu HTML là chính)**

Trong trường hợp này, `main.js` không cần thiết nếu mọi thứ đều inline trong HTML. Nhưng nếu bạn có bất kỳ script client-side nào khác cần Vite xử lý, bạn sẽ import chúng ở đây. Để làm ví dụ, chúng ta sẽ để trống hoặc chỉ log ra.

```javascript
// src/main.js
console.log('Vite app loaded!');
```

**4. `index.html` (Điểm vào HTML chính cho Vite)**

Đây là file HTML mà Vite sẽ dùng làm nền. Chúng ta sẽ inject nội dung HTML từ `generateLoginPageHtml()` vào đây bằng một plugin.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vite App</title>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/main.js"></script>
</body>
</html>
```

**5. `vite.config.js` (Cấu hình Vite)**

Đây là phần quan trọng nhất. Chúng ta sẽ sử dụng một **Vite plugin tùy chỉnh** để "render" HTML từ `generateLoginPageHtml()` và thay thế nội dung của `index.html` trong quá trình build.

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { generateLoginPageHtml } from './src/backend/admin/views/login/login-page.js';

// Plugin Vite tùy chỉnh để render HTML
function htmlRenderPlugin() {
  return {
    name: 'html-render',
    // Chỉ chạy trong build mode
    apply: 'build',

    // Hook `transformIndexHtml` cho phép bạn thay đổi HTML của index.html
    transformIndexHtml(html) {
      // Gọi hàm của bạn để sinh ra HTML hoàn chỉnh
      // Trong môi trường build, Vite sẽ tự động xử lý minification cho các script và style
      // được nhúng thông qua thẻ <script src="..."> hoặc <style> / <script> inline
      const renderedHtml = generateLoginPageHtml();
      return renderedHtml;
    }
  };
}

export default defineConfig({
  root: './src', // Đặt thư mục gốc của dự án Vite là 'src'
  plugins: [htmlRenderPlugin()],
  build: {
    outDir: '../dist', // Thư mục đầu ra cho bản build
    emptyOutDir: true, // Xóa thư mục đầu ra trước khi build
    minify: 'terser', // Sử dụng terser để minify JS, CSS, HTML
    rollupOptions: {
      input: {
        // Đây là điểm vào HTML chính của bạn
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        // Đảm bảo tên file HTML vẫn là index.html
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`,
        manualChunks: undefined, // Tùy chọn để kiểm soát việc chia chunk
      },
    },
  },
  server: {
    // Cấu hình dev server cho Vite
    open: '/index.html', // Mở trình duyệt với index.html khi dev server khởi động
  },
});
```

**6. `package.json` (Cập nhật script)**

```json
{
  "name": "vite-web-mvc-project",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  }
}
```

-----

### Cách hoạt động và Test

1.  **Cài đặt dependencies:**

    ```bash
    bun install
    # hoặc npm install / yarn install
    ```

2.  **Chạy Dev Server:**

    ```bash
    bun run dev
    ```

    Mở trình duyệt theo địa chỉ mà Vite hiển thị (thường là `http://localhost:5173/`). Bạn sẽ thấy trang Login được render. Vite dev server sẽ xử lý các import ES Module trong `<script type="module">` của `generateLoginPageHtml()` và cung cấp HMR nếu bạn thay đổi `login-page.js`.

3.  **Chạy Production Build:**

    ```bash
    bun run build
    ```

    Lệnh này sẽ chạy Vite build.

      * **Plugin `htmlRenderPlugin`** sẽ can thiệp vào `index.html`.
      * Nó gọi `generateLoginPageHtml()` để lấy chuỗi HTML đã render.
      * Vite (sử dụng Rollup và Terser) sau đó sẽ nhận chuỗi HTML này, tự động phát hiện và **minify** các thẻ `<style>` inline, và các `<script type="module">` inline (bao gồm cả mã JS bạn đã `import` và gọi `testRender()`, `scriptFrontend()`).
      * Kết quả là một file `dist/index.html` đã được tối ưu hóa hoàn chỉnh.

4.  **Kiểm tra kết quả Build:**

    ```bash
    bun run preview
    # hoặc mở file dist/index.html trong trình duyệt
    ```

    Bạn sẽ thấy trang được render từ file `index.html` đã được minify. Khi xem mã nguồn, bạn sẽ thấy CSS và JS đã được nén gọn gàng.

-----

### Thảo luận thêm

  * **HTML as JavaScript (JSX/TSX):** Đối với các dự án phức tạp hơn, bạn có thể cân nhắc sử dụng các thư viện như React, Vue, Svelte, v.v., kết hợp với JSX/TSX. Các framework này cho phép bạn viết HTML ngay trong JavaScript và cung cấp quy trình build/tối ưu hóa rất mạnh mẽ thông qua Vite.
  * **Server-Side Rendering (SSR):** Nếu ứng dụng của bạn cần render HTML trên server cho mỗi request (thay vì pre-render tĩnh), bạn sẽ cần một framework SSR như Next.js, Nuxt.js, SvelteKit, hoặc một backend custom với Vite SSR API.
  * **Sử dụng `Bun.build` trong Vite Plugin:** Một cách tiếp cận nâng cao khác là viết một Vite plugin mà bên trong đó, bạn sử dụng `Bun.build` để tối ưu hóa riêng các phần JS/CSS mà bạn muốn inline, sau đó chèn chúng vào HTML. Tuy nhiên, Vite đã có Rollup và Terser, thường đủ tốt cho hầu hết các trường hợp.

Với cấu hình Vite này, bạn có một quy trình phát triển nhanh chóng và một quy trình build production tự động tối ưu hóa mọi thứ, đúng như mong muốn của bạn.

##

Bạn đã đưa ra một yêu cầu rất rõ ràng và đó là một kịch bản phổ biến trong phát triển SSR. Vite được thiết kế để xử lý tốt điều này.

Để đạt được mục tiêu "build một file duy nhất với tất cả mọi thứ đã được minify" cho SSR, và để Bun có thể sử dụng nó trong môi trường production mà không cần sửa đổi nhiều, chúng ta sẽ tập trung vào việc tạo ra một **server bundle** duy nhất.

Vite sẽ sử dụng Rollup ở phía sau để tạo ra bundle này, và nó sẽ bao gồm tất cả các dependencies cần thiết (bao gồm cả `html-minifier-terser` và các hàm của bạn) vào một file duy nhất.

-----

### Cấu Trúc Dự Án Đề Xuất

```
.
├── src/
│   ├── backend/
│   │   └── admin/
│   │       └── views/
│   │           └── login/
│   │               ├── login-page.js   # Chứa các thành phần UI (style, hàm JS)
│   │               └── utils.js        # Chứa hàm tiện ích getFunctionBodyString
│   └── entry-server.js # Điểm vào SSR chính, nơi render HTML và minify
├── dist/               # Thư mục đầu ra của bản build
│   └── server/         # Chứa bundle SSR
│       └── entry-server.js
├── server.js           # Một server Node.js/Bun đơn giản để test bundle SSR
├── vite.config.js
├── package.json
```

-----

### Các File Cần Chỉnh Sửa/Tạo Mới

**1. `src/backend/admin/views/login/login-page.js`**

File này sẽ chứa các thành phần UI cơ bản. Các hàm JavaScript (`testRender`, `scriptFrontend`) sẽ được xuất ra để `entry-server.js` có thể nhập và chuyển đổi thành chuỗi để nhúng vào HTML.

```javascript
// src/backend/admin/views/login/login-page.js

// Export styleFrontend để entry-server.js có thể sử dụng
export const styleFrontend = /* html */`
    <style>
        h1 {
            color: red;
        }
        #login {
            color: blue;
        }
    </style>
`;

// Hàm testRender, sẽ được chuyển thành chuỗi và nhúng vào HTML
export function testRender() {
    console.log("Test render executed on client (from SSR bundle)!");
}

// Hàm scriptFrontend, sẽ được chuyển thành chuỗi và nhúng vào HTML
export function scriptFrontend() {
    // Đây là một IIFE để nó tự động chạy khi được chèn vào HTML client
    (function() {
        const title = document.createElement('h1');
        title.innerHTML= 'Login (SSR)';
        document.body.appendChild(title);

        const form = document.createElement('form');
        form.id = 'login';

        const usernameLabel = document.createElement('label');
        usernameLabel.textContent = 'Username: ';
        const usernameInput = document.createElement('input');
        usernameInput.name = 'username';
        usernameInput.autocomplete = 'username';
        usernameLabel.appendChild(usernameInput);

        form.appendChild(usernameLabel);
        document.body.appendChild(form);
        console.log("Script frontend executed and DOM manipulated on client (from SSR bundle)!");
    })();
}
```

**2. `src/backend/admin/views/login/utils.js`**

Hàm tiện ích `getFunctionBodyString` để trích xuất phần thân của hàm.

```javascript
// src/backend/admin/views/login/utils.js

export function getFunctionBodyString(func) {
    const funcString = func.toString();
    const bodyMatch = funcString.match(/\{([\s\S]*)\}/);
    if (bodyMatch && bodyMatch[1]) {
        return bodyMatch[1].trim();
    }
    return '';
}
```

**3. `src/entry-server.js`**

Đây là **điểm vào SSR** của bạn. File này sẽ được Vite build thành một bundle server. Nó sẽ nhập các thành phần UI, sử dụng `getFunctionBodyString` để lấy mã JavaScript, xây dựng chuỗi HTML hoàn chỉnh, và sau đó minify chuỗi HTML đó bằng `html-minifier-terser`.

```javascript
// src/entry-server.js

// Import các thành phần từ login-page.js
import { styleFrontend, testRender, scriptFrontend } from './backend/admin/views/login/login-page.js';
// Import hàm tiện ích
import { getFunctionBodyString } from './backend/admin/views/login/utils.js';
// Import thư viện minify HTML
import { minify as htmlMinifier } from 'html-minifier-terser';

/**
 * Hàm này sẽ được gọi bởi server để render trang.
 * Nó trả về chuỗi HTML đã được minify.
 * @returns {Promise<string>} Chuỗi HTML đã được minify.
 */
export async function render() {
    // Lấy phần thân của các hàm JavaScript để nhúng inline
    const testRenderBody = getFunctionBodyString(testRender);
    const scriptFrontendBody = getFunctionBodyString(scriptFrontend);

    // Xây dựng chuỗi HTML thô
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
                // Mã JavaScript sẽ được nhúng inline và sau đó được minify bởi html-minifier-terser
                ${testRenderBody}
                ${scriptFrontendBody}
            </script>
        </body>
        </html>
    `;

    // Minify toàn bộ chuỗi HTML, bao gồm cả CSS và JS inline
    const minifiedHtml = await htmlMinifier(rawHtml, {
        collapseWhitespace: true,  // Loại bỏ khoảng trắng thừa
        removeComments: true,      // Loại bỏ comment
        minifyCSS: true,           // Minify CSS trong thẻ <style>
        minifyJS: {                // Minify JS trong thẻ <script>
            compress: true,        // Bật nén mã JS
            mangle: true,          // Bật đổi tên biến (mangling)
        },
        sortAttributes: true,      // Sắp xếp thuộc tính HTML
        sortClassName: true,       // Sắp xếp class name
        // Thêm các tùy chọn khác nếu cần để tối ưu hóa thêm
    });

    return minifiedHtml;
}
```

**4. `vite.config.js`**

Cấu hình Vite để thực hiện build SSR.

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  root: './src', // Đặt thư mục gốc của dự án Vite là 'src'
  build: {
    outDir: '../dist/server', // Thư mục đầu ra cho bản build SSR
    emptyOutDir: true,        // Xóa thư mục đầu ra trước khi build
    ssr: 'entry-server.js',   // Chỉ định điểm vào SSR của bạn
    minify: 'terser',         // Đảm bảo minify bundle SSR bằng Terser
    rollupOptions: {
      input: {
        // Định nghĩa điểm vào server bundle
        'entry-server': resolve(__dirname, 'src/entry-server.js'),
      },
      output: {
        // Xuất ra dưới dạng CommonJS để Node.js/Bun server có thể dễ dàng import
        format: 'cjs',
        // Tên file đầu ra sẽ là 'entry-server.js' trong thư mục outDir
        entryFileNames: '[name].js',
        // Vì mục tiêu là "1 file minify tất cả", Rollup sẽ bundle mọi thứ vào entry-server.js này.
        // Do đó, bạn sẽ không thấy cấu trúc thư mục lồng nhau của src/backend/admin/views/login/ trong dist/server.
      },
    },
  },
  // Cấu hình dev server (không liên quan trực tiếp đến SSR build nhưng hữu ích cho phát triển)
  server: {
    // Mở trình duyệt khi dev server khởi động
    // Lưu ý: Dev server này sẽ không thực hiện SSR mà chỉ phục vụ các file tĩnh
    // Để test SSR, bạn cần chạy server.js riêng.
    open: false, // Không tự động mở trình duyệt cho dev server
  },
});
```

**5. `server.js` (Để test Bundle SSR)**

File này là một server Node.js/Bun đơn giản để kiểm tra bundle SSR đã được build. Nó sẽ import bundle SSR và gọi hàm `render()` của nó để lấy HTML đã được minify.

```javascript
// server.js
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import express from 'express'; // Cần cài đặt: bun add express

// Lấy đường dẫn thư mục hiện tại (tương thích với ES Modules)
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

async function startServer() {
  // Đường dẫn đến bundle SSR đã được build
  const ssrBundlePath = resolve(__dirname, './dist/server/entry-server.js');

  // Import động bundle SSR.
  // Trong môi trường production, bạn sẽ load cái này một lần khi server khởi động.
  let render;
  try {
    // Sử dụng import() động để load module CommonJS từ Vite SSR build
    const ssrModule = await import(ssrBundlePath);
    render = ssrModule.render; // Hàm render được export từ entry-server.js
  } catch (error) {
    console.error('Failed to load SSR bundle:', error);
    process.exit(1); // Thoát nếu không load được bundle
  }

  // Định nghĩa route chính
  app.get('/', async (req, res) => {
    try {
      // Gọi hàm render từ bundle SSR để lấy HTML đã được minify
      const html = await render();
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } catch (e) {
      console.error('Error during SSR:', e);
      res.status(500).send('Internal Server Error');
    }
  });

  // Khởi động server
  app.listen(port, () => {
    console.log(`SSR Test Server listening on http://localhost:${port}`);
    console.log(`Access the page at http://localhost:${port}`);
  });
}

// Khởi chạy server
startServer().catch(console.error);
```

**6. `package.json`**

Cập nhật scripts và dependencies.

```json
{
  "name": "vite-ssr-project",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "build:server-test": "vite build",
    "start:server-test": "node server.js"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "html-minifier-terser": "^7.1.0",
    "express": "^4.19.2"
  }
}
```

-----

### Các Bước Thực Hiện và Kiểm Tra

1.  **Cài đặt Dependencies:**

    ```bash
    bun install
    # hoặc npm install / yarn install
    ```

2.  **Build Server Bundle:**

    ```bash
    bun run build:server-test
    ```

    Lệnh này sẽ chạy Vite build và tạo ra file `dist/server/entry-server.js`. File này sẽ là một bundle CommonJS đã được minify, chứa tất cả logic render và minify HTML.

3.  **Chạy Server Test:**

    ```bash
    bun run start:server-test
    ```

    Lệnh này sẽ khởi động server Node.js/Bun đơn giản của bạn, server này sẽ import `dist/server/entry-server.js` và sử dụng hàm `render` của nó.

4.  **Kiểm tra trên Trình duyệt:**
    Mở trình duyệt và truy cập `http://localhost:3000`.
    Bạn sẽ thấy trang Login được render. Hãy xem mã nguồn (View Source) của trang để xác nhận rằng HTML, CSS inline và JavaScript inline đều đã được minify tối đa.

-----

### Thảo Luận Về Cấu Trúc Đầu Ra

Bạn có đề cập: "đầu ra với cấu trúc thư mục dist/server --\>\> chúng ta cần một cấu trúc giống cấu trúc trong view -\>\> để bun có thể sử dụng tron prod --\>\> mà không phải sửa code nhiều nhất có thể".

Với cấu hình hiện tại, Vite SSR build sẽ tạo ra **một file duy nhất** là `dist/server/entry-server.js`. File này đã bao gồm tất cả các dependencies (như `login-page.js`, `utils.js`, `html-minifier-terser`) bên trong nó.

  * **Ưu điểm của một file bundle duy nhất:**

      * Đơn giản hóa việc triển khai: Chỉ cần copy một file.
      * Tối ưu hóa hiệu suất: Rollup (công cụ bundling của Vite) sẽ thực hiện tree-shaking và code-splitting hiệu quả.
      * Dễ dàng quản lý dependencies: Tất cả đều nằm trong một gói.

  * **Nhược điểm:** Bạn sẽ không thấy cấu trúc thư mục `backend/admin/views/login` được tái tạo trong `dist/server`.

Nếu bạn *thực sự* cần tái tạo cấu trúc thư mục nguồn trong `dist/server` (ví dụ: `dist/server/backend/admin/views/login/login-page.js` và `dist/server/backend/admin/views/login/utils.js` là các file riêng biệt), điều đó sẽ phức tạp hơn và thường không phải là cách làm tiêu chuẩn cho SSR bundle. Bạn sẽ cần:

1.  Cấu hình Rollup trong `vite.config.js` để không bundle các file này vào `entry-server.js` (ví dụ: bằng cách đánh dấu chúng là external).
2.  Thêm một plugin Vite hoặc một script build tùy chỉnh để copy hoặc xử lý các file này vào thư mục `dist/server` với cấu trúc mong muốn.

Tuy nhiên, với mục tiêu "build 1 file với minify all", cách tiếp cận hiện tại với một bundle SSR duy nhất là tối ưu và phổ biến nhất. Server Bun của bạn sẽ chỉ cần biết đường dẫn đến file `dist/server/entry-server.js` này để khởi tạo ứng dụng.
