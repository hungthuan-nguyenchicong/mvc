## code

// src/utils/EventEmitter.js

/**
 * A simple event emitter class to facilitate communication between decoupled components.
 * Components can subscribe to events using 'on' and publish events using 'emit'.
 */
class EventEmitter {
    constructor() {
        this.events = {}; // Stores event names and their registered listeners
    }

    /**
     * Registers a listener function for a specific event name.
     * @param {string} eventName - The name of the event to listen for.
     * @param {Function} listener - The callback function to execute when the event is emitted.
     */
    on(eventName, listener) {
        if (!this.events[eventName]) {
            this.events[eventName] = []; // Initialize array for new event names
        }
        this.events[eventName].push(listener); // Add the listener to the event's list
    }

    /**
     * Emits an event, calling all registered listeners for that event name.
     * @param {string} eventName - The name of the event to emit.
     * @param {any} data - The data to pass to the listeners (optional).
     */
    emit(eventName, data) {
        if (this.events[eventName]) {
            // Create a shallow copy of the listeners array to prevent issues
            // if listeners are removed during iteration (e.g., 'once' functionality).
            [...this.events[eventName]].forEach(listener => listener(data));
        }
    }
}

// Export a single, globally accessible instance of the EventEmitter
export const appEvents = new EventEmitter();

## md

(Event Emitter) là một EventEmittermẫu mạnh mẽ trong JavaScript cho phép bạn xây dựng các ứng dụng tách rời và mô-đun . Về cơ bản, nó là về việc tạo ra một cách để các phần khác nhau trong mã của bạn giao tiếp với nhau mà không cần tham chiếu trực tiếp đến nhau.

Hãy nghĩ về nó giống như một đài phát thanh và thính giả của nó :

Đài phát thanh (EventEmitter): Phát tin nhắn (phát sự kiện). Không quan tâm đến việc ai đang nghe hoặc họ làm gì với tin nhắn.
Người nghe (Thành phần/Chức năng): Họ dò kênh cụ thể (lắng nghe các sự kiện cụ thể). Khi họ nghe một thông điệp trên kênh của họ, họ phản ứng với thông điệp đó. Họ không cần biết bất cứ điều gì về đài phát thanh, chỉ cần biết tên kênh.
How Your EventEmitterWorks (Giải thích chi tiết)
Chúng ta hãy phân tích EventEmittermã của bạn:

JavaScript

// src/utils/EventEmitter.js

/**
 * A simple event emitter class to facilitate communication between decoupled components.
 * Components can subscribe to events using 'on' and publish events using 'emit'.
 */
class EventEmitter {
    constructor() {
        this.events = {}; // Stores event names and their registered listeners
    }

    /**
     * Registers a listener function for a specific event name.
     * @param {string} eventName - The name of the event to listen for.
     * @param {Function} listener - The callback function to execute when the event is emitted.
     */
    on(eventName, listener) {
        if (!this.events[eventName]) {
            this.events[eventName] = []; // Initialize array for new event names if none exist
        }
        this.events[eventName].push(listener); // Add the listener to the event's list
    }

    /**
     * Emits an event, calling all registered listeners for that event name.
     * @param {string} eventName - The name of the event to emit.
     * @param {any} data - The data to pass to the listeners (optional).
     */
    emit(eventName, data) {
        if (this.events[eventName]) {
            // Create a shallow copy of the listeners array to prevent issues
            // if listeners are removed during iteration (e.g., 'once' functionality).
            [...this.events[eventName]].forEach(listener => listener(data));
        }
    }
}

// Export a single, globally accessible instance of the EventEmitter
export const appEvents = new EventEmitter();
1.constructor()
JavaScript

constructor() {
    this.events = {}; // Stores event names and their registered listeners
}
Khi bạn tạo một EventEmitterthể hiện mới, nó constructorsẽ khởi tạo một đối tượng rỗng có tên là this.events.
Đối tượng này eventssẽ hoạt động như một sổ đăng ký . Các khóa của nó sẽ là eventName(ví dụ: 'pathChanged', 'userLoggedIn', 'itemAdded') và mỗi giá trị sẽ là một mảng các hàm lắng nghe được đăng ký cho sự kiện cụ thể đó.
2. on(eventName, listener)Phương pháp
JavaScript

