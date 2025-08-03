// web-mvc/src/admin/template/pages/posts.js

function posts() {
    const container = document.querySelector('.content');

    //const params = params;
    async function index() {
        const module = await import('./posts/post-index');
        const htmlContent = module.adminPostIndex();
        container.innerHTML = htmlContent
    }
    async function create() {
        const module = await import('./posts/post-create')
        const htmlContent = module.adminPostCreate();
        container.innerHTML = htmlContent;
    }
    async function show(params = {}) {
        const module = await import('./posts/post-show');
        const htmlContent = module.adminPostShow(params);
        container.innerHTML = htmlContent
    }
    return {
        index,
        create,
        show,
    }
}

export {posts}