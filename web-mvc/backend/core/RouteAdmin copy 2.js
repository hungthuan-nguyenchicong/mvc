// web-mvc/backend/core/RouteAdmin.js
import { LoginController } from "../admin/controller.js/LoginController"

const loginControllerInstance = new LoginController();
const RouteAdmin = {
    '/admin/': new Response('/admin/'),
    //'/admin/login': new LoginController().index(),
    '/admin/login': {
        GET: () => loginControllerInstance.index(),
        POST: async req => loginControllerInstance.login(req),
    }
}

export { RouteAdmin }

//console.log(new LoginController().index())