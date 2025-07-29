// web-mvc/vite.config.server.js
import { defineConfig } from "vite";
import { htmlMinifyPlugin } from './vite-html-minify-plugin.js'; // Import plugin tùy chỉnh của bạn

export default defineConfig({
    // Các plugin dành riêng cho server-side (ví dụ: vite-plugin-ssr nếu bạn dùng)
    plugins: [
        // ssr(), // Bỏ comment nếu bạn muốn sử dụng vite-plugin-ssr để quản lý trang SSR
        htmlMinifyPlugin(), // Plugin minify HTML tùy chỉnh của bạn
    ],
    
    build: {
        // Thư mục đầu ra cho bản build server-side
        outDir: 'dist/server',
        emptyOutDir: true, // Xóa thư mục đầu ra trước khi build
        
        // Bật chế độ SSR build
        ssr: true, 
        
        // Cấu hình minification cho JavaScript/TypeScript của server
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
        
        // Định nghĩa các entry points SSR của bạn
        rollupOptions: {
            input: {
                main: './src/main.js', // Điểm vào chính cho SSR
                admin: './src/test-socket.js', // Một điểm vào SSR khác
            },
            output: {
                entryFileNames: `[name].js`, // Đảm bảo tên file đầu ra rõ ràng
                // dir: 'dist/server', // outDir đã được định nghĩa ở trên
            },
        },
    },
    
    // Server config thường không cần trong file build server, nhưng giữ lại nếu có lý do
    server: {
        port: 4000,
        proxy: {
            '^/(?!src|node_modules|dist|@vite/client)': {
                target: 'http://localhost:3000',
            }
        }
    }
});
