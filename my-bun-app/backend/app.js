// ./backend/app.js

import dashboard from './dashboard.html';
import homepage from './index.html';

Bun.serve({
    routes: {
        '/': homepage,
        '/dashboard': dashboard,
    },

    fetch(req) {
        // ... api requests
        return new Response("hello world a");
    }
});

console.log(123);