on(eventName, listener) {
    if (!this.events[eventName]) {
        this.events[eventName] = []; // Create an array for this event if it doesn't exist
    }
    this.events[eventName].push(listener); // Add the listener function to the array
}
Đây là cách các thành phần đăng ký sự kiện.
Bạn gọi appEvents.on('myCustomEvent', myCallbackFunction).
Nó kiểm tra xem mảng đã tồn tại hay myCustomEventchưa this.events. Nếu chưa, nó sẽ tạo một mảng rỗng.
Sau đó, nó sẽ được thêm myCallbackFunctionvào mảng đó. Bây giờ, bất cứ khi nào 'myCustomEvent'được phát ra, myCallbackFunctionsẽ được thực thi.
Bạn có thể đăng ký nhiều trình lắng nghe cho cùng một tên sự kiện; tất cả chúng sẽ được gọi khi sự kiện được phát ra.
3. emit(eventName, data)Phương pháp
JavaScript

emit(eventName, data) {
    if (this.events[eventName]) { // Check if there are any listeners for this event
        // Create a shallow copy to prevent issues during iteration
        [...this.events[eventName]].forEach(listener => listener(data));
    }
}
Đây là cách các thành phần xuất bản hoặc kích hoạt sự kiện.
Bạn gọi appEvents.emit('myCustomEvent', someData).
Nó nhìn myCustomEventlên this.events.
Nếu tìm thấy một mảng trình lắng nghe cho sự kiện đó, nó sẽ lặp lại từng hàm trong mảng đó và thực thi hàm đó .
Tham datasố (ví dụ: someData) được truyền dưới dạng đối số cho mỗi hàm lắng nghe. Điều này cho phép emitter gửi thông tin có liên quan cùng với sự kiện.
[...this.events[eventName]]tạo một bản sao nông của mảng các trình lắng nghe. Đây là một thực hành tốt vì nếu một trình lắng nghe tự quyết định xóa chính nó hoặc một trình lắng nghe khác khỏi eventsmảng trong vòng forEachlặp, nó có thể gây ra hành vi hoặc lỗi không mong muốn (ví dụ: bỏ qua một trình lắng nghe hoặc vòng lặp vô hạn nếu không cẩn thận). Việc sao chép đảm bảo rằng lần lặp luôn xảy ra trên danh sách các trình lắng nghe tồn tại tại thời điểm emit được gọi.
4.export const appEvents = new EventEmitter();
JavaScript

export const appEvents = new EventEmitter();
Dòng này tạo ra một phiên bản toàn cục duy nhất của bạn EventEmittervà xuất phiên bản đó.
Điều này rất quan trọng vì bạn muốn tất cả các phần của ứng dụng giao tiếp qua cùng một bus sự kiện. Nếu mỗi thành phần tạo ra EventEmitterphiên bản riêng của mình, chúng sẽ không thể "nghe" được các sự kiện của nhau.
Nhờ exportingđó, bạn có thể import { appEvents } from './utils/EventEmitter.js';sử dụng bất kỳ tệp nào cần phát hoặc lắng nghe sự kiện.
Lợi ích của việc sử dụng mộtEventEmitter
Tách rời: Các thành phần không cần biết trực tiếp về nhau. RouterKhông cần biết có một Sidebarthành phần quan tâm đến thay đổi đường dẫn. Nó chỉ phát sóng pathChanged. SidebarKhông cần biết Routercó tồn tại hay không; nó chỉ lắng nghe pathChanged.
Tính mô-đun: Bạn có thể dễ dàng thêm, xóa hoặc sửa đổi các thành phần mà không ảnh hưởng đến các thành phần khác, miễn là chúng tuân thủ cùng một hợp đồng sự kiện (tên sự kiện và định dạng dữ liệu).
Khả năng mở rộng: Khi ứng dụng của bạn phát triển, việc quản lý các phụ thuộc trực tiếp giữa nhiều thành phần trở nên rất phức tạp. Một trình phát sự kiện tập trung giao tiếp.
Tính linh hoạt: Bạn có thể có nhiều trình lắng nghe cho một sự kiện hoặc một trình lắng nghe cho nhiều sự kiện.
Trong ứng dụng của bạn, appEventshoạt động như trung tâm giao tiếp. RouterXuất bản pathChangedcác sự kiện và Sidebarđăng ký chúng, cho phép thanh bên cập nhật các liên kết đang hoạt động bất cứ khi nào URL thay đổi, bất kể URL thay đổi như thế nào (nhấp vào liên kết, nút quay lại, nhập URL trực tiếp).

