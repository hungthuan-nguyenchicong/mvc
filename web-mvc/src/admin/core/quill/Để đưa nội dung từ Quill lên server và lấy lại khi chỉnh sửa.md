## Để đưa nội dung từ Quill lên server và lấy lại khi chỉnh sửa

Để đưa nội dung từ Quill lên server và lấy lại khi chỉnh sửa, bạn cần sử dụng các phương thức có sẵn của **Quill API** để lấy nội dung, gửi nó đến server bằng **JavaScript**, và sau đó tải lại nội dung đó từ server.

-----

## 1\. Lấy Nội Dung từ Quill để Gửi lên Server

Quill cung cấp hai phương thức chính để lấy nội dung:

  * `quill.root.innerHTML`: Trả về nội dung dưới dạng **HTML**. Cách này đơn giản và dễ hiển thị trực tiếp.
  * `quill.getContents()`: Trả về nội dung dưới dạng **Delta**. Đây là một định dạng JSON độc đáo của Quill, giúp bảo toàn định dạng và cấu trúc nội dung tốt hơn so với HTML. Nó rất hữu ích cho việc lưu trữ và xử lý nội dung trên backend.

Bạn nên chọn **Delta** để lưu trữ trên database, vì nó đảm bảo tính nhất quán và dễ dàng xử lý khi cần tải lại nội dung.

## 2\. Gửi Nội Dung lên Server

Sau khi đã lấy được nội dung (dưới dạng HTML hoặc Delta), bạn có thể dùng **fetch API** hoặc **XMLHttpRequest** để gửi dữ liệu lên server. Dưới đây là ví dụ sử dụng `fetch`:

```javascript
// web-mvc/src/admin/core/quill/quill.js
// ... (code hiện tại của bạn)

// Hàm để lấy nội dung và gửi lên server
function saveQuillContent(quillInstance) {
    // Lấy nội dung dưới dạng Delta
    const delta = quillInstance.getContents();
    
    // Chuyển Delta thành chuỗi JSON
    const contentToSave = JSON.stringify(delta);

    // Sử dụng fetch để gửi dữ liệu
    fetch('/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Thêm các header khác nếu cần (ví dụ: Authorization)
        },
        body: JSON.stringify({
            title: 'Tiêu đề bài viết', // Thêm các trường dữ liệu khác
            content: contentToSave
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Nội dung đã được lưu thành công:', data);
        // Có thể hiển thị thông báo thành công cho người dùng
    })
    .catch(error => {
        console.error('Lỗi khi lưu nội dung:', error);
        // Xử lý lỗi
    });
}
```

Bạn có thể gọi hàm `saveQuillContent()` này khi người dùng nhấn nút "Lưu" hoặc "Đăng bài".

-----

## 3\. Tải và Hiển thị Nội dung khi Edit/Update

Khi người dùng quay lại trang chỉnh sửa, bạn cần lấy nội dung từ server và đưa nó vào Quill.

### a. Lấy Nội dung từ Server

Đầu tiên, bạn cần một endpoint trên server để lấy dữ liệu. Ví dụ: `GET /api/posts/123`.

### b. Đưa Nội dung vào Quill

Sau khi lấy được dữ liệu, bạn sử dụng phương thức `quill.setContents()` để tải lại nội dung.

```javascript
// web-mvc/src/admin/core/quill/quill.js
// ... (code hiện tại của bạn)

function quillInit(editorElement, initialContent) {
    const options = {
        // ... (các options của bạn)
    };
    
    const quill = new Quill(editorElement, options);

    // Kiểm tra nếu có nội dung ban đầu thì tải vào trình soạn thảo
    if (initialContent) {
        try {
            // Chuyển chuỗi JSON thành Delta object
            const delta = JSON.parse(initialContent);
            quill.setContents(delta);
        } catch (e) {
            console.error('Lỗi khi parse hoặc set nội dung Delta:', e);
            // Có thể xử lý nếu nội dung không phải là Delta hợp lệ
        }
    }

    // click upload
    clickUseImage(quill);
}

// Giả định bạn có một hàm để fetch dữ liệu từ server
function loadQuillContent(postId) {
    fetch(`/api/posts/${postId}`)
        .then(response => response.json())
        .then(data => {
            // Khởi tạo Quill với nội dung đã lấy được
            const container = document.getElementById('quill-container');
            const editor = quillRender(container);
            quillInit(editor, data.content); // `data.content` chứa nội dung Delta
        })
        .catch(error => {
            console.error('Lỗi khi tải nội dung:', error);
        });
}

// Gọi hàm này khi trang tải xong
// Ví dụ: loadQuillContent('123'); // Tải bài viết có ID là 123
```

Bạn có thể tích hợp việc lấy dữ liệu này vào hàm `quill()` hoặc gọi nó ở nơi khác sau khi DOM đã được tải hoàn chỉnh.

## 4\. Tổng kết

Để **lưu**:

1.  Lấy nội dung dưới dạng **Delta** bằng `quill.getContents()`.
2.  Gửi dữ liệu Delta này (đã chuyển thành JSON string) lên server qua một API (`POST`, `PUT`).

Để **tải lại**:

1.  Gọi API trên server để lấy nội dung bài viết.
2.  Sau khi nhận được dữ liệu, chuyển JSON string trở lại thành Delta object bằng `JSON.parse()`.
3.  Sử dụng `quill.setContents()` để nạp nội dung vào trình soạn thảo.