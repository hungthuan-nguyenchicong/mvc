## Gửi Dữ liệu (Create/Update) với FormData

Để lấy nội dung từ Quill và gửi lên server bằng **FormData** cùng với các dữ liệu khác, bạn cần kết hợp việc lấy nội dung (HTML hoặc Delta) từ Quill vào đối tượng **FormData** trước khi gửi đi. Khi lấy lại, quy trình không thay đổi.

### 1\. Gửi Dữ liệu (Create/Update) với FormData

Khi bạn sử dụng **FormData**, tất cả dữ liệu (bao gồm cả nội dung Quill) được đóng gói thành một đối tượng duy nhất, giúp việc gửi dữ liệu lên server dễ dàng, đặc biệt là khi có tệp tin (ví dụ: hình ảnh).

Dưới đây là cách bạn có thể lấy nội dung **HTML** hoặc **Delta** và thêm vào FormData:

```javascript
// Giả định bạn có một form và một nút submit
const form = document.querySelector('form');
const quillEditor = document.getElementById('editor');

// Tạo một instance Quill
const quill = new Quill(quillEditor, {
    theme: 'snow'
    // ... các options khác
});

form.addEventListener('submit', function(event) {
    event.preventDefault(); // Ngăn form submit theo cách truyền thống

    // Tạo đối tượng FormData
    const formData = new FormData(this);

    // Lấy nội dung từ Quill và thêm vào FormData
    // Nên lấy Delta để lưu trữ trên database, nhưng HTML cũng có thể được dùng tùy mục đích
    const contentDelta = JSON.stringify(quill.getContents());
    const contentHtml = quill.root.innerHTML;

    // Thêm nội dung Quill vào FormData
    formData.append('content_delta', contentDelta);
    formData.append('content_html', contentHtml);

    // Gửi dữ liệu bằng fetch API
    fetch('/api/posts', {
        method: 'POST',
        body: formData, // FormData sẽ tự động thiết lập Content-Type là multipart/form-data
    })
    .then(response => response.json())
    .then(data => {
        console.log('Bài viết đã được lưu thành công:', data);
    })
    .catch(error => {
        console.error('Lỗi khi lưu bài viết:', error);
    });
});
```

-----

### 2\. Tải và Chỉnh sửa Dữ liệu (Get/Edit)

Quy trình này không thay đổi, vì **FormData** chỉ liên quan đến cách bạn gửi dữ liệu đi. Khi bạn muốn chỉnh sửa, bạn vẫn lấy dữ liệu từ server (thường là qua phương thức **GET**), sau đó sử dụng Quill API để hiển thị lại nội dung.

```javascript
// Hàm để tải dữ liệu bài viết từ server
function loadPostForEditing(postId) {
    fetch(`/api/posts/${postId}`)
        .then(response => response.json())
        .then(data => {
            // Giả định data.content_delta là nội dung Delta đã lưu trên server
            const contentDelta = data.content_delta;
            
            // Khởi tạo Quill (nếu chưa có)
            const quillEditor = document.getElementById('editor');
            const quill = new Quill(quillEditor, {
                theme: 'snow'
                // ...
            });

            // Tải nội dung vào Quill
            if (contentDelta) {
                try {
                    const delta = JSON.parse(contentDelta);
                    quill.setContents(delta);
                } catch (e) {
                    console.error('Lỗi khi tải nội dung Delta:', e);
                }
            }

            // Đồng thời điền các dữ liệu khác vào form
            document.getElementById('post-title').value = data.title;
            // ... điền các trường khác tương ứng
        })
        .catch(error => {
            console.error('Lỗi khi tải bài viết:', error);
        });
}

// Gọi hàm khi trang edit được tải
// Ví dụ: loadPostForEditing('123'); // Tải bài viết có ID là 123
```

**Tóm lại**, việc sử dụng **FormData** chỉ thay đổi cách bạn gói dữ liệu trước khi gửi đi. Cách bạn lấy nội dung từ Quill (`getContents()`, `root.innerHTML`) và cách bạn nạp lại nội dung (`setContents()`) vẫn không thay đổi.

## content_html

Đúng vậy, bạn hoàn toàn có thể chỉ lưu và sử dụng **`content_html`** duy nhất. Đây là cách tiếp cận đơn giản hơn và thường được dùng cho các hệ thống không yêu cầu chức năng chỉnh sửa nội dung quá phức tạp.

Tuy nhiên, có một lưu ý quan trọng: **Quill không thể `setContents` trực tiếp từ một chuỗi HTML**. Phương thức `setContents` của Quill chỉ chấp nhận định dạng **Delta**.

