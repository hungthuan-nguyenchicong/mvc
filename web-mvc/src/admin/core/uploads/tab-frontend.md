## tab front end

Để làm cho các tab có thể tương tác, bạn cần thêm một đoạn mã JavaScript để xử lý sự kiện click vào các nút tab và hiển thị nội dung tương ứng. Dưới đây là cách bạn có thể thực hiện điều đó:

### 1\. Cập nhật HTML

Đầu tiên, bạn cần thêm `data-tab` cho các nút tab để biết nút nào tương ứng với tab content nào, và đặt `id` cho các nút tab để dễ dàng truy cập trong JavaScript.

```html
// web-mvc/src/admin/core/uploads/renderUploadFile.js

function renderUploadFile() {
    return /* html */ `
        <button type="button" class="close-btn">X</button>
        <div class="tab">
            <button class="tablinks active" id="tablink-upload" data-tab="tabUpload">Upload</button>
            <button class="tablinks" id="tablink-gallery" data-tab="tabGallery">Gallery</button>
        </div>
        <div id="tabUpload" class="tabcontent active">
            <h3>Upload Image</h3>
            <form id="upload">
                <input type="file" name="file" accept="image/*"><br>
                <button type="submit">Upload Image</button>
            </form>
        </div>
        <div id="tabGallery" class="tabcontent">
            <h3>Gallery</h3>
            <p>Nội dung của Gallery sẽ được hiển thị ở đây.</p>
        </div>
    `;
}

export { renderUploadFile };
```

**Lưu ý:**

  * Thêm class `active` vào tab và content mặc định để tab đó được hiển thị khi vừa mở.
  * Thêm `data-tab` với giá trị là `id` của tab content tương ứng.

-----

### 2\. Thêm JavaScript để xử lý sự kiện

Bạn có thể tạo một file JavaScript mới, ví dụ như `handleTabs.js`, hoặc thêm trực tiếp vào file hiện tại để xử lý logic này.

```javascript
// Ví dụ: handleTabs.js

// Lắng nghe sự kiện khi toàn bộ DOM đã được tải
document.addEventListener('DOMContentLoaded', () => {
    // Lấy tất cả các nút tab
    const tabLinks = document.querySelectorAll('.tablinks');
    // Lấy tất cả các nội dung tab
    const tabContents = document.querySelectorAll('.tabcontent');

    // Lặp qua từng nút tab và thêm sự kiện click
    tabLinks.forEach(tabLink => {
        tabLink.addEventListener('click', () => {
            // Loại bỏ class 'active' khỏi tất cả các nút tab
            tabLinks.forEach(link => link.classList.remove('active'));
            // Loại bỏ class 'active' khỏi tất cả các nội dung tab
            tabContents.forEach(content => content.classList.remove('active'));

            // Thêm class 'active' vào nút tab vừa được click
            tabLink.classList.add('active');

            // Lấy ID của tab content tương ứng từ thuộc tính data-tab
            const tabId = tabLink.dataset.tab;
            // Tìm và thêm class 'active' vào tab content đó
            document.getElementById(tabId).classList.add('active');
        });
    });
});
```

-----

### 3\. Thêm CSS để ẩn/hiện tab

Để class `.active` có tác dụng, bạn cần thêm một chút CSS để các tab content không có class này bị ẩn đi.

```css
/* Trong file CSS của bạn */

.tabcontent {
    display: none; /* Ẩn tất cả các tab content mặc định */
}

.tabcontent.active {
    display: block; /* Hiển thị tab content có class 'active' */
}

/* Tùy chọn: Thêm style cho nút tab khi được chọn */
.tablinks.active {
    background-color: #ccc; /* Ví dụ: đổi màu nền cho nút tab đang active */
}
```

Bằng cách này, khi bạn click vào một nút tab, JavaScript sẽ xóa class `active` khỏi tất cả các tab và nội dung, sau đó thêm lại class `active` cho tab và nội dung tương ứng vừa được click, giúp chuyển đổi tab một cách mượt mà.