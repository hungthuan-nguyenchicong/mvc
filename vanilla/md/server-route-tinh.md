## v1

PARAPHRASED Preamble:
Để Bun server phục vụ các file tĩnh trong thư mục admin/views, bạn sử dụng thuộc tính static trong Bun.serve. Bạn có thể map đường dẫn URL đến file tĩnh bằng cách trả về một đối tượng Response với Bun.file(path). Ví dụ:

javascript
import { file } from "bun";

Bun.serve({
  routes: {
    "/admin/views/:filename": req => {
      const { filename } = req.params;
      return new Response(file(`./admin/views/${filename}`));
    },
    // các routes khác...
  },
  fetch(req) {
    const url = new URL(req.url);
    return new Response(`Page 404 Not Found: ${url.pathname}`, {status: 404});
  },
});
Bạn cũng có thể định nghĩa nhiều routes tĩnh khác nhau hoặc sử dụng routes động như trên để phục vụ các file .html, .css, .js trong thư mục admin/views.

Nếu muốn phục vụ file favicon hoặc các file tĩnh cụ thể:

javascript
routes: {
  "/favicon.ico": new Response(await file("./admin/views/favicon.ico").bytes(), {
    headers: { "Content-Type": "image/x-icon" },
  }),
}
Bạn cần đảm bảo đường dẫn file là chính xác và file tồn tại trong thư mục admin/views1.

## v2

import { file } from "bun";

Bun.serve({
  routes: {
    "/admin/views/*": req => {
      const url = new URL(req.url);
      // Lấy phần đường dẫn sau /admin/views/
      const filePath = url.pathname.replace("/admin/views/", "");
      return new Response(file(`./admin/views/${filePath}`));
    },
    // các routes khác...
  },
  fetch(req) {
    const url = new URL(req.url);
    return new Response(`Page 404 Not Found: ${url.pathname}`, {status: 404});
  },
});