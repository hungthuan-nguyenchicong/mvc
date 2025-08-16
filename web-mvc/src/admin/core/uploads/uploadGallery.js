// web-mvc/src/admin/core/uploads/uploadGallery.js
import './uploadGallery.scss';
import { uploadGallerySidebar } from './uploadGallerySidebar';
function uploadGallery() {
    document.addEventListener('tabUpload', (e)=> {
        const newTabId = e.detail.tabId;
        if (newTabId === 'tabGallery') {
            requestServer();
            //uploadGallerySidebar();
        }
    });
}

function renderGalleryContainer(images) {
    const galleryContainer =  document.getElementById('galleryContainer');
    if (galleryContainer) {
        // Xóa nội dung cũ trước khi render mới để tránh lặp lại ảnh
        galleryContainer.innerHTML = ''; 
        images.forEach(image => {
            const img = document.createElement('img');
            img.src = image.url;
            img.dataset.id = image.id;
            galleryContainer.appendChild(img);
        });
    }
    // Call the clickImage function AFTER the images are rendered
    uploadGallerySidebar();
}

async function requestServer() {
    try {
        const response = await fetch('/admin/api/?UploadController@index');
        const result = await response.json();
        //console.log(result);
        if (result.success) {
            renderGalleryContainer(result.images);
        }

    } catch (error) {
        console.error(error);
    }
}

export {uploadGallery}