Vậy, để giải quyết vấn đề này, bạn sẽ làm như sau:

1.  **Lưu vào CSDL**: Khi người dùng lưu bài viết, bạn lấy nội dung **HTML** từ Quill (sử dụng `quill.root.innerHTML`) và lưu vào CSDL PostgreSQL trong một cột có kiểu dữ liệu **`TEXT`**.

2.  **Lấy ra và Hiển thị (Phía Client)**: Khi người dùng xem bài viết, bạn lấy chuỗi HTML từ CSDL và đưa thẳng vào một thẻ `<div>` trên trang, không cần dùng đến Quill.

3.  **Lấy ra và Chỉnh sửa (Phía Admin)**: Đây là bước quan trọng nhất. Vì Quill không chấp nhận HTML trực tiếp, bạn phải sử dụng một giải pháp để chuyển đổi HTML sang Delta. May mắn thay, Quill có một cơ chế tích hợp để làm điều này. Bạn sẽ sử dụng phương thức **`quill.clipboard.dangerouslyPasteHTML()`**.

### Cách `dangerouslyPasteHTML` hoạt động

Phương thức này cho phép bạn chèn một chuỗi HTML vào trình soạn thảo Quill tại một vị trí xác định. Khi bạn chèn ở vị trí 0 (đầu văn bản), nó sẽ phân tích toàn bộ chuỗi HTML đó và chuyển đổi thành định dạng Delta để Quill có thể quản lý.

Đây là cách bạn sẽ thực hiện trong code:

```javascript
// web-mvc/src/admin/core/quill/quill.js

function quillInit(editorElement, initialHtmlContent) {
    const options = {
        // ... (các options của bạn)
    };
    
    const quill = new Quill(editorElement, options);

    // Nếu có nội dung HTML ban đầu, nạp vào Quill
    if (initialHtmlContent) {
        // Sử dụng dangerouslyPasteHTML để nạp nội dung HTML vào Quill
        // Tham số đầu tiên là vị trí (0: chèn vào đầu)
        // Tham số thứ hai là chuỗi HTML
        quill.clipboard.dangerouslyPasteHTML(0, initialHtmlContent);
    }
    
    // ... (các code khác của bạn)
}

// Giả định bạn có hàm để fetch nội dung HTML từ server
function loadQuillContentFromHtml(postId) {
    fetch(`/api/posts/${postId}`)
        .then(response => response.json())
        .then(data => {
            // Giả định data.content_html là nội dung HTML đã lưu trên server
            const htmlContent = data.content_html;
            
            const container = document.getElementById('quill-container');
            const editor = quillRender(container);
            
            // Gọi quillInit để khởi tạo Quill với nội dung HTML
            quillInit(editor, htmlContent); 
        })
        .catch(error => {
            console.error('Lỗi khi tải nội dung:', error);
        });
}
```

### Ưu và Nhược điểm

| Cách tiếp cận | Ưu điểm | Nhược điểm |
| :--- | :--- | :--- |
| **Chỉ dùng HTML** | Đơn giản, dễ triển khai, không cần lưu trữ nhiều cột, phù hợp cho các dự án nhỏ. | Có thể mất một số định dạng hoặc thuộc tính phức tạp của Quill khi chuyển đổi từ HTML sang Delta, hiệu suất thấp hơn khi xử lý nội dung lớn. |
| **Kết hợp HTML + Delta** | Đảm bảo tính toàn vẹn của nội dung, hiệu suất cao hơn khi chỉnh sửa, linh hoạt cho cả backend và frontend. | Yêu cầu lưu trữ nhiều hơn (hai cột trong CSDL), phức tạp hơn một chút trong quá trình triển khai ban đầu. |

Tóm lại, nếu bạn muốn một giải pháp đơn giản, hãy lưu **`content_html`** và dùng **`quill.clipboard.dangerouslyPasteHTML()`** khi cần chỉnh sửa. Nếu dự án của bạn lớn hơn và đòi hỏi tính nhất quán cao, việc lưu cả Delta và HTML vẫn là lựa chọn tối ưu.

## fix

Có, bạn có thể tương tác qua lại giữa một `div` hiển thị nội dung Quill và một `textarea` ẩn để đồng bộ hóa và gửi dữ liệu. Đây là một phương pháp phổ biến để đảm bảo dữ liệu luôn sẵn sàng trong một trường form truyền thống.

-----

### Cách đồng bộ hóa và tương tác

Để làm được điều này, bạn sẽ sử dụng các sự kiện của Quill để cập nhật nội dung của `textarea` bất cứ khi nào nội dung của trình soạn thảo thay đổi. Khi gửi form, dữ liệu từ `textarea` sẽ được gửi đi như một trường form thông thường.

