#  Elysia.js tích hợp Vite HMR cho SSR (Vanilla JS)

Tuyệt vời\! Việc sử dụng Elysia.js sẽ giúp bạn tích hợp **Vite HMR (Hot Module Replacement)** vào dự án SSR của bạn với Bun một cách dễ dàng và hiệu quả hơn nhiều so với việc cố gắng xử lý middleware trong Bun thuần. Elysia.js được xây dựng trên Bun, tận dụng tối đa hiệu suất của nó và cung cấp một API rõ ràng.

-----

## Ví dụ cơ bản về Elysia.js tích hợp Vite HMR cho SSR (Vanilla JS)

Chúng ta sẽ xây dựng một ví dụ đơn giản với cấu trúc MVC (Model-View-Controller) cơ bản để bạn hình dung. Tuy nhiên, trong một dự án Vanilla JS nhỏ, MVC có thể không quá rõ ràng, nhưng tôi sẽ cố gắng tách biệt các phần để minh họa ý tưởng.

### 1\. Cài đặt các thư viện cần thiết

Trước tiên, hãy đảm bảo bạn đã tạo một thư mục dự án mới và cài đặt các dependencies:

```bash
mkdir bunvite-elysia-ssr
cd bunvite-elysia-ssr
bun init -y # Khởi tạo project Bun
bun add elysia
bun add -D vite @elysiajs/vite
```

### 2\. Cấu trúc dự án

```
bunvite-elysia-ssr/
├── public/
│   └── index.html
├── src/
│   ├── models/ # Để minh họa Model
│   │   └── data.js
│   ├── views/  # Để minh họa View (hàm render HTML)
│   │   └── appView.js
│   ├── controllers/ # Để minh họa Controller (logic xử lý yêu cầu)
│   │   └── homeController.js
│   ├── entry-client.js  # Client-side hydration
│   └── entry-server.js  # Server-side rendering
├── server.js # Server chính với Elysia
├── vite.config.js
└── package.json
```

-----

### 3\. Các file Frontend (Client & Server)

#### `public/index.html`

Template HTML cho SSR.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bun Elysia Vite Vanilla SSR</title>
</head>
<body>
    <div id="app"></div>
    </body>
</html>
```

#### `src/models/data.js`

Minh họa Model: nơi lấy dữ liệu (ví dụ, một hàm trả về chuỗi).

```javascript
// src/models/data.js
export function getWelcomeMessage() {
    return "Chào mừng đến với Vanilla JS SSR (Elysia + Vite)!";
}
```

#### `src/views/appView.js`

Minh họa View: hàm tạo chuỗi HTML từ dữ liệu.

```javascript
// src/views/appView.js
export function createAppHtml(message, clickCount = 0) {
    return `
        <div>
            <h1>${message}</h1>
            <p>Đây là ứng dụng Vanilla JS được render bởi Bun/Elysia (SSR) và được hydrate bởi Vite (Client).</p>
            <button id="myButton">Click me!</button>
            <p id="clickCount">Đã click: ${clickCount} lần</p>
        </div>
    `;
}
```

#### `src/controllers/homeController.js`

Minh họa Controller: logic để phối hợp Model và View.

```javascript
// src/controllers/homeController.js
import { getWelcomeMessage } from '../models/data.js';
import { createAppHtml } from '../views/appView.js';

export function getHomePageContent() {
    const message = getWelcomeMessage();
    return createAppHtml(message);
}
```

#### `src/entry-server.js`

Entry point cho SSR: hàm `render` sẽ được gọi trên server.

```javascript
// src/entry-server.js
import { getHomePageContent } from './controllers/homeController.js';

// Hàm này sẽ được gọi trên server để tạo ra chuỗi HTML
export function render() {
    return getHomePageContent();
}
```

#### `src/entry-client.js`

Entry point cho Client-side Hydration: Kích hoạt tương tác trên trình duyệt.

```javascript
// src/entry-client.js
// Chúng ta không cần import appView hay data ở đây vì HTML đã được render.
// Chỉ cần thêm logic tương tác vào DOM đã có.