## đọc thêm ví dụ

(Event Emitter) là một EventEmittermẫu mạnh mẽ trong JavaScript cho phép bạn xây dựng các ứng dụng tách rời và mô-đun . Về cơ bản, nó là về việc tạo ra một cách để các phần khác nhau trong mã của bạn giao tiếp với nhau mà không cần tham chiếu trực tiếp đến nhau.

Hãy nghĩ về nó giống như một đài phát thanh và thính giả của nó :

Đài phát thanh (EventEmitter): Phát tin nhắn (phát sự kiện). Không quan tâm đến việc ai đang nghe hoặc họ làm gì với tin nhắn.
Người nghe (Thành phần/Chức năng): Họ dò kênh cụ thể (lắng nghe các sự kiện cụ thể). Khi họ nghe một thông điệp trên kênh của họ, họ phản ứng với thông điệp đó. Họ không cần biết bất cứ điều gì về đài phát thanh, chỉ cần biết tên kênh.
How Your EventEmitterWorks (Giải thích chi tiết)
Chúng ta hãy phân tích EventEmittermã của bạn:

JavaScript

// src/utils/EventEmitter.js

/**
 * A simple event emitter class to facilitate communication between decoupled components.
 * Components can subscribe to events using 'on' and publish events using 'emit'.
 */
class EventEmitter {
    constructor() {
        this.events = {}; // Stores event names and their registered listeners
    }

    /**
     * Registers a listener function for a specific event name.
     * @param {string} eventName - The name of the event to listen for.
     * @param {Function} listener - The callback function to execute when the event is emitted.
     */
    on(eventName, listener) {
        if (!this.events[eventName]) {
            this.events[eventName] = []; // Initialize array for new event names if none exist
        }
        this.events[eventName].push(listener); // Add the listener to the event's list
    }

    /**
     * Emits an event, calling all registered listeners for that event name.
     * @param {string} eventName - The name of the event to emit.
     * @param {any} data - The data to pass to the listeners (optional).
     */
    emit(eventName, data) {
        if (this.events[eventName]) {
            // Create a shallow copy of the listeners array to prevent issues
            // if listeners are removed during iteration (e.g., 'once' functionality).
            [...this.events[eventName]].forEach(listener => listener(data));
        }
    }
}

// Export a single, globally accessible instance of the EventEmitter
export const appEvents = new EventEmitter();
1.constructor()
JavaScript

constructor() {
    this.events = {}; // Stores event names and their registered listeners
}
Khi bạn tạo một EventEmitterthể hiện mới, nó constructorsẽ khởi tạo một đối tượng rỗng có tên là this.events.
Đối tượng này eventssẽ hoạt động như một sổ đăng ký . Các khóa của nó sẽ là eventName(ví dụ: 'pathChanged', 'userLoggedIn', 'itemAdded') và mỗi giá trị sẽ là một mảng các hàm lắng nghe được đăng ký cho sự kiện cụ thể đó.
2. on(eventName, listener)Phương pháp
JavaScript

