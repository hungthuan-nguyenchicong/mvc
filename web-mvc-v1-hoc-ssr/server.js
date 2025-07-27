// ./server.js
import AdminRoutes from "./backend/admin/core/AdminRoutes";
Bun.serve({
    routes: {
        '/': new Response('/ index'),
        ...AdminRoutes,
    }
});