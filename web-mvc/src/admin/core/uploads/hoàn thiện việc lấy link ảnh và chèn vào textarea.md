## hoàn thiện việc lấy link ảnh và chèn vào textarea

Để hoàn thiện việc lấy link ảnh và chèn vào textarea, bạn cần thực hiện các bước sau:

1.  Tạo một nút bấm hoặc biểu tượng "Sử dụng ảnh" trên sidebar.
2.  Thêm một sự kiện click cho nút này.
3.  Khi sự kiện click xảy ra, lấy đường dẫn ảnh từ thuộc tính `src` của thẻ `<img>` trong sidebar.
4.  Chèn đường dẫn ảnh đó vào textarea mong muốn.

Dưới đây là phiên bản code đã được hoàn chỉnh để thực hiện chức năng này.

### Cập nhật hàm `renderSidebar`

Bạn cần thêm một nút "Sử dụng ảnh" vào sidebar.

```javascript
// ... (code hiện có) ...

function renderSidebar(image) {
    const gallerySidebar = document.getElementById('gallerySidebar');
    if(gallerySidebar) {
        const html = /* html */ `
            <div class="image-preview">
                <img src="${image.url}" alt="${image.alt}">
            </div>
            <div class="image-info">
                <input type="text" name="alt" value="${image.alt}">
                <button id="useImageBtn" class="btn btn-primary">Sử dụng ảnh</button>
            </div>
        `;
        gallerySidebar.innerHTML = html;

        // Gọi hàm để xử lý sự kiện click của nút sau khi đã render
        setupUseImageButton(image.url);
    }
}
```

-----

### Thêm hàm `setupUseImageButton`

Hàm này sẽ lắng nghe sự kiện click trên nút "Sử dụng ảnh" và chèn link vào textarea.

```javascript
// ... (code hiện có) ...

function setupUseImageButton(imageUrl) {
    const useImageBtn = document.getElementById('useImageBtn');
    // Giả sử textarea của bạn có id là 'postContent'
    const postTextarea = document.getElementById('postContent'); 

    if (useImageBtn && postTextarea) {
        useImageBtn.addEventListener('click', () => {
            // Chèn URL ảnh vào textarea
            insertLinkIntoTextarea(postTextarea, imageUrl);
        });
    }
}

// Hàm này sẽ chèn link vào vị trí con trỏ hiện tại trong textarea
function insertLinkIntoTextarea(textarea, link) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;

    const newValue = value.substring(0, start) + link + value.substring(end);
    textarea.value = newValue;
    
    // Di chuyển con trỏ đến cuối link vừa chèn
    textarea.selectionStart = textarea.selectionEnd = start + link.length;
    
    // Đặt lại focus để người dùng có thể tiếp tục gõ
    textarea.focus();
}

// ... (code hiện có) ...

```

-----

### Tổng hợp và hoàn thiện `uploadGallerySidebar.js`

Đây là toàn bộ code đã được cập nhật, bao gồm các hàm mới và đã tích hợp vào luồng xử lý hiện tại của bạn.

```javascript
// web-mvc/src/admin/core/uploads/uploadGallerySidebar.js

function uploadGallerySidebar() {
    // Không cần innerHTML ở đây, clickImage sẽ được gọi từ uploadGallery
    clickImage();
}

function clickImage() {
    const galleryContainer = document.getElementById('tabGallery');
    // Vì các ảnh được render động, ta sẽ dùng event delegation
    // để tránh phải thêm lại event listener mỗi lần render
    if (galleryContainer) {
        galleryContainer.addEventListener('click', (e) => {
            // Kiểm tra xem phần tử được click có phải là ảnh không
            if (e.target.tagName === 'IMG') {
                // Xóa toàn bộ active
                const images = galleryContainer.querySelectorAll('img');
                images.forEach(imgActive => {
                    imgActive.classList.remove('active');
                });

                // Thêm active cho ảnh vừa click
                e.target.classList.add('active');

                // Gọi server để lấy thông tin chi tiết của ảnh
                const imgId = e.target.dataset.id;
                requestServer(imgId);
            }
        });
    }
}

async function requestServer(id) {
    try {
        const response = await fetch(`/admin/api/?UploadController@edit&id=${id}`);
        const result = await response.json();
        
        if (result.success) {
            // result.image là một mảng, ta lấy phần tử đầu tiên
            renderSidebar(result.image[0]);
        }
    } catch (error) {
        console.error(error);
    }
}

function renderSidebar(image) {
    const gallerySidebar = document.getElementById('gallerySidebar');
    if(gallerySidebar) {
        const html = /* html */ `
            <div class="image-preview">
                <img src="${image.url}" alt="${image.alt}">
            </div>
            <div class="image-info">
                <input type="text" name="alt" value="${image.alt}">
                <button id="useImageBtn" class="btn btn-primary">Sử dụng ảnh</button>
            </div>
        `;
        gallerySidebar.innerHTML = html;

        // Gọi hàm để thiết lập sự kiện cho nút "Sử dụng ảnh"
        setupUseImageButton(image.url);
    }
}

function setupUseImageButton(imageUrl) {
    const useImageBtn = document.getElementById('useImageBtn');
    const postTextarea = document.getElementById('postContent'); // Cập nhật ID của textarea

    if (useImageBtn && postTextarea) {
        useImageBtn.addEventListener('click', () => {
            insertLinkIntoTextarea(postTextarea, imageUrl);
        });
    }
}

function insertLinkIntoTextarea(textarea, link) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;

    const newValue = value.substring(0, start) + link + value.substring(end);
    textarea.value = newValue;
    
    textarea.selectionStart = textarea.selectionEnd = start + link.length;
    textarea.focus();
}

export { uploadGallerySidebar };
```

**Lưu ý:**

  * **Event Delegation**: Tôi đã thay đổi cách lắng nghe sự kiện click trên ảnh bằng cách sử dụng **Event Delegation**. Thay vì thêm event listener cho từng ảnh, chúng ta chỉ cần thêm một listener duy nhất vào `galleryContainer`. Điều này hiệu quả hơn nhiều, đặc biệt khi số lượng ảnh lớn và khi các ảnh được thêm vào DOM một cách động.
  * **ID của Textarea**: Hãy đảm bảo rằng `textarea` của bạn có ID là `postContent` hoặc bạn có thể thay đổi `getElementById('postContent')` cho phù hợp.