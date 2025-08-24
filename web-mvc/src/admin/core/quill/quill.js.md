# run tam ok

## // web-mvc/src/admin/core/quill/custom/CustomLink.js
import Quill from "quill";
const Link = Quill.import('formats/link');

class CustomLink extends Link {
    // This static method is called when a link is created
    static create(value) {
        let node = super.create(value);
        // This is the core logic: removing the 'target' attribute
        node.removeAttribute('target');
        return node;
    }
}
// This is the correct place to register the class with Quill.
Quill.register(CustomLink, true);

export { CustomLink };

## // web-mvc/src/admin/core/quill/custom/CustomImage.js

import Quill from "quill";
import { quill } from "../quill";
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
    //console.log(quillImageElement)

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

// function clickUseImage(quillInstance) {
//     // This event listener will be set up only once.
//     document.addEventListener('useImage', (e) => {
//         const {imageUrl, imageAlt = '', imageCaption = ''} = e.detail;
//         const range = quillInstance.getSelection();
//         // https://quilljs.com/docs/api#getselection;
//         // https://quilljs.com/docs/api#insertembed
//         const delta = quillInstance.insertEmbed(
//             range.index,
//             'image',
//             {
//                 src: imageUrl,
//                 alt: imageAlt,
//                 caption: imageCaption
//             }
//         );
//         //const range = quillInstance.getSelection();

//         // if (range) {
//         //     console.log(embed);
//         //     if (range.length === 0) {
//         //         console.log('User cursor is at index', range.index);
//         //         console.log('User cursor is at index , length', range.index, range.length);

//         //     } else {
//         //         const text = quill.getText(range.index, range.length);
//         //         console.log('User has highlighted: ', text);
//         //     }
//         // } else {
//         //     console.log('User cursor is not in editor');
//         // }

//         // if (embed) {
//         //     // https://quilljs.com/docs/api#setselection
//         //     console.log(embed.length);
//         //     const text = quillInstance.getText(embed);
//         //     console.log(text)
//         //     quillInstance.setSelection(range.index +1);
//         // }
//         //console.log(delta);
//         if (delta && delta.ops && delta.ops.length > 0) {
//             //console.log(delta.ops.insert);
//             //console.log(delta.ops.flat(Infinity));
//             //console.log(delta.ops[0].insert);
//             // The length of a block embed in Quill's internal model is 1.
//         // You can get this from the Delta.
//         const insertedLength = delta.ops[0].insert.length || 1;
//         console.log('Length of the inserted embed:', insertedLength);

//         // Set the cursor position after the new embed.
//         quillInstance.setSelection(range.index + insertedLength);
//         }
//     });

// }
function clickUseImage(quillInstance) {
    document.addEventListener('useImage', (e) => {
        const { imageUrl, imageAlt = '', imageCaption = '' } = e.detail;
        const range = quillInstance.getSelection(true);
        //console.log(range.index);
        // https://quilljs.com/docs/api#inserttext
        // if (range.index > 0) {
        //     //quillInstance.insertText(0, 'Hello');
        //     //console.log(range.getText());
        //     //quillInstance.setContents([{ insert: '\n' }]);
        //     console.log(quillInstance.getContents().ops[0].insert);
        //     //const pContent = quillInstance.getContents();
        //     const pContent = quillInstance.getContents().ops[0].insert;

        //     quillInstance.setContents([{insert: `${pContent}`}]);
        // }
        if (range) {
            // nết p có nội dung
            // if (range.index > 0) {
            //     const pContent = quillInstance.getContents().ops[0].insert;
            //     quillInstance.setContents([{insert: `${pContent}`}]);
            //     //quillInstance.setSelection(1);
            // }
            // Insert the custom image blot at the current cursor position.
            // A block embed is represented by a length of 1 in Quill's model.
            quillInstance.insertEmbed(
                range.index,
                'image', // The blotName you registered
                {
                    src: imageUrl,
                    alt: imageAlt,
                    caption: imageCaption
                },
                //Quill.sources.USER // Specify the source as a user action
            );

            // Move the cursor to the position immediately after the newly inserted embed.
            // This is done by adding 1 to the original insertion index.
            //quillInstance.setSelection(range.index + 1);
            //quillInstance.setSelection(range.index + 1);

        }
        //console.log
        if (range.index > 0) {
            console.log(range.index);
            //quillInstance.insertText(range.index + 1, '\n', Quill.sources.USER);
            quillInstance.setSelection(range.index + 2);
        } else {
            quillInstance.setSelection(range.index + 1);
        }

    });
}

