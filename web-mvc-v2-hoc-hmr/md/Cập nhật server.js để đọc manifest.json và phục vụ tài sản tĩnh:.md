## Cập nhật server.js để đọc manifest.json và phục vụ tài sản tĩnh:

// server.js
import { RoutesAdmin } from "./backend/admin/core/RoutesAdmin";
import { loginPage } from "./backend/admin/views/login/login-page.js"; // Đảm bảo đường dẫn đúng
import fs from 'node:fs/promises';
import path from 'node:path';

// Biến để lưu trữ manifest.json
let clientManifest;

// Hàm để đọc manifest.json (chỉ trong production)
async function getClientManifest() {
    if (clientManifest) return clientManifest; // Tránh đọc lại nếu đã có
    if (import.meta.env.NODE_ENV === 'production') {
        const manifestPath = path.resolve(process.cwd(), 'dist/client/manifest.json');
        try {
            const manifestContent = await fs.readFile(manifestPath, 'utf-8');
            clientManifest = JSON.parse(manifestContent);
        } catch (error) {
            console.error('Failed to load client manifest.json:', error);
            clientManifest = {}; // Đặt rỗng để tránh lỗi tiếp theo
        }
    } else {
        // Trong dev mode, không cần manifest vì Vite dev server sẽ inject
        clientManifest = {};
    }
    return clientManifest;
}

// Hàm render HTML chung (có thể được gọi từ các route)
async function renderPageHtml(pageKey, initialHtmlContent = '') {
    let html = initialHtmlContent;
    let scripts = '';
    let styles = '';

    if (import.meta.env.NODE_ENV === 'production') {
        const manifest = await getClientManifest();
        const entry = manifest[pageKey]; // Ví dụ: 'public/index.html' hoặc 'public/post.html'

        if (entry) {
            // Chèn CSS
            if (entry.css) {
                styles = entry.css.map(cssFile => `<link rel="stylesheet" href="/${cssFile}">`).join('\n');
            }
            // Chèn JS
            if (entry.file) {
                scripts = `<script type="module" src="/${entry.file}"></script>`;
            }
        }
    } else {
        // Trong development, Vite dev server sẽ tự động inject các script HMR và client
        // Chúng ta có thể thêm một placeholder hoặc để trống nếu Vite xử lý toàn bộ
        // Ví dụ: <script type="module" src="/@vite/client"></script>
        // <script type="module" src="/src/main.js"></script>
        // Tuy nhiên, với Bun.serve, chúng ta sẽ dựa vào Vite proxy để xử lý các request này.
    }

    // Giả sử loginPage() đã trả về một chuỗi HTML hoàn chỉnh
    // Chúng ta sẽ cần một cách để chèn scripts và styles vào đó
    // Đây là một cách tiếp cận đơn giản: tìm </body> và chèn trước nó
    if (html.includes('</body>')) {
        html = html.replace('</body>', `${styles}\n${scripts}\n</body>`);
    } else {
        // Fallback nếu không tìm thấy </body>
        html = `${html}\n${styles}\n${scripts}`;
    }

    return html;
}

