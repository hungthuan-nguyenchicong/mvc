// web-mvc/src/admin/core/uploads/uploadFile.js
// accept="image/*"giới hạn lựa chọn tệp chỉ có hình ảnh.
import { renderUploadFile } from "./renderUploadFile";
import './uploadFile.scss';
function uploadFile() {
    //const container = document.querySelector('.content');
    document.addEventListener('upload', ()=> {
        index();
    });
    uploadBtn();
}

function index() {
    // tạo form
    //const htmlContent = renderUploadFile();
    const uploadElement = document.createElement('div');
    uploadElement.classList.add('uploadOverlay');
    //uploadElement.innerHTML = htmlContent;
    uploadElement.innerHTML = renderUploadFile();
    document.body.appendChild(uploadElement);

    // hien thi form
    const overlay = document.querySelector('.uploadOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
    }

}
function uploadBtn() {
    // Sử dụng bộ chọn '[upload]' để chỉ lấy các nút có thuộc tính 'upload'
    const uploadButtons = document.querySelectorAll('button[upload]');

    uploadButtons.forEach(btn => {
        btn.addEventListener('click', (e)=>{
            //console.log(btn); // Sẽ trả về một chuỗi rỗng ("") hoặc null tùy trình duyệt
            const uploadElement = new CustomEvent('upload');
            document.dispatchEvent(uploadElement);
        })
    // Đoạn code này chỉ chạy với các nút có thuộc tính 'upload'
    });
}


export {uploadFile}