on(eventName, listener) {
    if (!this.events[eventName]) {
        this.events[eventName] = []; // Create an array for this event if it doesn't exist
    }
    this.events[eventName].push(listener); // Add the listener function to the array
}
Đây là cách các thành phần đăng ký sự kiện.
Bạn gọi appEvents.on('myCustomEvent', myCallbackFunction).
Nó kiểm tra xem mảng đã tồn tại hay myCustomEventchưa this.events. Nếu chưa, nó sẽ tạo một mảng rỗng.
Sau đó, nó sẽ được thêm myCallbackFunctionvào mảng đó. Bây giờ, bất cứ khi nào 'myCustomEvent'được phát ra, myCallbackFunctionsẽ được thực thi.
Bạn có thể đăng ký nhiều trình lắng nghe cho cùng một tên sự kiện; tất cả chúng sẽ được gọi khi sự kiện được phát ra.
3. emit(eventName, data)Phương pháp
JavaScript

emit(eventName, data) {
    if (this.events[eventName]) { // Check if there are any listeners for this event
        // Create a shallow copy to prevent issues during iteration
        [...this.events[eventName]].forEach(listener => listener(data));
    }
}
Đây là cách các thành phần xuất bản hoặc kích hoạt sự kiện.
Bạn gọi appEvents.emit('myCustomEvent', someData).
Nó nhìn myCustomEventlên this.events.
Nếu tìm thấy một mảng trình lắng nghe cho sự kiện đó, nó sẽ lặp lại từng hàm trong mảng đó và thực thi hàm đó .
Tham datasố (ví dụ: someData) được truyền dưới dạng đối số cho mỗi hàm lắng nghe. Điều này cho phép emitter gửi thông tin có liên quan cùng với sự kiện.
[...this.events[eventName]]tạo một bản sao nông của mảng các trình lắng nghe. Đây là một thực hành tốt vì nếu một trình lắng nghe tự quyết định xóa chính nó hoặc một trình lắng nghe khác khỏi eventsmảng trong vòng forEachlặp, nó có thể gây ra hành vi hoặc lỗi không mong muốn (ví dụ: bỏ qua một trình lắng nghe hoặc vòng lặp vô hạn nếu không cẩn thận). Việc sao chép đảm bảo rằng lần lặp luôn xảy ra trên danh sách các trình lắng nghe tồn tại tại thời điểm emit được gọi.
4.export const appEvents = new EventEmitter();
JavaScript

export const appEvents = new EventEmitter();
Dòng này tạo ra một phiên bản toàn cục duy nhất của bạn EventEmittervà xuất phiên bản đó.
Điều này rất quan trọng vì bạn muốn tất cả các phần của ứng dụng giao tiếp qua cùng một bus sự kiện. Nếu mỗi thành phần tạo ra EventEmitterphiên bản riêng của mình, chúng sẽ không thể "nghe" được các sự kiện của nhau.
Nhờ exportingđó, bạn có thể import { appEvents } from './utils/EventEmitter.js';sử dụng bất kỳ tệp nào cần phát hoặc lắng nghe sự kiện.
Lợi ích của việc sử dụng mộtEventEmitter
Tách rời: Các thành phần không cần biết trực tiếp về nhau. RouterKhông cần biết có một Sidebarthành phần quan tâm đến thay đổi đường dẫn. Nó chỉ phát sóng pathChanged. SidebarKhông cần biết Routercó tồn tại hay không; nó chỉ lắng nghe pathChanged.
Tính mô-đun: Bạn có thể dễ dàng thêm, xóa hoặc sửa đổi các thành phần mà không ảnh hưởng đến các thành phần khác, miễn là chúng tuân thủ cùng một hợp đồng sự kiện (tên sự kiện và định dạng dữ liệu).
Khả năng mở rộng: Khi ứng dụng của bạn phát triển, việc quản lý các phụ thuộc trực tiếp giữa nhiều thành phần trở nên rất phức tạp. Một trình phát sự kiện tập trung giao tiếp.
Tính linh hoạt: Bạn có thể có nhiều trình lắng nghe cho một sự kiện hoặc một trình lắng nghe cho nhiều sự kiện.
Trong ứng dụng của bạn, appEventshoạt động như trung tâm giao tiếp. RouterXuất bản pathChangedcác sự kiện và Sidebarđăng ký chúng, cho phép thanh bên cập nhật các liên kết đang hoạt động bất cứ khi nào URL thay đổi, bất kể URL thay đổi như thế nào (nhấp vào liên kết, nút quay lại, nhập URL trực tiếp).







