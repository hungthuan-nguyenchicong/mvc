// web-mvc/server.js
import { RoutesAdmin } from "./backend/admin/core/RoutesAdmin";
Bun.serve({
    routes: {
        '/': () => new Response(render(),{
            headers: {"Content-Type": "text/html; charset=utf-8"},
        }),
        '/test-socket': () => new Response(testSocket(),{
            headers: {"Content-Type": "text/html; charset=utf-8"}
        }),
        ...RoutesAdmin
    }
});