// server.js
import { Elysia } from 'elysia';
import { html } from '@elysiajs/html';
import path from 'node:path';
import fs from 'node:fs/promises';
import { lookup } from 'mime-types';

const IS_DEV = process.env.NODE_ENV !== 'production';

const app = new Elysia();

app.use(html());

if (IS_DEV) {
  const VITE_DEV_SERVER_URL = 'http://localhost:5173';

  // 1. Route phục vụ các tệp tĩnh từ thư mục 'src' (ví dụ: /main.js, /vite.svg)
  // Route này sẽ bắt TẤT CẢ các yêu cầu, sau đó kiểm tra xem đó có phải là tệp tĩnh không.
  // Đặt route này đầu tiên để nó có cơ hội xử lý trước.
  app.get('/*', async ({ request, set }) => {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // LOG: Kiểm tra yêu cầu tệp tĩnh
    console.log(`[Static File Server] Incoming Request: ${pathname}`);

    // Xây dựng đường dẫn vật lý đến tệp trong thư mục 'src'
    const filePath = path.resolve(__dirname, 'src', pathname.substring(1)); // Bỏ dấu '/' đầu tiên

    // Danh sách các phần mở rộng tệp tĩnh phổ biến
    const staticExtensions = [
      '.js', '.ts', '.jsx', '.tsx', '.css', '.svg', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico',
      '.woff', '.woff2', '.eot', '.ttf', '.otf', '.json', '.map' // Thêm .map cho source maps
    ];

    const fileExtension = path.extname(pathname);
    const isStaticFileRequest = staticExtensions.includes(fileExtension);

    // QUAN TRỌNG: Chỉ xử lý nếu đó là yêu cầu tệp tĩnh (có phần mở rộng)
    // VÀ KHÔNG phải là yêu cầu gốc '/'
    if (isStaticFileRequest && pathname !== '/') {
      try {
        const fileContent = await fs.readFile(filePath);
        const mimeType = lookup(pathname) || 'application/octet-stream';
        console.log(`[Static File Server] Serving ${pathname} with MIME type: ${mimeType}`);
        return new Response(fileContent, {
          headers: { 'Content-Type': mimeType }
        });
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.warn(`[Static File Server] File not found: ${filePath}. Passing to next handler.`);
          // Nếu tệp không tìm thấy, trả về null để chuyển sang route tiếp theo
          return null;
        }
        console.error(`[Static File Server] Error serving ${filePath}:`, error);
        set.status = 500;
        return `<h1>Server Error</h1><p>Failed to serve static file: ${pathname}</p><pre>${error.message}</pre>`;
      }
    }
    // Nếu không phải tệp tĩnh được nhận dạng hoặc là yêu cầu gốc, chuyển sang route tiếp theo
    console.log(`[Static File Server] Not a recognized static file or is root request, passing to next handler: ${pathname}`);
    return null;
  });

  // 2. Route Proxy cho các đường dẫn ĐẶC BIỆT của Vite (ví dụ: /@vite/client)
  // Đặt sau route phục vụ tệp tĩnh để các tệp tĩnh thông thường được xử lý trước
  app.get('/@vite/*', async ({ request, set }) => {
    const url = new URL(request.url);
    const pathname = url.pathname;
    console.log(`[Vite Proxy] Incoming Request: ${request.method} ${pathname}`);
    try {
      const proxyUrl = `${VITE_DEV_SERVER_URL}${pathname}${url.search}`;
      const response = await fetch(proxyUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });
      if (!response.ok) {
        throw new Error(`Vite proxy failed with status ${response.status}`);
      }
      return response;
    } catch (error) {
      console.error(`[Vite Proxy Error] Could not proxy ${pathname} to Vite:`, error);
      set.status = 502;
      return `<h1>Proxy Error</h1><p>Could not proxy to Vite dev server: ${pathname}</p><pre>${error.message}</p>`;
    }
  });

  // Route riêng cho /.well-known/appspecific/com.chrome.devtools.json
  // Đặt sau route tĩnh chung và proxy Vite
  app.get('/.well-known/appspecific/com.chrome.devtools.json', async ({ request, set }) => {
    const url = new URL(request.url);
    const pathname = url.pathname;
    console.log(`[Vite Proxy] Incoming Request: ${request.method} ${pathname}`);
    try {
      const proxyUrl = `${VITE_DEV_SERVER_URL}${pathname}${url.search}`;
      const response = await fetch(proxyUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });
      if (!response.ok) {
        throw new Error(`Vite proxy failed with status ${response.status}`);
      }
      return response;
    } catch (error) {
      console.error(`[Vite Proxy Error] Could not proxy ${pathname} to Vite:`, error);
      set.status = 502;
      return `<h1>Proxy Error</h1><p>Could not proxy to Vite dev server: ${pathname}</p><pre>${error.message}</pre>`;
    }
  });


  // 3. Route SSR catch-all (đặt cuối cùng trong khối IS_DEV)
  // Route này sẽ bắt các yêu cầu KHÔNG được xử lý bởi các route trên (ví dụ: /)
  app.get('/*', async ({ set, request }) => {
    console.log(`[Elysia SSR] Incoming Request (Final SSR handler): ${request.method} ${request.url}`);
    try {
      const url = new URL(request.url).pathname;

      const templateResponse = await fetch(`${VITE_DEV_SERVER_URL}/index.html`);
      if (!templateResponse.ok) {
          throw new Error(`Failed to fetch Vite template from ${VITE_DEV_SERVER_URL}/index.html: ${templateResponse.statusText}`);
      }
      let template = await templateResponse.text();

      const { render } = await import(path.resolve(__dirname, 'src', 'entry-server.js'));

      const initialCount = 0;
      const initialStateScript = `<script>window.__INITIAL_STATE__ = { count: ${initialCount} };</script>`;
      const appHtml = render(initialCount);

      const hydrateScriptTag = `<script type="module" src="/main.js"></script>`;

      const finalHtml = template
        .replace(`<!--app-html-->`, appHtml)
        .replace(`<!--hydrate-script-->`, initialStateScript + hydrateScriptTag);

      return new Response(finalHtml, {
        headers: { 'Content-Type': 'text/html' },
      });

    } catch (e) {
      console.error("SSR Error during development:", e);
      set.status = 500;
      return `<h1>SSR Error in Development</h1><pre>${e.stack}</pre><p>Make sure Vite dev server is running on ${VITE_DEV_SERVER_URL}.</p>`;
    }
  });

} else {
  // --- Chế độ sản xuất: Phục vụ các tệp tĩnh và gói SSR đã được build ---
  app.use(staticPlugin({ assets: 'dist/client', prefix: '/' }));

  app.get('/*', async ({ set, request }) => {
    try {
      const url = new URL(request.url).pathname;
      const template = await Bun.file(path.resolve(process.cwd(), 'dist', 'client', 'index.html')).text();

      const { render } = await import(path.resolve(process.cwd(), 'dist', 'server', 'entry-server.js'));

      const initialCount = 0;
      const initialStateScript = `<script>window.__INITIAL_STATE__ = { count: ${initialCount} };</script>`;

      const appHtml = render(initialCount);
      const hydrateScriptTag = `<script type="module" src="/assets/main.js"></script>`;

      const finalHtml = template
        .replace(`<!--app-html-->`, appHtml)
        .replace(`<!--hydrate-script-->`, initialStateScript + hydrateScriptTag);

      return new Response(finalHtml, {
        headers: { 'Content-Type': 'text/html' },
      });

    } catch (e) {
      console.error("Error during SSR in Production:", e);
      set.status = 500;
      return `<h1>SSR Error in Production</h1><pre>${e.stack}</pre>`;
    }
  });
}

app.listen(3000, () => {
  console.log(`Elysia is running at http://localhost:${app.server?.port}`);
  if (IS_DEV) {
    console.log(`Vite development server is integrated (via proxy and static serving).`);
  }
});