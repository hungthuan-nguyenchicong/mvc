Tại sao Vite là lựa chọn tuyệt vời cho "Vanilla JS và cần một Bundler đơn giản"?
Đơn giản để bắt đầu:

Bash

npm create vite@latest my-vanilla-app -- --template vanilla
cd my-vanilla-app
npm install
npm run dev # Khởi động dev server
npm run build # Tạo bản build production
Chỉ với vài lệnh này, bạn đã có một dự án Vanilla JS được thiết lập đầy đủ với dev server, live reloading, và một quy trình build tối ưu. Bạn không cần chạm vào webpack.config.js hay rollup.config.js.

Trải nghiệm phát triển mượt mà: Khởi động nhanh và HMR tức thì giúp bạn tập trung vào việc code mà không phải chờ đợi quá trình build.

Build tối ưu: Mặc dù đơn giản khi sử dụng, bản build production của Vite (dựa trên Rollup) vẫn rất tối ưu về kích thước và hiệu suất.

So sánh Vite và Parcel một lần nữa cho người mới học Vanilla JS:
Parcel: Cực kỳ dễ dùng, không cấu hình, nhanh. Là một lựa chọn tốt nếu bạn muốn một công cụ "đóng hộp" đơn giản.
Vite: Cũng cực kỳ dễ dùng, không cấu hình, nhưng có tốc độ phát triển vượt trội nhờ cách tiếp cận dựa trên ES Modules bản địa. Đây là điểm phân biệt chính khiến Vite trở thành một lựa chọn hấp dẫn hơn cho các dự án mới, ngay cả khi chỉ là Vanilla JS.
Kết luận:

Nếu bạn muốn học Vanilla JS và cần một công cụ bundle đơn giản, hiệu quả, và cực kỳ nhanh chóng cho môi trường phát triển, thì Vite là một lựa chọn hàng đầu và rất được khuyến nghị. Nó cung cấp một cầu nối tuyệt vời giữa sự đơn giản của "zero-config" và hiệu suất của các công cụ build hiện đại, đồng thời giúp bạn làm quen với khái niệm ES Modules mà không gặp rào cản cấu hình phức tạp.

## Hướng Dẫn Cài Đặt Vite và Khởi Tạo Dự Án

Tuyệt vời! Vite là một lựa chọn xuất sắc để khởi tạo dự án nhờ tốc độ nhanh và cấu hình tối giản. Dưới đây là hướng dẫn từng bước để cài đặt Vite và tạo một dự án mới, bao gồm cả cách cấu hình cho Vanilla JavaScript (JS thuần) và SCSS.

Hướng Dẫn Cài Đặt Vite và Khởi Tạo Dự Án
Bước 1: Đảm bảo Node.js và npm (hoặc Yarn) đã được cài đặt
Vite chạy trên Node.js, vì vậy bạn cần đảm bảo Node.js và trình quản lý gói (npm hoặc Yarn) đã có trên hệ thống của bạn.

Để kiểm tra:

Bash

node -v
npm -v
# Hoặc nếu dùng Yarn:
# yarn -v
Nếu bạn chưa cài đặt Node.js hoặc phiên bản cũ, hãy tham khảo hướng dẫn cài đặt từ NodeSource (như đã nói ở câu trả lời trước) để có phiên bản LTS mới nhất:

Bash

# Ví dụ cài đặt Node.js v20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y
Bước 2: Khởi tạo dự án Vite mới
Vite cung cấp một công cụ dòng lệnh để khởi tạo dự án nhanh chóng. Bạn có thể tạo dự án với nhiều template khác nhau (Vanilla JS, Vue, React, Svelte, Lit, Preact...).

Mở Terminal hoặc Command Prompt của bạn.

Chạy lệnh tạo dự án Vite:
Bạn có thể đặt tên cho dự án của mình thay cho my-vite-app.

Bash

npm create vite@latest my-vite-app
Hoặc nếu dùng Yarn:

Bash

yarn create vite my-vite-app
Vite sẽ hỏi bạn một vài câu hỏi:

Project name: my-vite-app (hoặc tên bạn đã nhập). Nhấn Enter.
Select a framework: Sử dụng phím mũi tên để di chuyển và chọn Vanilla (cho JavaScript thuần). Nhấn Enter.
Select a variant: Chọn JavaScript (hoặc TypeScript nếu bạn muốn dùng TS). Nhấn Enter.
Sau khi trả lời, Vite sẽ tạo một cấu trúc thư mục dự án cơ bản cho bạn.

Điều hướng vào thư mục dự án và cài đặt dependencies:

Bash

cd my-vite-app
npm install
# Hoặc nếu dùng Yarn:
# yarn
Lệnh này sẽ cài đặt tất cả các gói cần thiết được liệt kê trong file package.json của dự án.

Bước 3: Cấu hình Vite để sử dụng SCSS (Sass)
Vite hỗ trợ các preprocessor CSS như Sass (SCSS/Sass), Less, Stylus ngay lập tức mà không cần cấu hình phức tạp. Bạn chỉ cần cài đặt preprocessor tương ứng.

