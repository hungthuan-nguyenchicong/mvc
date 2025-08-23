# hàm lấy Quillphiên bản và thiết lập trình lắng nghe

The reason you are seeing two images inserted after uploading one and then closing and reopening the modal is a common issue with **event listeners**.

Your `handlerImage` function adds an event listener to the `document.body` every time it's called.  This function is called when you click the image toolbar button.

Here's the sequence of events that leads to the problem:

1.  You click the image button for the first time.
2.  The `handlerImage` function runs.
3.  It dispatches `quillImage` to open your image picker modal.
4.  It adds a `useImage` event listener to `document.body` to wait for the image data. This listener has `{ once: true }`, so it will be removed after it fires.
5.  You upload an image. The `useImage` event fires, the image is inserted, and the listener is removed.

Now, let's look at what happens when you repeat the process without a page refresh:

1.  You click the image button for the second time.
2.  The `handlerImage` function runs again.
3.  It dispatches a **second** `quillImage` event.
4.  It adds another, **new** `useImage` event listener.
5.  You upload an image. The `useImage` event fires.
6.  The **new** listener you just added inserts the image.
7.  The modal closes, but for some reason, the original `useImage` event from the first interaction might not have been fully cleaned up, or the event is re-triggered on the second go, causing the first image to be inserted again.

The root of the issue is that the event listener isn't being properly managed or is being added multiple times. The solution is to ensure the listener is either added only once or that the previous listener is properly removed before a new one is added.

-----

### Cách khắc phục

There are two primary ways to fix this. The best approach is to pass the Quill instance directly to the handler and manage the event listener more explicitly.

#### 1\. (Recommended) Pass the Quill instance and manage the listener within your modal handler.

Instead of your `handlerImage` function doing everything, have it just fire the event. Then, your image picker modal's code should be responsible for listening for and handling the `quillImage` event. This way, the listener isn't tied to the toolbar button click.

**`CustomImage.js` (Simplified)**

```javascript
// This file only registers the custom blot and exports the handler
import Quill from "quill";
const BlockEmbed = Quill.import('blots/block/embed');

class CustomImage extends BlockEmbed {
    static blotName = 'image';
    static tagName = 'figure';

    // ... create and value methods are the same ...
    static create(value) {
        let node = super.create(value);
        const { src, alt = '', caption = '' } = value;
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.style.width = '100%';
        node.appendChild(img);
        if (caption) {
            const figcaption = document.createElement('figcaption');
            figcaption.innerText = caption;
            node.appendChild(figcaption);
        }
        return node;
    }

    static value(node) {
        const img = node.querySelector('img');
        const figcaption = node.querySelector('figcaption');
        return {
            src: img ? img.getAttribute('src') : '',
            alt: img ? img.getAttribute('alt') : '',
            caption: figcaption ? figcaption.innerText : ''
        };
    }
}

// Just a simple function to fire the event
function handlerImage() {
    const quillImageElement = new CustomEvent('quillImage');
    document.body.dispatchEvent(quillImageElement);
}

Quill.register(CustomImage, true);
export { handlerImage };
```

**`ImagePickerModal.js` (Pseudo-code)**

```javascript
import Quill from "quill";

// This is your separate modal code
document.body.addEventListener('quillImage', (e) => {
    // Show your modal
    showImageModal();
});

// A function inside your modal that inserts the image
function insertImageIntoQuill(quill, imageUrl, imageAlt, imageCaption) {
    const range = quill.getSelection(true);
    if (range) {
        quill.insertEmbed(
            range.index, 
            'image', 
            { src: imageUrl, alt: imageAlt, caption: imageCaption },
            Quill.sources.USER
        );
        quill.setSelection(range.index + 1, Quill.sources.SILENT);
    }
}
```

This approach is much cleaner because the `handlerImage` function is no longer responsible for managing the state of the event listener. The modal itself takes care of inserting the image.

#### 2\. (Simpler) Remove the listener before adding it again.

If you cannot refactor the code as shown above, a simpler fix is to remove the old listener before adding a new one.

