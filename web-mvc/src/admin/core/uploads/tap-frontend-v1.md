## tab fronent upload

Your new approach of having `activeTab` listen for an event is a good way to separate concerns. This allows your upload logic to just focus on uploading and then broadcast a "success" event, while your tab-switching logic just listens for events and updates the UI.

Here's how to structure your code to achieve that, with a clear separation between the upload form logic and the tab-switching logic.

-----

### 1\. `renderUploadFile.js`: The HTML Structure

Make sure your HTML has the correct `data-tab` attributes and class names. This part is already good.

```javascript
function renderUploadFile() {
    return /* html */ `
        <button type="button" class="close-btn">X</button>
        <div class="tab">
            <button class="tablinks active" data-tab="tabUpload">Upload</button>
            <button class="tablinks" data-tab="tabGallery">Gallery</button>
        </div>
        <div id="tabUpload" class="tabcontent active">
            <form id="uploadForm">
                <h3>Upload Image</h3>
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
```

-----

### 2\. `uploadFrontend.js`: The Main Logic

This is the core of your application. It will contain all event listeners.

```javascript
// web-mvc/src/admin/core/uploads/uploadFrontend.js
import './uploadFrontend.scss';

// Hàm chính để khởi tạo tất cả các listeners
function uploadFrontend() {
    const tablinks = document.querySelectorAll('.tablinks');
    const tabcontents = document.querySelectorAll('.tabcontent');
    const uploadForm = document.getElementById('uploadForm');

    // Listener cho việc chuyển tab khi click
    tablinks.forEach(tablink => {
        tablink.addEventListener('click', () => {
            const tabId = tablink.dataset.tab;
            // Gọi hàm xử lý UI trực tiếp, hoặc phát sự kiện
            // Ở đây, chúng ta sẽ gọi activeTab để chuyển tab
            const tabChangeEvent = new CustomEvent('tabChange', {
                detail: { tabId: tabId }
            });
            document.dispatchEvent(tabChangeEvent);
        });
    });

    // Listener cho form upload
    uploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Giả lập việc upload thành công sau 1 giây
        setTimeout(() => {
            console.log('Upload thành công! Chuyển sang tab Gallery.');
            // Phát sự kiện để kích hoạt activeTab
            const uploadSuccessEvent = new CustomEvent('uploadSuccess', {
                detail: { newTabId: 'tabGallery' }
            });
            document.dispatchEvent(uploadSuccessEvent);
        }, 1000);
    });

    // Lắng nghe sự kiện để thay đổi tab
    document.addEventListener('tabChange', (e) => {
        const { tabId } = e.detail;
        activeTab(tabId, tablinks, tabcontents);
    });

    // Lắng nghe sự kiện upload thành công để tự động chuyển tab
    document.addEventListener('uploadSuccess', (e) => {
        const { newTabId } = e.detail;
        activeTab(newTabId, tablinks, tabcontents);
    });
}

// Hàm activeTab giờ đây độc lập và chỉ nhận các tham số cần thiết để thay đổi UI
function activeTab(currentTabId, allTablinks, allTabcontents) {
    // Loại bỏ class 'active' khỏi tất cả các nút và nội dung
    allTablinks.forEach(link => link.classList.remove('active'));
    allTabcontents.forEach(content => content.classList.remove('active'));

    // Thêm class 'active' vào nút và nội dung tương ứng
    const newActiveTablink = document.querySelector(`.tablinks[data-tab="${currentTabId}"]`);
    if (newActiveTablink) {
        newActiveTablink.classList.add('active');
    }

    const newActiveTabcontent = document.getElementById(currentTabId);
    if (newActiveTabcontent) {
        newActiveTabcontent.classList.add('active');
    }
}

export { uploadFrontend };
```

-----

### 3\. Giải thích logic mới

1.  **Sự kiện `click` và `tabChange`**:

      * Khi người dùng click vào một tab, một sự kiện `tabChange` sẽ được phát ra.
      * Hàm `uploadFrontend` lắng nghe sự kiện này và gọi `activeTab` để cập nhật UI. Điều này giúp tách biệt việc xử lý click và việc thay đổi class.

2.  **Sự kiện `uploadSuccess`**:

      * Form upload có một event listener cho sự kiện `submit`. Khi upload thành công (ở đây là một `setTimeout` mô phỏng), nó phát ra một sự kiện tùy chỉnh khác: **`uploadSuccess`**.
      * Sự kiện này mang theo `detail` chứa `newTabId` mà bạn muốn chuyển đến (ví dụ: `tabGallery`).

3.  **Hàm `activeTab`**:

      * Hàm này không còn lắng nghe bất kỳ sự kiện nào. Nó chỉ là một hàm helper độc lập để thay đổi class `active` trên DOM.
      * Nó được gọi bởi các event listener (`tabChange` và `uploadSuccess`) với ID của tab cần được kích hoạt.

Với cấu trúc này, logic của bạn trở nên rất rõ ràng:

  * Click vào tab -\> phát sự kiện `tabChange`.
  * Upload thành công -\> phát sự kiện `uploadSuccess`.
  * Hàm `activeTab` chỉ làm một việc duy nhất là thay đổi giao diện, và nó được gọi khi các sự kiện này xảy ra.