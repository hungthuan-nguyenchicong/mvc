## tạo một flat message (thông báo phẳng)

Để tạo một flat message (thông báo phẳng) với JavaScript (vanillaJS) sau khi thực hiện thao tác CRUD, bạn sẽ cần các bước sau:

1.  **Tạo một hàm để hiển thị thông báo:** Hàm này sẽ tạo ra một element HTML, thêm nội dung và class CSS phù hợp, sau đó chèn vào DOM.
2.  **Sử dụng `setTimeout` để tự động ẩn thông báo:** Điều này tạo ra trải nghiệm người dùng tốt hơn, thông báo sẽ biến mất sau vài giây mà không cần người dùng phải tương tác.
3.  **Tích hợp vào các hàm xử lý sự kiện CRUD:** Sau khi gọi API hoặc xử lý dữ liệu thành công, bạn gọi hàm hiển thị thông báo.

-----

### Ví dụ Chi tiết

Giả sử bạn có một trang HTML đơn giản.

#### 1\. Cấu trúc HTML cơ bản

Thêm một div trống vào nơi bạn muốn hiển thị thông báo.

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>CRUD với Vanilla JS</title>
    <style>
        .message-container {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
        }
        .flat-message {
            padding: 15px 25px;
            margin-bottom: 15px;
            border-radius: 5px;
            font-family: sans-serif;
            color: white;
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
        }
        .flat-message.success {
            background-color: #4CAF50; /* Xanh lá */
        }
        .flat-message.error {
            background-color: #f44336; /* Đỏ */
        }
        .flat-message.show {
            opacity: 1;
        }
    </style>
</head>
<body>

    <div id="message-container" class="message-container"></div>

    <h1>Quản lý sản phẩm</h1>
    <button onclick="handleCreate()">Tạo mới sản phẩm</button>
    <button onclick="handleUpdate()">Cập nhật sản phẩm</button>
    <button onclick="handleDelete()">Xóa sản phẩm</button>

    <script src="app.js"></script>
</body>
</html>
```

#### 2\. Viết JavaScript (file `app.js`)

**Bước 1: Hàm tạo và hiển thị thông báo**

Hàm này sẽ nhận vào nội dung thông báo (`message`) và loại thông báo (`type`).

```javascript
function showFlatMessage(message, type = 'success') {
    // Lấy container
    const container = document.getElementById('message-container');

    // Tạo element cho thông báo
    const messageEl = document.createElement('div');
    messageEl.className = `flat-message ${type}`;
    messageEl.textContent = message;

    // Chèn vào container
    container.appendChild(messageEl);

    // Sử dụng setTimeout để thêm class 'show' sau một chút để tạo hiệu ứng fade-in
    setTimeout(() => {
        messageEl.classList.add('show');
    }, 10);

    // Tự động xóa thông báo sau 3 giây
    setTimeout(() => {
        messageEl.classList.remove('show');
        // Sau khi fade-out, xóa element khỏi DOM
        setTimeout(() => {
            messageEl.remove();
        }, 500); // Thời gian này phải khớp với transition
    }, 3000);
}
```

**Bước 2: Tích hợp vào các hàm xử lý CRUD**

Giả sử bạn có các hàm xử lý logic CRUD (thực tế, các hàm này sẽ gọi API).

```javascript
// Ví dụ hàm xử lý 'Tạo mới'
function handleCreate() {
    // Thực hiện logic tạo mới dữ liệu (gọi API, etc.)
    const isSuccess = true; // Giả lập thành công

    if (isSuccess) {
        showFlatMessage('Tạo mới sản phẩm thành công!', 'success');
    } else {
        showFlatMessage('Đã xảy ra lỗi khi tạo sản phẩm.', 'error');
    }
}

// Ví dụ hàm xử lý 'Cập nhật'
function handleUpdate() {
    // Thực hiện logic cập nhật
    const isSuccess = true;

    if (isSuccess) {
        showFlatMessage('Cập nhật sản phẩm thành công!', 'success');
    } else {
        showFlatMessage('Đã xảy ra lỗi khi cập nhật sản phẩm.', 'error');
    }
}

// Ví dụ hàm xử lý 'Xóa'
function handleDelete() {
    // Thực hiện logic xóa
    const isSuccess = true;

    if (isSuccess) {
        showFlatMessage('Xóa sản phẩm thành công!', 'success');
    } else {
        showFlatMessage('Đã xảy ra lỗi khi xóa sản phẩm.', 'error');
    }
}
```

-----

### Giải thích

  * **`showFlatMessage(message, type)`:** Đây là hàm chính để tạo và quản lý thông báo.
  * **`document.createElement` và `appendChild`:** Các phương thức này được sử dụng để tạo một phần tử HTML mới (`<div>`) và chèn nó vào bên trong `message-container`.
  * **CSS Classes (`success`, `error`, `show`):** Các class này được dùng để định dạng màu sắc cho thông báo và tạo hiệu ứng chuyển động mờ dần (fade-in/fade-out).
  * **`setTimeout`:**
      * `setTimeout` đầu tiên (`10ms`): Đợi một chút rồi thêm class `show` để kích hoạt hiệu ứng fade-in CSS.
      * `setTimeout` thứ hai (`3000ms`): Sau 3 giây, gỡ bỏ class `show` để thông báo bắt đầu mờ dần.
      * `setTimeout` thứ ba (nằm trong `setTimeout` thứ hai): Sau khi thông báo đã mờ hẳn (sau `500ms`), xóa hoàn toàn phần tử thông báo khỏi DOM bằng `element.remove()`. Điều này giúp dọn dẹp bộ nhớ và giữ cho DOM sạch sẽ.

## v2 với Custom --> new CustomEvent
Tuyệt vời\! Sử dụng `CustomEvent` là một cách hiệu quả và linh hoạt để quản lý thông báo trong ứng dụng của bạn, đặc biệt là khi bạn muốn tách biệt logic xử lý CRUD khỏi logic hiển thị giao diện.

Dưới đây là cách bạn có thể tạo và sử dụng `CustomEvent` để phát ra thông báo sau mỗi sự kiện CRUD bằng Vanilla JS:

-----

### Bước 1: Tạo Message Container và Hàm Lắng Nghe Sự Kiện

Đầu tiên, bạn cần một khu vực trên DOM để hiển thị các thông báo. Đồng thời, bạn sẽ tạo một listener để lắng nghe sự kiện tùy chỉnh.

```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>CRUD với CustomEvent</title>
    <style>
        .message-container {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
        }
        .flat-message {
            padding: 15px 25px;
            margin-bottom: 15px;
            border-radius: 5px;
            font-family: sans-serif;
            color: white;
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
        }
        .flat-message.success {
            background-color: #4CAF50;
        }
        .flat-message.error {
            background-color: #f44336;
        }
        .flat-message.show {
            opacity: 1;
        }
    </style>
