// vite.config.js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  server: {
    port: 5173,
    proxy: {
      // Sử dụng một hàm để kiểm soát khi nào proxy được kích hoạt.
      // Chúng ta sẽ proxy nếu đường dẫn là '/' HOẶC nếu yêu cầu chấp nhận HTML.
      // Điều này đảm bảo các yêu cầu tài nguyên tĩnh (JS, CSS, hình ảnh)
      // sẽ không bị proxy và được Vite xử lý trực tiếp.
      '/': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        ws: true,
        // Hàm này sẽ được gọi cho mỗi yêu cầu.
        // `req` là đối tượng yêu cầu của Node.js.
        // `options` là các tùy chọn proxy.
        // `target` là đích đến của proxy.
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Kiểm tra header 'Accept' của yêu cầu.
            // Nếu yêu cầu là cho một trang HTML, nó thường sẽ có 'text/html' trong header Accept.
            // Nếu không có 'text/html' (ví dụ: yêu cầu JS, CSS), chúng ta không proxy.
            const acceptHeader = req.headers.accept || '';
            const isHtmlRequest = acceptHeader.includes('text/html');

            // Log để dễ debug
            console.log(`Request for: ${req.url}, Accept: ${acceptHeader}, Is HTML Request: ${isHtmlRequest}`);

            // Nếu đây không phải là yêu cầu HTML, chúng ta không muốn proxy nó.
            // Tuy nhiên, hàm `configure` không thể ngăn chặn proxy hoàn toàn.
            // Cách tốt nhất là sử dụng một hàm cho key của proxy object.
          });
        },
        // Điều kiện để kích hoạt proxy:
        // Chỉ proxy nếu đường dẫn là '/' (yêu cầu trang gốc)
        // HOẶC nếu yêu cầu chấp nhận 'text/html' (đây là cách tốt nhất để phân biệt yêu cầu trang)
        // HOẶC nếu đó là một đường dẫn API mà Bun server xử lý (nếu có)
        // Đối với ví dụ này, chúng ta chỉ cần proxy đường dẫn gốc.
        // Các tài nguyên khác (JS, CSS) sẽ được Vite tự động xử lý.
        // Vì vậy, chúng ta sẽ chỉ proxy đường dẫn gốc '/'
        // và để Vite xử lý các đường dẫn khác.
        // Tuy nhiên, nếu bạn có các đường dẫn API khác mà Bun xử lý, bạn sẽ cần thêm chúng vào đây.
        // Ví dụ: '/api': { target: 'http://localhost:3000', ... }
      },
    },
    // Nếu bạn muốn proxy tất cả các đường dẫn TRỪ một số đường dẫn cụ thể (như /src/, /assets/),
    // bạn có thể sử dụng một regex phức tạp hơn hoặc nhiều entry trong proxy object.
    // Nhưng với luồng hiện tại, chỉ proxy '/' là đủ cho SSR.
    // Vite sẽ tự động xử lý các module và tài nguyên tĩnh của nó.
  },
  build: {
    ssr: 'src/main.js',
    outDir: 'dist',
  },
});
