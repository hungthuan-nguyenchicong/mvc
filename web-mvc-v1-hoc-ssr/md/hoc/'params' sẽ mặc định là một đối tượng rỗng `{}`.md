## 'params' sẽ mặc định là một đối tượng rỗng `{}`

// web-mvc/backend/admin/controllers/TestController.js

export class TestController {
    // ... (constructor và index) ...

    // action 'show' nhận một đối tượng 'params'
    // Nếu không có đối tượng nào được truyền vào (hoặc là undefined/null),
    // 'params' sẽ mặc định là một đối tượng rỗng `{}`
    show(params = {}) {
        // Destructuring 'params' để lấy 'id'.
        // Nếu 'params.id' không tồn tại (là undefined), 'id' sẽ mặc định là "1".
        const {id = "1"} = params;
        return new Response(`show id: ${id}`); // Sử dụng biến 'id' đã được gán mặc định
    }

    // ... (create) ...
}