// web-mvc/src/admin/core/uploads/uploadFile.js
// accept="image/*"giới hạn lựa chọn tệp chỉ có hình ảnh.
// use figure
import { renderUploadFile } from "./renderUploadFile";
import './uploadFile.scss';
import { uploadFrontend } from "./uploadFrontend";
import { uploadLogic } from "./uploadLogic";
import { uploadGallery } from "./uploadGallery";
function uploadFile() {
    //const container = document.querySelector('.content');
    // document.addEventListener('upload', ()=> {
    //     index();
    // });
    uploadBtn();
    //uploadLogic();
    uploadGallery();
    // quillImage
    quillImage();
    // featured image create form
    featuredImg();
}

function index() {
    // Tìm form upload pop-up đã có trên trang
    const uploadOverlay = document.querySelector('.uploadOverlay');
    if (!uploadOverlay) {
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
            overlay.classList.add('active');
            const closeBtn = overlay.querySelector('.close-btn');
            closeBtn.addEventListener('click', () => {
                overlay.classList.remove('active');
            })
        }
    } else {
        uploadOverlay.classList.add('active');
    }

}
// function uploadBtn() {
//     // Sử dụng bộ chọn '[upload]' để chỉ lấy các nút có thuộc tính 'upload'
//     const uploadButtons = document.querySelectorAll('button[upload]');

//     uploadButtons.forEach(btn => {
//         btn.addEventListener('click', (e)=>{
//             e.preventDefault();
//             index();
//             // upload front end

//             uploadFrontend();
//             //uploadGallery();
//             // xu ly sau khi tao form da render
//             uploadLogic();
//             // up load galerry
//             //uploadGallery();
//             //console.log(btn); // Sẽ trả về một chuỗi rỗng ("") hoặc null tùy trình duyệt
//             // const uploadElement = new CustomEvent('upload');
//             // document.dispatchEvent(uploadElement);
//         })
//     // Đoạn code này chỉ chạy với các nút có thuộc tính 'upload'
//     });
// }
function uploadBtn() {
    document.body.addEventListener('click', (e) => {
        // Kiểm tra xem phần tử được click có khớp với bộ chọn hay không
        if (e.target.matches('button[upload]')) {
            e.preventDefault();
            index();
            // Logic xử lý tải ảnh ở đây
            uploadFrontend();
            uploadLogic();
        }
    });
}

function quillImage() {
    document.body.addEventListener('quillImage', () => {
        index();
        uploadFrontend();
        uploadLogic();
    });
}

function featuredImg() {
    document.body.addEventListener('featuredImg', () => {
        //const {type} = e.detail;
        //console.log(type);
        index();
        uploadFrontend();
        uploadLogic();
    });
}


export { uploadFile }