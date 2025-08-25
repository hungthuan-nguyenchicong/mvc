// web-mvc/src/admin/template/pages/products/product-create.js
import { quill } from "../../../core/quill/quill";
function productCreate(container) {
    //console.log(container)
    render(container);
    quill();
    handleFormSubmit();
}

function render(container) {
    const html = /* html */ `
    <form id="create">
        <div class="formContent">
            <h2>Product Create</h2>
            <label>Title: 
                <br><input type="text" name="title">
            </label><br><br>
            <div id="quillEditor"></div>
        </div>
        <div class="formSidebar">
            <button type="submit">Create</button>
        </div>
    </form>
    `;
    container.innerHTML = html;
    //console.log(container)
}

function handleFormSubmit() {
    const form = document.getElementById('create');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        requestServer(form)
    });
}

// function quillContentHtml() {
//     const contentHtml = quill.prototype.innerHTML;
// }

async function requestServer(form) {
    try {
        const formData = new FormData(form);
        // quill
        const quillContentHtml = quill.root.innerHTML;
        console.log(quillContentHtml)
        const response = await fetch('/admin/api/?ProductController@create', {
            method: "POST",
            body: formData,
        });
        const result = await response.json();
        console.log(result)
    } catch (e) {
        console.log(e);
    }
}

export {productCreate}