// Cấu hình Bun.serve
Bun.serve({
    async fetch(request) {
        const url = new URL(request.url);

        // 1. Phục vụ các file tĩnh từ thư mục dist/client (cho production)
        if (import.meta.env.NODE_ENV === 'production' && url.pathname.startsWith('/assets/')) {
            const filePath = path.join(process.cwd(), 'dist/client', url.pathname);
            try {
                const file = Bun.file(filePath);
                return new Response(file);
            } catch (error) {
                console.error(`Error serving static file ${filePath}:`, error);
                return new Response('File not found', { status: 404 });
            }
        }
        // Thêm route cho manifest.json nếu trình duyệt yêu cầu trực tiếp
        if (import.meta.env.NODE_ENV === 'production' && url.pathname === '/manifest.json') {
            const manifestPath = path.join(process.cwd(), 'dist/client/manifest.json');
            try {
                const file = Bun.file(manifestPath);
                return new Response(file, { headers: { 'Content-Type': 'application/json' } });
            } catch (error) {
                console.error(`Error serving manifest.json:`, error);
                return new Response('Manifest not found', { status: 404 });
            }
        }


        // 2. Xử lý các routes đã định nghĩa
        // Sử dụng logic routes của bạn
        const routeHandler = RoutesAdmin[url.pathname];
        if (routeHandler) {
            if (typeof routeHandler === 'function') {
                // Nếu là hàm trực tiếp (như '/')
                const response = routeHandler();
                // Nếu response là HTML, chúng ta có thể chèn script/style vào đây
                if (response.headers.get('Content-Type')?.includes('text/html')) {
                    const htmlContent = await response.text();
                    // Giả sử '/' là trang chính, sử dụng 'public/index.html' làm key manifest
                    const finalHtml = await renderPageHtml('public/index.html', htmlContent);
                    return new Response(finalHtml, { headers: response.headers });
                }
                return response;
            } else if (routeHandler.GET) {
                // Nếu là đối tượng với phương thức GET (như '/admin/login')
                if (request.method === 'GET') {
                    const response = routeHandler.GET();
                    if (response.headers.get('Content-Type')?.includes('text/html')) {
                        const htmlContent = await response.text();
                        // Đối với login, sử dụng 'public/index.html' làm key manifest nếu nó là entry point chính
                        // Hoặc bạn cần một key riêng cho login-page nếu nó có JS/CSS riêng
                        const finalHtml = await renderPageHtml('public/index.html', htmlContent); // Cần điều chỉnh key này nếu loginPage có tài sản JS/CSS riêng
                        return new Response(finalHtml, { headers: response.headers });
                    }
                    return response;
                }
            }
        }

        // Nếu không có route nào khớp, trả về 404
        return new Response("Not Found", { status: 404 });
    },
    port: 3000, // Cổng cho Bun server
});

// Hàm render và testSocket (nếu có) cần được định nghĩa hoặc import
function render() {
    // Đây là hàm render của bạn cho trang chủ.
    // Bạn cần đảm bảo nó trả về HTML cho trang chủ.
    // Ví dụ:
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Home Page</title>
        </head>
        <body>
            <h1>Welcome Home!</h1>
        </body>
        </html>
    `;
}

function testSocket() {
    // Đây là hàm testSocket của bạn.
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Test Socket</title>
        </head>
        <body>
            <h1>Socket Test Page</h1>
            <script>
                // Your socket test client-side code here
            </script>
        </body>
        </html>
    `;
}

## md

Chào bạn,

Bạn đã tham khảo một phần tài liệu rất thú vị của Bun về cách xử lý manifest.json và tài sản tĩnh. Tuy nhiên, có một sự khác biệt quan trọng giữa việc Bun tự động phục vụ file manifest.json như một tài sản tĩnh và việc server của bạn sử dụng nội dung của manifest.json để động chèn các đường dẫn tài sản đã được hash vào HTML khi render SSR.

1. Hiểu về cách Bun phục vụ tài sản tĩnh (theo tài liệu bạn tham khảo)
Khi tài liệu Bun nói:
html <link rel="manifest" href="./manifest.json" />
Và
Bun sẽ tự động bundle và phục vụ file manifest.json nếu nó được tham chiếu trong HTML.

Điều này có nghĩa là:

Nếu bạn có một file HTML tĩnh (ví dụ: public/index.html) mà Bun phục vụ trực tiếp (ví dụ: Bun.serve({ routes: { "/": homepage } })).

Và trong file HTML tĩnh đó có dòng <link rel="manifest" href="./manifest.json" />.

Khi trình duyệt yêu cầu /manifest.json, Bun (nếu được cấu hình đúng để phục vụ thư mục dist/client nơi manifest.json nằm) sẽ tìm và gửi file manifest.json đó về cho trình duyệt.

Đây là trường hợp trình duyệt tự yêu cầu file manifest.json sau khi nhận được HTML. Nó thường được dùng cho Progressive Web Apps (PWAs) hoặc các trường hợp mà JavaScript phía client sẽ đọc manifest.json.

