## Giải pháp mới: Phát triển theo cách tiếp cận Build-time SSR

Tôi hiểu sự thất vọng của bạn. Chúng ta đã cố gắng rất nhiều để tích hợp Vite dev server trực tiếp vào Elysia middleware, nhưng nó vẫn gặp các vấn đề dai dẳng liên quan đến kiểu MIME và xử lý request.

Đề xuất của bạn là một cách tiếp cận rất hợp lý và thực tế hơn cho SSR, đặc biệt là trong môi trường phát triển khi việc tích hợp runtime phức tạp trở nên khó khăn. Đây được gọi là **SSR thời gian xây dựng (Build-time SSR)** hoặc **tiền render (pre-rendering)**.

## 💡 **Giải pháp mới: Phát triển theo cách tiếp cận Build-time SSR**

Thay vì cố gắng làm cho Elysia và Vite dev server tương tác trực tiếp trong runtime, chúng ta sẽ thay đổi quy trình phát triển để nó **phản ánh quy trình sản xuất hơn**:

1.  **Phía Frontend (Vite)**: Bạn sẽ sử dụng Vite để **build** các tệp client-side (HTML, CSS, JS) và server-side (hàm render SSR) vào thư mục `dist/` trong chế độ phát triển.
2.  **Phía Backend (Elysia)**: Server Elysia sẽ **phục vụ** các tệp tĩnh đã được build này từ thư mục `dist/client` và **import** hàm render SSR từ `dist/server`.

Cách này loại bỏ hoàn toàn sự phức tạp của việc tích hợp Vite dev server làm middleware trong Elysia, giúp hệ thống ổn định và dễ debug hơn rất nhiều. Nhược điểm duy nhất là bạn sẽ cần chạy lại bước build mỗi khi thay đổi code nguồn frontend, nhưng điều này có thể được tự động hóa.

## 🛠️ **Các thay đổi cần thiết:**

### 1\. **`package.json` (Cập nhật Script)**

Chúng ta sẽ điều chỉnh các script để rõ ràng hơn về quy trình build-then-serve trong phát triển.

```json
{
  "name": "bunvite-elysia-ssr",
  "module": "index.ts",
  "type": "module",
  "scripts": {
    "dev:vite": "bunx --bun vite",
    "dev:server": "NODE_ENV=development bun --hot server.js",
    "dev:build": "bun run build:client && bun run build:server", // Script mới để build cho dev
    "dev": "bun run dev:build && bun run dev:server", // Chạy build rồi chạy server
    "build:client": "vite build --ssrManifest --outDir dist/client",
    "build:server": "vite build --ssr --outDir dist/server",
    "build": "bun run build:client && bun run build:server",
    "start": "NODE_ENV=production bun server.js"
  },
  "private": true,
  "devDependencies": {
    "@types/bun": "latest",
    "vite": "^7.0.5"
  },
  "peerDependencies": {
    "typescript": "^5"
  },
  "dependencies": {
    "@elysiajs/html": "^1.3.0",
    "@elysiajs/node": "^1.3.0",
    "@elysiajs/static": "^1.3.0",
    "elysia": "^1.3.5",
    "mime-types": "^2.1.35"
  }
}
```

### 2\. **`vite.config.js` (Đơn giản hóa)**

