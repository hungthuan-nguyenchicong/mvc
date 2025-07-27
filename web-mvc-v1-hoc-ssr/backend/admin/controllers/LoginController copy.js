// web-mvc/backend/admin/controllers/LoginController.js
import loginPage from '../views/login/login-page'
export class LoginController {

    async index() {
        return new Response(loginPage.render(),{headers:{'Content-Type':'text/html'}})
    }
}