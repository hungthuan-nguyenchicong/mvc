## EventEmitter

// ./src/utils/event-emitter.js

class EventEmitter {
    constructor() {
        this.events= {}
    }

    on(eventName, listener) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(listener);
    }

    emit(eventName, ...args) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(listener => listener(...args));
        }
    }

    off(eventName, listenerToRemove) {
        if(!this.events[eventName]) {
            return;
        }
        this.events[eventName] = this.events[eventName].filter(listener => listener !== listenerToRemove);
    }
}

export const eventEmitterInstance = new EventEmitter();

## học

Bạn có một lớp EventEmitter được định nghĩa sẵn, và một thể hiện của nó là eventEmitterInstance. Dưới đây là cách bạn có thể phát và nghe sự kiện sử dụng eventEmitterInstance:

Phát sự kiện (emit)
Để phát một sự kiện, bạn sử dụng phương thức emit() của eventEmitterInstance. Tham số đầu tiên là tên của sự kiện bạn muốn phát, các tham số tiếp theo là dữ liệu (hoặc đối số) bạn muốn gửi cùng với sự kiện.

Ví dụ:

JavaScript

import { eventEmitterInstance } from './src/utils/event-emitter.js';

// Phát sự kiện 'userLoggedIn' với dữ liệu là ID người dùng
eventEmitterInstance.emit('userLoggedIn', { userId: 123, username: 'Alice' });

// Phát sự kiện 'dataUpdated' mà không có dữ liệu cụ thể nào
eventEmitterInstance.emit('dataUpdated');
Nghe sự kiện (on)
Để nghe một sự kiện, bạn sử dụng phương thức on() của eventEmitterInstance. Tham số đầu tiên là tên của sự kiện bạn muốn lắng nghe, và tham số thứ hai là một hàm callback (listener) sẽ được gọi khi sự kiện đó được phát. Hàm callback này sẽ nhận các đối số được truyền khi sự kiện được phát.

Ví dụ:

JavaScript

import { eventEmitterInstance } from './src/utils/event-emitter.js';

// Lắng nghe sự kiện 'userLoggedIn'
eventEmitterInstance.on('userLoggedIn', (userData) => {
    console.log('Người dùng đã đăng nhập:', userData.username, 'với ID:', userData.userId);
});

// Lắng nghe sự kiện 'dataUpdated'
eventEmitterInstance.on('dataUpdated', () => {
    console.log('Dữ liệu đã được cập nhật!');
});

// Bạn có thể đặt các phần lắng nghe sự kiện này ở các module khác nhau hoặc các phần khác nhau của ứng dụng.
// Khi sự kiện được emit, tất cả các listener đã đăng ký cho sự kiện đó sẽ được thực thi.

// Để minh họa, hãy phát sự kiện sau khi đã đăng ký listener:
eventEmitterInstance.emit('userLoggedIn', { userId: 456, username: 'Bob' });
eventEmitterInstance.emit('dataUpdated');
Dừng nghe sự kiện (off)
Nếu bạn muốn dừng lắng nghe một sự kiện cụ thể, bạn có thể sử dụng phương thức off(). Bạn cần truyền tên sự kiện và chính xác hàm listener mà bạn đã đăng ký trước đó.

Ví dụ:

JavaScript

import { eventEmitterInstance } from './src/utils/event-emitter.js';

// Định nghĩa một hàm listener
const myListener = (message) => {
    console.log('Thông báo:', message);
};

// Đăng ký listener
eventEmitterInstance.on('newMessage', myListener);

// Phát sự kiện
eventEmitterInstance.emit('newMessage', 'Đây là tin nhắn đầu tiên.'); // Output: Thông báo: Đây là tin nhắn đầu tiên.

// Dừng lắng nghe sự kiện
eventEmitterInstance.off('newMessage', myListener);

// Phát sự kiện lần nữa, nhưng listener sẽ không được gọi
eventEmitterInstance.emit('newMessage', 'Tin nhắn này sẽ không được nghe.');
Tóm lại:

Sử dụng eventEmitterInstance.on(eventName, listener) để đăng ký lắng nghe một sự kiện.

Sử dụng eventEmitterInstance.emit(eventName, ...args) để phát một sự kiện và truyền dữ liệu.

Sử dụng eventEmitterInstance.off(eventName, listenerToRemove) để hủy đăng ký một listener cụ thể.

Mô hình Event Emitter này rất hữu ích cho việc giao tiếp giữa các thành phần không có quan hệ trực tiếp trong ứng dụng của bạn, giúp decoupling (giảm sự phụ thuộc) giữa chúng.