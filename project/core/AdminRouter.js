// ./project/core/AdminRouter.js
import AdminController from "../controllers/AdminController";
const adminRouter = {
    '/admin/test': new Response('/admin/test'),
    '/admin/:method': async req => {
        const adminController = new AdminController(req);
        const methodName = req.params.method;
        if (typeof adminController[methodName] === 'function') {
            return adminController[methodName]();
        }
        return new Response('Not Found', {status: 404});
    }
}

export default adminRouter;