// web-mvc/src/admin/core/uploads/uploadGallerySidebar.js

function uploadGallerySidebar() {
    //document.getElementById('gallerySidebar').innerHTML = renderSidebar();
    clickImage();
}

// function renderSidebar() {
//     return /* html */ `
//     <form id="uploadSidebar">
//         <h2>Upload Sidebar</h2>
//     </form>
//     `;
// }

function clickImage() {
    const galleryContainer = document.getElementById('tabGallery');
    const images = galleryContainer.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('click', (e) => {
            // xóa toàn bộ active
            images.forEach(imgActive => {
                imgActive.classList.remove('active');
            });
            // add Active
            img.classList.add('active');
            // reqesServer
            const imgId = e.target.dataset.id;
            //console.log(imgId);
            requestServer(imgId);
        });
    });
}
async function requestServer(id) {
    console.log(id)
    try {
        const response = await fetch(`/admin/api/?UploadController@edit&id=${id}`);
        const result = await response.json();
        //console.log(result)
        if (result.success) {
            //console.log(result)
            renderSidebar(result.image[0])
        }
    } catch (error) {
        console.error(error)
    }
}

function renderSidebar(image) {
    console.log(image)
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
        `
        gallerySidebar.innerHTML = html;
        // Gọi hàm để xử lý sự kiện click của nút sau khi đã render
        setupUseImageButton(image.url);
    }
}

function setupUseImageButton(imageUrl) {
    const useImageBtn = document.getElementById('useImageBtn');
    const postTextarea = document.getElementById('postContent');

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
export { uploadGallerySidebar }
