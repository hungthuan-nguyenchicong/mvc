##

Bạn đã phát hiện ra một điểm quan trọng: dù bạn đã đặt `minify: true` trong Vite config, chuỗi template literal ( `...` ) chứa HTML vẫn còn nguyên định dạng với các khoảng trắng và ngắt dòng. Điều này là do Vite/Rollup mặc định sẽ minify JavaScript, nhưng chúng không tự động minify **chuỗi** bên trong JavaScript, đặc biệt là khi chuỗi đó là một template literal chứa HTML.

Khi bạn `import { getFunctionBodyString } from './utils.js';` và sau đó sử dụng `getFunctionBodyString(testRender)` để lấy phần thân của hàm, kết quả trả về là một chuỗi JavaScript. Chuỗi này sau đó được nhúng vào chuỗi HTML lớn hơn. Vite sẽ minify `getFunctionBodyString` và các hàm `testRender`, `scriptFrontend` (nếu chúng được xuất và sử dụng), nhưng nó không tự động minify **nội dung của chuỗi HTML** bạn đang xây dựng trong `loginPage().render()`.

Để đảm bảo toàn bộ HTML được minify, bao gồm cả CSS và JavaScript inline, bạn cần một bước minify HTML riêng biệt **sau khi chuỗi HTML được tạo ra**. Đây chính xác là lý do tại sao trong các ví dụ trước, chúng ta đã sử dụng thư viện `html-minifier-terser`.

Hãy cùng mở rộng thử nghiệm từng bước một để làm rõ điều này và đảm bảo mọi thứ được minify đúng cách.

-----

### Mở Rộng Thử Nghiệm Từng Bước Một

Để giải quyết vấn đề này và đảm bảo mọi thứ được minify triệt để, chúng ta cần đảm bảo rằng `entry-server.js` (hoặc `login-page.js` nếu nó là điểm vào SSR trực tiếp) thực hiện việc minify HTML bằng `html-minifier-terser` **trước khi nó trả về chuỗi HTML**.

**Bước 1: Đảm bảo `html-minifier-terser` được sử dụng trong hàm render.**

Bạn đã nhìn thấy kết quả `minify: true` của Vite chỉ áp dụng cho mã JavaScript. Để minify chuỗi HTML, bạn cần sử dụng một thư viện như `html-minifier-terser` ngay tại thời điểm chuỗi HTML được tạo ra trong SSR.

Hãy sử dụng lại cấu trúc file mà chúng ta đã thảo luận trước đó, nơi `entry-server.js` chịu trách nhiệm render và minify HTML.

-----

#### 1\. Cấu Trúc File

Đảm bảo cấu trúc file của bạn như sau:

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
├── server.js           # Server Node.js/Bun để test bundle SSR
├── vite.config.js
├── package.json
```

-----

#### 2\. Các File Mã Nguồn

**`src/backend/admin/views/login/utils.js`** (Không đổi)

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

**`src/backend/admin/views/login/login-page.js`** (Không đổi)

```javascript
// src/backend/admin/views/login/login-page.js

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

export function testRender() {
    console.log("Test render executed on client (from SSR bundle)!");
}

export function scriptFrontend() {
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

**`src/entry-server.js`** (Cập nhật để **đảm bảo** sử dụng `html-minifier-terser`)

Đây là file quan trọng nhất. Nó sẽ thực hiện việc render và minify.

```javascript
// src/entry-server.js

import { styleFrontend, testRender, scriptFrontend } from './backend/admin/views/login/login-page.js';
import { getFunctionBodyString } from './backend/admin/views/login/utils.js';
import { minify as htmlMinifier } from 'html-minifier-terser'; // Đảm bảo import thư viện

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
```

-----

#### 3\. Cấu Hình Vite (`vite.config.js`)

Cấu hình Vite sẽ chỉ định `entry-server.js` là điểm vào SSR và đảm bảo quá trình minify JavaScript của bundle server. **Lưu ý:** Vite sẽ minify `entry-server.js` và các hàm JS nó import, nhưng việc minify chuỗi HTML nằm trong trách nhiệm của code bạn (sử dụng `html-minifier-terser`).

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  root: './src', // Đặt thư mục gốc của dự án Vite là 'src'
  build: {
    outDir: '../dist/server', // Thư mục đầu ra cho bản build SSR
    emptyOutDir: true,        // Xóa thư mục đầu ra trước khi build
    // Chỉ định điểm vào SSR. Nó phải là một file module JavaScript
    // không phải một hàm render HTML trực tiếp.
    ssr: 'entry-server.js',
    minify: 'terser',         // Đảm bảo minify bundle SSR bằng Terser
    rollupOptions: {
      input: {
        'entry-server': resolve(__dirname, 'src/entry-server.js'),
      },
      output: {
        format: 'cjs',           // Xuất ra dưới dạng CommonJS cho Node.js/Bun server
        entryFileNames: '[name].js', // Tên file đầu ra sẽ là entry-server.js
      },
    },
  },
  server: {
    open: false,
  },
});
```

-----

#### 4\. File Test Server (`server.js`)

File này sẽ khởi động một server nhỏ để sử dụng bundle SSR đã được build.

```javascript
// server.js
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import express from 'express';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

async function startServer() {
  const ssrBundlePath = resolve(__dirname, './dist/server/entry-server.js');
  let render;
  try {
    const ssrModule = await import(ssrBundlePath);
    render = ssrModule.render;
  } catch (error) {
    console.error('Failed to load SSR bundle:', error);
    process.exit(1);
  }

  app.get('/', async (req, res) => {
    try {
      const html = await render(); // Gọi hàm render từ bundle SSR
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } catch (e) {
      console.error('Error during SSR:', e);
      res.status(500).send('Internal Server Error');
    }
  });

  app.listen(port, () => {
    console.log(`SSR Test Server listening on http://localhost:${port}`);
    console.log(`Access the page at http://localhost:${port}`);
  });
}

startServer().catch(console.error);
```

-----

#### 5\. `package.json`

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

### Các Bước Test

1.  **Cài đặt các gói cần thiết:**
    ```bash
    bun install
    # hoặc npm install / yarn install
    ```
2.  **Chạy lệnh build SSR:**
    ```bash
    bun run build:server-test
    ```
    Lệnh này sẽ tạo ra file `dist/server/entry-server.js`. File này sẽ chứa toàn bộ mã logic, bao gồm cả việc gọi `html-minifier-terser`.
3.  **Chạy server test:**
    ```bash
    bun run start:server-test
    ```
    Server sẽ khởi động và lắng nghe trên cổng 3000.
4.  **Truy cập và kiểm tra:**
    Mở trình duyệt và truy cập `http://localhost:3000`.
    Trang Login sẽ hiển thị. Điều quan trọng là bạn cần **xem mã nguồn trang (View Source)** trong trình duyệt. Bạn sẽ thấy HTML được trả về đã được minify hoàn toàn, bao gồm cả các thẻ `<style>` và `<script>` inline. Tất cả khoảng trắng, ngắt dòng và comment thừa sẽ biến mất.

Bằng cách này, bạn đảm bảo rằng mọi khía cạnh của HTML đầu ra, từ cấu trúc cơ bản đến CSS và JavaScript được nhúng, đều được tối ưu hóa cho production.