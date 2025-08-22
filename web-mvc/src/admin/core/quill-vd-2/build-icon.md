## icon

Đúng vậy, các đoạn mã bạn đưa ra:

```javascript
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faUser } from '@fortawesome/free-solid-svg-icons'
```

và việc sử dụng `<FontAwesomeIcon ... />` **không dùng được trực tiếp với Vanilla JS.**

Những đoạn mã này thuộc về thư viện **React**, cụ thể là `@fortawesome/react-fontawesome`, được thiết kế để tích hợp Font Awesome vào các dự án React. Chúng tận dụng hệ thống component của React để hiển thị icon.

-----

### Cách sử dụng Font Awesome với Vanilla JS

Nếu bạn đang dùng Vanilla JS (HTML, CSS, và JavaScript thuần), bạn có hai cách chính để sử dụng Font Awesome:

#### 1\. Sử dụng CSS (Khuyên dùng)

Đây là cách phổ biến và dễ nhất. Bạn chỉ cần thêm một thẻ `<link>` vào file HTML để tải CSS của Font Awesome và sau đó sử dụng các thẻ `<i>` hoặc `<span>` với class tương ứng.

**Bước 1:** Thêm CDN vào HTML của bạn.

```html
<head>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PzQO+mJ9I5zH4fJ1X+44t+a1K5W5c2F2e5z3a" crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>
```

**Bước 2:** Sử dụng icon trực tiếp trong HTML.

```html
<body>
  <p>Đây là icon ngôi nhà: <i class="fa-solid fa-house"></i></p>
  <p>Đây là icon người dùng: <i class="fa-solid fa-user"></i></p>
</body>
```

  - **Ưu điểm:** Cực kỳ đơn giản, không cần JavaScript phức tạp.
  - **Nhược điểm:** Tải toàn bộ icon pack, không tối ưu nếu bạn chỉ dùng một vài icon.

-----

#### 2\. Sử dụng SVG với JavaScript

Nếu bạn muốn tối ưu và chỉ tải các icon cần dùng, bạn có thể sử dụng gói SVG của Font Awesome.

**Bước 1:** Cài đặt các gói cần thiết qua npm.

```bash
npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons
```

**Bước 2:** Trong file JavaScript của bạn, bạn sẽ import và xây dựng các icon.

```javascript
// Import các icon bạn cần
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faHouse, faUser } from '@fortawesome/free-solid-svg-icons';

// Thêm các icon đã import vào thư viện
library.add(faHouse, faUser);

// Tìm kiếm và thay thế các icon
dom.i2svg(); 
```

**Bước 3:** Sau đó, bạn vẫn sử dụng các thẻ `<i>` hoặc `<span>` tương tự như cách dùng CSS ở trên trong HTML.

```html
<body>
  <p>Đây là icon ngôi nhà: <i class="fa-solid fa-house"></i></p>
  <p>Đây là icon người dùng: <i class="fa-solid fa-user"></i></p>
</body>
```

  - Khi chạy JavaScript, `dom.i2svg()` sẽ tự động tìm các thẻ `<i>` có class `fa-solid fa-house` và thay thế chúng bằng mã SVG tương ứng, đảm bảo bạn chỉ tải những icon đã được khai báo trong `library.add()`.

  - **Ưu điểm:** Tối ưu hiệu suất, chỉ tải những icon cần dùng.

  - **Nhược điểm:** Yêu cầu bạn phải thiết lập một môi trường phát triển (sử dụng npm, Webpack, Vite,...) để xử lý các `import`.