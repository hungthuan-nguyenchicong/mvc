// web-mvc/vite.config.js

import { defineConfig } from "vite";

export default defineConfig({
    root: '.',
    server: {
        port: 4000,
        //hostname: localhost,
        proxy: {
            '^/(?!src|node_module|dist|@vite/client|backend)': {
                target: 'http://localhost:3000',
            }
        }
    }
});