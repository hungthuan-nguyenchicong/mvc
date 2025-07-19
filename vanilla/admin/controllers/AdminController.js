// ./admin/controllers/AdminController.js

import { file } from "bun";
//import path from "path";
//import loginView from '../views/admin/login.html';

class AdminController {
    constructor(req) {
        this.req = req;
    }

    async index() {
        return new Response('AdminController - index');
    }

    async login() {
        if (this.req.method === 'POST') {
            const data = {
                message: 'message',
            }
            const dataJson = JSON.stringify(data);
            return new Response(dataJson);

        }
        //return new Response(`AdminController - login - method: ${this.req.method}`);
        //loginView;
        return new Response(file(__dirname + '/../views/admin/login.html'));
        //const filePath = path.join(__dirname, "../views/admin/login.html");
        //return new Response(file(filePath));
    }
}

export default AdminController;