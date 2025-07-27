// web-mvc/backend/admin/controllers/AdminController.js

import loginPage from "../views/loginPage";

class AdminController {
    constructor(req) {
        this.req = req;
    }

    async index() {
        return new Response('adm ctl index')
    }

    async login() {
        if (this.req.method === 'POST') {
            return Response.json({"message":"login post"})
        }
        const html = loginPage.render();
        return new Response(html, {
            headers: {'Content-Type': 'text/html'}
        })
    }
}

export default AdminController;