Dưới đây là các bước thực hiện:

#### 1\. Thiết lập HTML

Bạn cần một `div` để Quill render nội dung và một `textarea` ẩn để lưu trữ nội dung HTML.

```html
<form id="postForm">
    <input type="text" name="postTitle" placeholder="Tiêu đề bài viết">
    <div id="editor" style="min-height: 200px;"></div>
    <textarea id="hiddenContent" name="postContent" style="display: none;"></textarea>
    <button type="submit">Lưu bài viết</button>
</form>
```

-----

#### 2\. Đồng bộ nội dung với JavaScript

Bạn sẽ sử dụng sự kiện **`text-change`** của Quill. Sự kiện này được kích hoạt mỗi khi có bất kỳ thay đổi nào trong nội dung của trình soạn thảo.

```javascript
// web-mvc/src/admin/core/quill/quill.js
import Quill from "quill";

function quill(container) {
    const editor = quillRender(container);
    quillInit(editor);
}

function quillRender(container) {
    const editor = document.createElement('div');
    editor.id = 'editor';
    editor.style.minHeight = '150px';
    container.appendChild(editor);
    return editor;
}

function quillInit(editorElement) {
    const options = {
        // ... (các options của bạn)
    };
    
    const quill = new Quill(editorElement, options);
    
    const hiddenTextarea = document.getElementById('hiddenContent');

    // Lắng nghe sự kiện 'text-change' từ Quill
    quill.on('text-change', () => {
        // Cập nhật giá trị của textarea mỗi khi nội dung thay đổi
        // Sử dụng quill.root.innerHTML để lấy nội dung HTML
        hiddenTextarea.value = quill.root.innerHTML;
    });

    // Xử lý khi form được submit
    const form = document.getElementById('postForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            // Đảm bảo textarea đã được cập nhật trước khi submit
            hiddenTextarea.value = quill.root.innerHTML;
            // Form sẽ tự động gửi dữ liệu từ textarea
        });
    }

    // Các thiết lập khác của bạn
    // clickUseImage(quill);
    // ...
}

export { quill };
```

-----

#### 3\. Tải và chỉnh sửa (Get/Edit)

Khi muốn chỉnh sửa, bạn sẽ lấy nội dung **HTML** từ CSDL (như đã thảo luận trước đó) và đưa vào cả `div` và `textarea` trước khi khởi tạo Quill.

```javascript
// Hàm để tải dữ liệu và khởi tạo Quill
function loadPostForEditing(postId) {
    fetch(`/api/posts/${postId}`)
        .then(response => response.json())
        .then(data => {
            const htmlContent = data.content_html;
            
            // Tìm editor element đã có sẵn trên trang
            const editorElement = document.getElementById('editor');
            const hiddenTextarea = document.getElementById('hiddenContent');

            // Cập nhật cả div hiển thị và textarea ẩn
            if (editorElement) {
                editorElement.innerHTML = htmlContent;
            }
            if (hiddenTextarea) {
                hiddenTextarea.value = htmlContent;
            }
            
            // Khởi tạo Quill ngay sau khi nội dung đã được nạp
            // Quill sẽ tự động "nhận" nội dung từ editorElement
            quillInit(editorElement);
        })
        .catch(error => {
            console.error('Lỗi khi tải nội dung:', error);
        });
}
```

### Ưu và Nhược điểm của phương pháp này

  * **Ưu điểm**:

      * **Tương thích form**: Dễ dàng tích hợp vào các form HTML truyền thống, sử dụng cách submit form mặc định hoặc FormData mà không cần xử lý riêng biệt nội dung Quill.
      * **Fallback**: Nếu JavaScript bị lỗi hoặc tắt, `textarea` vẫn có nội dung thô (HTML) có thể được gửi lên.
      * **Đơn giản hóa việc gửi**: Giảm bớt các bước xử lý riêng biệt cho nội dung Quill khi gửi form.

  * **Nhược điểm**:

      * **Nội dung lớn**: Đối với nội dung rất lớn, việc cập nhật `textarea` có thể gây một chút độ trễ hoặc ảnh hưởng đến hiệu suất, mặc dù trong hầu hết các trường hợp, điều này không đáng kể.
      * **Lỗi HTML**: Nếu nội dung HTML bị sai cú pháp, Quill có thể không phân tích đúng, dẫn đến mất định dạng khi chỉnh sửa.

Phương pháp này là một giải pháp rất hiệu quả và đáng tin cậy để làm việc với Quill và các form truyền thống.