</head>
<body>

    <div id="message-container" class="message-container"></div>

    <h1>Quản lý sản phẩm</h1>
    <button id="createBtn">Tạo mới</button>
    <button id="updateBtn">Cập nhật</button>
    <button id="deleteBtn">Xóa</button>

    <script src="app.js"></script>
</body>
</html>
```

Bây giờ, trong file `app.js`, chúng ta sẽ thiết lập bộ lắng nghe sự kiện.

```javascript
document.addEventListener('DOMContentLoaded', () => {
    const messageContainer = document.getElementById('message-container');

    // Hàm để hiển thị thông báo
    function showFlatMessage(message, type) {
        const messageEl = document.createElement('div');
        messageEl.className = `flat-message ${type}`;
        messageEl.textContent = message;
        messageContainer.appendChild(messageEl);

        setTimeout(() => {
            messageEl.classList.add('show');
        }, 10);

        setTimeout(() => {
            messageEl.classList.remove('show');
            setTimeout(() => {
                messageEl.remove();
            }, 500);
        }, 3000);
    }

    // Lắng nghe sự kiện tùy chỉnh 'crud-message'
    document.addEventListener('crud-message', (e) => {
        const { message, type } = e.detail;
        showFlatMessage(message, type);
    });
});
```

-----

### Bước 2: Tạo và Phát Sự Kiện cho Từng Thao Tác CRUD

Bây giờ, chúng ta sẽ tạo các hàm xử lý cho từng nút `Tạo`, `Cập nhật`, `Xóa`. Thay vì gọi trực tiếp hàm `showFlatMessage`, chúng ta sẽ tạo và phát ra một `CustomEvent`.

```javascript
// Tiếp tục trong file app.js
document.addEventListener('DOMContentLoaded', () => {
    // ... (Phần code lắng nghe sự kiện ở trên) ...

    const createBtn = document.getElementById('createBtn');
    const updateBtn = document.getElementById('updateBtn');
    const deleteBtn = document.getElementById('deleteBtn');

    // Hàm chung để phát sự kiện
    function dispatchCrudMessage(message, type) {
        const event = new CustomEvent('crud-message', {
            detail: { message, type }
        });
        document.dispatchEvent(event);
    }

    // Xử lý sự kiện khi click nút
    createBtn.addEventListener('click', () => {
        // Giả lập logic xử lý thành công
        const success = true;
        if (success) {
            dispatchCrudMessage('Sản phẩm đã được tạo thành công!', 'success');
        } else {
            dispatchCrudMessage('Lỗi khi tạo sản phẩm!', 'error');
        }
    });

    updateBtn.addEventListener('click', () => {
        // Giả lập logic xử lý thành công
        const success = true;
        if (success) {
            dispatchCrudMessage('Sản phẩm đã được cập nhật thành công!', 'success');
        } else {
            dispatchCrudMessage('Lỗi khi cập nhật sản phẩm!', 'error');
        }
    });

    deleteBtn.addEventListener('click', () => {
        // Giả lập logic xử lý thành công
        const success = true;
        if (success) {
            dispatchCrudMessage('Sản phẩm đã được xóa thành công!', 'success');
        } else {
            dispatchCrudMessage('Lỗi khi xóa sản phẩm!', 'error');
        }
    });
});
```

-----

### Lợi Ích của Cách Tiếp Cận Này

  * **Tách biệt (Decoupling):** Logic hiển thị thông báo được tách biệt hoàn toàn khỏi logic xử lý CRUD. Các hàm xử lý CRUD chỉ cần phát ra sự kiện, còn việc hiển thị thông báo sẽ do một bộ lắng nghe khác đảm nhiệm. Điều này giúp code của bạn dễ bảo trì và mở rộng hơn.
  * **Tái sử dụng (Reusability):** Bạn chỉ cần viết hàm `showFlatMessage` một lần duy nhất và có thể tái sử dụng nó cho mọi loại thông báo trong ứng dụng.
  * **Linh hoạt:** Bạn có thể có nhiều bộ lắng nghe khác nhau cho cùng một sự kiện. Ví dụ, ngoài việc hiển thị thông báo, một bộ lắng nghe khác có thể ghi log sự kiện đó vào console hoặc gửi dữ liệu đến một dịch vụ phân tích.