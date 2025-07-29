## Hàm để đọc manifest.json

Bạn đang hỏi cách cấu hình và sử dụng `manifest: true` như một tiện ích trong môi trường `import.meta.env.NODE_ENV` của Vite.

`manifest: true` trong cấu hình build của Vite có một mục đích cụ thể: **nó tạo ra một file `manifest.json` sau khi quá trình build hoàn tất.**

### `manifest.json` là gì và tại sao nó hữu ích?

Khi bạn bật `manifest: true`, Vite sẽ tạo ra một file `manifest.json` trong thư mục `outDir` của bạn (trong trường hợp này là `dist/client`). File này là một bản đồ (map) từ tên file gốc của các tài nguyên (ví dụ: `main.js`, `style.css`) sang tên file đã được hash và tối ưu hóa của chúng (ví dụ: `main-ab12cd34.js`, `style-ef56gh78.css`).

**Ví dụ về `manifest.json`:**

```json
{
  "main.js": {
    "file": "assets/main-ab12cd34.js",
    "src": "src/main.js",
    "isEntry": true,
    "css": ["assets/main-ef56gh78.css"]
  },
  "style.css": {
    "file": "assets/style-ef56gh78.css",
    "src": "src/style.css"
  }
}
```

### Cách sử dụng `manifest.json` như một tiện ích trong SSR (Server-Side Rendering)

`manifest.json` đặc biệt hữu ích trong các ứng dụng SSR. Khi server của bạn render HTML, nó cần biết đường dẫn chính xác đến các file CSS và JavaScript đã được Vite build (và có thể đã được hash). Thay vì phải hardcode các đường dẫn này hoặc cố gắng suy luận chúng, server có thể đọc `manifest.json` để tìm đường dẫn thực tế.

Để sử dụng `manifest.json` như một tiện ích trong môi trường `import.meta.env.NODE_ENV` (thường là `production` trên server), bạn sẽ làm như sau:

1.  **Đảm bảo `manifest: true` được bật trong `vite.config.client.js`** (như bạn đã chọn).
2.  **Trong code SSR của bạn (`server.js` hoặc một module render HTML), bạn sẽ cần đọc file `manifest.json` này.**

**Ví dụ về cách sử dụng trong code SSR (`server.js` hoặc một hàm render HTML):**

Giả sử bạn có một hàm `render` trên server để tạo ra HTML.

```javascript
// server.js (hoặc một module render HTML của bạn)

import fs from 'node:fs/promises'; // Sử dụng fs/promises để đọc file bất đồng bộ
import path from 'node:path';

// Biến để lưu trữ manifest.json
let manifest;

// Hàm để đọc manifest.json
async function getManifest() {
    if (manifest) return manifest; // Tránh đọc lại nếu đã có
    // Đọc manifest.json từ thư mục build của client
    const manifestPath = path.resolve(process.cwd(), 'dist/client/manifest.json');
    const manifestContent = await fs.readFile(manifestPath, 'utf-8');
    manifest = JSON.parse(manifestContent);
    return manifest;
}

// Hàm render HTML của bạn
async function renderHtml(url) {
    // Chỉ đọc manifest trong môi trường production (hoặc khi cần)
    // Trong development, Vite dev server sẽ tự động inject các script
    if (import.meta.env.NODE_ENV === 'production') {
        const clientManifest = await getManifest();

        // Lấy đường dẫn đến các tài nguyên đã build từ manifest
        const mainJsPath = clientManifest['public/index.html']?.file; // Hoặc 'main.js' nếu bạn chỉ có 1 entry
        const mainCssPath = clientManifest['public/index.html']?.css?.[0]; // Lấy CSS nếu có

        // Xây dựng HTML với các đường dẫn động
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>My App</title>
                ${mainCssPath ? `<link rel="stylesheet" href="/${mainCssPath}">` : ''}
            </head>
            <body>
                <div id="app"></div>
                ${mainJsPath ? `<script type="module" src="/${mainJsPath}"></script>` : ''}
            </body>
            </html>
        `;
    } else {
        // Trong development, Vite dev server sẽ inject các script HMR và client
        // Bạn có thể trả về một template đơn giản hơn hoặc sử dụng HMR như đã có.
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>My App (Dev)</title>
            </head>
            <body>
                <div id="app"></div>
                <!-- Vite sẽ inject script client và HMR ở đây trong dev mode -->
            </body>
            </html>
        `;
    }
}

// Ví dụ về cách sử dụng trong Bun.serve
/*
Bun.serve({
    async fetch(req) {
        const url = new URL(req.url);
        if (url.pathname === '/') {
            const html = await renderHtml(url.pathname);
            return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        }
        // Thêm logic để phục vụ các file tĩnh từ dist/client nếu cần
        // Hoặc sử dụng một middleware phục vụ file tĩnh
        return new Response('Not Found', { status: 404 });
    },
    port: 3000,
});
*/
```

**Giải thích:**

  * **`getManifest()`:** Hàm này đọc file `manifest.json` từ thư mục `dist/client`. Nó chỉ đọc một lần và lưu vào biến `manifest` để tránh đọc lại nhiều lần.
  * **`renderHtml()`:**
      * Trong môi trường `production` (khi `import.meta.env.NODE_ENV === 'production'`), nó gọi `getManifest()` để lấy bản đồ các tài nguyên.
      * Sau đó, nó sử dụng các key trong `manifest` (ví dụ: `'public/index.html'`) để tìm đường dẫn đã được hash của các file JavaScript và CSS tương ứng.
      * Cuối cùng, nó chèn các thẻ `<script>` và `<link>` với các đường dẫn đã lấy được vào HTML.
  * **Trong môi trường `development`:** Bạn không cần đọc `manifest.json` vì Vite dev server sẽ tự động inject các script cần thiết (bao gồm cả HMR) vào HTML được serve.

Bằng cách này, `manifest: true` trở thành một tiện ích quan trọng giúp server-side của bạn biết chính xác cách tham chiếu đến các tài nguyên client-side đã được build và tối ưu hóa bởi Vite, đặc biệt là khi chúng có tên file được hash để tối ưu việc caching.

### bun
Để sử dụng manifest (ví dụ manifest.json) trong sản phẩm (production) với Bun, bạn cần import file HTML vào mã server, khi đó Bun sẽ tự động bundle toàn bộ các asset frontend (bao gồm manifest.json nếu được tham chiếu trong HTML) thành một manifest object. Đối với file manifest.json, bạn nên tham chiếu nó trong HTML như sau:

html
<link rel="manifest" href="./manifest.json" />
Khi build production với Bun:

bun build --target=bun --production --outdir=dist ./server.ts
Sau đó, trong code server:

typescript
import { serve } from "bun";
import index from "./index.html";
serve({
  routes: { "/": index },
});
Lúc này, Bun sẽ đóng gói các file như manifest.json vào thư mục xuất (dist), và các đường dẫn trong HTML sẽ được rewrite để trỏ đến file đã được hash tên, đảm bảo truy cập đúng asset khi chạy production12.