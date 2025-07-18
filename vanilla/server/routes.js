// ./server/routes.js
import UserController from "../controllers/UserController.js"; // Import your UserController

const routes = {
    // GET /
    '/': {
        GET: async (req) => {
            return new Response("Chào mừng đến với ứng dụng Bun MVC!");
        }
    },
    // GET /users
    '/users': {
        GET: async (req) => {
            // Call the index method from UserController via an instance
            const userControllerInstance = new UserController();
            return await userControllerInstance.index();
        }
    },
    // POST /users
    '/users/create': {
        POST: async (req) => {
            // Example of handling a POST request
            const userControllerInstance = new UserController();
            return await userControllerInstance.create(req); // Assume UserController has a 'create' method
        }
    },
    // GET /products/{id} (Example of a dynamic route)
    '/products/:id': {
        GET: async (req) => {
            const productId = req.params.id; // How you'd get the 'id' parameter
            return new Response(`Product Detail for ID: ${productId}`);
        }
    },
    // 404 Fallback
    '404': {
        GET: async (req) => {
            return new Response("404 Not Found", { status: 404 });
        }
    }
};

export default routes;