## Tạo một Module Cấu hình

Để biến `ROOT` (đường dẫn gốc của dự án) có thể truy cập được ở mọi nơi mà không cần `import`, bạn **có thể** gán nó vào đối tượng `global` trong Node.js/Bun. Tuy nhiên, việc này **không được khuyến khích** trong các dự án hiện đại.

-----

## Tại sao không nên dùng `global.ROOT`

1.  **Ô nhiễm không gian tên toàn cục (Global Namespace Pollution):** Việc thêm các biến vào đối tượng `global` làm cho mã khó đoán hơn và dễ gây ra xung đột tên với các thư viện khác hoặc các biến hệ thống.
2.  **Khó theo dõi phụ thuộc (Hard to Trace Dependencies):** Khi một biến được truy cập toàn cục, rất khó để biết nó được định nghĩa ở đâu hoặc nó đang được sử dụng ở những nơi nào trong dự án mà không cần tìm kiếm thủ công. Điều này làm giảm khả năng bảo trì và tái cấu trúc mã.
3.  **Khó kiểm thử (Difficult to Test):** Mã phụ thuộc vào các biến toàn cục khó kiểm thử hơn vì trạng thái của chúng có thể bị thay đổi bởi các phần khác của ứng dụng.
4.  **Không theo chuẩn Module (Not idiomatic/Modular):** Các hệ thống module hiện đại (ESM, CommonJS) được thiết kế để quản lý các phụ thuộc một cách rõ ràng thông qua `import`/`export`. Việc bỏ qua chúng đi ngược lại với triết lý này.

-----

## Các cách tốt hơn để quản lý đường dẫn gốc

Thay vì `global.ROOT`, bạn nên sử dụng các phương pháp chuẩn và an toàn hơn:

### 1\. Tạo một Module Cấu hình (`config.js` hoặc `path.js`) 📦

Đây là cách tốt nhất. Bạn định nghĩa đường dẫn gốc một lần trong một tệp và xuất nó ra.

**`config/paths.js`:**

```javascript
import { resolve } from 'path';
import { fileURLToPath } from 'url';

// Trong ES Modules, __dirname không tồn tại.
// Chúng ta cần tính toán nó từ import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

// ROOT sẽ là đường dẫn đến thư mục gốc của dự án (ví dụ: /var/www/html/app/mvc/project)
// Điều chỉnh '../..' hoặc '../..' tùy thuộc vào vị trí của file config/paths.js
export const ROOT = resolve(__dirname, '../../..'); 
// Ví dụ nếu paths.js nằm ở project/frontend/config/paths.js
// thì ROOT = resolve(__dirname, '../../../') sẽ đưa về project/
```

**`server.js`:**

```javascript
import { ROOT } from './config/paths.js';
// Hoặc './project/frontend/config/paths.js' nếu bạn đang ở backend

console.log('Project Root:', ROOT);
// Sử dụng ROOT ở đây
```

**Ưu điểm:**

  * **Rõ ràng:** Ai đọc code cũng biết `ROOT` đến từ đâu.
  * **Dễ bảo trì:** Thay đổi đường dẫn chỉ ở một nơi.
  * **Dễ kiểm thử:** Có thể mock (giả lập) giá trị `ROOT` trong các bài kiểm thử.
  * **Không gây ô nhiễm toàn cục.**

-----

### 2\. Truyền đường dẫn qua Tham số (Passing as Arguments) ➡️

Nếu chỉ một vài hàm hoặc lớp cần đường dẫn gốc, bạn có thể truyền nó như một tham số.

```javascript
// server.js
import { ROOT } from './config/paths.js';

function processFiles(basePath) {
    console.log(`Processing files in: ${basePath}`);
    // ...
}

processFiles(ROOT);
```

**Ưu điểm:** Rõ ràng về phụ thuộc của hàm.

-----

## Trường hợp đặc biệt: Biến môi trường (`process.env`)

Nếu `ROOT` là một đường dẫn có thể thay đổi giữa các môi trường triển khai (development, production), thì việc đưa nó vào biến môi trường và truy cập qua `process.env.ROOT_PATH` sẽ là một lựa chọn tốt:

**`.env`:**

```
ROOT_PATH=/var/www/html/app/mvc
```

**`server.js`:**

```javascript
// Đảm bảo bạn đã cấu hình dotenv nếu cần để tải biến từ .env
// import 'dotenv/config'; // Nếu dùng dotenv (Bun tự hỗ trợ dotenv cho .env)

const ROOT = process.env.ROOT_PATH;
if (!ROOT) {
    console.warn('ROOT_PATH environment variable is not set!');
}
console.log('Project Root:', ROOT);
```

**Ưu điểm:** Cấu hình linh hoạt theo môi trường mà không cần thay đổi code.

-----

## Kết luận

Mặc dù `global.ROOT` có thể "hoạt động", nhưng nó đi ngược lại với các nguyên tắc phát triển phần mềm hiện đại. Việc sử dụng hệ thống module (`import/export`) thông qua một tệp cấu hình đường dẫn riêng biệt là cách tiếp cận **tốt nhất và được khuyến nghị nhất** để quản lý các đường dẫn quan trọng trong dự án của bạn.