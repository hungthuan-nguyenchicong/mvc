## HTML sang DOM.

Chắc chắn rồi. Bạn hoàn toàn có thể lấy một chuỗi HTML đã có và hiển thị nó trong trình soạn thảo của bạn. Quá trình này chính là chuyển đổi từ **HTML sang DOM**.

Khi bạn tải nội dung đã lưu từ cơ sở dữ liệu lên trang web, bạn chỉ cần gán chuỗi HTML đó vào thuộc tính `innerHTML` của phần tử trình soạn thảo. Trình duyệt sẽ tự động phân tích chuỗi HTML đó và xây dựng lại cây DOM tương ứng, giúp bạn có thể tiếp tục chỉnh sửa bằng WYSIWYG.

-----

### Ví dụ về quy trình

Giả sử bạn đã lưu nội dung của trình soạn thảo vào cơ sở dữ liệu dưới dạng chuỗi HTML như sau:

```html
<p><strong>Chào</strong> mừng đến với trình soạn thảo WYSIWYG!</p><figure style="width:100%"><img src="https://via.placeholder.com/600x400" alt="Ảnh placeholder" style="width:100%"><figcaption>Fig. - Ảnh mô tả</figcaption></figure><p>Đoạn văn tiếp theo.</p>
```

Khi người dùng mở trang để chỉnh sửa nội dung này, bạn sẽ thực hiện các bước sau:

**1. Lấy chuỗi HTML từ backend:**

Bạn sẽ lấy chuỗi HTML đã lưu từ máy chủ (ví dụ: thông qua API `fetch`).

```javascript
// Giả lập chuỗi HTML được tải từ cơ sở dữ liệu
const savedHtml = '<p><strong>Chào</strong> mừng đến với trình soạn thảo WYSIWYG!</p><figure style="width:100%"><img src="https://via.placeholder.com/600x400" alt="Ảnh placeholder" style="width:100%"><figcaption>Fig. - Ảnh mô tả</figcaption></figure><p>Đoạn văn tiếp theo.</p>';
```

**2. Đưa chuỗi HTML vào trình soạn thảo:**

Bạn chỉ cần gán chuỗi `savedHtml` vào thuộc tính `innerHTML` của phần tử trình soạn thảo.

```javascript
const editor = document.getElementById('editor');

// Gán chuỗi HTML vào editor
editor.innerHTML = savedHtml;
```

**3. Kết quả:**

Sau khi gán, trình duyệt sẽ tự động phân tích chuỗi HTML và chuyển nó thành các **đối tượng DOM** bên trong phần tử `#editor`. Trình soạn thảo của bạn sẽ hiển thị nội dung y hệt như khi nó được lưu lại.

Giờ đây, bạn có thể tiếp tục tương tác với nội dung này bằng JavaScript như bình thường. Ví dụ:

  - Con trỏ có thể di chuyển vào trong `<p>` hoặc `<figcaption>`.
  - Bạn có thể bôi đen chữ **Chào** và nhấn nút "Bold" để xóa định dạng.
  - Bạn có thể nhấn Enter sau `<figure>` để tạo một đoạn `<p>` mới.

Tóm lại, **bạn không cần phải tự mình chuyển đổi thủ công**. Trình duyệt làm tất cả công việc đó cho bạn khi bạn sử dụng thuộc tính `innerHTML`. Đây là một trong những cơ chế mạnh mẽ nhất của web cho phép các trình soạn thảo WYSIWYG hoạt động hiệu quả.