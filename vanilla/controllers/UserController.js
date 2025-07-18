// ./controllers/UserController.js

class UserController {
    async index() {
        console.log("UserController.index called on server!");
        return new Response("Hello from Server-side UserController.index!");
    }

    async create(req) {
        // Example: process a POST request
        const body = await req.json(); // Assuming JSON body
        console.log("Creating user on server:", body);
        return new Response(JSON.stringify({ message: "User created!", data: body }), {
            headers: { "Content-Type": "application/json" },
            status: 201
        });
    }
}

export default UserController;