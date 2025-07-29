// web-mvc/backend/admin/core/RouteAdmin.js
import { loginPage } from "../views/login-page"
const RoutesAdmin = {
    '/admin/': new Response('/'),
    '/admin/login': {
        GET: () => new Response(loginPage(),{headers:{'Content-Type':'text/html'}})
    }
}

export {RoutesAdmin}