2. Vấn đề của chúng ta trong SSR
Trong trường hợp của chúng ta, loginPage() trả về một chuỗi HTML được render trên server. Mục đích của manifest.json ở đây là để server biết được tên file đã được hash của các tài sản JavaScript và CSS phía client, để server có thể chèn các thẻ <script> và <link> với đường dẫn chính xác vào HTML mà nó gửi về trình duyệt.

Nếu bạn chỉ thêm <link rel="manifest" href="/manifest.json" /> vào HTML được render bởi loginPage(), thì:

Trình duyệt sẽ nhận được HTML.

Trình duyệt sẽ thấy <link rel="manifest" ...> và sau đó gửi một yêu cầu riêng đến /manifest.json.

Nhưng server của bạn vẫn không biết đường dẫn của main-ab12cd34.js hay style-ef56gh78.css để chèn chúng vào HTML ban đầu.

Để server có thể chèn các đường dẫn đã được hash vào HTML trong quá trình SSR, nó bắt buộc phải đọc và phân tích nội dung của file manifest.json.

Cách áp dụng kết hợp cho dự án của chúng ta:
Bạn nên tiếp tục sử dụng phương pháp đọc manifest.json bằng code trên server để chèn các tài sản đã được hash vào HTML render SSR. Đồng thời, bạn cần cấu hình Bun để phục vụ thư mục dist/client như các tài sản tĩnh để manifest.json (và các tài sản khác) có thể được trình duyệt truy cập trực tiếp nếu cần.

1. Cấu hình vite.config.client.js: (Đã đúng)
Đảm bảo manifest: true và outDir: 'dist/client'.

2. Cập nhật server.js để đọc manifest.json và phục vụ tài sản tĩnh:
Updated server.js for Manifest and Static Assets
23:20 28 thg 7

Mở

Những thay đổi và giải thích:

getClientManifest(): Hàm này được tạo để đọc manifest.json. Nó chỉ đọc file này một lần trong production để tối ưu.

renderPageHtml(pageKey, initialHtmlContent):

Đây là một hàm tiện ích mới. Nó nhận pageKey (ví dụ: 'public/index.html' hoặc 'public/post.html') để tra cứu trong manifest.json.

Nó nhận initialHtmlContent là chuỗi HTML ban đầu được tạo ra bởi các hàm như loginPage() hoặc render().

Trong môi trường production, nó sẽ đọc manifest.json, tìm các tài sản JS/CSS đã được hash và chèn chúng vào initialHtmlContent.

Trong môi trường development, nó sẽ không làm gì cả với script/style vì Vite dev server sẽ xử lý việc inject chúng.

Phục vụ tài sản tĩnh (dist/client):

Trong Bun.serve's fetch handler, tôi đã thêm logic để kiểm tra nếu url.pathname bắt đầu bằng /assets/ (hoặc /manifest.json).

Nếu đúng, nó sẽ cố gắng tìm và phục vụ file đó từ thư mục dist/client. Điều này là cần thiết để trình duyệt có thể tải các file JS/CSS đã được hash và cả manifest.json nếu nó được tham chiếu trực tiếp.

Tích hợp vào Routes:

Các route hiện tại (/, /admin/login) giờ đây sẽ gọi renderPageHtml sau khi nhận được HTML từ render() hoặc loginPage().

Lưu ý quan trọng: Bạn cần đảm bảo rằng pageKey bạn truyền vào renderPageHtml (ví dụ: 'public/index.html') khớp với input bạn đã định nghĩa trong vite.config.client.js để tìm đúng entry trong manifest.json.

Để áp dụng:

Lưu vite.config.client.js và vite.config.ssr.js như chúng ta đã thống nhất.

Cập nhật file server.js của bạn với code mới này.

Đảm bảo rằng render() và testSocket() của bạn được định nghĩa hoặc import đúng cách trong server.js.

Chạy build client và server:

Bash

bun run build:client
bun run build:server
Sau đó, chạy server đã build:

Bash

