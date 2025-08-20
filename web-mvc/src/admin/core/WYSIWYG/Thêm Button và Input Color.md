## Để thêm chức năng tô màu cho văn bản
Để thêm chức năng tô màu cho văn bản, bạn sẽ cần một nút trên thanh công cụ và một cách để người dùng chọn màu. Thay vì dùng `prompt` như thêm link, bạn có thể sử dụng `<input type="color">` để tạo một bảng chọn màu trực quan.

-----

### 1\. Thêm Button và Input Color

Bạn sẽ tạo một nút và một ô chọn màu (input) trên thanh công cụ.

```javascript
// web-mvc/src/admin/core/wysiwyg/wysiwygColor.js

function wysiwygColor(toolbar) {
    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = '#000000'; // Màu mặc định

    // Thêm sự kiện khi màu thay đổi
    colorInput.addEventListener('change', (e) => {
        applyTextColor(e.target.value);
    });

    // Thêm input vào toolbar
    toolbar.appendChild(colorInput);
}
```

-----

### 2\. Xử lý logic tô màu

Hàm `applyTextColor()` sẽ nhận giá trị màu và áp dụng nó lên vùng văn bản được chọn. Bạn có thể sử dụng `document.execCommand` hoặc xử lý thủ công với DOM.

#### Cách 1: Sử dụng `document.execCommand` (Đơn giản)

Phương pháp này là cách nhanh nhất để thực hiện. Nó sử dụng lệnh `foreColor` để thay đổi màu chữ.

```javascript
function applyTextColor(color) {
    // Gọi lệnh "foreColor" để thay đổi màu chữ
    document.execCommand('foreColor', false, color);
}
```

**Ưu điểm**: Rất ngắn gọn và dễ hiểu.
**Nhược điểm**: `document.execCommand` đã lỗi thời và có thể không hoạt động nhất quán trên mọi trình duyệt hoặc trong mọi trường hợp phức tạp.

#### Cách 2: Xử lý thủ công với DOM (Chuyên nghiệp)

Cách này phức tạp hơn nhưng cho bạn toàn quyền kiểm soát. Bạn sẽ bọc vùng văn bản được chọn trong một thẻ `<span>` với style `color` tương ứng.

```javascript
function applyTextColor(color) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedContent = range.extractContents();

    const span = document.createElement('span');
    span.style.color = color;
    span.appendChild(selectedContent);

    range.insertNode(span);

    // Di chuyển con trỏ ra sau thẻ span vừa tạo
    const newRange = document.createRange();
    newRange.setStartAfter(span);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);
}
```

**Ưu điểm**: Hoạt động nhất quán trên mọi trình duyệt và bạn có thể dễ dàng kiểm soát cách định dạng được áp dụng.
**Nhược điểm**: Phức tạp hơn để viết và xử lý các trường hợp đặc biệt (ví dụ: bôi đen một phần của văn bản đã được định dạng màu khác).

### Tóm tắt

Để bắt đầu, bạn nên sử dụng `document.execCommand` vì nó nhanh và hiệu quả. Khi bạn muốn một giải pháp mạnh mẽ và tùy chỉnh hơn, hãy chuyển sang xử lý DOM thủ công.