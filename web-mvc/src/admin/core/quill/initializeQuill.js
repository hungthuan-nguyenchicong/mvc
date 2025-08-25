// web-mvc/src/admin/core/quill/initializeQuill.js

import Quill from "quill";
import { clickUseImage, handlerImage } from "./custom/CustomImage";

function initializeQuill() {
    const quillEditor = document.getElementById('quillEditor');
    if (!quillEditor) {
        console.error('Không tìm thấy phần tử #quillEditor');
        return null;
    }
    quillEditor.style.minHeight = '300px';
    quillEditor.style.height = 'fit-content';
    quillEditor.lang = 'vi';

    const options = {
        modules: {
            toolbar: {
                container: [
                    [{'header': [1, 2, 3, 4, 5, 6, false]}],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{'align': []}],
                    [{'color': []}, {'background': []}],
                    ['clean'],
                    [{'list': 'ordered'}, {'list': 'bullet'}, {'list': 'check'}],
                    ['link', 'image'],
                ],
                handlers: {
                    'image': handlerImage,
                }
            }
        },
        theme: 'snow',
        placeholder: 'Post content',
    };

    const quillInstance = new Quill(quillEditor, options);

    // Bind the Quill instance to the image handler's click event.
    // This assumes `clickUseImage` needs the Quill instance to work.

    clickUseImage(quillInstance);

    quillEditor.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            e.stopPropagation();
        }
    });

    return quillInstance;
}

export {initializeQuill};