console.log('Client-side script loaded for hydration.');

// Đảm bảo mã này chỉ chạy trên trình duyệt
if (typeof document !== 'undefined') {
    const button = document.getElementById('myButton');
    const clickCountElement = document.getElementById('clickCount');
    let count = 0;

    // Lấy số đếm ban đầu nếu có từ SSR (ví dụ này không truyền, nhưng trong thực tế có thể)
    // const initialCount = parseInt(clickCountElement.textContent.replace('Đã click: ', '').replace(' lần', '')) || 0;
    // count = initialCount;

    if (button && clickCountElement) {
        button.addEventListener('click', () => {
            count++;
            clickCountElement.textContent = `Đã click: ${count} lần`;
            console.log('Nút đã được click (Client-side)!');
        });
    }
}
```

-----

### 4\. Cấu hình Vite (`vite.config.js`)

Vite sẽ được cấu hình để tạo ra hai bản build (client và server) và tích hợp với Elysia thông qua plugin `@elysiajs/vite`.

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import { ssr } from 'vite-plugin-ssr/plugin'; // Ví dụ nếu bạn dùng vite-plugin-ssr, nhưng không cần thiết với Elysia + Vite tích hợp
// Không cần plugin đặc biệt cho Vanilla JS, chỉ cần cấu hình Vite.
// Import plugin từ Elysia cho Vite
import { vite as elysiaVite } from '@elysiajs/vite';

export default defineConfig({
    plugins: [
        // Plugin này sẽ giúp Elysia tích hợp tốt với Vite Dev Server
        elysiaVite({
            // Cấu hình Vite cho SSR
            ssr: {
                // Định nghĩa entry point cho server
                entry: './src/entry-server.js',
                // Để Bun (Elysia) có thể import được các file .js trong dev mode
                noExternal: ['your-project-name'], // Thêm tên package của bạn ở đây nếu có lỗi module
                                                  // Ví dụ: noExternal: ['bunvite-elysia-ssr']
            },
            // Chỉ định thư mục output cho client và server
            clientOutput: 'dist/client',
            serverOutput: 'dist/server',
        }),
    ],
    // Các cấu hình build khác
    build: {
        minify: false, // Để dễ đọc trong quá trình học
        rollupOptions: {
            input: {
                // Client bundle sẽ được Vite tự động xử lý qua public/index.html
                // Server bundle sẽ được xử lý qua ssr.entry
            }
        }
    }
});
```

  * **`@elysiajs/vite`**: Đây là plugin giúp Elysia biết cách làm việc với Vite Dev Server và xử lý các bản build SSR.
  * **`ssr.entry`**: Chỉ định file `entry-server.js` cho bản build server.

-----

### 5\. Server chính với Elysia (`server.js`)

Đây là nơi bạn sẽ tạo server với Elysia và tích hợp với Vite Dev Server cho chế độ phát triển và phục vụ các bản build trong chế độ production.

```javascript
// server.js
import { Elysia } from 'elysia';
import { vite } from '@elysiajs/vite';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';

const app = new Elysia();

app.use(
    vite({
        // Cấu hình plugin @elysiajs/vite
        entry: './src/entry-client.js', // Client entry point
        root: __dirname, // Thư mục gốc của project
        build: {
            outDir: 'dist', // Thư mục output chung cho cả client và server
        },
        // Nếu bạn muốn Vite Dev Server chạy trên một cổng khác trong dev
        // devBundler: {
        //     port: 5173
        // }
    })
);

// Router chính
app.get('/', async ({ html, ssrHtml, set }) => {
    // ssrHtml được cung cấp bởi plugin @elysiajs/vite,
    // nó đã gọi hàm render từ entry-server.js của bạn.
    const appHtml = ssrHtml;

    // Đọc template HTML
    let template = readFileSync(resolve(__dirname, 'public/index.html'), 'utf-8');

    // Chèn nội dung đã SSR vào placeholder
    template = template.replace('', appHtml);

    // Trả về HTML
    set.headers['Content-Type'] = 'text/html';
    return template;
});

// Bắt đầu server
app.listen(3000, ({ hostname, port }) => {
    console.log(`🦊 Elysia is running at http://${hostname}:${port}`);
    if (!isProduction) {
        console.log(`Vite HMR active for client-side development.`);
    }
});

