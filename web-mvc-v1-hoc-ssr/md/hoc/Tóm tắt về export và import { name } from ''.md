## Tóm tắt về export và import { name } from ''

Bạn hỏi về việc export và import các hàm trong JavaScript, và bạn đúng\! Khi sử dụng cú pháp `import { name } from '...'`, JavaScript cung cấp tính năng **gợi ý tên (name suggestions)** thông qua các công cụ phát triển (IDEs, text editors) và thậm chí là trong môi trường Node.js.

### Tóm tắt về `export` và `import { name } from ''`

Đây là cách bạn định nghĩa và sử dụng các module trong JavaScript (ES Modules):

**1. Export (Xuất khẩu):**

Để một hàm, biến, hoặc class có thể được sử dụng ở file khác, bạn cần `export` nó. Có hai loại export chính:

  * **Named Export (Xuất khẩu theo tên):** Đây là loại bạn đang hỏi. Bạn đặt từ khóa `export` trực tiếp trước định nghĩa của cái bạn muốn xuất. Một file có thể có nhiều named exports.

    ```javascript
    // file: myModule.js

    export function myFunction() {
        console.log("This is my named function.");
    }

    export const myVariable = 123;

    export class MyClass {
        constructor() {
            console.log("MyClass instance created.");
        }
    }

    // Hoặc bạn có thể export sau khi định nghĩa:
    function anotherFunction() {
        console.log("Another named function.");
    }
    export { anotherFunction };
    ```

  * **Default Export (Xuất khẩu mặc định):** Mỗi file chỉ có thể có **một** default export. Khi import, bạn có thể đặt bất kỳ tên nào cho nó.

    ```javascript
    // file: myOtherModule.js

    function myDefaultFunction() {
        console.log("This is the default function.");
    }

    export default myDefaultFunction;

    // Hoặc export trực tiếp:
    // export default class MyDefaultClass { ... }
    // export default { key: 'value' };
    ```

**2. Import (Nhập khẩu):**

Để sử dụng các nội dung đã được export từ một file khác, bạn dùng từ khóa `import`.

  * **Import Named Exports:** Bạn phải sử dụng đúng tên đã export (hoặc sử dụng `as` để đổi tên).

    ```javascript
    // file: app.js
    import { myFunction, myVariable, MyClass } from './myModule.js'; // Phải dùng đúng tên

    myFunction(); // Output: This is my named function.
    console.log(myVariable); // Output: 123
    const instance = new MyClass(); // Output: MyClass instance created.
    ```

  * **Import Default Export:** Bạn có thể đặt bất kỳ tên nào cho default export.

    ```javascript
    // file: app.js
    import MyAwesomeFunction from './myOtherModule.js'; // 'MyAwesomeFunction' là tên bạn tự đặt

    MyAwesomeFunction(); // Output: This is the default function.
    ```

  * **Import tất cả Named Exports:** Bạn có thể nhập tất cả các named exports vào một đối tượng.

    ```javascript
    // file: app.js
    import * as MyModule from './myModule.js';

    MyModule.myFunction();
    console.log(MyModule.myVariable);
    ```

-----

### Gợi ý Tên (`name suggestions`) khi sử dụng `import { name } from '...'`

Đây chính là điểm bạn quan tâm\!

Các **Integrated Development Environments (IDEs)** như VS Code, WebStorm, hoặc các trình soạn thảo code hiện đại với các extension JavaScript/TypeScript mạnh mẽ, đều có khả năng đọc và phân tích cấu trúc module của dự án bạn.

Khi bạn gõ:

```javascript
import {
    // ... bạn bắt đầu gõ ở đây
} from './path/to/your/module.js';
```

IDE sẽ tự động quét file `'./path/to/your/module.js'` và hiển thị một danh sách các tên mà file đó đã `export`.

**Ví dụ thực tế với VS Code:**

1.  Bạn có file `utils.js`:

    ```javascript
    // utils.js
    export function calculateSum(a, b) { return a + b; }
    export const PI = 3.14159;
    export class Shape { /* ... */ }
    ```

2.  Trong một file `main.js`, bạn bắt đầu gõ:

    ```javascript
    // main.js
    import {  } from './utils.js';
    ```

    Khi con trỏ của bạn nằm giữa hai dấu `{}` và bạn bắt đầu gõ (ví dụ: gõ `c`), VS Code sẽ gợi ý `calculateSum`, `PI`, `Shape`... và bạn có thể chọn từ danh sách đó bằng cách nhấn Enter hoặc Tab.

**Làm thế nào các IDE làm được điều này?**

  * **Static Analysis:** Các IDE sử dụng các công cụ phân tích tĩnh mã nguồn. Chúng không cần chạy code, mà chỉ đọc cấu trúc của file để hiểu các từ khóa như `export`, `import`, `function`, `class`, `const`, `let`, `var`.
  * **Language Servers:** Nhiều IDE sử dụng một "Language Server" (ví dụ: TypeScript Language Server cho JavaScript/TypeScript) chạy ngầm để cung cấp các tính năng như gợi ý code, kiểm tra lỗi thời gian thực, điều hướng mã. Language Server sẽ liên tục phân tích toàn bộ dự án của bạn để xây dựng một biểu đồ phụ thuộc và một chỉ mục của tất cả các tên được xuất và nhập.
  * **File System Access:** IDE có quyền truy cập vào hệ thống file của bạn, cho phép nó tìm và đọc các file module mà bạn đang cố gắng nhập.

**Lợi ích của tính năng này:**

  * **Tăng tốc độ phát triển:** Không cần phải nhớ chính xác tất cả các tên đã export.
  * **Giảm lỗi chính tả:** Tránh các lỗi do gõ sai tên.
  * **Cải thiện khả năng đọc mã:** Dễ dàng khám phá các API của module.

Vì vậy, bạn hoàn toàn có thể dựa vào tính năng gợi ý tên này của IDE để làm việc hiệu quả hơn với các ES Modules.