// web-mvc/src/admin/template/pages/testquillWysiwyg.js
import { quill } from "../../core/quill/quill";
function testquillWysiwyg() {
    const container = document.querySelector('.content');
    function index() {
        quill(container)
        // const htmlContent = /* html */ `
        // <h2>testquillWysiwyg Page</h2>
        // `;
        // container.innerHTML = htmlContent;
    }
    return {index}
}

export {testquillWysiwyg}