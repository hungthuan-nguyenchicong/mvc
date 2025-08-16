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
    if(gallerySidebar) {
        const html = /* html */ `
        <img src="${image.url}" alt="${image.alt}">
        <input type="text" name="alt" value="${image.alt}">
        `
        gallerySidebar.innerHTML = html;
    }
}
export {uploadGallerySidebar}