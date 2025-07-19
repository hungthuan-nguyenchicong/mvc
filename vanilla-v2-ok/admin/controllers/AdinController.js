// ./admin/controllers/AdminController.js

class AdminController {
    async index() {
        return 'Admin Dashboard';
    }

    // async json() {
    //     const data = {
    //         message: "This is a JSON response from admin"
    //     }
    //     // Return a plain JavaScript object that represents your JSON data
    //     // return {
    //     //     message: "This is a JSON response from admin",
    //     //     data: {
    //     //         adminKey: "adminValue",
    //     //         version: "1.0",
    //     //     },
    //     //     customHeaderExample: "json admin" // This could be part of the body if not a real header
    //     // };
    //     return JSON.stringify(data, {
    //         Headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     })
    // }

    async json() {
        const data = {
            message: "This is a JSON response from admin"
        };
        return data; // Just return the JavaScript object
    }

    async notFound() {
        return 'Page 404 not found';
    }
}

export default AdminController;

