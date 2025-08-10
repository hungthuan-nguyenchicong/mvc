# lấy Post id
Để truyền `posts.id` vào hàm `requestUpdateServer`, bạn có thể thực hiện một trong hai cách sau: truyền ID như một tham số trực tiếp hoặc truy xuất ID từ form sau khi nó đã được render.

-----

### Cách 1: Truyền ID trực tiếp vào hàm `requestUpdateServer`

Đây là cách đơn giản và trực tiếp nhất. Bạn có thể truyền `id` từ vòng lặp `forEach` vào hàm `requestUpdateServer`.

Trong hàm `render`, bạn sửa đổi vòng lặp và lời gọi hàm như sau:

```javascript
function render(posts) {
    const form = document.getElementById('postEdit');
    if (posts && posts.length > 0) {
        posts.forEach(post => {
            // ... (code tạo label, input, textarea, button)
            // Cần thêm một input ẩn để lưu trữ post.id
            const inputId = document.createElement('input');
            inputId.type = 'hidden';
            inputId.name = 'id';
            inputId.value = post.id;
            form.appendChild(inputId);

            // ... (các phần tử khác)
            const buttonUpdate = document.createElement('button');
            buttonUpdate.type = 'submit';
            buttonUpdate.textContent = 'Update';
            form.appendChild(buttonUpdate);
        });
        
        // Gọi hàm requestUpdateServer và truyền ID vào
        requestUpdateServer(posts[0].id); // Giả sử chỉ có một post được trả về
    } else {
        form.textContent = 'no post id';
    }
}

function requestUpdateServer(id) {
    const form = document.getElementById('postEdit');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Lấy dữ liệu từ form
        const formData = new FormData(form);

        // Thêm ID vào FormData nếu cần
        // formData.append('id', id); 
        
        console.log('Update post with ID:', id);
        // ... (gửi request fetch)
    });
}
```

**Lưu ý:** Vì vòng lặp `forEach` có thể xử lý nhiều `post`, bạn cần đảm bảo lấy đúng `id`. Trong trường hợp trang edit chỉ hiển thị một bài viết, bạn có thể truy cập `posts[0].id`.

-----

### Cách 2: Lấy ID từ một input ẩn trong form

Đây là cách phổ biến và hiệu quả hơn vì nó giữ ID liên kết với chính form đó. Bạn thêm một trường `<input type="hidden">` để lưu ID, và sau đó truy xuất nó từ form trong hàm `requestUpdateServer`.

Trong hàm `render`, bạn thêm một input ẩn:

```javascript
function render(posts) {
    const form = document.getElementById('postEdit');
    if (posts && posts.length > 0) {
        posts.forEach(post => {
            // ... (code tạo label, input, textarea)

            // Thêm một input ẩn để lưu ID
            const inputId = document.createElement('input');
            inputId.type = 'hidden';
            inputId.name = 'id'; // Quan trọng: đặt name để có thể lấy giá trị
            inputId.value = post.id;
            form.appendChild(inputId);
            
            // button
            const buttonUpdate = document.createElement('button');
            buttonUpdate.type = 'submit';
            buttonUpdate.textContent = 'Update';
            form.appendChild(buttonUpdate);
        });
        requestUpdateServer();
    } else {
        form.textContent = 'no post id';
    }
}
```

Sau đó, trong hàm `requestUpdateServer`, bạn có thể lấy ID từ chính form:

```javascript
function requestUpdateServer() {
    const form = document.getElementById('postEdit');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Lấy dữ liệu form bằng FormData
        const formData = new FormData(form);
        const postId = formData.get('id'); // Lấy giá trị của input có name="id"
        
        console.log('Update post with ID:', postId);
        
        // Tạo request fetch
        fetch('/admin/api/?PostController@update', {
            method: 'POST',
            body: formData, // Gửi toàn bộ dữ liệu form, bao gồm cả ID
        })
        .then(response => response.json())
        .then(result => {
            console.log('Success:', result);
            // Xử lý kết quả trả về
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
}
```

**Ưu điểm của Cách 2:**

  * Dữ liệu ID được gắn liền với form, giúp mã nguồn rõ ràng và dễ quản lý hơn.
  * Bạn có thể gửi toàn bộ dữ liệu của form (bao gồm ID, title, content) chỉ bằng một đối tượng `FormData` duy nhất, rất tiện lợi khi gửi request.
  * Hàm `requestUpdateServer` không cần phải nhận thêm tham số, làm cho nó tái sử dụng và tách biệt tốt hơn.