Cài đặt Sass (Node-Sass):
Bash

npm install sass --save-dev
# Hoặc nếu dùng Yarn:
# yarn add sass --dev
Việc này sẽ cài đặt thư viện Sass vào dự án của bạn. Vite sẽ tự động phát hiện và sử dụng nó khi bạn import file .scss hoặc .sass.
Bước 4: Chạy dự án trong môi trường phát triển (Development)
Trong terminal, đảm bảo bạn đang ở thư mục gốc của dự án (my-vite-app).

Chạy lệnh phát triển:

Bash

npm run dev
# Hoặc nếu dùng Yarn:
# yarn dev
Vite sẽ khởi động một máy chủ phát triển cục bộ và hiển thị địa chỉ URL trong terminal (thường là http://localhost:5173 hoặc một cổng khác nếu cổng này đã được sử dụng). Trình duyệt của bạn sẽ tự động mở tab mới tại địa chỉ đó.

Kiểm tra tính năng Hot Module Replacement (HMR):

Mở file main.js hoặc style.css (bạn sẽ đổi nó thành .scss sau) trong thư mục src.
Thực hiện một thay đổi nhỏ (ví dụ: thay đổi màu chữ trong CSS hoặc một đoạn console.log trong JS).
Lưu file.
Bạn sẽ thấy thay đổi được cập nhật ngay lập tức trên trình duyệt mà không cần tải lại trang. Đây là sức mạnh của Vite!
Bước 5: Cấu trúc file và sử dụng SCSS
Dự án Vite mới khởi tạo thường có cấu trúc cơ bản như sau:

my-vite-app/
├── node_modules/
├── public/
│   └── vite.svg
├── src/
│   ├── main.js      # File JavaScript chính
│   ├── style.css    # File CSS mặc định
│   └── vite-env.d.ts # Dành cho TypeScript
├── .gitignore
├── index.html       # File HTML chính
├── package.json
├── package-lock.json (hoặc yarn.lock)
└── vite.config.js   # File cấu hình Vite (nếu có)
Bạn có thể thay đổi file style.css thành style.scss và bắt đầu viết SCSS.

Đổi tên src/style.css thành src/style.scss.

Cập nhật src/main.js để import file SCSS mới:

JavaScript

import './style.scss'; // Thay thế import './style.css';

document.querySelector('#app').innerHTML = `
  <h1>Hello Vite!</h1>
  <a href="https://vitejs.dev/guide/features.html" target="_blank">Vite Docs</a>
  <p>This is a Vite + Vanilla JS + SCSS project.</p>
`;

console.log('Vite app is running!');
Viết code SCSS trong src/style.scss:
Bạn có thể dùng các tính năng của Sass như biến, mixins, nested rules, và @import các file SCSS khác.

SCSS

$primary-color: #3498db;
$font-stack: Arial, sans-serif;

body {
  font-family: $font-stack;
  line-height: 1.6;
  color: #333;
  background-color: #f4f4f4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  margin: 0;
}

#app {
  text-align: center;
  padding: 30px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  h1 {
    color: $primary-color;
    margin-bottom: 20px;
  }

  a {
    color: $primary-color;
    text-decoration: none;
    font-weight: bold;
    transition: color 0.3s ease;

    &:hover {
      color: darken($primary-color, 15%);
    }
  }
}
Nếu bạn muốn tổ chức CSS thành nhiều file SCSS nhỏ hơn (ví dụ: _variables.scss, _buttons.scss), bạn có thể tạo chúng trong thư mục src và @import chúng vào src/style.scss:

SCSS

// src/_variables.scss
$primary-color: #3498db;
$secondary-color: #2ecc71;
SCSS

// src/style.scss
@import 'variables'; // Không cần .scss và dấu gạch dưới

body {
  // ... sử dụng biến
}
Bước 6: Tạo bản build cho sản phẩm (Production)
Khi bạn đã sẵn sàng triển khai ứng dụng của mình, Vite sẽ tạo ra một bản build được tối ưu hóa cao.

Trong terminal, đảm bảo bạn đang ở thư mục gốc của dự án.

Chạy lệnh build:

Bash

npm run build
# Hoặc nếu dùng Yarn:
# yarn build
Vite sẽ sử dụng Rollup để tối ưu hóa code của bạn (minification, tree-shaking, code splitting, v.v.) và xuất các file tĩnh vào thư mục dist/. Các file này đã sẵn sàng để được deploy lên bất kỳ máy chủ web tĩnh nào (Nginx, Apache, CDN...).

Kết luận
Vite là một công cụ cực kỳ hiệu quả để bắt đầu các dự án frontend, đặc biệt là với Vanilla JS và SCSS. Nó mang lại trải nghiệm phát triển nhanh chóng và dễ dàng, đồng thời tạo ra các bản build production được tối ưu hóa. Hãy tận hưởng tốc độ của Vite!