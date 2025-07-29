// web-mvc/src/test-socket.js

function testSocket() {
    //const hmrRender = hmr();
    return /* html */ `
    <h1>Test Socket</h1>
    ${hmr()}
    `;
}
function hmr() {
    if (import.meta.env.NODE_ENV === 'development') {
        return /* html */ `
        <!-- commnet -->
        <script type="module" src="http://localhost:4000/src/test.js"></script>
        <script type="module" src="http://localhost:4000/@vite/client"></script>
        `;
    } else {
        return ` abc`;
    }

}
// test comment
export {testSocket};
console.log(import.meta.env.NODE_ENV)
console.log(process.env.NODE_ENV)