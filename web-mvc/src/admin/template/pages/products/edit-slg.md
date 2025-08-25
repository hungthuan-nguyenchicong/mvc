## Nếu bạn muốn người dùng có thể sửa đổi ô input 
`slug-input` bằng cách nhấn vào một nút, bạn cần sử dụng **JavaScript** để thêm và loại bỏ thuộc tính **`readonly`** một cách linh hoạt.

Dưới đây là cách thực hiện:

### 1\. Thêm nút "Sửa" vào HTML

Bạn thêm một nút (button) bên cạnh ô input `slug-input`. Nút này sẽ có một `id` để bạn có thể dễ dàng truy cập nó bằng JavaScript.

```html
<label for="title-input">Tiêu đề sản phẩm:</label>
<input type="text" id="title-input" placeholder="Nhập tiêu đề">

<br><br>

<label for="slug-input">Đường dẫn (Slug):</label>
<input type="text" id="slug-input" readonly>
<button id="edit-slug-btn">Sửa</button>
```

-----

### 2\. Xử lý logic bằng JavaScript

Sử dụng JavaScript, bạn sẽ thêm một sự kiện lắng nghe vào nút "Sửa". Khi nút này được nhấn, nó sẽ loại bỏ thuộc tính `readonly` khỏi ô input `slug-input`.

```javascript
// Lấy các phần tử từ HTML
const titleInput = document.getElementById('title-input');
const slugInput = document.getElementById('slug-input');
const editButton = document.getElementById('edit-slug-btn');

// Hàm tạo slug (giữ nguyên từ ví dụ trước)
function generateSlug(title) {
    const normalizedString = title.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const slug = normalizedString
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-+|-+$/g, '');
    return slug;
}

// Lắng nghe sự kiện input từ ô tiêu đề để tự động tạo slug
titleInput.addEventListener('input', function() {
    // Chỉ tự động cập nhật nếu ô slug đang ở chế độ readonly
    if (slugInput.hasAttribute('readonly')) {
        slugInput.value = generateSlug(this.value);
    }
});

// Lắng nghe sự kiện click từ nút "Sửa"
editButton.addEventListener('click', function() {
    // Loại bỏ thuộc tính readonly khỏi ô slug
    slugInput.removeAttribute('readonly');
    
    // Đổi màu nền để người dùng biết họ có thể chỉnh sửa
    slugInput.style.backgroundColor = '#fff';
    
    // Đặt con trỏ chuột vào ô slug để tiện sửa
    slugInput.focus();
    
    // Ẩn nút "Sửa" và có thể hiển thị một nút "Lưu" hoặc "Xong"
    this.style.display = 'none';
});
```

-----

### 3\. Tùy chỉnh nâng cao (Tùy chọn)

Để trải nghiệm người dùng tốt hơn, bạn có thể:

  * **Thêm nút "Lưu"**: Sau khi nhấn "Sửa", nút "Sửa" sẽ ẩn đi và một nút "Lưu" sẽ hiện ra. Khi người dùng nhấn "Lưu", bạn lại thêm thuộc tính `readonly` vào ô slug để khóa nó lại.
  * **Thêm tooltip**: Hướng dẫn người dùng rằng họ có thể sửa slug nếu cần.
  * **Đổi màu nền**: Đổi màu nền của ô input khi nó chuyển từ `readonly` sang chế độ có thể chỉnh sửa để người dùng dễ nhận biết.

Với cách tiếp cận này, bạn vẫn giữ được tính năng tự động tạo slug ban đầu nhưng đồng thời cung cấp cho người dùng khả năng tùy chỉnh khi cần thiết.