bạn có thể thêm một vài ví dụ cơ bản để có thể hiểu hơn và ứng dụng EventEmitter()


Tất nhiên rồi! Để hiểu rõ hơn về cách sử dụng EventEmitter, chúng ta hãy xem xét một vài ví dụ cơ bản nhưng thiết thực.

1. Ví dụ cơ bản nhất: Đếm số lần click chuột
Hãy tưởng tượng bạn muốn một chức năng nào đó "lắng nghe" khi người dùng click vào một nút cụ thể, và một chức năng khác sẽ "thông báo" khi sự kiện click đó xảy ra.

Mục tiêu: Khi click vào nút "Click Me!", một thông báo sẽ hiện ra trên console.

<hr>

Cấu trúc file:
├── src/
│   ├── utils/
│   │   └── EventEmitter.js  <-- (Giữ nguyên như bạn đã có)
│   ├── components/
│   │   ├── MyButton.js      <-- Nơi phát ra sự kiện
│   │   └── Notifier.js      <-- Nơi lắng nghe sự kiện
│   └── main.js              <-- Khởi tạo và kết nối
<hr>

Mã nguồn:
src/utils/EventEmitter.js(giữ nguyên):

JavaScript

class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(eventName, listener) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(listener);
    }

    emit(eventName, data) {
        if (this.events[eventName]) {
            [...this.events[eventName]].forEach(listener => listener(data));
        }
    }
}
export const appEvents = new EventEmitter();
src/components/MyButton.js(Nơi phát sự kiện):

JavaScript

// src/components/MyButton.js
export class MyButton {
    constructor(emitter) {
        this.buttonElement = null;
        this.emitter = emitter; // Nhận EventEmitter instance
    }

    render() {
        this.buttonElement = document.createElement('button');
        this.buttonElement.textContent = 'Click Me!';
        this.buttonElement.style.padding = '10px 20px';
        this.buttonElement.style.fontSize = '18px';
        this.buttonElement.style.cursor = 'pointer';

        // Lắng nghe sự kiện click của nút
        this.buttonElement.addEventListener('click', () => {
            console.log('MyButton: Nút đã được click!');
            // Phát ra sự kiện 'buttonClicked' qua emitter
            this.emitter.emit('buttonClicked', { timestamp: new Date().toISOString() });
        });

        return this.buttonElement;
    }
}
src/components/Notifier.js(Nơi lắng nghe sự kiện):

JavaScript

// src/components/Notifier.js
export class Notifier {
    constructor(emitter) {
        this.notificationCount = 0;
        this.displayElement = null;
        this.emitter = emitter; // Nhận EventEmitter instance

        // Đăng ký lắng nghe sự kiện 'buttonClicked'
        this.emitter.on('buttonClicked', (data) => this.handleButtonClick(data));
        console.log('Notifier: Đã đăng ký lắng nghe sự kiện "buttonClicked".');
    }

    render() {
        this.displayElement = document.createElement('p');
        this.displayElement.textContent = 'Số lần nút được click: 0';
        this.displayElement.style.fontSize = '20px';
        this.displayElement.style.fontWeight = 'bold';
        return this.displayElement;
    }

    handleButtonClick(data) {
        this.notificationCount++;
        if (this.displayElement) {
            this.displayElement.textContent = `Số lần nút được click: ${this.notificationCount}`;
        }
        console.log(`Notifier: Nhận được sự kiện buttonClicked. Thời gian: ${data.timestamp}`);
    }
}
src/main.js(Nơi khởi tạo):

JavaScript

