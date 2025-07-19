// ./admin/core/AdminRoutes.js
import AdminController from "../controllers/AdminController";
import { file } from "bun";
const adminRoutes = {
    // phuc vu file tinh

    '/admin/views/*': req => {
        const url = new URL(req.url);
        // lấy đường dẫ sau /admin/views/
        const filePath = url.pathname.replace('/admin/views/', '');
        return new Response(file(__dirname + `/../views/${filePath}`));
    },

    // Phục vụ các file tĩnh trong thư mục public (ví dụ: login.js, style.css)
    '/public/*': req => {
        const url = new URL(req.url);
        const filePath = url.pathname.replace('/public/', '');
        // Giả sử thư mục public nằm ở thư mục gốc của dự án
        return new Response(file(process.cwd() + `/public/${filePath}`));
    },

    
    '/abc': new Response('/abc'),
    '/admin/:method': async req => {
        const adminController = new AdminController(req);
        const methodName = req.params.method;
        if (typeof adminController[methodName] === 'function') {
            return adminController[methodName]();
        };
        return new Response('Not Found', {status: 404});
    }
}

export default adminRoutes;