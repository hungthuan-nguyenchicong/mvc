## Chỉ tạo một form duy nhất

Nếu bạn click nút **upload** nhiều lần, hàm `index()` sẽ được gọi nhiều lần và tạo ra nhiều form upload.

### Nguyên nhân

Vấn đề nằm ở cách bạn thiết lập sự kiện. Cụ thể, trong hàm `uploadFile()`, bạn đã lắng nghe sự kiện `upload` một lần duy nhất:

```javascript
function uploadFile() {
  document.addEventListener('upload', ()=> {
    index(); // Dòng này chỉ được thiết lập một lần
  });
  uploadBtn();
}
```

Tuy nhiên, mỗi khi bạn click vào nút `<button upload>`, hàm `uploadBtn()` sẽ kích hoạt một sự kiện `upload` mới:

```javascript
// Bên trong uploadBtn()
btn.addEventListener('click', (e) => {
  const uploadElement = new CustomEvent('upload');
  document.dispatchEvent(uploadElement); // Dòng này chạy mỗi lần click
});
```

Điều này có nghĩa là mỗi lần bạn click, một sự kiện `upload` mới được phát đi, và trình nghe sự kiện đã được thiết lập từ trước sẽ bắt lấy sự kiện này và gọi hàm `index()`. Vì hàm `index()` luôn tạo một form mới và thêm vào `document.body`, bạn sẽ thấy nhiều form xuất hiện chồng lên nhau.

-----

### Cách khắc phục

Có hai cách để giải quyết vấn đề này, tùy thuộc vào mục đích của bạn:

1.  **Chỉ tạo một form duy nhất**: Kiểm tra xem form đã tồn tại trên trang chưa. Nếu có, chỉ cần hiển thị nó; nếu không, hãy tạo một form mới.

    ```javascript
    function index() {
      // Tìm xem đã có form upload nào tồn tại chưa
      const existingForm = document.querySelector('.upload-overlay');
      
      if (!existingForm) {
        // Nếu chưa có, tạo form mới
        const htmlContent = render();
        const uploadElement = document.createElement('div');
        uploadElement.innerHTML = htmlContent;
        document.body.appendChild(uploadElement);
      }
      
      // Hiển thị form (dù là form mới hay form đã có)
      const overlay = document.querySelector('.upload-overlay');
      if (overlay) {
        overlay.style.display = 'flex';
        // Thêm logic cho nút đóng tại đây
      }
    }
    ```

2.  **Sử dụng logic trực tiếp**: Thay vì dùng sự kiện tùy chỉnh, bạn có thể gọi hàm `index()` trực tiếp từ trong sự kiện click của nút. Cách này đơn giản và dễ kiểm soát hơn.

    ```javascript
    function uploadBtn() {
      const uploadButtons = document.querySelectorAll('button[upload]');
      uploadButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          index(); // Gọi trực tiếp hàm tạo form
        });
      });
    }

    function uploadFile() {
      // Không cần lắng nghe sự kiện 'upload' nữa
      uploadBtn();
    }
    ```

Cách thứ hai là cách đơn giản và trực quan nhất để xử lý vấn đề này, vì nó loại bỏ sự phức tạp không cần thiết của sự kiện tùy chỉnh khi bạn chỉ muốn một hành động đơn giản.