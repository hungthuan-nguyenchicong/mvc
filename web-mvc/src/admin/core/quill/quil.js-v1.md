# ver 1

## // web-mvc/src/admin/core/quill/custom/CustomImage.js

import Quill from "quill";
const BlockEmbed = Quill.import('blots/block/embed');

class CustomImage extends BlockEmbed {
    // Use a unique name to avoid conflicts with Quill's default image blot
    static blotName = 'image';
    static tagName = 'figure';
    //static className = 'ql-figure';

    static create(value) {
        let node = super.create(value);
        
        // Ensure the value is an object with image data
        const { src, alt = '', caption = '' } = value;

        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.style.width = '100%'; // Apply styling directly
        node.appendChild(img);

        if (caption) {
            const figcaption = document.createElement('figcaption');
            figcaption.innerText = caption;
            node.appendChild(figcaption);
        }

        return node;
    }

    // Method to parse the blot's attributes from the HTML node
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

// Handler function to be called by the toolbar button
function handlerImage() {
    // 'this' refers to the toolbar handler context, which includes the Quill instance
    //const quill = this.quill;

    // Dispatch a custom event to signal that an image picker should be shown
    const quillImageElement = new CustomEvent('quillImage');
    document.body.dispatchEvent(quillImageElement);

    // Add a one-time event listener to handle the image data
    // document.addEventListener('useImage', (e) => {
    //     const { imageUrl, imageAlt, imageCaption } = e.detail;
        
    //     const range = quill.getSelection(true);
    //     if (range && range.length >= 0) {
    //         // Use the safe and correct method to insert the custom blot
    //         quill.insertEmbed(
    //             range.index, 
    //             'image', // Use the blotName you registered
    //             {
    //                 src: imageUrl,
    //                 alt: imageAlt,
    //                 caption: imageCaption
    //             },
    //             Quill.sources.USER
    //         );

    //         // Move the cursor after the newly inserted image
    //         quill.setSelection(range.index + 1, Quill.sources.SILENT);
    //     }
    // }, { once: true });
}

Quill.register(CustomImage, true);
export { handlerImage };

## // web-mvc/src/admin/core/quill/quillImageManager.js

import Quill from "quill";

/**
 * Sets up a single, permanent listener to handle image insertion.
 * @param {Quill} quillInstance - The Quill editor instance.
 */
export function setupQuillImageManager(quillInstance) {
    // This event listener will be set up only once.
    document.addEventListener('useImage', (e) => {
        const { imageUrl, imageAlt, imageCaption } = e.detail;
        
        const range = quillInstance.getSelection(true);
        if (range && range.length >= 0) {
            quillInstance.insertEmbed(
                range.index, 
                'image', 
                {
                    src: imageUrl,
                    alt: imageAlt,
                    caption: imageCaption
                },
                Quill.sources.USER
            );
            quillInstance.setSelection(range.index + 1, Quill.sources.SILENT);
        }
    });
}

## // web-mvc/src/admin/core/quill/quill.js
import Quill from "quill";
//import { handlerLink } from "./handlers/handlerLink";
import "./custom/CustomLink";
//import "./custom/CustomImage";
import { handlerImage } from "./custom/CustomImage";
import { setupQuillImageManager } from "./custom/quillImageManager";
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
                    ['link', 'image'],
                ],
                // handlers: {
                //     link: handlerLink,
                // }
                // handlers: {
                //     image: handlerImage,
                // }
                handlers: {
                    //'image': handlerImage // Quan trọng: bind Quill instance vào handler
                    //'image': handlerImage.bind(quill)
                }
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

    // 3. Now that the `quill` instance exists, you can safely use it.
    // Set up the toolbar handler
    quill.getModule('toolbar').addHandler('image', handlerImage.bind(quill));
    
    // // Đăng ký blot tùy chỉnh
    // Quill.register(CustomLink, true);
    editorElement.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            e.stopPropagation();
        }
    });

    setupQuillImageManager(quill)
}
// 6. Call the initialization function when the document is ready
//document.addEventListener('DOMContentLoaded', quillInit);
export { quill };

## fix

