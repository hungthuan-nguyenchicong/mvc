// ./project/controllers/AdminController.js

export class AdminController {
    constructor(req) {
        this.req = req;
    }
    
    async index() {
        return new Response('Admin controller index')
    }

    async login() {
        if (this.req.method === 'POST') {
            return Response.json({"message":"login post"})
        } else {
            return new Response('login');
        }
    }
}

//export default AdminController;
//export const adminController = new AdminController();