// ./admin/controllers/AdminController.js

class AdminController {
    async index() {
        return 'Admin Dashboard';
    }

    async json() {
        // Return a plain JavaScript object that represents your JSON data
        return {
            message: "This is a JSON response from admin",
            data: {
                adminKey: "adminValue",
                version: "1.0",
            },
            customHeaderExample: "json admin" // This could be part of the body if not a real header
        };
    }

    async notFound() {
        return 'Page 404 not found';
    }
}

export default AdminController;