```javascript
// Create a named function for the event listener so you can remove it.
function useImageHandler(e) {
    const quill = this.quill; // 'this' might be lost, so let's pass it
    const { imageUrl, imageAlt, imageCaption } = e.detail;
    const range = quill.getSelection(true);
    if (range) {
        quill.insertEmbed(
            range.index, 
            'image', 
            { src: imageUrl, alt: imageAlt, caption: imageCaption },
            Quill.sources.USER
        );
        quill.setSelection(range.index + 1, Quill.sources.SILENT);
    }
    // Remove the listener after it fires, or when the modal closes
    document.body.removeEventListener('useImage', useImageHandler);
}

function handlerImage() {
    const quill = this.quill;
    
    // First, remove any existing listeners to prevent duplicates
    document.removeEventListener('useImage', useImageHandler);
    
    const quillImageElement = new CustomEvent('quillImage');
    document.body.dispatchEvent(quillImageElement);

    // Now, add the new listener
    document.addEventListener('useImage', useImageHandler.bind({quill: quill}), { once: true });
}
```

This second method is more verbose and can be tricky to get right, which is why the first approach is superior. It correctly separates the concerns of the toolbar button and the image picker modal.

## ver gix

Your `uploadGallerySidebar.js` code is responsible for handling the user interface of your image gallery and should be kept separate from the Quill logic. The key to integrating the two is a shared state or communication mechanism. The current approach using `CustomEvent` is a good start. However, you need to pass the Quill instance from your main application to the gallery module so it can insert the image.

To do this, you can create a function that takes the `Quill` instance and sets up the event listener, then exports that function. This keeps your modules clean and focused on their individual responsibilities.

-----

## 1\. Tối ưu hóa file `uploadGallerySidebar.js`

File này sẽ vẫn chịu trách nhiệm về giao diện và sự kiện click, nhưng sẽ không trực tiếp thao tác với Quill. Thay vào đó, nó sẽ dispatch một `CustomEvent` chứa đầy đủ thông tin ảnh, và file khác sẽ lắng nghe sự kiện này.

```javascript
// web-mvc/src/admin/core/uploads/uploadGallerySidebar.js

/**
 * Khởi tạo chức năng cho gallery sidebar.
 */
export function uploadGallerySidebar() {
    clickImage();
}

/**
 * Xử lý sự kiện click trên các hình ảnh trong gallery.
 */
function clickImage() {
    const galleryContainer = document.getElementById('tabGallery');
    if (!galleryContainer) {
        console.error('Không tìm thấy #tabGallery. Vui lòng kiểm tra DOM.');
        return;
    }
    const images = galleryContainer.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('click', (e) => {
            // Xóa class 'active' khỏi tất cả các ảnh
            images.forEach(imgActive => {
                imgActive.classList.remove('active');
            });
            // Thêm class 'active' vào ảnh được click
            img.classList.add('active');
            // Gửi yêu cầu lên server
            const imgId = e.target.dataset.id;
            requestServer(imgId);
        });
    });
}

/**
 * Gửi yêu cầu lên server để lấy thông tin chi tiết của ảnh.
 * @param {string} id - ID của ảnh.
 */
async function requestServer(id) {
    try {
        const response = await fetch(`/admin/api/?UploadController@edit&id=${id}`);
        const result = await response.json();
        if (result.success && result.image && result.image.length > 0) {
            renderSidebar(result.image[0]);
        }
    } catch (error) {
        console.error("Lỗi khi fetch dữ liệu ảnh:", error);
    }
}

/**
 * Render sidebar với thông tin chi tiết của ảnh.
 * @param {object} image - Dữ liệu của ảnh từ server.
 */
function renderSidebar(image) {
    const gallerySidebar = document.getElementById('gallerySidebar');
    if (gallerySidebar) {
        const html = `
            <div class="image-preview">
                <img src="${image.url}" alt="${image.alt}">
            </div>
            <div class="image-info">
                <input type="text" name="alt" value="${image.alt}">
                <button id="useImageBtn">Sử dụng ảnh</button>
            </div>
        `;
        gallerySidebar.innerHTML = html;
        setupUseImageButton(image.url, image.alt);
    }
}

/**
 * Thiết lập sự kiện click cho nút "Sử dụng ảnh" và dispatch event.
 * @param {string} imageUrl - URL của ảnh.
 * @param {string} imageAlt - Thuộc tính alt của ảnh.
 * @param {string} imageCaption - Caption của ảnh
 */
function setupUseImageButton(imageUrl, imageAlt) {
    const useImageBtn = document.getElementById('useImageBtn');
    if (useImageBtn) {
        useImageBtn.addEventListener('click', () => {
            const useImageEvent = new CustomEvent('useImage', {
                detail: {
                    imageUrl: imageUrl,
                    imageAlt: imageAlt
                }
            });
            document.dispatchEvent(useImageEvent);
            // Có thể thêm đoạn code để ẩn modal tại đây
            // hideImageModal(); 
        });
    }
}
```

