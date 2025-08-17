// web-mvc/src/admin/core/uploads/uploadGallerySidebar.js

/**
 * Khởi tạo chức năng cho gallery sidebar.
 */
function uploadGallerySidebar() {
    clickImage();
}

/**
 * Xử lý sự kiện click trên các hình ảnh trong gallery.
 */
function clickImage() {
    const galleryContainer = document.getElementById('tabGallery');
    // Kiểm tra xem phần tử có tồn tại không trước khi truy cập
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
        const html = /* html */ `
            <div class="image-preview">
                <img src="${image.url}" alt="${image.alt}">
            </div>
            <div class="image-info">
                <input type="text" name="alt" value="${image.alt}">
                <button id="useImageBtn">Sử dụng ảnh</button>
            </div>
        `;
        // Thay đổi HTML của gallerySidebar
        gallerySidebar.innerHTML = html;
        // Gọi hàm để xử lý sự kiện click của nút sau khi đã render
        setupUseImageButton(image.url, image.alt);
    }
}

/**
 * Thiết lập sự kiện click cho nút "Sử dụng ảnh".
 * @param {string} imageUrl - URL của ảnh.
 * @param {string} imageAlt - Thuộc tính alt của ảnh.
 */
function setupUseImageButton(imageUrl, imageAlt) {
    const useImageBtn = document.getElementById('useImageBtn');
    // Tìm phần tử contenteditable của trình soạn thảo
    const contentDiv = document.getElementById('content'); 
    
    // Tạo thẻ <img>
    const imageTag = `<img src="${imageUrl}" alt="${imageAlt}">`;
    
    if (useImageBtn && contentDiv) {
        useImageBtn.addEventListener('click', () => {
            insertHtmlAtCursor(contentDiv, imageTag);
        });
    } else {
        console.error('Không tìm thấy #useImageBtn hoặc #content.');
    }
}

/**
 * Chèn HTML vào vị trí con trỏ trong một phần tử contenteditable.
 * @param {HTMLElement} element - Phần tử contenteditable.
 * @param {string} htmlToInsert - Chuỗi HTML cần chèn.
 */
function insertHtmlAtCursor(element, htmlToInsert) {
    element.focus();
    const selection = window.getSelection();
    // Đảm bảo có một vùng chọn đang hoạt động
    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents(); // Xóa nội dung được chọn (nếu có)

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlToInsert;
        const fragment = document.createDocumentFragment();
        let lastNode;
        while (tempDiv.firstChild) {
            lastNode = fragment.appendChild(tempDiv.firstChild);
        }

        range.insertNode(fragment); // Chèn fragment vào vị trí con trỏ
        
        // Di chuyển con trỏ về sau thẻ vừa chèn
        if (lastNode) {
            const newRange = document.createRange();
            newRange.setStartAfter(lastNode);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
        }
    }
}

// Bỏ hàm insertLinkIntoTextarea vì nó chỉ dùng cho textarea
// và không còn phù hợp với trình soạn thảo contenteditable

export { uploadGallerySidebar };