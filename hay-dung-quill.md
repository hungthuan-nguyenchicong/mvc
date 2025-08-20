# add
bun add quill

# js

// web-mvc/src/admin/template/pages/testWysiwyg.js
import Quill from 'quill'; // 1. Import thư viện Quill.js

function testWysiwyg() {
    const container = document.querySelector('.content');

    function index() {
        // 2. Tạo cấu trúc HTML cho editor
        const htmlContent = `
            <link href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css" rel="stylesheet" />
            <div id="editor">
                <p>Hello World!</p>
                <p>Some initial <strong>bold</strong> text</p>
                <p><br /></p>
            </div>
        `;

        // Chèn HTML vào container
        container.innerHTML = htmlContent;

        // 3. Khởi tạo Quill sau khi phần tử editor đã có trong DOM
        const quill = new Quill('#editor', {
            theme: 'snow',
            modules: { toolbar: true }
        });
    }

    return { index };
}

export { testWysiwyg };