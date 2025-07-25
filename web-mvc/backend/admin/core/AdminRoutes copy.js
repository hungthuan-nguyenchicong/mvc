// web-mvc/backend/admin/core/AdminRoutes.js

//import AdminController from "../controllers/AdminController";
const AdminRoutes = {
    '/admin/test': new Response('/admin/test'),
    '/admin/:method': async req => {
        const {default: AdminController} = await import('../controllers/AdminController.js');
        const adminControllerInstance = new AdminController(req);
        const methodName = req.params.method;
        if (typeof adminControllerInstance[methodName] === 'function') {
            return adminControllerInstance[methodName]();
        }
        return new Response('Not Found', {status: 404});
    }
}

export default AdminRoutes;