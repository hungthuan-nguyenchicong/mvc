##  hãy tạo một nút "Add Link"

Để thêm sự kiện chèn đường link cho văn bản, bạn sẽ cần một nút (button) trên thanh công cụ và logic JavaScript để xử lý nó. Quy trình này tương tự như việc tạo hiệu ứng **strong**, nhưng thay vì bọc văn bản trong thẻ `<strong>`, bạn sẽ bọc nó trong thẻ `<a>` với thuộc tính `href` tương ứng.

-----

### 1\. Thêm Button và Sự Kiện

Đầu tiên, hãy tạo một nút "Add Link" (hoặc biểu tượng chuỗi liên kết) trên thanh công cụ của bạn. Gắn một sự kiện `click` vào nút này để kích hoạt chức năng.

```javascript
// web-mvc/src/admin/core/wysiwyg/wysiwygLink.js

function wysiwygLink(toolbar) {
    const linkButton = document.createElement('button');
    linkButton.textContent = 'Add Link'; // Hoặc biểu tượng icon
    linkButton.addEventListener('click', () => {
        addLinkToSelection();
    });
    toolbar.appendChild(linkButton);
}
```

-----

### 2\. Xử lý logic chèn Link

Hàm `addLinkToSelection()` sẽ thực hiện logic chính. Bạn sẽ cần lấy đường link từ người dùng, ví dụ bằng cách sử dụng `prompt()`, sau đó áp dụng nó lên vùng văn bản được chọn.

```javascript
function addLinkToSelection() {
    // Lấy vùng văn bản được chọn
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
        console.error("Không có văn bản nào được chọn để thêm link.");
        return;
    }

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    // Hỏi người dùng nhập đường link
    const url = prompt("Nhập URL cho đường link:", "https://");
    if (!url || url.trim() === '') {
        return; // Hủy nếu người dùng không nhập gì
    }

    // Kiểm tra nếu vùng chọn đã có link
    let parentLink = selection.anchorNode.closest('a');
    if (parentLink) {
        // Nếu đã có, chỉ cập nhật thuộc tính href
        parentLink.href = url;
    } else {
        // Nếu chưa, tạo một thẻ <a> mới
        const newLink = document.createElement('a');
        newLink.href = url;
        newLink.textContent = selectedText;

        // Xóa văn bản cũ và chèn thẻ <a> mới
        range.deleteContents();
        range.insertNode(newLink);
        
        // Di chuyển con trỏ ra sau thẻ a
        const newRange = document.createRange();
        newRange.setStartAfter(newLink);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
    }
}
```

### Giải thích và Cải tiến

  * **`range.deleteContents()`**: Phương thức này rất hữu ích, nó sẽ xóa bất kỳ nội dung nào được người dùng bôi đen. Sau đó, chúng ta có thể chèn thẻ `<a>` mới vào đúng vị trí đó.
  * **`range.insertNode(newLink)`**: Chèn node `<a>` vào vị trí của con trỏ.
  * **Xử lý trường hợp đã có link**: Đoạn code kiểm tra `selection.anchorNode.closest('a')` giúp xác định xem con trỏ hiện tại có nằm trong một thẻ `<a>` nào đó không. Nếu có, chúng ta chỉ cần cập nhật `href` thay vì tạo một thẻ `<a>` mới, tránh việc lồng thẻ không cần thiết.

Cách tiếp cận này giúp bạn xây dựng một chức năng thêm link cơ bản nhưng hiệu quả, mang lại sự kiểm soát tốt hơn so với các phương thức cũ như `document.execCommand`.