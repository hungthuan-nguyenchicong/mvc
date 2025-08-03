// web-mvc/src/admin/template/pages/posts.js

function posts() {
    //const params = params;
    async function index() {
        import('./posts/post-index')
    }
    function create() {
        import('./posts/post-create')
    }
    async function show(params = {}) {
        await import('./posts/post-show');
    }
    return {
        index,
        create,
        //show,
    }
}

export {posts}