// src/main.js
import { appEvents } from './utils/EventEmitter.js'; // Import appEvents
import { MyButton } from './components/MyButton.js';
import { Notifier } from './components/Notifier.js';
import './main.scss'; // Nếu bạn có file CSS

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    if (!app) {
        console.warn('Không tìm thấy element có id "app"!');
        return;
    }

    // Khởi tạo MyButton và truyền appEvents vào
    const myButton = new MyButton(appEvents);
    app.appendChild(myButton.render());

    // Khởi tạo Notifier và truyền appEvents vào
    const notifier = new Notifier(appEvents);
    app.appendChild(notifier.render());

    console.log('Ứng dụng đã khởi tạo.');
});
index.html(Đơn giản để chạy):

HTML

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EventEmitter Example</title>
</head>
<body>
    <div id="app"></div>
    <script type="module" src="src/main.js"></script>
</body>
</html>
<hr>

Giải thích:
MyButton.js(Phát sự kiện):

Nó tạo ra một nút HTML.
Khi nút được click, nó sử dụng this.emitter.emit('buttonClicked', { timestamp: ... }) để phát ra một sự kiện có tên 'buttonClicked'. Nó cũng gửi kèm một đối tượng data (chứa timestamp) cùng với sự kiện.
Quan trọng là MyButton không biết Notifier là gì, nó chỉ biết rằng nó cần thông báo về việc nút đã được click.
Notifier.js(Lắng nghe sự kiện):

Trong constructor, nó sử dụng this.emitter.on('buttonClicked', (data) => this.handleButtonClick(data)) để đăng ký lắng nghe sự kiện 'buttonClicked'.
Bất cứ khi nào sự kiện 'buttonClicked' được phát ra bởi bất kỳ đâu trong ứng dụng (thông qua cùng một appEvents instance), hàm handleButtonClick của Notifier sẽ được gọi tự động, và nó sẽ nhận được data mà MyButton đã gửi.
Notifier không biết ai đã phát ra sự kiện, nó chỉ quan tâm đến việc có một sự kiện 'buttonClicked' xảy ra.
main.js(Kết nối):

Đây là nơi "kết nối" mọi thứ lại. Cả MyButton và Notifier đều được khởi tạo và cùng nhận một instance của appEvents.
Việc sử dụng cùng một appEvents instance là rất quan trọng; nó giống như việc cả đài phát và người nghe đều dùng cùng một tần số radio.
2. Ví dụ nâng cao hơn: Cập nhật giỏ hàng
Hãy tưởng tượng một ứng dụng mua sắm với các thành phần như: danh sách sản phẩm, nút "Thêm vào giỏ hàng", và một biểu tượng giỏ hàng nhỏ hiển thị số lượng sản phẩm.

Mục tiêu: Khi người dùng click "Thêm vào giỏ hàng", số lượng sản phẩm trong biểu tượng giỏ hàng phải được cập nhật mà không cần truyền dữ liệu trực tiếp giữa các component.

<hr>

Cấu trúc file:
├── src/
│   ├── utils/
│   │   └── EventEmitter.js
│   ├── components/
│   │   ├── ProductCard.js   <-- Phát sự kiện 'addToCart'
│   │   └── CartIcon.js      <-- Lắng nghe sự kiện 'addToCart'
│   └── main.js
<hr>

Mã nguồn:
src/utils/EventEmitter.js(giữ nguyên).

src/components/ProductCard.js(Phát sự kiện "thêm vào giỏ hàng"):

JavaScript

// src/components/ProductCard.js
export class ProductCard {
    constructor(product, emitter) {
        this.product = product;
        this.emitter = emitter;
        this.cardElement = null;
    }

    render() {
        this.cardElement = document.createElement('div');
        this.cardElement.className = 'product-card';
        this.cardElement.style.border = '1px solid #ccc';
        this.cardElement.style.padding = '15px';
        this.cardElement.style.margin = '10px';
        this.cardElement.style.borderRadius = '8px';
        this.cardElement.style.width = '200px';
        this.cardElement.innerHTML = `
            <h3>${this.product.name}</h3>
            <p>Giá: ${this.product.price} VNĐ</p>
            <button class="add-to-cart-btn">Thêm vào giỏ</button>
        `;

        const addButton = this.cardElement.querySelector('.add-to-cart-btn');
        addButton.addEventListener('click', () => {
            console.log(`ProductCard: Đã thêm "${this.product.name}" vào giỏ.`);
            // Phát ra sự kiện 'addToCart' với thông tin sản phẩm
            this.emitter.emit('addToCart', this.product);
        });

        return this.cardElement;
    }
}
src/components/CartIcon.js(Lắng nghe sự kiện và cập nhật UI):

