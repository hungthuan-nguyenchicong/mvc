## Việc sử dụng dangerouslyPasteHTML

Đó là một hành vi được biết đến của Quill khi sử dụng `dangerouslyPasteHTML`. Quill được thiết kế để xử lý một tập hợp các thẻ HTML được hỗ trợ và sẽ **tự động loại bỏ** những thẻ mà nó không nhận dạng được, trong trường hợp này là thẻ `<figure>` và `<figcaption>`.

Quill không hiểu `<figure>` và `<figcaption>` là gì theo mặc định, do đó nó chỉ giữ lại thẻ `<img src="...">` mà nó có thể xử lý. Đây là lý do tại sao bạn thấy thẻ `<figure>` và `<figcaption>` bị xóa.

Để giải quyết vấn đề này, bạn phải tuân theo cách tiếp cận được khuyến nghị của Quill: **tạo một Blot tùy chỉnh**.

### Tại sao phải dùng Blot?

  * **Kiểm soát cấu trúc:** Blot cho phép bạn định nghĩa chính xác cấu trúc DOM mà bạn muốn chèn. Bạn đăng ký Blot với Quill, chỉ cho nó biết rằng `'figure'` là một Blot hợp lệ và cách nó nên được tạo ra từ dữ liệu của bạn.
  * **Hạn chế rủi ro:** Sử dụng `dangerouslyPasteHTML` có thể gây ra lỗi không mong muốn hoặc xung đột với cấu trúc nội bộ của Quill, đặc biệt là khi người dùng chỉnh sửa nội dung.
  * **Tương tác với API:** Khi bạn có một Blot tùy chỉnh, bạn có thể tương tác với nó bằng các API của Quill, ví dụ như để thay đổi chú thích hoặc thuộc tính của hình ảnh sau khi nó đã được chèn.

### Cách khắc phục

Bạn phải quay lại cách tiếp cận đầu tiên: tạo và đăng ký một Blot tùy chỉnh cho `<figure>`.

1.  **Định nghĩa Blot:** Tạo một file mới (ví dụ: `figure.js`) để định nghĩa Blot.

    ```javascript
    // web-mvc/src/admin/core/quill/formats/figure.js
    import Quill from 'quill';
    const BlockEmbed = Quill.import('blots/block/embed');

    class FigureBlot extends BlockEmbed {
      static blotName = 'figure';
      static tagName = 'figure';

      static create(value) {
        const node = super.create();
        node.setAttribute('contenteditable', 'false');

        const img = document.createElement('img');
        img.src = value.imageUrl;
        img.alt = value.imageAlt || '';
        img.style.width = '100%';
        node.appendChild(img);

        const figcaption = document.createElement('figcaption');
        figcaption.textContent = value.imageCaption || '';
        node.appendChild(figcaption);
        
        return node;
      }
    }

    export default FigureBlot;
    ```

2.  **Đăng ký Blot:** Import và đăng ký Blot này trong file `quillInit.js` **trước khi khởi tạo Quill**.

    ```javascript
    // web-mvc/src/admin/core/quill/quillInit.js
    import Quill from 'quill';
    import FigureBlot from "./formats/figure";

    // Đăng ký Blot tùy chỉnh
    Quill.register(FigureBlot, true);

    // ... (phần còn lại của code)
    ```

3.  **Chèn Blot:** Sửa lại hàm `imageQuill.js` để sử dụng `insertEmbed`.

    ```javascript
    // web-mvc/src/admin/core/quill/handlers/imageQuill.js
    function imageQuill() {
      const quill = this.quill;
      document.addEventListener('useImage', (e) => {
        const { imageUrl, imageAlt, imageCaption } = e.detail;
        
        const range = quill.getSelection(true);
        if (range) {
          // Sử dụng Blot đã được đăng ký
          quill.insertEmbed(range.index, 'figure', { imageUrl, imageAlt, imageCaption });
        }
      }, { once: true });
    }
    export { imageQuill };
    ```

Việc sử dụng `dangerouslyPasteHTML` chỉ nên là giải pháp tạm thời khi không có cách nào khác. Đối với trường hợp này, cách làm đúng là tạo Blot tùy chỉnh để đảm bảo Quill hiểu và quản lý cấu trúc `<figure>` một cách chính xác.