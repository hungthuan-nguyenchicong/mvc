// ./project/backend/server.js

import {serve, file} from "bun";
import adminRouter from "../core/AdminRouter";

const server = serve({
    port: process.env.PORT || 3000,
    routes: {
        '/': new Response('bun /'),
        ...adminRouter,
    },

    fetch(req) {
        return new Response('Page 404', {status: 404});
    }
});

console.log(`bun run on http://${process.env.HOST}:${server.port}`);