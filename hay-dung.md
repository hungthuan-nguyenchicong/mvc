## port
sudo lsof -i :3000
sudo kill -9 44991

## bun built
bun build ./server.js --outdir dist/server

NODE_ENV=production bun build ./server.js --outdir dist/server

## built -production
bun build --define import.meta.env.NODE_ENV='"production"' ./server.js --outdir ./out/dist/server

## vite built
bunx --bun vite --config vite.config.client.js

NODE_ENV=production bunx --bun vite build --config vite.config.client.js

NODE_ENV=production bunx --bun vite build --config vite.config.ssr.js

bun run dist/server/server.js

    "build:client": "bunx --bun vite build --config vite.config.client.js",
    "build:server": "bunx --bun vite build --config vite.config.server.js",
    "build": "bun run build:client && bun run build:server"


## chạy thử
PORT=3333 bun run ./out/dist/server/server.js

NODE_ENV=production PORT=3333 bun run server.js
## .env
import.meta.env.NODE_ENV
process.env.NODE_ENV

## built --ssr
bunx --bun vite build --ssr ./src/test-socket.js

## bun add -D terser
bun add -d terser

## bun add -D vite-plugin-html
bun add -d vite-plugin-html

## bun bun add -D vite-plugin-ssr
bun add -d vite-plugin-ssr

## import { minify as htmlMinifier } from 'html-minifier-terser';

bun add -d html-minifier-terser


## vite.config.js
// vite.config.js
// web-mvc/vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
    build: {
        minify: 'terser', // Đảm bảo sử dụng Terser làm minifier
        emptyOutDir: true,
        terserOptions: {
            // Tùy chọn cho nén mã (compression options)
            compress: {
                drop_console: true, // Loại bỏ tất cả console.* statements
                drop_debugger: true, // Loại bỏ debugger statements
                // Các tùy chọn nén khác (có thể bật/tắt tùy nhu cầu)
                unused: true,       // Loại bỏ các biến/hàm không được sử dụng
                dead_code: true,    // Loại bỏ mã không bao giờ được thực thi (ví dụ: sau return)
                // ... nhiều tùy chọn khác nữa, xem tài liệu Terser
            },
            // Tùy chọn cho việc làm biến tên (mangling options)
            mangle: {
                safari10: true,     // Khắc phục lỗi làm biến tên trên Safari 10
            },
            // Tùy chọn cho định dạng đầu ra (output options)
            output: {
                comments: false,    // Loại bỏ tất cả comments khỏi đầu ra
                // Bạn cũng có thể thiết lập comments: /@preserve|@license|@cc_on/i để giữ lại các comment đặc biệt
            },
        },
    },
    server: {
        port: 4000,
        proxy: {
            '^/(?!src|node_modules|dist|@vite/client)': {
                target: 'http://localhost:3000',
            }
        }
    }
});

## bun file
    const scriptRender = await Bun.file('backend/admin/views/login/login-frontend.js').text();

## /src/login.js

import('/backend/admin/views/login/login-frontend.js')


