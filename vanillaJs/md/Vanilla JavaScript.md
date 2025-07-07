## Vanilla JavaScript

Trong các dự án Vanilla JavaScript, khi bạn có một tệp đại diện cho một "class" (hoặc một constructor function, hoặc một factory function mà bạn dùng như một class), có, bạn hoàn toàn nên viết hoa chữ cái đầu tiên của tên tệp đó và giữ tên tệp trùng với tên của class/hàm chính trong tệp.

Lý do nên viết hoa chữ cái đầu tệp và trùng tên với "Class"
Quy ước trong JavaScript: Đây là một quy ước mạnh mẽ và được chấp nhận rộng rãi trong cộng đồng JavaScript, đặc biệt là khi làm việc với các thành phần (components) hoặc các thực thể có tính chất "class-like".

Nếu bạn có một class tên là User, tệp chứa nó nên là User.js.

Nếu bạn có một component tên là Button, tệp chứa nó nên là Button.js.

Dễ đọc và dễ hiểu: Khi nhìn vào cấu trúc tệp, bạn ngay lập tức nhận ra rằng User.js chứa định nghĩa của User class (hoặc một thực thể tương tự). Điều này giúp cải thiện khả năng đọc mã và cấu trúc dự án.

Hỗ trợ từ các công cụ: Các IDE hiện đại, linter, và các công cụ khác thường "hiểu" và hỗ trợ tốt hơn các quy ước đặt tên này, giúp việc tự động hoàn thành (autocompletion) và điều hướng mã trở nên thuận tiện hơn.

Tính nhất quán: Mặc dù tên thư mục thường là kebab-case (ví dụ: src/utils/, src/components/), tên tệp của các "class" hoặc các module cụ thể thì lại theo PascalCase. Điều này tạo ra sự nhất quán trong cách đặt tên trong một dự án.

Ví dụ minh họa
Giả sử bạn có một dự án Vanilla JS với cấu trúc thư mục như sau:

src/
├── components/           # Tên thư mục con là kebab-case
│   ├── button/           # Thư mục riêng cho component nếu phức tạp
│   │   └── Button.js     # Tên tệp viết hoa, trùng tên class/component
│   └── Modal.js          # Tên tệp viết hoa, trùng tên class/component
├── services/             # Tên thư mục con là kebab-case
│   └── UserService.js    # Tên tệp viết hoa, trùng tên class/service
└── index.js
Nội dung src/components/Modal.js:

JavaScript

// src/components/Modal.js
class Modal {
    constructor(title, content) {
        this.title = title;
        this.content = content;
    }

    render() {
        console.log(`Rendering Modal: ${this.title} - ${this.content}`);
        // Logic để render modal ra DOM
    }
}

export default Modal; // Xuất class Modal
Nội dung src/services/UserService.js:

JavaScript

// src/services/UserService.js
class UserService {
    static getUsers() {
        console.log("Fetching users from API...");
        return [
            { id: 1, name: "Alice" },
            { id: 2, name: "Bob" }
        ];
    }
}

export default UserService; // Xuất class UserService
Nội dung src/index.js (hoặc tệp chính của bạn):

JavaScript

// src/index.js
import Modal from './components/Modal.js'; // Nhập Modal từ tệp Modal.js
import UserService from './services/UserService.js'; // Nhập UserService

const myModal = new Modal('Welcome', 'This is a test modal.');
myModal.render();

const users = UserService.getUsers();
console.log(users);
Tóm lại:

Mặc dù thư mục thường viết thường (kebab-case), nhưng đối với các tệp đại diện cho một "class" hoặc một module chính có thể được khởi tạo/sử dụng như một đối tượng, việc viết hoa chữ cái đầu tiên của tên tệp và làm cho nó trùng với tên của class/hàm chính là một thực hành tốt nhất và rất được khuyến nghị trong JavaScript. Điều này tạo ra một cấu trúc dự án rõ ràng, dễ đọc và dễ bảo trì.