# Bạn muốn cấu hình vite.config.js để proxy tất cả các đường dẫn về localhost:3000
## vite.config.js
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  // Cấu hình server của Vite
  server: {
    // Proxy tất cả các yêu cầu không phải là tài nguyên tĩnh của Vite
    // về máy chủ Bun SSR đang chạy trên cổng 3000.
    // Điều này có nghĩa là nếu bạn truy cập http://localhost:5173/
    // Vite dev server sẽ nhận yêu cầu và chuyển nó đến http://localhost:3000/
    // (nơi Bun server của bạn đang lắng nghe).
    proxy: {
      // Sử dụng một regex để khớp với TẤT CẢ các đường dẫn.
      // '^/' khớp với bất kỳ đường dẫn nào bắt đầu bằng dấu gạch chéo (root path).
      '^/': {
        target: 'http://localhost:3000', // Địa chỉ của máy chủ Bun SSR của bạn
        changeOrigin: true, // Thay đổi header Host của yêu cầu thành target URL
        // rewrite: (path) => path.replace(/^\//, ''), // Tùy chọn: Xóa tiền tố đường dẫn nếu cần
                                                    // Trong trường hợp này, chúng ta muốn giữ nguyên đường dẫn
                                                    // để Bun server nhận được đúng đường dẫn yêu cầu.
        // Cấu hình cho WebSocket proxy (nếu bạn có WebSocket trên server 3000)
        ws: true,
      },
    },
  },
  // Cấu hình build cho SSR (như đã thảo luận trước đó)
  build: {
    ssr: 'src/main.js', // Hoặc src/entry-server.js nếu bạn có tệp riêng cho SSR
    outDir: 'dist', // Thư mục đầu ra cho bản build
  },
});
