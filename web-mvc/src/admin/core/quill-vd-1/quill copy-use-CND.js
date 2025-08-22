// web-mvc/src/admin/core/quill/quill.js
// bun add quill
//import Quill from "quill";
//import 'quill/dist/quill.snow.css';
// <link href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css" rel="stylesheet" />
// <script src="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js"></script>

function quill(container) {
    renderQuill(container);
    //logicQuill();
    //console.log(container)
}

function renderQuill(container) {
    const quillStyle = document.createElement('style');
    quillStyle.href = 'https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css';
    document.head.appendChild(quillStyle);

    const quillScript = document.createElement('script');
    quillScript.src = 'https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js';
    //document.head.appendChild(quillScript);

    // Gắn sự kiện onload vào thẻ script
    quillScript.onload = () => {
        // Chỉ gọi logicQuill() sau khi Quill.js đã được tải xong
        logicQuill();
    };

    // 4. Gắn sự kiện onload vào thẻ script
    // Chỉ gọi logic để khởi tạo Quill sau khi script đã tải xong
    // quillScript.onload = () => {
    //     const quillInstance = new Quill('#editer', {
    //         theme: 'snow',
    //     });
    //     console.log("Quill đã được khởi tạo thành công!");
    // };
    // 5. Thêm thẻ script vào <head> để bắt đầu tải
    document.head.appendChild(quillScript);

    
    const editer = document.createElement('div');
    editer.id = 'editer';
    editer.style.minHeight = '200px';

    //editer.appendChild(quillStyle);
    //editer.appendChild(quillScript);
    container.appendChild(editer);
}

function logicQuill() {
    const quill = new Quill('#editer', {
        theme: 'snow',
    });
}

export {quill}