NODE_ENV=production bun run dist/server/server.js
Hoặc chạy trong dev mode:

Bash

bun run dev # (sẽ chạy cả vite dev server và bun server)
Với cách này, bạn vừa tận dụng được khả năng phục vụ tài sản tĩnh của Bun, vừa đảm bảo server của bạn có thể động chèn các đường dẫn tài sản đã được hash vào HTML khi render SSR.

## update ver 2

// server.js
import { RoutesAdmin } from "./backend/admin/core/RoutesAdmin";
import { loginPage } from "./backend/admin/views/login/login-page.js"; // Đảm bảo đường dẫn đúng
import fs from 'node:fs/promises';
import path from 'node:path';

// Biến để lưu trữ manifest.json
let clientManifest;

// Hàm để đọc manifest.json (chỉ trong production)
async function getClientManifest() {
    if (clientManifest) return clientManifest; // Tránh đọc lại nếu đã có
    if (import.meta.env.NODE_ENV === 'production') {
        const manifestPath = path.resolve(process.cwd(), 'dist/client/manifest.json');
        try {
            const manifestContent = await fs.readFile(manifestPath, 'utf-8');
            clientManifest = JSON.parse(manifestContent);
        } catch (error) {
            console.error('Failed to load client manifest.json:', error);
            clientManifest = {}; // Đặt rỗng để tránh lỗi tiếp theo
        }
    } else {
        // Trong dev mode, không cần manifest vì Vite dev server sẽ inject
        clientManifest = {};
    }
    return clientManifest;
}

// Hàm đệ quy để thu thập tất cả các script và style từ manifest, bao gồm cả chunks
function collectAssets(entryKey, manifest, collectedScripts = new Set(), collectedStyles = new Set()) {
    const entry = manifest[entryKey];
    if (!entry) {
        console.warn(`Manifest entry not found for key: ${entryKey}`);
        return { collectedScripts, collectedStyles };
    }

    // Thêm script chính nếu có
    if (entry.file && entry.isEntry) { // Chỉ thêm entry point chính 1 lần
        collectedScripts.add(entry.file);
    }

    // Thêm CSS
    if (entry.css) {
        entry.css.forEach(cssFile => collectedStyles.add(cssFile));
    }

    // Xử lý các imports (chunks)
    if (entry.imports) {
        for (const importKey of entry.imports) {
            // Đệ quy để thu thập các assets từ chunk này
            collectAssets(importKey, manifest, collectedScripts, collectedStyles);
        }
    }

    return { collectedScripts, collectedStyles };
}


// Hàm render HTML chung (có thể được gọi từ các route)
async function renderPageHtml(pageKey, initialHtmlContent = '') {
    let html = initialHtmlContent;
    let scripts = '';
    let styles = '';

    if (import.meta.env.NODE_ENV === 'production') {
        const manifest = await getClientManifest();
        // Sử dụng hàm collectAssets để lấy tất cả scripts và styles, bao gồm cả chunks
        const { collectedScripts, collectedStyles } = collectAssets(pageKey, manifest);

        // Chèn CSS
        if (collectedStyles.size > 0) {
            styles = Array.from(collectedStyles)
                        .map(cssFile => `<link rel="stylesheet" href="/${cssFile}">`)
                        .join('\n');
        }
        // Chèn JS (đảm bảo thứ tự nếu cần, nhưng Set không đảm bảo thứ tự)
        // Đối với các module ES, thứ tự tải không quá quan trọng nếu chúng được viết đúng cách
        if (collectedScripts.size > 0) {
            scripts = Array.from(collectedScripts)
                         .map(jsFile => `<script type="module" src="/${jsFile}"></script>`)
                         .join('\n');
        }
    } else {
        // Trong development, Vite dev server sẽ tự động inject các script HMR và client
        // Chúng ta có thể thêm một placeholder hoặc để trống nếu Vite xử lý toàn bộ
        // Ví dụ: <script type="module" src="/@vite/client"></script>
        // <script type="module" src="/src/main.js"></script>
        // Tuy nhiên, với Bun.serve, chúng ta sẽ dựa vào Vite proxy để xử lý các request này.
    }

    // Giả sử loginPage() đã trả về một chuỗi HTML hoàn chỉnh
    // Chúng ta sẽ cần một cách để chèn scripts và styles vào đó
    // Đây là một cách tiếp cận đơn giản: tìm </body> và chèn trước nó
    if (html.includes('</body>')) {
        html = html.replace('</body>', `${styles}\n${scripts}\n</body>`);
    } else {
        // Fallback nếu không tìm thấy </body>
        html = `${html}\n${styles}\n${scripts}`;
    }

    return html;
}

