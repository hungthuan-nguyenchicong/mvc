//import Container from "quill/blots/container";
import { linkQuill } from "./handlers/linkQuill";
import { imageQuill } from "./handlers/imageQuill";
// web-mvc/src/admin/core/quill/quillInit.js
function quillInit() {
    const options = {
    //debug: 'info',
    modules: {
        toolbar: {
            container: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['clean'],
            ['link', 'image', 'video'],
            ],
            handlers: {
                'link': linkQuill,
                //'image': imageQuill,
            }
        }
    },
    placeholder: 'Compose an epic...',
    theme: 'snow'
    };
    const quill = new Quill('#editor', options);

    // Thêm nút upload tùy chỉnh sau khi Quill được khởi tạo
    const toolbar = document.querySelector('.ql-toolbar.ql-snow');
    const imageBtn = toolbar.querySelector('.ql-image');

    // Tạo một nút mới với thuộc tính upload
    const spanElement = document.createElement('span');
    spanElement.classList.add('ql-formats');

    const uploadBtn = document.createElement('button');
    uploadBtn.innerHTML = 'Upload'; // Hoặc icon
    uploadBtn.setAttribute('upload', ''); // Thêm thuộc tính upload

    spanElement.appendChild(uploadBtn)

    // Thêm nút mới vào bên cạnh nút image
    // if (imageBtn) {
    //     //imageBtn.parentNode.insertBefore(uploadBtn, imageBtn.nextSibling);
    //     toolbar.insert(uploadBtn)
    // }
    // Thêm nút mới vào cuối cùng của toolbar
    if (toolbar) {
        toolbar.appendChild(spanElement);
    }
    // 2. Add a click event listener to your custom upload button
    uploadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Call the imageQuill handler, passing the Quill instance
        imageQuill.call({ quill: quill });
    });
    
    // Remove the old, unattached call to imageQuill()
    // imageQuill(); 
    //imageQuill();
}

export { quillInit }