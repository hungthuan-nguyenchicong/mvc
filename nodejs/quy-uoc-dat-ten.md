## # va _

Trong JavaScript thuần (Vanilla JS), việc đặt tên hàm bắt đầu bằng # hoặc _ là một quy ước để chỉ ra rằng hàm đó có một mục đích sử dụng đặc biệt, thường là để thể hiện tính "riêng tư" (private) hoặc "nội bộ" (internal) của hàm. JavaScript trước đây không có các công cụ ngôn ngữ tích hợp để thực thi tính riêng tư, vì vậy đây là các quy ước được cộng đồng phát triển.

1. Quy ước đặt tên hàm với _ (underscore - gạch dưới)
Ý nghĩa: Khi bạn đặt tên một hàm hoặc một thuộc tính bắt đầu bằng một dấu gạch dưới (_), nó là một quy ước ngầm định (convention) rằng thành viên đó được coi là private (riêng tư) hoặc protected (được bảo vệ).
Không thực thi (Non-enforced): JavaScript hoàn toàn không ngăn cản bạn truy cập hoặc gọi các hàm/thuộc tính bắt đầu bằng _ từ bên ngoài class hoặc module. Bất kỳ ai cũng có thể truy cập chúng.
Mục đích:
Báo hiệu cho các lập trình viên khác: Nó thông báo rằng "Hàm này/thuộc tính này được dùng nội bộ trong class/module này. Bạn không nên gọi hoặc thay đổi nó trực tiếp từ bên ngoài, vì nó có thể thay đổi trong tương lai và phá vỡ code của bạn."
Tổ chức code: Giúp phân biệt rõ ràng các phương thức public (API công khai của class) với các phương thức hỗ trợ nội bộ.
Ví dụ của bạn:
_setupListeners() trong Router.js: Bạn đã đổi init() thành _setupListeners(). Điều này ngụ ý rằng _setupListeners() là một hàm nội bộ của class Router chịu trách nhiệm thiết lập các listener, và bạn không mong muốn code bên ngoài gọi nó trực tiếp sau khi Router đã được khởi tạo. Router sẽ tự gọi nó trong constructor.
<!-- kết thúc danh sách -->

JavaScript

export class MyClass {
    constructor() {
        this._internalHelper(); // Gọi hàm nội bộ trong constructor
    }

    publicMethod() {
        console.log("This is a public method.");
        this._internalHelper(); // Một phương thức public có thể gọi một phương thức nội bộ
    }

    _internalHelper() { // Quy ước hàm nội bộ
        console.log("This is an internal helper method. Don't call me directly from outside!");
    }
}

const instance = new MyClass();
instance.publicMethod();      // OK
instance._internalHelper();   // Cũng OK về mặt cú pháp, nhưng là vi phạm quy ước (should not do this)
2. Quy ước đặt tên hàm với # (hash - dấu thăng)
Ý nghĩa: Bắt đầu từ ES2020 (ECMAScript 2020), JavaScript giới thiệu Private Class Fields sử dụng cú pháp #. Khi bạn đặt tên một hàm hoặc một thuộc tính trong class với #, nó được coi là thực sự private (riêng tư thực thi).
Được thực thi (Enforced): Đây không chỉ là một quy ước mà là một tính năng ngôn ngữ. Bạn không thể truy cập hoặc gọi các hàm/thuộc tính bắt đầu bằng # từ bên ngoài class mà chúng được định nghĩa. Nếu cố gắng, bạn sẽ nhận được một SyntaxError hoặc TypeError.
Mục đích:
Đóng gói (Encapsulation) thực sự: Đảm bảo rằng một phần dữ liệu hoặc logic chỉ có thể được truy cập và thay đổi bởi chính class đó, bảo vệ tính toàn vẹn của đối tượng.
API rõ ràng: Giúp định nghĩa rõ ràng đâu là API công khai của class và đâu là chi tiết triển khai nội bộ.
Ví dụ của bạn:
#triggerRouteChange() trong Router.js: Đây là một ví dụ hoàn hảo. Bạn đã sử dụng # để biến nó thành một phương thức private. Điều này có nghĩa là chỉ các phương thức khác bên trong class Router (như _setupListeners(), triggerInitialRoute(), và các listener trong _setupListeners()) mới có thể gọi #triggerRouteChange(). Code bên ngoài class Router không thể trực tiếp gọi routerInstance.#triggerRouteChange().
<!-- kết thúc danh sách -->

JavaScript

export class MyNewClass {
    #privateValue = 10; // Thuộc tính private

    constructor() {
        this.#privateHelper(); // Gọi hàm private trong constructor
    }

    publicMethod() {
        console.log("Accessing private value:", this.#privateValue);
        this.#privateHelper(); // Một phương thức public có thể gọi một phương thức private
    }

    #privateHelper() { // Hàm private
        console.log("This is a truly private method. You cannot call me from outside!");
    }
}

const instance = new MyNewClass();
instance.publicMethod();            // OK
// instance.#privateHelper();       // Lỗi: SyntaxError - Cannot access private field from outside class
// console.log(instance.#privateValue); // Lỗi: SyntaxError - Cannot access private field from outside class
Tóm tắt sự khác biệt:
Đặc điểm	_(gạch chân)	#(dấu thăng)
Tính chất	Quy ước (convention)	Tính năng ngôn ngữ (language feature)
Thực thi	Không được thực thi bởi JS Engine	Được thực thi bởi JS Engine
Truy cập	Có thể truy cập từ bên ngoài (nhưng không nên)	Không thể truy cập từ bên ngoài (lỗi)
Khả dụng từ	Luôn có (quy ước cũ)	ES2020 trở đi (modern JS)
Ứng dụng	Các hàm/thuộc tính "internal" hoặc "protected"	Các hàm/thuộc tính "private" thực sự

Xuất sang Trang tính
Trong dự án của bạn, việc sử dụng cả _setupListeners() và #triggerRouteChange() là một cách tiếp cận hiện đại và tốt. Nó giúp phân biệt rõ ràng giữa các hàm hỗ trợ nội bộ (nhưng có thể truy cập được nếu cần) và các hàm thực sự chỉ dành cho việc sử dụng trong class đó.