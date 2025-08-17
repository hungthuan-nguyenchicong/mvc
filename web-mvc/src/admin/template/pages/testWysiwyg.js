// web-mvc/src/admin/template/pages/testWysiwyg.js
import { wysiwyg, logic } from "../../core/wysiwyg/wysiwyg";
function testWysiwyg() {
    const container = document.querySelector('.content');
    function index() {
        const htmlContent = wysiwyg();
        container.innerHTML = htmlContent;

        // wysiwyg logic
        logic();
    }
    return {index}
}

export {testWysiwyg}