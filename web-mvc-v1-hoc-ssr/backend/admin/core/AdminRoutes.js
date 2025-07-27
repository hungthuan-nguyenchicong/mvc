// web-mvc/backend/admin/core/AdminRoutes.js

//import AdminController from "../controllers/AdminController";
import AdminController from '../controllers/AdminController.js';
import { LoginController } from '../controllers/LoginController.js';
import { RouterAdminApi } from './RouterAdminApi.js';
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
    },
    '/admin/api/*': async req => {
        const routerAdminApiInstance = new RouterAdminApi(req);
        return await routerAdminApiInstance.handle();
    },
    '/admin/login': async req => {
        const loginControllerInstance = new LoginController(req);
        return await loginControllerInstance.index();
    }
}

export default AdminRoutes;