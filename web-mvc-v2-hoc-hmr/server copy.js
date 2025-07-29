// web-mvc/server.js
import { testSocket } from "./src/test-socket";
function render() {
    return /* html */ `
    <h1>test page</h1>
    <script type="module" src="http://localhost:4000/src/test.js"></script>
    <script type="module" src="http://localhost:4000/@vite/client"></script>
    `;
}
Bun.serve({
    routes: {
        '/': () => new Response(render(),{
            headers: {"Content-Type": "text/html; charset=utf-8"},
        }),
        '/test-socket': () => new Response(testSocket(),{
            headers: {"Content-Type": "text/html; charset=utf-8"}
        })
    }
});