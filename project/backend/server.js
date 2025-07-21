// ./project/backend/server.js

//import {serve, file} from "bun";
import { serve } from "bun";
import {AdminRouter} from "../core/AdminRouter";
// import path from 'path';

// // Đường dẫn tuyệt đối đến thư mục frontend/public
// const FRONTEND_PUBLIC_DIR = path.join(import.meta.dir, '../../frontend/public');

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
//console.log(FRONTEND_PUBLIC_DIR)