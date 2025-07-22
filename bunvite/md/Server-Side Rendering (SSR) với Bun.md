## Server-Side Rendering (SSR) với Bun

Để Vite "nhận biết" rằng Bun đã render HTML và gửi đến trình duyệt, quá trình này liên quan đến **Server-Side Rendering (SSR)** và **Client-Side Hydration**. Dưới đây là cách chúng hoạt động cùng nhau:

-----

### 1\. Server-Side Rendering (SSR) với Bun

Trước tiên, Bun (hoặc bất kỳ môi trường Node.js tương thích nào) sẽ thực hiện SSR. Điều này có nghĩa là ứng dụng frontend của bạn (ví dụ: React, Vue, Svelte) được chạy trên máy chủ, tạo ra một chuỗi HTML đầy đủ.

  * **entry-server.js:** Bạn sẽ có một file "entry-server.js" (hoặc tên tương tự) trên máy chủ. File này chịu trách nhiệm:

      * Tạo một phiên bản của ứng dụng frontend của bạn.
      * Sử dụng API của framework (ví dụ: `ReactDOMServer.renderToString` của React, `renderToString` của Vue) để render ứng dụng thành một chuỗi HTML.
      * Gửi chuỗi HTML này như một phản hồi HTTP đến trình duyệt.

    **Ví dụ đơn giản về HTML được trả về từ Bun:**

    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>My SSR App</title>
    </head>
    <body>
        <div id="app"></div>
        <script type="module" src="/src/entry-client.js"></script>
    </body>
    </html>
    ```

    Trong ví dụ này, \`\` là một placeholder mà server-side đã chèn nội dung HTML được render vào.

-----

### 2\. Vai trò của Vite trong SSR và Hydration

Vite đóng vai trò quan trọng trong cả quá trình phát triển (với HMR) và xây dựng (cho production) các ứng dụng SSR.

#### Trong môi trường phát triển (Development):

  * **Middleware Mode:** Vite thường được sử dụng ở chế độ middleware. Điều này có nghĩa là server Bun của bạn sẽ sử dụng Vite dev server làm middleware để xử lý các yêu cầu.
  * **SSR Entry:** Vite sẽ biết cách tải và chạy `entry-server.js` của bạn trên máy chủ (mà không cần đóng gói).
  * **HTML Transformation:** Vite tự động inject **client-side HMR code** và áp dụng các transform từ các plugin của Vite vào HTML trước khi nó được gửi đến trình duyệt. Điều này đảm bảo rằng khi có thay đổi mã nguồn, Vite có thể thông báo cho client cập nhật mà không cần tải lại toàn bộ trang.
  * **`import.meta.hot`:** Trong môi trường phát triển, Vite cung cấp API `import.meta.hot` cho phép bạn quản lý các module được cập nhật nóng. Bun cũng có triển khai API HMR tương tự như của Vite.

#### Trong môi trường sản phẩm (Production):

  * **SSR Build:** Khi bạn build cho production (`vite build --ssr`), Vite sẽ tạo ra hai bản bundle riêng biệt:

      * **Client Bundle:** Đây là mã JavaScript và CSS sẽ được tải và chạy trên trình duyệt.
      * **SSR Bundle:** Đây là mã JavaScript sẽ được chạy trên server Bun để render HTML.

  * **Client-Side Hydration:** Đây là bước quan trọng nhất để Vite "nhận biết" Bun đã render HTML.

      * **`entry-client.js`:** Bạn sẽ có một file "entry-client.js". File này chịu trách nhiệm:
          * Tạo một phiên bản của ứng dụng frontend của bạn.
          * Sử dụng một phương thức đặc biệt của framework (ví dụ: `ReactDOM.hydrateRoot` của React 18+, `createSSRApp().mount('#app', true)` của Vue) để "gắn kết" ứng dụng frontend vào HTML đã được server render sẵn.
          * Thay vì render lại toàn bộ DOM, quá trình hydration sẽ tái sử dụng cấu trúc DOM đã có, gắn kèm các event listener và trạng thái động.

    **Cách Vite và trình duyệt hoạt động cùng nhau:**

    1.  **Bun trả về HTML:** Trình duyệt nhận HTML được Bun render.
    2.  **Trình duyệt tải `entry-client.js`:** Thẻ `<script type="module" src="/src/entry-client.js"></script>` trong HTML sẽ khiến trình duyệt tải và thực thi client bundle của bạn.
    3.  **Client-side hydration:** Bên trong `entry-client.js`, mã của framework của bạn sẽ:
          * Kiểm tra DOM hiện có.
          * Xác định liệu cấu trúc DOM có khớp với cấu trúc mà nó sẽ render hay không.
          * "Kích hoạt" các thành phần UI, gắn các trình xử lý sự kiện (event listeners) và khôi phục trạng thái nếu cần.

-----

### Tóm tắt quá trình:

1.  **Yêu cầu:** Trình duyệt gửi yêu cầu đến server Bun.
2.  **SSR (Bun):** Server Bun chạy `entry-server.js`, render ứng dụng frontend thành HTML và gửi HTML này về cho trình duyệt.
3.  **Tải Client Bundle (Vite):** Trình duyệt nhận HTML và tải client bundle (`entry-client.js`) do Vite tạo ra (hoặc phục vụ trong dev mode).
4.  **Hydration (Vite & Framework):** Mã trong `entry-client.js` của bạn sẽ "hydrate" HTML đã có sẵn, biến nó thành một ứng dụng tương tác đầy đủ trên client-side. Nếu có sự khác biệt giữa HTML được server render và những gì client sẽ render (gọi là **hydration mismatch**), framework sẽ cảnh báo hoặc cố gắng tự điều chỉnh.

Về cơ bản, Vite không "nhận điểm vào" theo cách Bun gửi HTML. Thay vào đó, **Vite tạo ra các bundles client và server** cho ứng dụng của bạn. Server Bun sử dụng server bundle để tạo HTML, và sau đó trình duyệt sử dụng client bundle (mà Vite cũng tạo ra) để "kích hoạt" HTML đó thông qua quá trình hydration.

Bạn có muốn tìm hiểu sâu hơn về một phần cụ thể nào đó trong quá trình này không?

## ví dụ đơn giản

Chắc chắn rồi\! Bạn có thể làm SSR và Hydration với Vanilla JavaScript thuần mà không cần các thư viện như React hay Vue. Nó sẽ minh họa rõ hơn cách Bun và Vite phối hợp.

-----

### Cấu trúc dự án

Chúng ta sẽ giữ cấu trúc tương tự để dễ theo dõi:

```
my-ssr-vanilla-app/
├── public/
│   └── index.html
├── src/
│   ├── app.js
│   ├── entry-client.js
│   └── entry-server.js
├── server.js
├── vite.config.js
└── package.json
```

-----

### 1\. File HTML cơ bản (`public/index.html`)

Đây vẫn là template HTML mà Bun sẽ sử dụng.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bun + Vite Vanilla JS SSR</title>
</head>
<body>
    <div id="app"></div>
    <script type="module" src="/src/entry-client.js"></script>
</body>
</html>
```

