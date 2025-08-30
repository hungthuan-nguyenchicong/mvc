## Express để tự fetch toàn bộ trang HTML từ Vite dev server

-----

Có, bạn hoàn toàn có thể làm được điều đó. Thay vì proxy tất cả các yêu cầu, bạn có thể cấu hình Express để **tự fetch toàn bộ trang HTML từ Vite dev server**, sau đó render và trả về cho trình duyệt.

Đây là một cách tiếp cận hữu ích, đặc biệt khi bạn cần thực hiện SSR (Server-Side Rendering) hoặc xử lý nội dung trang trước khi gửi đi. Thay vì chỉ đơn giản là chuyển tiếp yêu cầu, backend có toàn quyền kiểm soát nội dung cuối cùng.

### Cách thực hiện

Bạn sẽ sử dụng một thư viện HTTP như **`node-fetch`** hoặc **`axios`** để lấy nội dung từ Vite dev server, sau đó gửi nội dung đó về cho client.

#### Bước 1: Cài đặt thư viện

Bạn cần cài đặt `node-fetch` để Express có thể thực hiện các yêu cầu HTTP.

```bash
npm install node-fetch --save-dev
```

#### Bước 2: Viết code Express

Trong file `server.js`, bạn sẽ tạo một route để xử lý yêu cầu đến, sau đó dùng `fetch` để lấy nội dung HTML từ Vite dev server.

**File `server.js`:**

```javascript
const express = require('express');
const fetch = require('node-fetch'); // Sử dụng import nếu bạn dùng ES Modules
const app = express();
const port = 3000;

// URL của Vite dev server
const viteDevServerUrl = 'http://localhost:5173';

// Route xử lý tất cả các yêu cầu
app.get('*', async (req, res) => {
  try {
    const vitePath = req.originalUrl;
    
    // Fetch toàn bộ nội dung từ Vite dev server
    const response = await fetch(viteDevServerUrl + vitePath);
    const html = await response.text();

    // Bạn có thể xử lý nội dung HTML tại đây nếu cần
    // Ví dụ: thêm meta tags, thay thế một số placeholder, ...
    
    // Gửi HTML đã lấy về cho client
    res.status(response.status).set(response.headers).send(html);

  } catch (error) {
    console.error('Error fetching from Vite:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});
```

Với cách này, Express trở thành **trung tâm điều phối**. Mọi yêu cầu đều được Express xử lý, và nó sẽ quyết định lấy nội dung từ Vite (hoặc từ các nguồn khác) để hiển thị.
