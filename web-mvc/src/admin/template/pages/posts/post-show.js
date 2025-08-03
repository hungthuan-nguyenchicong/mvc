// web-mvc/src/admin/template/pages/posts/post-show.js

function adminPostShow(params = {}) {
    const { id = 1 } = params;
    return /* html */ `
        <h2>Post show: ${id}</h2>
    `;
}
export { adminPostShow }