-----

### 2\. Component Vanilla JS cơ bản (`src/app.js`)

Đây là một hàm đơn giản để tạo chuỗi HTML và một hàm để "gắn kết" các sự kiện.

```javascript
// src/app.js

// Hàm này sẽ tạo ra chuỗi HTML của ứng dụng
export function renderAppHtml(message) {
    return `
        <div>
            <h1>${message}</h1>
            <p>Đây là ứng dụng Vanilla JS được render bởi Bun (SSR) và được hydrate bởi Vite (Client).</p>
            <button id="myButton">Click me!</button>
            <p id="clickCount">Đã click: 0 lần</p>
        </div>
    `;
}

// Hàm này sẽ gắn các sự kiện vào DOM đã tồn tại
export function hydrateApp() {
    const button = document.getElementById('myButton');
    const clickCountElement = document.getElementById('clickCount');
    let count = 0;

    if (button && clickCountElement) {
        button.addEventListener('click', () => {
            count++;
            clickCountElement.textContent = `Đã click: ${count} lần`;
            console.log('Nút đã được click!');
        });
    }
}
```

-----

### 3\. Entry point cho Server-Side Rendering (`src/entry-server.js`)

File này sẽ được Bun sử dụng để render chuỗi HTML trên server.

```javascript
// src/entry-server.js
import { renderAppHtml } from './app.js';

export function render() {
    // Chúng ta chỉ gọi hàm renderAppHtml để lấy chuỗi HTML
    const html = renderAppHtml("Chào mừng đến với Vanilla JS SSR!");
    return html;
}
```

  * Rất đơn giản, chỉ gọi hàm `renderAppHtml` để lấy HTML.

-----

### 4\. Entry point cho Client-Side Hydration (`src/entry-client.js`)