-----

## 2\. Tạo một file mới để quản lý logic Quill

Bạn nên tạo một file riêng, ví dụ `quillImageManager.js`, để xử lý việc lắng nghe các sự kiện và chèn ảnh vào Quill. File này sẽ chứa logic của `Quill` và kết nối nó với các sự kiện từ `uploadGallerySidebar.js`.

**Tạo file `quillImageManager.js`:**

```javascript
// web-mvc/src/admin/core/quill/quillImageManager.js

import Quill from "quill";

/**
 * Khởi tạo trình quản lý ảnh cho Quill.
 * @param {Quill} quillInstance - Đối tượng Quill đã được khởi tạo.
 */
function setupQuillImageManager(quillInstance) {
    // Lắng nghe sự kiện 'useImage' được dispatch từ gallery sidebar
    document.addEventListener('useImage', (e) => {
        const { imageUrl, imageAlt, imageCaption } = e.detail;

        const range = quillInstance.getSelection(true);
        if (range) {
            // Chèn ảnh vào trình soạn thảo bằng insertEmbed
            quillInstance.insertEmbed(
                range.index, 
                'image', // Đây phải là blotName đã đăng ký (thường là 'image' mặc định)
                {
                    src: imageUrl,
                    alt: imageAlt,
                    caption: imageCaption
                },
                Quill.sources.USER
            );

            // Di chuyển con trỏ xuống cuối hình ảnh vừa chèn
            quillInstance.setSelection(range.index + 1, Quill.sources.SILENT);
        }
    });
}

export { setupQuillImageManager };
```

-----

## 3\. Kết nối các file trong file chính (ví dụ: `main.js`)

Cuối cùng, trong file JavaScript chính của ứng dụng (nơi bạn khởi tạo Quill), bạn sẽ nhập và gọi các hàm từ cả hai file trên để kết nối chúng.

```javascript
// web-mvc/src/main.js

import Quill from "quill";
import { uploadGallerySidebar } from "./admin/core/uploads/uploadGallerySidebar.js";
import { setupQuillImageManager } from "./admin/core/quill/quillImageManager.js";
import { handlerImage } from "./admin/core/quill/custom/CustomImage.js";

// Khởi tạo Quill
const quill = new Quill('#editor', {
    // Cấu hình Quill của bạn
    modules: {
        toolbar: {
            container: [
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'align': [] }],
                ['link', 'image', 'video'], // Sử dụng handlerImage cho button 'image'
            ],
            handlers: {
                'image': handlerImage.bind(quill) // Quan trọng: bind Quill instance vào handler
            }
        }
    },
    theme: 'snow'
});

// Khởi tạo gallery sidebar
uploadGallerySidebar();

// Kết nối Quill với trình quản lý ảnh
setupQuillImageManager(quill);
```

### Tại sao cách này lại hiệu quả hơn?

  * **Tách biệt mối quan tâm (Separation of Concerns):** Mỗi module giờ đây chỉ làm một việc. `uploadGallerySidebar.js` chỉ quan tâm đến việc hiển thị ảnh và gửi dữ liệu. `quillImageManager.js` chỉ quan tâm đến việc nhận dữ liệu và chèn vào Quill.
  * **Tránh Lỗi Event Listener:** Bằng cách này, bạn chỉ cần thiết lập event listener (`setupQuillImageManager`) **một lần duy nhất** khi ứng dụng khởi động. Điều này loại bỏ hoàn toàn vấn đề listener bị thêm nhiều lần mỗi khi bạn mở modal, giải quyết triệt để lỗi chèn 2 hình ảnh.
  * **Dễ bảo trì và mở rộng:** Code trở nên rõ ràng và dễ hiểu hơn. Nếu bạn muốn thay đổi cách xử lý ảnh trong Quill, bạn chỉ cần chỉnh sửa file `quillImageManager.js` mà không ảnh hưởng đến phần gallery.