// ./server.js
import adminRoutes from "./admin/core/AdminRoutes";

const server = Bun.serve({
    port: 3000,
    // routes: {
    //     '/': new Response('helle bun')
    // },
    //adminRoutes,
    routes: {
        '/': new Response('Bun /'),
        ...adminRoutes
    },
    // fetch(req) {
    //     return new Response(`Page 404 Not Found: ${req.url.pathname}`, {status: 404});
    // }

    fetch(req) {
        const url = new URL(req.url);
        return new Response(`Page 404 Not Found: ${url.pathname}`, {status: 404});
    },
});

console.log(`Bun on http://localhost:${server.port}`);