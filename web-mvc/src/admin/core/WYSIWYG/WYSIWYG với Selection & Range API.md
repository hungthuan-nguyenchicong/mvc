# WYSIWYG với Selection & Range API

Chắc chắn rồi\! Hãy thử nghiệm với một ví dụ đơn giản sử dụng **Range API** và **Selection API** trong Vanilla JS. Thay vì dùng `execCommand()`, chúng ta sẽ tự viết code để **làm đậm (bold) một đoạn văn bản được chọn**, cho phép bạn hiểu sâu hơn cách các API này hoạt động.

### 1\. Chuẩn Bị HTML

Chúng ta sẽ giữ nguyên HTML từ ví dụ trước.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>WYSIWYG với Selection & Range API</title>
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
            Đây là một trình soạn thảo đơn giản. Hãy **chọn một đoạn văn bản** và nhấn nút "B".
        </div>
    </div>

    <script src="editor_api.js"></script>

</body>
</html>
```

-----

### 2\. Viết Code JavaScript (`editor_api.js`)

Đây là phần quan trọng nhất. Chúng ta sẽ lấy vùng văn bản được chọn và bọc nó trong một thẻ `<strong>`.

```javascript
document.addEventListener('DOMContentLoaded', () => {
    const boldBtn = document.getElementById('boldBtn');
    const contentArea = document.getElementById('content');

    boldBtn.addEventListener('click', () => {
        // Lấy đối tượng Selection hiện tại của cửa sổ
        const selection = window.getSelection();

        // Kiểm tra xem có văn bản nào được chọn không
        if (selection.rangeCount > 0) {
            // Lấy đối tượng Range đầu tiên (và thường là duy nhất) từ Selection
            const range = selection.getRangeAt(0);

            // Tạo một phần tử <strong> mới
            const boldNode = document.createElement('strong');

            // Bọc nội dung đã chọn vào trong thẻ <strong> mới
            range.surroundContents(boldNode);
        }
    });

    // Ngăn nút mất focus sau khi click để con trỏ vẫn nằm trong vùng soạn thảo
    boldBtn.addEventListener('mousedown', (e) => {
        e.preventDefault();
    });
});
```

-----

### 3\. Giải thích

#### `window.getSelection()`

  * Đây là phương thức trả về đối tượng `Selection`. Đối tượng này đại diện cho **phạm vi văn bản mà người dùng đã chọn** trên trang.

#### `selection.rangeCount`

  * Một đối tượng `Selection` có thể chứa nhiều `Range` (phạm vi), nhưng trong các trình duyệt hiện đại và cho các trường hợp đơn giản, giá trị này thường là `1` nếu có văn bản được chọn. Ta dùng nó để kiểm tra xem có văn bản nào được chọn không.

#### `selection.getRangeAt(0)`

  * Lấy đối tượng `Range` đầu tiên từ `Selection`. Đối tượng `Range` là một khái niệm mạnh mẽ hơn, nó đại diện cho một **khoảng liên tục của DOM tree**. `Range` có các điểm bắt đầu và kết thúc, và nó chứa tất cả các node bên trong nó.

#### `document.createElement('strong')`

  * Tạo một phần tử HTML `<strong>` mới, nhưng nó chưa được thêm vào DOM.

#### `range.surroundContents(boldNode)`

  * Đây là phương thức cốt lõi. Nó **lấy tất cả nội dung bên trong `Range`** và **bọc (surround)** nó bằng phần tử mới mà bạn đã tạo (`boldNode`).
  * Ví dụ: Nếu bạn chọn `đoạn văn bản`, `Range` sẽ bao gồm các ký tự đó. Khi bạn gọi `surroundContents()`, `Range` đó sẽ được thay thế bằng `<strong>đoạn văn bản</strong>`.

#### `mousedown` trên nút

  * Khi bạn click vào một nút, trình duyệt sẽ tự động làm mất focus khỏi vùng `contenteditable`. Điều này sẽ làm mất Selection và bạn sẽ không thể thực hiện lệnh.
  * Bằng cách gọi `e.preventDefault()`, chúng ta ngăn chặn hành vi mặc định này, giữ cho con trỏ và vùng chọn không bị mất.

**Lưu ý:** Ví dụ này mới chỉ giải quyết trường hợp đơn giản nhất. Trong thực tế, bạn sẽ cần xử lý các tình huống phức tạp hơn như:

  * Khi người dùng chọn văn bản đã được làm đậm.
  * Khi người dùng chọn văn bản nằm một phần trong thẻ `<strong>`.
  * Khi người dùng chọn qua nhiều thẻ khác nhau.

Tuy nhiên, với ví dụ này, bạn đã hiểu được cơ chế cơ bản đằng sau `Selection` và `Range` API và tại sao chúng lại mạnh mẽ hơn `execCommand()`.