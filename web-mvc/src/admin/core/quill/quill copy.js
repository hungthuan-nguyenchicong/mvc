// web-mvc/src/admin/core/quill/quill.js

import Quill from "quill";
import { toEditorSettings } from "typescript";


function quill(container) {
    quillRender(container);
}

function quillRender(container) {
    // cdn link
    const quillStyle = document.createElement('link');
    quillStyle.rel = 'stylesheet';
    quillStyle.href = 'https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css';
    document.head.appendChild(quillStyle);

    // cnd
    const quillScript = document.createElement('script');
    quillScript.src = 'https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.js';
    document.head.appendChild(quillScript);

    // onload
    quillScript.onload = () => {
        quillInit();
    }

    const editor = document.createElement('div');
    editor.id = 'editor';
    editor.style.minHeight = '150px';

    container.appendChild(editor);
}

function quillInit() {
    //console.log(1);
    const quill = new Quill('#editor', {
        theme: 'snow',
        placeholder: 'Post content',
    })
}

export {quill}