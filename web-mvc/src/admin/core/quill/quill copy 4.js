// web-mvc/src/admin/core/quill/quill.js
import Quill from "quill";
//import { handlerLink } from "./handlers/handlerLink";
import "./custom/CustomLink";
function quill(container) {
    const editor = quillRender(container);
    quillInit(editor);
    //new CustomLink(editorElement);
}

function quillRender(container) {
    const editor = document.createElement('div');
    editor.id = 'editor';
    editor.style.minHeight = '150px';
    container.appendChild(editor);
    return editor;
}
//let quillInstance = null;
function quillInit(editorElement) {
    const options = {
        modules: {
            toolbar: {
                container: [
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'align': [] }],
                    [{ 'color': [] }, { 'background': [] }],
                    ['clean'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
                    ['link'],
                ],
                // handlers: {
                //     link: handlerLink,
                // }
            },

        },
        tooltip: true,
        theme: 'snow',
        placeholder: 'Post content',
    };

    // const Link = Quill.import('formats/link');

    // class CustomLink extends Link {
    //     static create(value) {
    //         let node = super.create(value);
    //         // Loại bỏ thuộc tính rel
    //         node.removeAttribute('target');
    //         return node;
    //     }
    // }

    // // Đăng ký blot tùy chỉnh
    // Quill.register(CustomLink, true);
    //new CustomLink(editorElement);
    const quill = new Quill(editorElement, options);
    //quill.update();
    //var editor_content = quill.container.innerHTML // or quill.container.firstChild.innerHTML could also work
    // // Lắng nghe sự kiện click trên toàn bộ trình soạn thảo
    // quill.root.addEventListener('click', function(event) {
    //     // Kiểm tra xem phần tử được click có phải là một thẻ <a>
    //     // với class 'ql-action' hoặc 'ql-remove' không
    //     if (event.target.tagName.toLowerCase() === 'a' && (event.target.classList.contains('ql-action') || event.target.classList.contains('ql-remove'))) {
    //         // Chặn hành vi mặc định để ngăn tải lại trang
    //         event.preventDefault();

    //         // Tùy chỉnh hành vi của bạn tại đây
    //         // Ví dụ: đối với ql-action, bạn có thể gọi một hàm để xử lý
    //         // việc lưu hoặc cập nhật link

    //         // Nếu bạn muốn Quill xử lý tiếp, bạn có thể gọi một phương thức của Quill
    //         // (Tuy nhiên, trong trường hợp này, việc preventDefault() đã đủ để giải quyết vấn đề reload)
    //     }
    // });
    // Use a single listener on the body or a higher-level container for robustness
    // as the tooltip is outside of the quill.root element
    // document.body.addEventListener('click', function(event) {
    // const qlAction = event.target.closest('.ql-action');

    // if (qlAction) {
    //     const tooltip = qlAction.closest('.ql-tooltip');

    //     if (tooltip) {
    //         event.preventDefault();
    //         event.stopPropagation();

    //         const linkInput = tooltip.querySelector('input[type="text"]');

    //         if (linkInput) {
    //             // Lấy giá trị của input ngay tại thời điểm click
    //             const inputValue = linkInput.value;
    //             console.log('Giá trị hiện tại của input:', inputValue);

    //             // Dùng giá trị này để cập nhật link
    //             const newUrl = inputValue; 

    //             const range = quill.getSelection();
    //             if (range) {
    //                 quill.formatText(range.index, range.length, 'link', newUrl);
    //             }
    //         }
    //         tooltip.classList.remove('ql-editing');
    //     }
    // }
    //});
    // const Link = Quill.import('formats/link');

    // class CustomLink extends Link {
    //     static create(value) {
    //         let node = super.create(value);
    //         // Loại bỏ thuộc tính rel
    //         node.removeAttribute('target');
    //         return node;
    //     }
    // }

    // // Đăng ký blot tùy chỉnh
    // Quill.register(CustomLink, true);
    editorElement.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            e.stopPropagation();
        }
    });
}

export { quill };