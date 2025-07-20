// ./project/controllers/AdminController.js

class AdminController {
    constructor(req) {
        this.req = req;
    }
    
    async index() {
        return new Response('Admin controller index')
    }

    async login() {
        return new Response('login');
    }
}

export default AdminController;