Quill.register(CustomImage, true);
export { handlerImage, clickUseImage };

## // web-mvc/src/admin/core/quill/quill.js
import Quill from "quill";
//import { handlerLink } from "./handlers/handlerLink";
import "./custom/CustomLink";
//import "./custom/CustomImage";
import { handlerImage, clickUseImage } from "./custom/CustomImage";
//import { setupQuillImageManager } from "./custom/quillImageManager";
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
                    'image': handlerImage // Quan trọng: bind Quill instance vào handler
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

    // click upload
    clickUseImage(quill);
    
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
    //quill.getModule('toolbar').addHandler('image', handlerImage.bind(quill));
    //handlerImage(quill);
    //quill.getModule('toolbar').addHandler('image', handlerImage);
    // // Đăng ký blot tùy chỉnh
    // Quill.register(CustomLink, true);
    editorElement.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            e.stopPropagation();
        }
    });

    //setupQuillImageManager(quill)
}
// 6. Call the initialization function when the document is ready
//document.addEventListener('DOMContentLoaded', quillInit);
export { quill };

## // web-mvc/src/admin/core/uploads/uploadGallerySidebar.js

/**
 * Khởi tạo chức năng cho gallery sidebar.
<figure>
  <img src="pic_trulli.jpg" alt="Trulli" style="width:100%">
  <figcaption>Fig.1 - Trulli, Puglia, Italy.</figcaption>
</figure>

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
// function setupUseImageButton(imageUrl, imageAlt) {
//     const useImageBtn = document.getElementById('useImageBtn');
//     // Tìm phần tử contenteditable của trình soạn thảo
//     const contentDiv = document.getElementById('content'); 
    
//     // Tạo thẻ <img>
//     const imageTag = `<img src="${imageUrl}" alt="${imageAlt}">`;
    
//     if (useImageBtn && contentDiv) {
//         useImageBtn.addEventListener('click', () => {
//             insertHtmlAtCursor(contentDiv, imageTag);
//         });
//     } else {
//         console.error('Không tìm thấy #useImageBtn hoặc #content.');
//     }
// }

function setupUseImageButton(imageUrl, imageAlt) {
    const useImageBtn = document.getElementById('useImageBtn');
    if (useImageBtn) {
        useImageBtn.addEventListener('click', () => {
            const useImageEvent = new CustomEvent('useImage', {detail: {
                imageUrl:imageUrl, imageAlt:imageAlt
            }});
            document.dispatchEvent(useImageEvent);
            // close upload
            document.querySelector('.uploadOverlay').classList.remove('active');
        });
    }
}

/**
 * Chèn HTML vào vị trí con trỏ trong một phần tử contenteditable.
 * @param {HTMLElement} element - Phần tử contenteditable.
 * @param {string} htmlToInsert - Chuỗi HTML cần chèn.
 * thường là một thẻ <div> hoặc <iframe>
 */
// function insertHtmlAtCursor(element, htmlToInsert) {
//     element.focus();
//     const selection = window.getSelection();
//     // Đảm bảo có một vùng chọn đang hoạt động
//     if (selection && selection.rangeCount > 0) {
//         const range = selection.getRangeAt(0);
//         range.deleteContents(); // Xóa nội dung được chọn (nếu có)

//         const tempDiv = document.createElement('div');
//         tempDiv.innerHTML = htmlToInsert;
//         const fragment = document.createDocumentFragment();
//         let lastNode;
//         while (tempDiv.firstChild) {
//             lastNode = fragment.appendChild(tempDiv.firstChild);
//         }

//         range.insertNode(fragment); // Chèn fragment vào vị trí con trỏ
        
//         // Di chuyển con trỏ về sau thẻ vừa chèn
//         if (lastNode) {
//             const newRange = document.createRange();
//             newRange.setStartAfter(lastNode);
//             newRange.collapse(true);
//             selection.removeAllRanges();
//             selection.addRange(newRange);
//         }
//     }
// }

// Bỏ hàm insertLinkIntoTextarea vì nó chỉ dùng cho textarea
// và không còn phù hợp với trình soạn thảo contenteditable

export { uploadGallerySidebar };