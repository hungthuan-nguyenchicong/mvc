// ./project/core/AdminRouter.js
//import AdminController from "../controllers/AdminController";
export const AdminRouter = {
    '/admin/test': new Response('/admin/test'),
    '/admin/:method': async req => {
        const {AdminController} = await import('../controllers/AdminController.js')
        const adminController = new AdminController(req);
        const methodName = req.params.method;
        if (typeof adminController[methodName] === 'function') {
            return adminController[methodName]();
        }
        return new Response('Not Found', {status: 404});
    }
}

//export default adminRouter;
// import adminRouter from "../core/AdminRouter";
//export const AdminRouter