// Cấu hình Bun.serve
Bun.serve({
    async fetch(request) {
        const url = new URL(request.url);

        // 1. Phục vụ các file tĩnh từ thư mục dist/client (cho production)
        if (import.meta.env.NODE_ENV === 'production' && url.pathname.startsWith('/assets/')) {
            const filePath = path.join(process.cwd(), 'dist/client', url.pathname);
            try {
                const file = Bun.file(filePath);
                return new Response(file);
            } catch (error) {
                console.error(`Error serving static file ${filePath}:`, error);
                return new Response('File not found', { status: 404 });
            }
        }
        // Thêm route cho manifest.json nếu trình duyệt yêu cầu trực tiếp
        if (import.meta.env.NODE_ENV === 'production' && url.pathname === '/manifest.json') {
            const manifestPath = path.join(process.cwd(), 'dist/client/manifest.json');
            try {
                const file = Bun.file(manifestPath);
                return new Response(file, { headers: { 'Content-Type': 'application/json' } });
            } catch (error) {
                console.error(`Error serving manifest.json:`, error);
                return new Response('Manifest not found', { status: 404 });
            }
        }


        // 2. Xử lý các routes đã định nghĩa
        // Sử dụng logic routes của bạn
        const routeHandler = RoutesAdmin[url.pathname];
        if (routeHandler) {
            if (typeof routeHandler === 'function') {
                // Nếu là hàm trực tiếp (như '/')
                const response = routeHandler();
                // Nếu response là HTML, chúng ta có thể chèn script/style vào đây
                if (response.headers.get('Content-Type')?.includes('text/html')) {
                    const htmlContent = await response.text();
                    // Giả sử '/' là trang chính, sử dụng 'public/index.html' làm key manifest
                    const finalHtml = await renderPageHtml('public/index.html', htmlContent);
                    return new Response(finalHtml, { headers: response.headers });
                }
                return response;
            } else if (routeHandler.GET) {
                // Nếu là đối tượng với phương thức GET (như '/admin/login')
                if (request.method === 'GET') {
                    const response = routeHandler.GET();
                    if (response.headers.get('Content-Type')?.includes('text/html')) {
                        const htmlContent = await response.text();
                        // Đối với login, sử dụng 'public/index.html' làm key manifest nếu nó là entry point chính
                        // Hoặc bạn cần một key riêng cho login-page nếu nó có JS/CSS riêng
                        const finalHtml = await renderPageHtml('public/index.html', htmlContent); // Cần điều chỉnh key này nếu loginPage có tài sản JS/CSS riêng
                        return new Response(finalHtml, { headers: response.headers });
                    }
                    return response;
                }
            }
        }

        // Nếu không có route nào khớp, trả về 404
        return new Response("Not Found", { status: 404 });
    },
    port: 3000, // Cổng cho Bun server
});

// Hàm render và testSocket (nếu có) cần được định nghĩa hoặc import
function render() {
    // Đây là hàm render của bạn cho trang chủ.
    // Bạn cần đảm bảo nó trả về HTML cho trang chủ.
    // Ví dụ:
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Home Page</title>
        </head>
        <body>
            <h1>Welcome Home!</h1>
        </body>
        </html>
    `;
}

function testSocket() {
    // Đây là hàm testSocket của bạn.
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Test Socket</title>
        </head>
        <body>
            <h1>Socket Test Page</h1>
            <script>
                // Your socket test client-side code here
            </script>
        </body>
        </html>
    `;
}
