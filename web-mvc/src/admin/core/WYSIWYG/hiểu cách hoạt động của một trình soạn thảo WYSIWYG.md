# hiểu cách hoạt động của một trình soạn thảo WYSIWYG

Chắc chắn rồi\! Để học về Vanilla JS và hiểu cách hoạt động của một trình soạn thảo WYSIWYG, chúng ta sẽ bắt đầu bằng việc xây dựng một tính năng cơ bản nhất: **làm đậm (bold) một đoạn văn bản được chọn**.

Bạn sẽ không viết mã giống hệt NicEdit, mà là một phiên bản đơn giản hơn nhiều để hiểu các khái niệm cốt lõi.

### 1\. Chuẩn Bị HTML và CSS

Đầu tiên, bạn cần một trang HTML có một vùng soạn thảo và một nút để thực hiện hành động.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Simple WYSIWYG</title>
    <style>
        .editor-container {
            border: 1px solid #ccc;
            padding: 10px;
            width: 500px;
            margin: 20px;
        }
        .toolbar {
            margin-bottom: 10px;
        }
        .content-area {
            /* contenteditable="true" biến div thành trình soạn thảo */
            border: 1px solid #eee;
            min-height: 200px;
            padding: 10px;
        }
    </style>
</head>
<body>

    <div class="editor-container">
        <div class="toolbar">
            <button id="boldBtn">B</button>
        </div>
        <div id="content" class="content-area" contenteditable="true">
            Đây là một trình soạn thảo đơn giản. Hãy chọn một đoạn văn bản và nhấn nút "B".
        </div>
    </div>

    <script src="editor.js"></script>

</body>
</html>
```

  * **`contenteditable="true"`**: Đây là thuộc tính quan trọng nhất. Nó biến một thẻ `<div>` bình thường thành một vùng mà người dùng có thể nhập và chỉnh sửa nội dung, đồng thời cho phép hiển thị các thẻ HTML bên trong nó.

### 2\. Viết Code JavaScript (`editor.js`)

Bây giờ, chúng ta sẽ viết code để xử lý khi người dùng nhấn nút "B". Chúng ta sẽ sử dụng một API có sẵn của trình duyệt.

```javascript
// Lấy các phần tử từ HTML
const boldBtn = document.getElementById('boldBtn');

// Lắng nghe sự kiện click trên nút "B"
boldBtn.addEventListener('click', function() {
    // execCommand là một API của trình duyệt giúp thực thi các lệnh chỉnh sửa
    document.execCommand('bold', false, null);
});
```

### 3\. Cách Thức Hoạt Động

  * **`document.execCommand()`**: Đây là một API **đã cũ nhưng vẫn hoạt động** và rất dễ sử dụng cho các tác vụ đơn giản. Nó cho phép bạn thực hiện các lệnh như làm đậm, làm nghiêng, gạch chân, v.v. trên văn bản đã được chọn.
  * **Tham số**:
      * `'bold'`: Tên của lệnh bạn muốn thực thi. Các lệnh khác có thể là `'italic'`, `'underline'`, `'insertImage'`.
      * `false`: Tham số thứ hai, luôn là `false` khi sử dụng các lệnh định dạng.
      * `null`: Tham số thứ ba, thường là `null` hoặc một chuỗi (ví dụ: đường dẫn hình ảnh cho `insertImage`).

Khi bạn chọn một đoạn văn bản và nhấn nút "B", trình duyệt sẽ tự động chèn các thẻ `<b>` hoặc `<strong>` xung quanh đoạn văn bản đó. Tương tự, nếu đoạn văn bản đã được làm đậm, việc nhấn nút sẽ loại bỏ các thẻ này.

**Lưu ý quan trọng**: Mặc dù `execCommand()` rất tiện lợi, nhưng nó đã lỗi thời và không được khuyến khích sử dụng trong các dự án lớn. Các trình soạn thảo hiện đại sử dụng các API phức tạp hơn (như `Selection` API và `Range` API) để có khả năng kiểm soát tốt hơn. Tuy nhiên, để học và hiểu khái niệm cơ bản, `execCommand()` là một điểm khởi đầu tuyệt vời.