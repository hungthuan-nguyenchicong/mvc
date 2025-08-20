## Để tạo hiệu ứng strong (in đậm)

Để tạo hiệu ứng **strong** (in đậm) trong một đoạn văn bản (thẻ `<p>`), bạn cần xác định vùng văn bản được chọn và bọc nó trong thẻ `<strong>`. Quá trình này bao gồm các bước sau:

-----

### 1\. Bắt sự kiện click chuột

Bạn sẽ cần một button trên thanh công cụ (toolbar) để kích hoạt chức năng này. Gắn một sự kiện `click` vào button này để chạy hàm định dạng.

```javascript
// web-mvc/src/admin/core/wysiwyg/wysiwygStrong.js

function wysiwygStrong(toolbar) {
    const strongButton = document.createElement('button');
    strongButton.textContent = 'B'; // Hoặc biểu tượng icon
    strongButton.addEventListener('click', () => {
        applyStrongFormatting();
    });
    toolbar.appendChild(strongButton);
}
```

-----

### 2\. Xử lý logic định dạng

Trong hàm `applyStrongFormatting()`, bạn sẽ sử dụng `window.getSelection()` để lấy vùng văn bản được người dùng bôi đen.

**Cách 1: Sử dụng `document.execCommand` (Đơn giản, nhưng đã lỗi thời)**

Phương pháp này rất dễ sử dụng và được hỗ trợ bởi hầu hết các trình duyệt, nhưng nó đã lỗi thời và không được khuyến khích sử dụng trong các dự án mới.

```javascript
function applyStrongFormatting() {
    // Đơn giản chỉ cần gọi lệnh "bold"
    document.execCommand('bold', false, null);
}
```

**Cách 2: Xử lý thủ công với `Range` (Hiệu quả, hiện đại)**

Đây là cách tiếp cận được khuyến nghị. Nó cho phép bạn kiểm soát hoàn toàn việc định dạng và không phụ thuộc vào trình duyệt.

```javascript
function applyStrongFormatting() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
        return; // Không có vùng văn bản nào được chọn
    }

    const range = selection.getRangeAt(0);

    // Lấy nội dung đã chọn dưới dạng chuỗi HTML
    const selectedContent = range.cloneContents();
    const tempDiv = document.createElement('div');
    tempDiv.appendChild(selectedContent);
    const html = tempDiv.innerHTML;

    // Tạo thẻ strong mới và bọc nội dung vào trong
    const strongElement = document.createElement('strong');
    strongElement.innerHTML = html;

    // Xóa nội dung cũ và chèn nội dung mới
    range.deleteContents();
    range.insertNode(strongElement);

    // Di chuyển con trỏ ra sau thẻ strong vừa tạo
    const newRange = document.createRange();
    newRange.setStartAfter(strongElement);
    newRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(newRange);
}
```

-----

### 3\. Cải tiến và Xử lý nâng cao

Cách trên hoạt động tốt với các đoạn văn bản đơn giản, nhưng sẽ có vấn đề nếu vùng chọn của bạn nằm giữa nhiều thẻ HTML khác nhau hoặc một phần của văn bản đã in đậm. Bạn cần phải xử lý các trường hợp này để đảm bảo logic hoạt động chính xác:

  * **Kiểm tra xem vùng chọn có phải là `<strong>` không**: Nếu người dùng bôi đen một đoạn đã in đậm, bạn nên xóa định dạng đó thay vì thêm một thẻ `<strong>` nữa.
  * **Xử lý các vùng chọn phức tạp**: Vùng chọn có thể bắt đầu ở một thẻ và kết thúc ở một thẻ khác. Logic cần phải tách, bọc và nối lại các node một cách cẩn thận.
  * **Tránh bọc toàn bộ thẻ cha**: Ví dụ, nếu người dùng bôi đen toàn bộ nội dung của một thẻ `<p>`, bạn không nên bọc cả thẻ `<p>` vào trong `<strong>`. Thay vào đó, bạn chỉ nên bọc nội dung bên trong nó.

Đây là một ví dụ nâng cao hơn để xử lý việc "bật/tắt" định dạng `strong`:

```javascript
function toggleStrongFormatting() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    // 1. Kiểm tra nếu vùng chọn đã được bọc trong <strong>
    const isStrong = document.queryCommandState('bold');
    
    // 2. Nếu đã bọc rồi, xóa định dạng
    if (isStrong) {
        document.execCommand('removeFormat', false, 'strong');
    } 
    // 3. Nếu chưa, thêm định dạng
    else {
        // Tùy chọn 1: Dùng execCommand (đơn giản)
        // document.execCommand('bold', false, null);

        // Tùy chọn 2: Tự xử lý với DOM (chuyên nghiệp hơn)
        if (selectedText.length > 0) {
            const strongNode = document.createElement('strong');
            strongNode.appendChild(range.extractContents());
            range.insertNode(strongNode);
        }
    }
}

// Gắn sự kiện vào button trên thanh công cụ
// strongButton.addEventListener('click', toggleStrongFormatting);
```

Để đơn giản, bạn có thể bắt đầu bằng `document.execCommand` rồi dần dần thay thế bằng phương pháp tự xử lý DOM để có được sự kiểm soát tốt nhất.