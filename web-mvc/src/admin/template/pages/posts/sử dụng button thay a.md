## Có, bạn hoàn toàn có thể dùng thẻ `<button>` để thay thế hành vi kích hoạt của thẻ `<a>` và xử lý việc chuyển hướng bằng JavaScript. Đây là một cách làm tốt và được khuyến khích trong nhiều trường hợp, đặc biệt khi bạn muốn thực hiện các hành động phức tạp hơn thay vì chỉ đơn thuần là chuyển hướng.

### Tại sao nên dùng `<button>` thay cho `<a>`?

  * **Tính ngữ nghĩa (Semantic HTML):** Thẻ `<a>` được thiết kế để tạo liên kết (link) tới một tài nguyên khác. Thẻ `<button>` được thiết kế để kích hoạt một hành động (action) trên trang web, chẳng hạn như gửi form, mở modal, hoặc trong trường hợp này là kích hoạt một logic JavaScript để điều hướng.
  * **Kiểm soát hành vi dễ hơn:** Khi dùng `<button>`, bạn có thể dễ dàng ngăn chặn hành vi mặc định (như gửi form) bằng `e.preventDefault()`, và sau đó tùy ý thực hiện các hành động khác. Với thẻ `<a>`, bạn phải ngăn chặn hành vi mặc định là chuyển hướng, điều này đôi khi có thể phức tạp hơn như bạn đã gặp phải.

### Cách sử dụng `<button>` để thay thế

Bạn có thể thay thế thẻ `<a>` bằng `<button>` và sử dụng `addEventListener` để xử lý sự kiện `click`.

**Trước khi sửa (dùng `<a>`):**

```javascript
const editLink = document.createElement('a');
editLink.href = `/admin/?p=posts&action=edit&id=${post.id}`;
editLink.textContent = 'Edit';
editLink.addEventListener('click', (event) => {
    // ... logic xác nhận
});
```

-----

**Sau khi sửa (dùng `<button>`):**

```javascript
// Tạo ô edit id
const editCell = document.createElement('td');
const editButton = document.createElement('button');
editButton.textContent = 'Edit';
// Thêm một thuộc tính data để lưu trữ id, dễ dàng truy cập sau này
editButton.dataset.postId = post.id;
editButton.classList.add('edit-post-button'); // Thêm class để dễ dàng chọn

editCell.appendChild(editButton);

// Thay vì thêm listener cho từng button, hãy dùng event delegation
tbodyElement.addEventListener('click', (event) => {
    // Kiểm tra xem phần tử được click có phải là button "Edit" không
    const targetButton = event.target.closest('.edit-post-button');
    if (targetButton) {
        // Lấy ID từ thuộc tính data
        const postId = targetButton.dataset.postId;
        
        const isConfirmed = confirm('Bạn có muốn sửa bài viết này không?');
        if (isConfirmed) {
            // Chuyển hướng thủ công sau khi xác nhận
            window.location.href = `/admin/?p=posts&action=edit&id=${postId}`;
        }
    }
});
```

Trong ví dụ trên, chúng ta đã thay thế `<a>` bằng `<button>` và dùng **event delegation** trên `<tbody>` để lắng nghe sự kiện click. Khi button được click, chúng ta xác nhận và sau đó **thực hiện chuyển hướng thủ công** bằng `window.location.href`. Cách này giúp code rõ ràng và dễ bảo trì hơn.