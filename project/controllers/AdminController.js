// ./project/controllers/AdminController.js
//import { file } from "bun";
//import path from 'path'
export class AdminController {
    constructor(req) {
        this.req = req;
    }
    
    async index() {
        return new Response('Admin controller index')
    }

    // async login() {
    //     if (this.req.method === 'POST') {
    //         return Response.json({"message":"login post"})
    //     } else {
    //         //return new Response('login');
    //         //return new Response(file(__dirname + '/../views/admin/login.html'));
    //         const loginFile = file(path.join(import.meta.dir, '../frontend/public/admin/login.html'));
    //         console.log(import.meta.dir)
    //         return new Response(loginFile);
    //     }
    // }

    async login() {
        if (this.req.method === 'POST') {
            return Response.json({"message":"login post"})
        } else {
            const {Login} = await import('../views/admin/Login');
            const loginInstance = new Login();
            const html = loginInstance.render();
            return new Response(html,{
                headers: { "Content-Type": "text/html; charset=utf-8" },
            })
        }
    }
}
//console.log(1);

//export default AdminController;
//export const adminController = new AdminController();