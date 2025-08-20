// web-mvc/src/admin/core/wysiwyg/wysiwyg.js

import { wysiwygKeyEnter } from "./wysiwygKeyEnter";
import { wysiwygHeadingDropdown } from "./wysiwygHeadingDropdown";
import { wysiwygUpload } from "./wysiwygUpload";
/**
 * Khởi tạo một div#wysiwyg
 * WYSIWYG - What You See Is What You Get
 */

function wysiwyg() {
    const wysiwygElement = document.getElementById('wysiwyg');
    if (wysiwygElement) {
        wysiwygElement.innerHTML = renderWysiwyg();
        initWysiwyg();
    }
}

function renderWysiwyg() {
    return /* html */ `
    <style>
        #wysiwygToolbar {
            padding: 8px;
            border: 1px solid #ccc;
            display: flex;
        }
        #wysiwygContent {
            width: 100%;
            border: 1px solid #ccc;
            padding: 5px;
            min-height: 200px;
            cursor: text;
        }
        #wysiwygContent:focus {
            outline: none;
            border-color: #007bff;
        }
        #wysiwygHiddenContent {
            display: none;
        }
    </style>
    <div id="wysiwygToolbar"></div>
    <div id="wysiwygContent" contenteditable="true"><p><br></p></div>
    <textarea name="content" id="wysiwygHiddenContent"></textarea>
    `;
}
function initWysiwyg() {
    const toolbar = document.getElementById('wysiwygToolbar');
    const content = document.getElementById('wysiwygContent');
    const textarea = document.getElementById('wysiwygHiddenContent');

    // enter make p
    wysiwygKeyEnter(content);
    // make heading
    wysiwygHeadingDropdown(toolbar, content);
    // upload image
    wysiwygUpload(toolbar);
}

export {wysiwyg}