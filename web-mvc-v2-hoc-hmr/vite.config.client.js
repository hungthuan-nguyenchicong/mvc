// web-mvc/vite.config.client.js
import { defineConfig } from "vite";

export default defineConfig({
    // Các plugin dành riêng cho client-side (nếu có, ví dụ: @vitejs/plugin-react)
    plugins: [],
    
    build: {
        // Thư mục đầu ra cho bản build client-side
        outDir: 'dist/client',
        emptyOutDir: true, // Xóa thư mục đầu ra trước khi build
        
        // Cấu hình minification cho JavaScript/TypeScript của client
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
                unused: true,
                dead_code: true,
            },
            mangle: {
                safari10: true,
            },
            output: {
                comments: false,
            },
        },
        
        // Cấu hình Rollup input cho client-side (thường là index.html)
        // Vite sẽ tự động tìm index.html nếu không chỉ định input.
        // Nếu bạn có nhiều entry points client, bạn có thể định nghĩa ở đây:
        // rollupOptions: {
        //     input: 'index.html', // Hoặc './src/client-entry.js'
        // },
    },
    
    server: {
        port: 4000,
        proxy: {
            // Cấu hình proxy cho dev server (chỉ áp dụng khi chạy dev server)
            '^/(?!src|node_modules|dist|@vite/client)': {
                target: 'http://localhost:3000',
            }
        }
    }
});
