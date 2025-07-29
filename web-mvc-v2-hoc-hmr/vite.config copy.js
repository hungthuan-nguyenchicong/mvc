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