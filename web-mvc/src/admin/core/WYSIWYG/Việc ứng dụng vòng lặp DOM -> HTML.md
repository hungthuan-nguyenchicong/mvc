## Việc ứng dụng vòng lặp DOM -> HTML

Việc ứng dụng vòng lặp **DOM -\> HTML** trong trình soạn thảo WYSIWYG là một quy trình chuẩn để đảm bảo nội dung được cập nhật và lưu trữ chính xác. Đây là cách bạn có thể triển khai từng bước trong dự án của mình:

-----

### Bước 1: Khởi tạo Trình soạn thảo (DOM)

Khi trang web tải, bạn sẽ có một vùng chỉnh sửa (ví dụ: một thẻ `<div contenteditable="true">`). Vùng này chính là **cây DOM** mà người dùng sẽ tương tác.

```html
<div id="editor" contenteditable="true">
    <p>Chào mừng đến với trình soạn thảo WYSIWYG!</p>
</div>
```

```javascript
// Khởi tạo trình soạn thảo
const editor = document.getElementById('editor');
```

Đây là trạng thái DOM ban đầu của bạn.

-----

### Bước 2: Chỉnh sửa DOM bằng JavaScript

Khi người dùng thực hiện một hành động (nhấn nút "Bold", "Thêm link", "Chèn ảnh"), code JavaScript của bạn sẽ **chỉnh sửa trực tiếp cây DOM** bên trong `#editor`.

**Ví dụ:** Khi người dùng bôi đen chữ "chào" và nhấn nút "Bold", hàm JavaScript của bạn sẽ tìm đúng node văn bản đó và bọc nó trong một thẻ `<strong>`.

```javascript
// Giả sử người dùng đã bôi đen chữ "chào"
const selection = window.getSelection();
const range = selection.getRangeAt(0);
const strongNode = document.createElement('strong');
strongNode.textContent = range.toString();

// Chỉnh sửa DOM: xóa văn bản cũ và chèn thẻ <strong> mới
range.deleteContents();
range.insertNode(strongNode);
```

Sau thao tác này, DOM của bạn sẽ thay đổi từ:

```html
<div id="editor" contenteditable="true">
    <p>Chào mừng đến với trình soạn thảo WYSIWYG!</p>
</div>
```

thành:

```html
<div id="editor" contenteditable="true">
    <p><strong>Chào</strong> mừng đến với trình soạn thảo WYSIWYG!</p>
</div>
```

Bạn không cần phải can thiệp vào chuỗi HTML, trình duyệt tự động cập nhật cấu trúc DOM cho bạn.

-----

### Bước 3: Lấy Chuỗi HTML để Lưu trữ

Khi người dùng hoàn tất việc chỉnh sửa và muốn lưu nội dung (ví dụ: nhấn nút "Save"), bạn chỉ cần lấy thuộc tính `innerHTML` của phần tử trình soạn thảo. Đây là cách dễ nhất và hiệu quả nhất để lấy toàn bộ nội dung đã được định dạng.

```javascript
const saveButton = document.getElementById('save-button');
saveButton.addEventListener('click', () => {
    // Lấy chuỗi HTML từ cây DOM đã được chỉnh sửa
    const contentToSave = editor.innerHTML;

    // Gửi dữ liệu này lên máy chủ để lưu vào cơ sở dữ liệu
    // fetch('/api/save-content', {
    //     method: 'POST',
    //     body: JSON.stringify({ content: contentToSave }),
    //     headers: { 'Content-Type': 'application/json' }
    // });
    
    console.log(contentToSave);
});
```

Trong ví dụ trên, biến `contentToSave` sẽ chứa chuỗi HTML đã được cập nhật, bao gồm cả thẻ `<strong>` bạn đã thêm.

### Tổng kết

Quá trình này tạo nên một vòng lặp liên tục và hiệu quả:

1.  **Giao diện:** Người dùng tương tác trực quan với nội dung trong vùng `contenteditable`.
2.  **Logic JavaScript:** Các sự kiện (click, keydown) kích hoạt code JavaScript để **thao tác trực tiếp trên DOM**.
3.  **Lưu trữ:** Khi cần lưu, bạn chỉ cần lấy chuỗi HTML từ DOM đã được cập nhật.

Cách tiếp cận này giúp bạn xây dựng một trình soạn thảo mạnh mẽ mà không cần phải quản lý chuỗi HTML phức tạp, vì trình duyệt sẽ xử lý phần lớn công việc đó cho bạn.