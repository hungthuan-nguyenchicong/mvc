// ./server.js

// import { serve } from "bun";
import AdminRouter from "./admin/core/AdminRouter";

const adminRouter = new AdminRouter();
const server = Bun.serve({
    port:3000,
    async fetch(request) {
        return await adminRouter.handleRequest(request);
    },
});

console.log(`Bun server listening on http://localhost:${server.port}`);