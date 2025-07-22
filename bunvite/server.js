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
                    //html = html.replace('', appHtml);
                    html = html.replace('<!-- render -->', appHtml);

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