Bây giờ Vite chỉ dùng để build, nên khối `server` không còn cần thiết.

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  // KHÔNG CÓ KHỐI 'server' NÀO Ở ĐÂY NỮA
  // Vite sẽ không chạy server độc lập trong chế độ dev của Elysia
  base: '/', // Vẫn giữ base để đảm bảo đường dẫn tài sản đúng trong build

  build: {
    ssr: 'src/entry-server.js', // Chỉ định điểm vào phía server cho quá trình build
    rollupOptions: {
      input: {
        client: 'src/main.js',    // Điểm vào JavaScript phía client cho quá trình build
        server: 'src/entry-server.js', // Điểm vào JavaScript phía server cho quá trình build
      },
      output: {
        // Định nghĩa tên tệp đầu ra cho các tài sản đã build
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'client') return `assets/main.js`;
          if (chunkInfo.name === 'server') return `server/entry-server.js`;
          return `assets/[name].js`;
        },
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`,
      },
    },
  },
});
```

### 3\. **`server.js` (Elysia Server - Đã cập nhật cho Build-time SSR)**

Phần `IS_DEV` sẽ giống hệt như phần `else` (production) của bạn, vì cả hai đều phục vụ các tệp đã được build.

```javascript
// server.js
import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';
import { staticPlugin } from '@elysiajs/static'; // staticPlugin sẽ được sử dụng
import path from 'node:path';
import fs from 'node:fs/promises'; // Không cần lookup từ mime-types nữa nếu dùng staticPlugin

const IS_DEV = process.env.NODE_ENV !== 'production';

const app = new Elysia();

app.use(html());

// Trong cả chế độ phát triển và sản xuất, chúng ta sẽ phục vụ các tệp đã được build
// và import hàm render từ các tệp đã build.
// Điều này đơn giản hóa đáng kể logic phát triển.

// Phục vụ các tệp tĩnh đã được build bởi Vite
// Trong dev, chúng ta sẽ build vào dist/client và dist/server
// Trong prod, cũng là dist/client và dist/server
app.use(staticPlugin({ assets: 'dist/client', prefix: '/' }));

// Route SSR catch-all
app.get('/*', async ({ set, request }) => {
  console.log(`[Elysia SSR] Incoming Request: ${request.method} ${request.url}`);
  try {
    const url = new URL(request.url).pathname;

    // Đọc template HTML đã được build từ thư mục client
    // Trong dev, bạn sẽ chạy `bun run dev:build` để tạo ra các tệp này
    const templatePath = path.resolve(process.cwd(), 'dist', 'client', 'index.html');
    const template = await Bun.file(templatePath).text();

    // Import hàm render từ gói SSR đã được build
    // Trong dev, bạn sẽ chạy `bun run dev:build` để tạo ra các tệp này
    const { render } = await import(path.resolve(process.cwd(), 'dist', 'server', 'entry-server.js'));

    const initialCount = 0;
    const initialStateScript = `<script>window.__INITIAL_STATE__ = { count: ${initialCount} };</script>`;

    const appHtml = render(initialCount);

    // Trong cả dev và prod, main.js sẽ được build vào /assets/main.js
    const hydrateScriptTag = `<script type="module" src="/assets/main.js"></script>`;

    const finalHtml = template
      .replace(`<!--app-html-->`, appHtml)
      .replace(`<!--hydrate-script-->`, initialStateScript + hydrateScriptTag);

    return new Response(finalHtml, {
      headers: { 'Content-Type': 'text/html' },
    });

  } catch (e) {
    console.error(`Error during SSR in ${IS_DEV ? 'development' : 'production'}:`, e);
    set.status = 500;
    return `<h1>SSR Error in ${IS_DEV ? 'Development' : 'Production'}</h1><pre>${e.stack}</pre><p>Ensure you have run 'bun run dev:build' (or 'bun run build') to create client and server bundles.</p>`;
  }
});

app.listen(3000, () => {
  console.log(`Elysia is running at http://localhost:${app.server?.port}`);
  console.log(`Serving assets from ${path.resolve(process.cwd(), 'dist', 'client')}`);
  if (IS_DEV) {
    console.log(`Remember to run 'bun run dev:build' whenever you change frontend code.`);
  }
});
```

### 4\. **`src/index.html` (Không thay đổi)**

Vẫn giữ các placeholder.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + Bun SSR with Vanilla JS</title>
  </head>
  <body>
    <div id="root">
      <!--app-html-->
    </div>
    <!--hydrate-script-->
  </body>
</html>
```

### 5\. **`src/main.js` (Không thay đổi)**

```javascript
// src/main.js
console.log('[Client] main.js loaded and hydrating.');

const rootElement = document.getElementById('root');
let count = window.__INITIAL_STATE__ ? window.__INITIAL_STATE__.count : 0;

function updateUI() {
  const countDisplay = document.getElementById('count-display');
  if (countDisplay) {
    countDisplay.textContent = `Count: ${count}`;
  }
}

function hydrate() {
  const incrementButton = document.getElementById('increment-button');
  if (incrementButton) {
    incrementButton.addEventListener('click', () => {
      count++;
      updateUI();
    });
  }
  updateUI(); // Cập nhật UI lần đầu
  console.log('Client-side app hydrated and running.');
}

document.addEventListener('DOMContentLoaded', hydrate);
export { hydrate };
```

### 6\. **`src/entry-server.js` (Không thay đổi)**

```javascript
// src/entry-server.js
console.log('[SSR] entry-server.js loaded and rendering minimal HTML.');

export function render(initialCount) {
  return `
    <div id="app-content-ssr">
      <h1>Hello from SSR - Minimal!</h1>
      <p id="count-display">Count: ${initialCount}</p>
      <button id="increment-button">Increment</button>
    </div>
  `;
}
```

-----

## 🚀 **Quy trình làm việc mới (Rất quan trọng\!)**

Bây giờ, quy trình phát triển của bạn sẽ là:

1.  **Cập nhật `package.json`** với script `dev:build`.
2.  **Cập nhật `vite.config.js`** (xóa khối `server`).
3.  **Cập nhật `server.js`** (với logic mới cho chế độ `IS_DEV`).
4.  **Lưu tất cả các tệp** (`package.json`, `vite.config.js`, `server.js`, `src/index.html`, `src/main.js`, `src/entry-server.js`).
5.  **Dừng TẤT CẢ các tiến trình Bun đang chạy** (nhấn `Ctrl+C` trong tất cả các terminal).
6.  **Xóa bộ nhớ cache của Bun (Rất khuyến nghị)**:
    ```bash
    bun install --force
    bun cache clean
    ```
7.  **Mở CHỈ MỘT terminal duy nhất** tại thư mục gốc của dự án.
8.  **Để bắt đầu phát triển**:
    ```bash
    bun run dev
    ```
    Lệnh này sẽ tự động chạy `bun run dev:build` (build client và server bundles) trước, sau đó chạy `bun run dev:server` để khởi động Elysia server phục vụ các tệp đã build đó.

**Lưu ý:**

  * Bất cứ khi nào bạn thay đổi code trong thư mục `src/`, bạn sẽ cần chạy lại `bun run dev:build` để các thay đổi được phản ánh.
  * Bạn không còn cần chạy `bun run dev:vite` trong một terminal riêng nữa.

Cách tiếp cận này sẽ khắc phục các lỗi MIME type và các vấn đề tích hợp phức tạp mà chúng ta đã gặp phải, mang lại một quy trình phát triển ổn định hơn.