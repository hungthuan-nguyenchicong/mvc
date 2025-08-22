## thêm nút tùy chỉnh vào toolbar
Để thêm một nút có thuộc tính `upload` vào thanh công cụ (toolbar) của Quill và kích hoạt logic của bạn bằng `document.body.addEventListener('click', ...)`, bạn có thể làm theo các bước sau.

-----

### Cách 1: Thêm Nút Tùy Chỉnh vào Toolbar

Đây là cách trực tiếp và tốt nhất để tích hợp nút upload vào thanh công cụ của Quill.

#### 1\. Tạo một nút HTML trong Toolbar

Bạn cần thêm một nút tùy chỉnh vào mảng `container` của module `toolbar`. Bạn có thể sử dụng một biểu tượng hoặc một chữ cái. Trong ví dụ này, chúng ta sẽ sử dụng một nút với thuộc tính `upload` và thêm nó vào toolbar.

```javascript
// web-mvc/src/admin/core/quill/quillInit.js
function quillInit() {
    const options = {
        modules: {
            toolbar: {
                container: [
                    // Các nút mặc định
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'align': [] }],
                    ['clean'],
                    // Thêm nút upload tùy chỉnh
                    ['link', 'image', 'video', { 'custom-upload': '' }], // Thêm một kiểu tùy chỉnh
                ],
                // Gán handler cho nút tùy chỉnh
                handlers: {
                    'custom-upload': function() {
                        // Kích hoạt logic upload của bạn tại đây
                        uploadLogic(); 
                    }
                }
            }
        },
        placeholder: 'Compose an epic...',
        theme: 'snow'
    };
    const quill = new Quill('#editor', options);
}
```

#### 2\. Định nghĩa logic `uploadLogic()`

Quill sẽ gọi hàm `uploadLogic()` khi người dùng nhấn vào nút này. Bên trong hàm này, bạn có thể thực hiện các bước để mở hộp thoại chọn file, tải ảnh lên server, và sau đó chèn ảnh vào editor.

#### Ưu điểm:

  * **Tích hợp tốt:** Nút của bạn sẽ là một phần của toolbar Quill và tuân theo các quy tắc thiết kế của nó.
  * **Rõ ràng và có tổ chức:** Logic xử lý được đặt trực tiếp trong handler của Quill, giúp code dễ đọc và bảo trì hơn.
  * **Tương thích:** Cách tiếp cận này tuân thủ API của Quill, đảm bảo tính ổn định và tương thích trong tương lai.

-----

### Cách 2: Sử dụng `document.body.addEventListener` (Không khuyến khích)

Bạn muốn sử dụng `document.body.addEventListener` để lắng nghe sự kiện click. Cách này có thể hoạt động nhưng không phải là cách tốt nhất để tích hợp với Quill vì nó tách rời logic khỏi editor.

#### 1\. Tạo một nút HTML đặc biệt trong Toolbar

Bạn không thể thêm một nút HTML có thuộc tính tùy chỉnh trực tiếp qua mảng `container` của Quill. Thay vào đó, bạn phải sửa đổi DOM sau khi Quill được khởi tạo để thêm nút đó.

```javascript
// web-mvc/src/admin/core/quill/quillInit.js
function quillInit() {
    const options = {
        // ... (cấu hình của bạn)
        modules: {
            toolbar: [
                // ... (các nút khác)
                'image' // Để giữ nút image mặc định
            ]
        },
        // ...
    };
    const quill = new Quill('#editor', options);

    // Thêm nút upload tùy chỉnh sau khi Quill được khởi tạo
    const toolbar = document.querySelector('.ql-toolbar.ql-snow');
    const imageBtn = toolbar.querySelector('.ql-image');

    // Tạo một nút mới với thuộc tính upload
    const uploadBtn = document.createElement('button');
    uploadBtn.innerHTML = 'Upload'; // Hoặc icon
    uploadBtn.setAttribute('upload', ''); // Thêm thuộc tính upload

    // Thêm nút mới vào bên cạnh nút image
    if (imageBtn) {
        imageBtn.parentNode.insertBefore(uploadBtn, imageBtn.nextSibling);
    }
}

// web-mvc/src/admin/core/quill/quill.js
// Giữ nguyên hàm uploadBtn() của bạn
function uploadBtn() {
    document.body.addEventListener('click', (e) => {
        if (e.target.matches('button[upload]')) {
            e.preventDefault();
            // Xử lý upload ở đây
            uploadFrontend();
            uploadLogic();
        }
    });
}
```

#### Ưu điểm:

  * **Dễ thực hiện (trên giấy):** Nếu bạn đã có sẵn hàm `uploadBtn()` và muốn tận dụng lại, đây là cách nhanh chóng.

#### Nhược điểm:

  * **Không linh hoạt:** Nếu cấu trúc HTML của Quill toolbar thay đổi, code của bạn sẽ bị hỏng.
  * **Gây lỗi:** Việc thao tác trực tiếp với DOM của Quill có thể gây xung đột với các event handler nội bộ của Quill.
  * **Khó bảo trì:** Logic xử lý sự kiện nằm ở một nơi khác so với nơi nút được tạo, làm cho code khó theo dõi hơn.

-----

### Kết luận

Cách tốt nhất và được khuyến khích là sử dụng **Cách 1**, tức là thêm nút tùy chỉnh vào toolbar của Quill và gán một handler. Điều này đảm bảo sự tích hợp chặt chẽ, an toàn và dễ bảo trì với Quill API.