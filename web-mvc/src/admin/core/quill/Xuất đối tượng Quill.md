## Xuất đối tượng Quill

Dựa vào đoạn code bạn đã cung cấp, có thể thấy một số vấn đề trong cách bạn quản lý và sử dụng đối tượng **Quill**. Thay vì chỉ gọi hàm `quill()`, bạn cần phải **xuất ra đối tượng Quill** đã được khởi tạo để các mô-đun khác có thể truy cập và tương tác với nó một cách chính xác.

-----

## Các điểm cần sửa đổi

1.  **Xuất đối tượng Quill**: Hàm `quill()` trong file `quill.js` hiện tại chỉ khởi tạo trình soạn thảo và không trả về đối tượng Quill đã tạo. Điều này khiến các file khác (như `product-create.js`) không thể truy cập được các thuộc tính như `root` hay các phương thức khác của Quill.

2.  **Sự nhầm lẫn giữa hàm và đối tượng**: Trong `product-create.js`, bạn đã import `quill` và gọi nó như một hàm `quill()`, nhưng sau đó lại cố gắng truy cập `quill.root.innerHTML`. Đây là lỗi vì bạn đang cố truy cập thuộc tính của một hàm chứ không phải của đối tượng Quill đã được tạo.

3.  **Không cần `quillRender`**: Hàm `quillRender` không được sử dụng trong hàm `quill()` và có thể bị loại bỏ để tránh code thừa.

-----

## Cách sửa đổi

Dưới đây là phiên bản code đã được sửa đổi để giải quyết các vấn đề trên, tập trung vào việc xuất đối tượng Quill đã khởi tạo.

### File `web-mvc/src/admin/core/quill/quill.js`

```javascript
import Quill from "quill";
import { handlerImage, clickUseImage } from "./custom/CustomImage";
import "./custom/CustomLink";

/**
 * Khởi tạo và trả về một đối tượng Quill.
 * @returns {Quill|null} Trả về đối tượng Quill đã khởi tạo, hoặc null nếu không tìm thấy phần tử.
 */
function initializeQuill() {
    const quillEditor = document.getElementById('quillEditor');
    if (!quillEditor) {
        console.error('Không tìm thấy phần tử #quillEditor');
        return null;
    }

    quillEditor.style.minHeight = '300px';
    quillEditor.style.height = 'fit-content';

    const options = {
        modules: {
            toolbar: {
                container: [
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'align': [] }],
                    [{ 'color': [] }, { 'background': [] }],
                    ['clean'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
                    ['link', 'image'],
                ],
                handlers: {
                    'image': handlerImage
                }
            },
        },
        tooltip: true,
        theme: 'snow',
        placeholder: 'Post content',
    };

    const quillInstance = new Quill(quillEditor, options);
    
    // Bind the Quill instance to the image handler's click event.
    // This assumes `clickUseImage` needs the Quill instance to work.
    clickUseImage(quillInstance);

    // Disable link behavior on click inside the editor to prevent navigation
    // This is a common issue with `<a>` tags in Quill.
    quillInstance.root.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            e.stopPropagation();
        }
    });

    return quillInstance;
}

// Export the function that initializes and returns the Quill instance.
export { initializeQuill };
```

-----

### File `web-mvc/src/admin/template/pages/products/product-create.js`

```javascript
// web-mvc/src/admin/template/pages/products/product-create.js
import { initializeQuill } from "../../../core/quill/quill";

let quillInstance; // Biến toàn cục để lưu trữ đối tượng Quill

function productCreate(container) {
    render(container);
    quillInstance = initializeQuill(); // Gán đối tượng Quill đã khởi tạo
    if (quillInstance) {
        handleFormSubmit();
    }
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
}

function handleFormSubmit() {
    const form = document.getElementById('create');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (quillInstance) {
            requestServer(form);
        } else {
            console.error('Quill is not initialized.');
        }
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
        console.log(e);
    }
}

export { productCreate };
```

Với những thay đổi trên, bạn đã có một luồng xử lý rõ ràng hơn: hàm `initializeQuill()` sẽ chịu trách nhiệm khởi tạo Quill và trả về đối tượng đó. Sau đó, biến `quillInstance` sẽ lưu trữ đối tượng này, cho phép bạn truy cập vào nội dung của trình soạn thảo một cách an toàn và chính xác.