```

  * **`app.use(vite({ ... }))`**: Đây là phần quan trọng nhất. Plugin `@elysiajs/vite` sẽ:
      * **Trong chế độ phát triển (`NODE_ENV !== 'production'`):** Khởi động Vite Dev Server ngầm, xử lý các yêu cầu cho các file client-side (như `/src/entry-client.js`, `/src/app.js`), và inject code HMR vào các file đó và HTML. Elysia sẽ tự động chuyển tiếp các yêu cầu này đến Vite Dev Server.
      * **Trong chế độ production (`NODE_ENV === 'production'`):** Phục vụ các file tĩnh đã được build (từ `dist/client`) và sử dụng bản build SSR (từ `dist/server`) để render HTML.
  * **`ssrHtml`**: Plugin `@elysiajs/vite` tự động gọi hàm `render()` từ `entry-server.js` của bạn và cung cấp kết quả qua `ssrHtml`.

-----

### 6\. `package.json`

Cập nhật các script để chạy dễ dàng hơn.

```json
{
  "name": "bunvite-elysia-ssr",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "bun --hot server.js",
    "build": "vite build",
    "start": "NODE_ENV=production bun server.js"
  },
  "dependencies": {
    "elysia": "^1.0.26"
  },
  "devDependencies": {
    "@elysiajs/vite": "^0.7.1",
    "vite": "^5.2.0"
  }
}
```

  * **`npm run build`**: Lệnh này bây giờ chỉ cần `vite build`. Plugin `@elysiajs/vite` sẽ lo việc tạo cả client bundle và server bundle một cách chính xác.
  * **`npm run dev`**: Chạy server Elysia với Bun HMR (cho server-side code) và đồng thời kích hoạt Vite Dev Server (cho client-side HMR).
  * **`npm run start`**: Chạy ứng dụng trong chế độ production.

-----

### Cách hoạt động của HMR trong ví dụ này:

1.  Khi bạn chạy `bun dev`, Elysia sẽ khởi động server của nó.
2.  Plugin `@elysiajs/vite` sẽ phát hiện rằng bạn đang ở chế độ dev và khởi tạo Vite Dev Server.
3.  Khi trình duyệt yêu cầu `/`, Elysia sẽ:
      * Đọc `public/index.html`.
      * Yêu cầu `ssrHtml` từ plugin `@elysiajs/vite`. Plugin này sẽ gọi `render()` từ `src/entry-server.js` của bạn (mà không cần build lại trong dev).
      * Chèn `ssrHtml` vào template.
      * Quan trọng nhất: **Vite Dev Server** sẽ tự động **inject các script cần thiết cho client bundle (`entry-client.js`) và mã HMR (websocket client)** vào HTML trước khi nó được gửi đến trình duyệt.
4.  Khi bạn chỉnh sửa các file frontend như `src/appView.js` hoặc `src/entry-client.js`:
      * Vite Dev Server sẽ phát hiện thay đổi.
      * Nó sẽ biên dịch lại module bị ảnh hưởng và gửi một bản cập nhật HMR qua websocket đến trình duyệt.
      * Mã HMR trong trình duyệt sẽ nhận cập nhật và thay thế module cũ bằng module mới mà không cần tải lại toàn bộ trang, giúp bạn thấy thay đổi gần như ngay lập tức.

Với setup này, bạn sẽ có cả SSR và HMR hoạt động mượt mà trong quá trình phát triển, mang lại trải nghiệm tuyệt vời\!