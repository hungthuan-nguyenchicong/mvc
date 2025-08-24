## khởi tạo một đối tượng Quill trên phần tử

Dựa vào đoạn mã bạn đã cung cấp, bạn không thể sử dụng `quill.root.innerHTML` trực tiếp trong hàm `requestServer` vì biến `quill` được khai báo và xử lý trong phạm vi của mô-đun riêng. Cụ thể, `quill` được khởi tạo và gán giá trị sau khi hàm `quill()` được gọi, nhưng biến này lại không được xuất ra ngoài để các hàm khác có thể truy cập.

-----

## Nguyên nhân chi tiết

Trong file `product-create.js`, bạn đã import `quill` từ `../../../core/quill/quill`. Hàm `productCreate` gọi `quill()`.

```javascript
import { quill } from "../../../core/quill/quill";
function productCreate(container) {
    //...
    quill(); // quíll được khởi tạo tại đây
    //...
}
```

Tuy nhiên, `quill` ở đây chỉ là một hàm được import. Khi bạn gọi `quill()`, nó sẽ thực hiện một số tác vụ, thường là khởi tạo một **đối tượng Quill** trên phần tử `div` có `id="quillEditor"`.

Sau khi hàm `quill()` được gọi, biến **đối tượng Quill đã khởi tạo** thường được gán cho một biến cục bộ bên trong mô-đun `quill`. Do đó, biến `quill` mà bạn import vào `product-create.js` vẫn chỉ là hàm ban đầu.

Khi bạn cố gắng truy cập `quill.root.innerHTML` trong hàm `requestServer`, bạn đang cố gắng truy cập thuộc tính `root` trên chính cái hàm `quill` đó, chứ không phải trên đối tượng Quill đã được khởi tạo. Vì hàm không có thuộc tính `root`, nên bạn sẽ nhận được lỗi hoặc giá trị không xác định.

## Cách khắc phục

Để khắc phục vấn đề này, bạn cần phải có cách để lấy được đối tượng Quill đã khởi tạo. Dưới đây là hai cách phổ biến:

### 1\. Trả về đối tượng Quill từ hàm `quill()`

Sửa đổi file `quill.js` để hàm `quill` trả về đối tượng Quill đã khởi tạo.

**File `web-mvc/src/admin/core/quill/quill.js` (cần sửa đổi)**

```javascript
// Ví dụ về cách sửa đổi file quill.js
let quillInstance; // Biến này sẽ lưu đối tượng Quill

export function quill() {
    // Khởi tạo Quill trên phần tử có id="quillEditor"
    quillInstance = new Quill('#quillEditor', {
        theme: 'snow'
    });
    return quillInstance; // Trả về đối tượng đã khởi tạo
}
```

**File `web-mvc/src/admin/template/pages/products/product-create.js` (cần sửa đổi)**

```javascript
import { quill } from "../../../core/quill/quill";

let quillEditor; // Khai báo biến toàn cục trong mô-đun để giữ đối tượng Quill

function productCreate(container) {
    render(container);
    quillEditor = quill(); // Gán đối tượng Quill được trả về
    handleFormSubmit();
}

//...

async function requestServer(form) {
    try {
        const formData = new FormData(form);
        // Sử dụng biến quillEditor đã lưu
        const quillContentHtml = quillEditor.root.innerHTML; 
        console.log(quillContentHtml);
        
        // Thêm nội dung Quill vào formData
        formData.append('description', quillContentHtml);

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
```

### 2\. Sử dụng Quill trên đối tượng DOM

Nếu bạn không muốn thay đổi file `quill.js`, bạn có thể truy cập đối tượng Quill đã khởi tạo thông qua chính phần tử DOM của nó. Quill gán đối tượng của nó cho thuộc tính `__quill` trên phần tử `div` của editor.

```javascript
import { quill } from "../../../core/quill/quill";

function productCreate(container) {
    render(container);
    quill();
    handleFormSubmit();
}

//...

async function requestServer(form) {
    try {
        const formData = new FormData(form);
        
        // Lấy phần tử DOM của Quill Editor
        const editorElement = document.getElementById('quillEditor');
        // Truy cập đối tượng Quill thông qua thuộc tính __quill của DOM
        const quillInstance = editorElement.__quill;
        
        // Kiểm tra xem đối tượng Quill có tồn tại không
        if (quillInstance) {
            const quillContentHtml = quillInstance.root.innerHTML; 
            console.log(quillContentHtml);
            
            // Thêm nội dung vào formData
            formData.append('description', quillContentHtml);
        }

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
```

Cách này có thể không hoạt động với mọi phiên bản Quill và không phải là cách chính thức, nhưng nó khá phổ biến. Cách đầu tiên (trả về instance) là phương pháp được khuyến nghị và rõ ràng hơn.

**Tóm lại**, bạn không thể truy cập `quill.root.innerHTML` vì biến `quill` mà bạn import chỉ là hàm khởi tạo, chứ không phải là đối tượng editor đã được tạo. Bạn cần phải lưu trữ đối tượng editor đã tạo vào một biến và sử dụng biến đó để truy cập các thuộc tính và phương thức của Quill.