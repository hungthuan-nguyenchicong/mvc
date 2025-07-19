// ./admin/core/AdminRouter.js
import AdminController from "../controllers/AdinController";


class AdminRouter {
    constructor() {
        this.adminController = new AdminController();
    }

    async handleRequest(request) {
        const url = new URL(request.url);
        const pathname = url.pathname;
        const method = request.method;

        if (method === 'GET' || method === 'POST') {
            switch (pathname) {
                case '/admin':
                    return new Response( await this.adminController.index());
                // case '/json':
                //     return new Response( await this.adminController.json());
                //     // const jsonData = await this.adminController.json();
                //     // // Stringify the JSON data and set the correct Content-Type header
                //     // return new Response(JSON.stringify(jsonData), {
                //     //     headers: {
                //     //         'Content-Type': 'application/json',
                //     //         // Custom headers for the HTTP response go here, not in the JSON body
                //     //         //"X-Custom-Admin-Header": "json admin response"
                //     //     }
                //     // });
                case '/json':
                    const jsonData = await this.adminController.json();
                    // tra ve response
                    return new Response(JSON.stringify(jsonData), {
                        headers: {'Content-Type': 'application/json'}
                    })
                default:
                    return new Response( await this.adminController.notFound(), {status: 404});
            }
        } else {
            // Method not allowed for other HTTP methods
            return new Response('Method Not Allowed', {status: 405});
        }
    }
}

export default AdminRouter;