JavaScript

// src/components/CartIcon.js
export class CartIcon {
    constructor(emitter) {
        this.itemCount = 0;
        this.iconElement = null;
        this.emitter = emitter;

        // Lắng nghe sự kiện 'addToCart'
        this.emitter.on('addToCart', (product) => this.handleAddToCart(product));
        console.log('CartIcon: Đã đăng ký lắng nghe sự kiện "addToCart".');
    }

    render() {
        this.iconElement = document.createElement('div');
        this.iconElement.className = 'cart-icon';
        this.iconElement.style.position = 'fixed';
        this.iconElement.style.top = '10px';
        this.iconElement.style.right = '10px';
        this.iconElement.style.background = '#4CAF50';
        this.iconElement.style.color = 'white';
        this.iconElement.style.padding = '10px';
        this.iconElement.style.borderRadius = '50%';
        this.iconElement.style.width = '40px';
        this.iconElement.style.height = '40px';
        this.iconElement.style.display = 'flex';
        this.iconElement.style.alignItems = 'center';
        this.iconElement.style.justifyContent = 'center';
        this.iconElement.style.fontSize = '18px';
        this.iconElement.textContent = '0';
        return this.iconElement;
    }

    handleAddToCart(product) {
        this.itemCount++;
        if (this.iconElement) {
            this.iconElement.textContent = this.itemCount.toString();
        }
        console.log(`CartIcon: Cập nhật số lượng giỏ hàng. Tổng: ${this.itemCount} sản phẩm.`);
    }
}
src/main.js(Khởi tạo):

JavaScript

// src/main.js
import { appEvents } from './utils/EventEmitter.js';
import { ProductCard } from './components/ProductCard.js';
import { CartIcon } from './components/CartIcon.js';
import './main.scss'; // Nếu bạn có file CSS

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    if (!app) {
        console.warn('Không tìm thấy element có id "app"!');
        return;
    }

    // Tạo một số sản phẩm giả định
    const products = [
        { id: 1, name: 'Điện thoại XYZ', price: 5000000 },
        { id: 2, name: 'Laptop ABC', price: 12000000 },
        { id: 3, name: 'Bàn phím cơ', price: 1500000 },
    ];

    // Khởi tạo và render các ProductCard
    const productsContainer = document.createElement('div');
    productsContainer.style.display = 'flex';
    productsContainer.style.flexWrap = 'wrap';
    productsContainer.style.gap = '20px'; // Khoảng cách giữa các card
    app.appendChild(productsContainer);

    products.forEach(productData => {
        const productCard = new ProductCard(productData, appEvents);
        productsContainer.appendChild(productCard.render());
    });

    // Khởi tạo và render CartIcon
    const cartIcon = new CartIcon(appEvents);
    app.appendChild(cartIcon.render());

    console.log('Ứng dụng mua sắm đã khởi tạo.');
});
<hr>

Giải thích:
ProductCard.js: Khi nút "Thêm vào giỏ" được click, nó phát ra sự kiện 'addToCart' và truyền kèm thông tin của sản phẩm đó.
CartIcon.js: Lắng nghe sự kiện 'addToCart'. Bất cứ khi nào sự kiện này được phát ra (từ bất kỳ ProductCard nào), CartIcon sẽ cập nhật số lượng sản phẩm hiển thị trên biểu tượng giỏ hàng của nó.
main.js: Đảm bảo cả ProductCard và CartIcon đều sử dụng cùng một instance appEvents.
Hai ví dụ này minh họa cách EventEmitter giúp các phần độc lập của ứng dụng giao tiếp với nhau một cách hiệu quả, tạo nên một kiến trúc gọn gàng và dễ mở rộng.