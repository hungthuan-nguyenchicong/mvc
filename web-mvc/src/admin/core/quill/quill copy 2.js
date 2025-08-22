// web-mvc/src/admin/core/quill/quill.js
import Quill from "quill";
//import 'quill/dist/quill.snow.css';
import { handlerLink } from "./handlers/handlerLink";
function quill(container) {
    quillRender(container);
    quillInit()
}

function quillRender(container) {
    // editor

    const editor = document.createElement('div');
    editor.id = 'editor';
    editor.style.minHeight = '150px';

    container.appendChild(editor);
}


function quillInit() {
    // option
    const options = {
        modules: {
            toolbar: {
                container: [
                    [{'header': [1, 2, 3, 4, 5, 6, false]}],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{'align':[]}],
                    [{'color':[]}, {'background':[]}],
                    ['clean'],
                    [{'list': 'ordered'}, {'list': 'bullet'}, {'list': 'check'}],
                    ['link'],
                ],
                handlers: {
                    link: handlerLink,
                }
            }
        },
        theme: 'snow',
        placeholder: 'Post content',
    }
    //console.log(1);
    const quill = new Quill('#editor', options);
}

export {quill}