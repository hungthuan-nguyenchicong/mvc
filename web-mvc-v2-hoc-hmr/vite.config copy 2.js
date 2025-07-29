// web-mvc/vite.config.js
import { defineConfig } from "vite";
// import ssr from 'vite-plugin-ssr/plugin'; // Đã comment theo yêu cầu của bạn
//import { minify as htmlMinifier } from 'html-minifier-terser'; // Đảm bảo đã cài đặt: bun add -D html-minifier-terser
import { htmlMinifyPlugin } from './vite-html-minify-plugin.js'; // Import plugin

export default defineConfig({
    plugins: [htmlMinifyPlugin()], // THÊM PLUGIN VÀO ĐÂY
    build: {
        minify: 'terser', // Đảm bảo sử dụng Terser làm minifier cho JS/TS
        emptyOutDir: true, // Xóa thư mục đầu ra trước khi build
        terserOptions: {
            // Tùy chọn cho nén mã (compression options)
            compress: {
                drop_console: true, // Loại bỏ tất cả console.* statements
                drop_debugger: true, // Loại bỏ debugger statements
                unused: true,       // Loại bỏ các biến/hàm không được sử dụng
                dead_code: true,    // Loại bỏ mã không bao giờ được thực thi (ví dụ: sau return)
            },
            // Tùy chọn cho việc làm biến tên (mangling options)
            mangle: {
                safari10: true,     // Khắc phục lỗi làm biến tên trên Safari 10
            },
            // Tùy chọn cho định dạng đầu ra (output options)
            output: {
                comments: false,    // Loại bỏ tất cả comments khỏi đầu ra
            },
        },
        // Cấu hình SSR entry point
        // Khi ssr được đặt là một chuỗi, nó chỉ định file entry cho bản build SSR.
        ssr: './src/test-socket.js',
        rollupOptions: {
            // `input` ở đây là redundant nếu `build.ssr` đã được set là một chuỗi.
            // Bạn sẽ sử dụng `input` nếu bạn có nhiều entry points hoặc cần tùy chỉnh sâu hơn.
            // input: './src/test-socket.js',
            output: {
                // Đảm bảo tên file đầu ra rõ ràng cho bundle SSR.
                // Ví dụ: test-socket.js sẽ được build thành test-socket.js trong thư mục output.
                entryFileNames: `[name].js`,
                // Nếu bạn muốn SSR bundle ở một thư mục con riêng biệt, ví dụ: 'dist/server'
                // dir: 'dist/server',
            },
        },
    },
    server: {
        port: 4000,
        proxy: {
            // Cấu hình proxy cho dev server (không ảnh hưởng đến quá trình build)
            // Chuyển hướng các request không phải tài nguyên Vite đến backend server
            '^/(?!src|node_modules|dist|@vite/client)': {
                target: 'http://localhost:3000',
            }
        }
    }
});