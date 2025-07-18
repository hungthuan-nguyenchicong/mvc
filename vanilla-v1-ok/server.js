// ./server.js
import { serve } from "bun";
import routes from "./server/routes";
class Router {
    constructor(routes) {
        this.routes = routes;
    }

    /**
     * Finds a matching route and extracts parameters.
     * Supports basic dynamic segments like /users/:id
     * @param {string} path - The request path (e.g., "/users/123")
     * @param {string} method - The HTTP method (e.g., "GET")
     * @returns {{handler: Function, params: Object}|null} - The matched handler and extracted params, or null if no match
     */
    matchRoute(path, method) {
        // Try to find an exact match first
        if (this.routes[path] && this.routes[path][method]) {
            return { handler: this.routes[path][method], params: {} };
        }

        // Check for dynamic routes
        for (const routePath in this.routes) {
            // Skip 404 and exact matches already handled
            if (routePath === '404' || typeof this.routes[routePath] !== 'object' || !this.routes[routePath][method]) {
                continue;
            }

            // Convert route path to a regex for dynamic segments (e.g., /products/:id)
            const regexPattern = new RegExp(`^${routePath.replace(/:([a-zA-Z0-9_]+)/g, '(?<$1>[^/]+)')}$`);
            const match = path.match(regexPattern);

            if (match) {
                return {
                    handler: this.routes[routePath][method],
                    params: match.groups || {} // Capture named groups (e.g., { id: "123" })
                };
            }
        }

        // If no specific route matches, return the 404 handler if defined
        if (this.routes['404'] && this.routes['404'].GET) { // Assuming 404 is always a GET request
            return { handler: this.routes['404'].GET, params: {} };
        }

        return null; // No match found at all
    }

    /**
     * Handles an incoming request by routing it to the appropriate handler.
     * @param {Request} request - The incoming Bun Request object.
     * @returns {Promise<Response>} - A promise that resolves to a Bun Response object.
     */
    async handleRequest(request) {
        const url = new URL(request.url);
        const path = url.pathname;
        const method = request.method;

        console.log(`Incoming request: ${method} ${path}`);

        const matched = this.matchRoute(path, method);

        if (matched) {
            try {
                // Pass the request object along with params
                const response = await matched.handler({ ...request, params: matched.params });
                if (!(response instanceof Response)) {
                    console.error(`Handler for ${method} ${path} did not return a Response object.`);
                    return new Response("Internal Server Error: Handler did not return a Response", { status: 500 });
                }
                return response;
            } catch (error) {
                console.error(`Error handling ${method} ${path}:`, error);
                return new Response("Internal Server Error", { status: 500 });
            }
        } else {
            // This case should ideally be caught by '404' in matchRoute,
            // but as a fallback, ensure a 404 is returned.
            return new Response("404 Not Found", { status: 404 });
        }
    }
}

// Create an instance of your server-side Router
const serverRouter = new Router(routes);

// Serve with Bun's fetch handler, delegating to your Router instance
serve({
    port: 3000,
    fetch: (request) => serverRouter.handleRequest(request),
});

console.log('Bun MVC Server is running on http://localhost:3000');