File này sẽ được trình duyệt tải xuống và chạy. Nó sẽ sử dụng hàm `hydrateApp` để gắn các sự kiện vào DOM đã có sẵn.

```javascript
// src/entry-client.js
import { hydrateApp } from './app.js';

// Đảm bảo mã này chỉ chạy trên trình duyệt
if (typeof document !== 'undefined') {
    // Gọi hàm hydrateApp để gắn các sự kiện
    hydrateApp();
    console.log('Client-side hydration hoàn tất!');
}
```

  * **`hydrateApp()`**: Đây là cách client "kích hoạt" trang. Thay vì tạo lại HTML, nó chỉ tìm các phần tử và gắn các event listeners. Nếu bạn không chạy `hydrateApp`, nút "Click me\!" sẽ không hoạt động sau khi trang tải.

-----

### 5\. Cấu hình Vite (`vite.config.js`)

Vite vẫn cần biết cách xử lý các entry point cho cả client và server.

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
    // Không cần plugin React hay Vue nữa
    plugins: [],
    build: {
        ssr: './src/entry-server.js', // Chỉ định entry point cho SSR build
        rollupOptions: {
            input: {
                client: './src/entry-client.js',
                server: './src/entry-server.js'
            }
        }
    }
});
```

-----

### 6\. Server Bun (`server.js`)

Server Bun vẫn sẽ đọc template HTML, gọi hàm render từ `entry-server.js`, và chèn HTML vào template. Sau đó, nó sẽ phục vụ các file JavaScript cho trình duyệt.

```javascript
// server.js
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

// Lấy đường dẫn thư mục hiện tại
const __dirname = fileURLToPath(new URL('.', import.meta.url));

async function createServer() {
    const app = Bun.serve({
        port: 3000,
        async fetch(req) {
            const url = new URL(req.url);

            try {
                // Xử lý các yêu cầu cho các assets của Vite (trong chế độ dev)
                if (url.pathname.startsWith('/src/')) {
                    const filePath = resolve(__dirname, url.pathname.slice(1));
                    // Đọc và trả về file JavaScript
                    return new Response(Bun.file(filePath), {
                        headers: { 'Content-Type': 'application/javascript' }
                    });
                }

                // Xử lý yêu cầu HTML
                if (url.pathname === '/') {
                    // Đọc template HTML
                    let html = readFileSync(resolve(__dirname, './public/index.html'), 'utf-8');

                    // Import entry-server và render ứng dụng
                    // Trong môi trường sản phẩm, bạn sẽ import từ bundle SSR đã build (thường là dist/server/entry-server.js)
                    const { render } = await import('./src/entry-server.js');
                    const appHtml = render();

                    // Chèn HTML đã render vào placeholder
                    html = html.replace('', appHtml);

                    return new Response(html, {
                        headers: { 'Content-Type': 'text/html' }
                    });
                }

                // Xử lý các yêu cầu khác (ví dụ: favicon)
                return new Response('Not Found', { status: 404 });

            } catch (e) {
                console.error(e);
                return new Response(`Error: ${e.message}`, { status: 500 });
            }
        },
    });

    console.log(`Server running at http://localhost:${app.port}`);
}

createServer();
```

-----

### 7\. `package.json`

```json
{
  "name": "my-ssr-vanilla-app",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "bun --hot server.js",
    "build": "vite build && vite build --ssr",
    "preview": "bun server.js"
  },
  "devDependencies": {
    "vite": "^5.2.0"
  }
}
```

-----

### Cách chạy ví dụ

1.  **Cài đặt các gói**:
    ```bash
    bun install
    ```
2.  **Chạy server Bun trong chế độ phát triển**:
    ```bash
    bun dev
    ```
    Mở trình duyệt và truy cập `http://localhost:3000`.

Bạn sẽ thấy trang tải ngay lập tức. Nếu bạn xem nguồn trang, bạn sẽ thấy toàn bộ HTML, bao gồm cả nội dung "Chào mừng đến với Vanilla JS SSR\!", đã được Bun render. Sau đó, **`entry-client.js`** sẽ được tải và chạy. File này sẽ tìm nút "Click me\!" và gắn event listener vào nó. Khi bạn click vào nút, số lần click sẽ tăng lên.

Đây là minh họa rõ ràng nhất về cách SSR và hydration hoạt động: Bun tạo ra HTML ban đầu, và sau đó Vanilla JavaScript do Vite phục vụ sẽ "thức tỉnh" trang bằng cách thêm hành vi tương tác vào HTML đã có. 🚀