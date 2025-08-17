// web-mvc/src/admin/template/pages/testWysiwyg.js
import { renderWysiwyg, initWysiwygLogic } from "../../core/wysiwyg/wysiwyg";
function testWysiwyg() {
    const container = document.querySelector('.content');
    function index() {
        const htmlContent = renderWysiwyg();
        container.innerHTML = htmlContent;

        // wysiwyg logic
        initWysiwygLogic();
    }
    return {index}
}

export {testWysiwyg}