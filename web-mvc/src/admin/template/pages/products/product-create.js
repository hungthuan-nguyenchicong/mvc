// web-mvc/src/admin/template/pages/products/product-create.js
import { initializeQuill } from "../../../core/quill/initializeQuill";
let quillInstance; // Biến toàn cục để lưu trữ đối tượng

function productCreate(container) {
    render(container);
    quillInstance = initializeQuill();
    handleFormSubmit();
}

function render(container) {
    const html = /* html */ `
    <form id="create">
        <div class="formContent">
            <h2>Product Create</h2>
            <label>Title: 
                <br><input type="text" name="title">
            </label><br>
            <label>Slug:
                <br><input type="text" name="slug" readonly>
            </label><br>
            <br><div id="quillEditor"></div>
        </div>
        <div class="formSidebar">
            <button type="submit">Save</button>
        </div>
    </form>
    `;
    container.innerHTML = html;
}

function slug(form) {
    //console.log(form)
    const titleInput = form.querySelector('input[name="title"]');
    const slugInput = form.querySelector('input[name="slug"]');
    //console.log(slug)

    // Thêm sự kiện 'input' để xử lý mỗi khi có ký tự mới được gõ
    titleInput.addEventListener('input', () => {
        // Lấy giá trị hiện tại của ô input
        const title = titleInput.value;
        // Bước 1: Loại bỏ dấu tiếng Việt (cách hiện đại và hiệu quả)
        // normalize('NFD') tách chữ cái và dấu ra
        // regex /\p{M}/g loại bỏ tất cả các dấu (ký tự không gian)
        const normalizedString = title.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        // Bước 2: Chuyển về chữ thường và thay thế các ký tự không hợp lệ
        // toLowerCase(): chuyển tất cả thành chữ thường
        // replace(/[^\w\s-]/g, ''): loại bỏ tất cả các ký tự không phải chữ, số, khoảng trắng hoặc dấu gạch ngang
        // replace(/\s+/g, '-'): thay thế một hoặc nhiều khoảng trắng thành một dấu gạch ngang
        // replace(/^-+|-+$/g, ''): loại bỏ các dấu gạch ngang thừa ở đầu hoặc cuối
        const slug = normalizedString
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/^-+|-+$/g, '');

        // Bước 3: Gán giá trị slug đã xử lý vào ô input thứ hai
        slugInput.value = slug;

        //console.log(normalizedString)
    });
}

function handleFormSubmit() {
    const form = document.getElementById('create');
    slug(form)
    form.addEventListener('click', (e) => {
        e.preventDefault();
        requestServer(form);

    });
}

async function requestServer(form) {
    try {
        const formData = new FormData(form);
        
        // Bây giờ bạn có thể sử dụng `quillInstance` để truy cập `root.innerHTML`
        const quillContentHtml = quillInstance.root.innerHTML;

        // Thêm nội dung của Quill vào formData để gửi lên server
        formData.append('description', quillContentHtml);
        console.log(quillContentHtml);

        const response = await fetch('/admin/api/?ProductController@create', {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        console.log(result);

    } catch (e) {
        console.error(e);
    }
}





export {productCreate}