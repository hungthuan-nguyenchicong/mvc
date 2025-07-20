// ./project/backend/server.js

import {serve, file} from "bun";
import {AdminRouter} from "../core/AdminRouter";

const server = serve({
    port: process.env.PORT || 3000,
    routes: {
        '/': new Response('bun /'),
        ...AdminRouter,
    },

    fetch(req) {
        return new Response('Page 404', {status: 404});
    }
});

console.log(`bun run on http://${process.env.HOST}:${server.port}`);