## Từ DOM sang HTML

Dạ được, việc chuyển đổi giữa DOM (Document Object Model) và HTML là hoàn toàn có thể và là một phần cốt lõi của việc phát triển web.

Dưới đây là cách bạn có thể thực hiện việc này:

-----

### Từ DOM sang HTML

Khi bạn có một cây DOM, bạn có thể dễ dàng chuyển nó thành chuỗi HTML để lưu trữ hoặc gửi lên máy chủ.

  * **Lấy HTML của toàn bộ trang:**

    ```javascript
    const fullHtml = document.documentElement.outerHTML;
    ```

    Thuộc tính `outerHTML` của `document.documentElement` sẽ trả về toàn bộ mã HTML của trang, bao gồm cả thẻ `<html>` gốc.

  * **Lấy HTML của một phần tử cụ thể:**

    ```javascript
    const myDiv = document.getElementById('my-editor');
    const innerHtml = myDiv.innerHTML; // Lấy nội dung bên trong
    const outerHtml = myDiv.outerHTML; // Lấy cả phần tử đó và nội dung bên trong
    ```

    Bạn có thể dùng `innerHTML` để lấy nội dung HTML của một phần tử hoặc `outerHTML` để lấy cả phần tử đó cùng với nội dung của nó.

Khi bạn sửa đổi cây DOM bằng JavaScript (ví dụ: thêm thẻ `<strong>`, chèn `<figure>`), các thuộc tính `innerHTML` và `outerHTML` của phần tử đó sẽ tự động được cập nhật để phản ánh những thay đổi.

-----

### Từ HTML sang DOM

Để chuyển một chuỗi HTML thành các đối tượng DOM, bạn có thể sử dụng các phương thức sau.

  * **Gắn chuỗi HTML vào một phần tử đã tồn tại:**

    ```javascript
    const myDiv = document.getElementById('my-editor');
    const newHtml = '<p>Đây là <strong>nội dung mới</strong>.</p>';
    myDiv.innerHTML = newHtml;
    ```

    Khi bạn gán một chuỗi HTML vào `innerHTML`, trình duyệt sẽ phân tích chuỗi đó và xây dựng lại cây DOM con bên trong phần tử đó.

  * **Tạo một phần tử mới từ chuỗi HTML:**

    ```javascript
    const newDiv = document.createElement('div');
    newDiv.innerHTML = '<p>Đoạn văn này được tạo từ HTML.</p>';
    // Bây giờ bạn có thể chèn newDiv vào DOM của trang
    document.body.appendChild(newDiv);
    ```

  * **Sử dụng `DOMParser` (Được khuyến khích cho các chuỗi phức tạp):**

    ```javascript
    const htmlString = '<p>Chào bạn, đây là <strong>nội dung</strong> được phân tích.</p>';
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const parsedElement = doc.body.firstChild; // Lấy thẻ p đầu tiên
    ```

    `DOMParser` là một API hiện đại và an toàn hơn, đặc biệt khi bạn cần xử lý các chuỗi HTML có thể không hợp lệ hoặc chứa mã độc. Nó phân tích chuỗi HTML thành một đối tượng `Document` mới, cho phép bạn truy cập và thao tác với các node một cách an toàn.

### Kết nối DOM và HTML trong trình soạn thảo

Trong một trình soạn thảo WYSIWYG:

1.  **Chỉnh sửa DOM**: Khi người dùng gõ hoặc nhấn các nút định dạng, bạn sẽ **thao tác trực tiếp trên cây DOM**. Ví dụ, bạn dùng `range.insertNode()` để chèn thẻ `<a>` hoặc `<span>`.
2.  **Cập nhật HTML**: Khi cần lưu trữ hoặc hiển thị nội dung, bạn sẽ lấy chuỗi HTML từ phần tử trình soạn thảo bằng cách truy cập thuộc tính `innerHTML`. Chuỗi HTML này sẽ tự động phản ánh mọi thay đổi bạn đã thực hiện trên DOM.

Quá trình này tạo nên một vòng lặp liên tục: người dùng tương tác với giao diện, code JavaScript chỉnh sửa **cây DOM**, và sau đó bạn lấy **chuỗi HTML** từ cây DOM để lưu lại.