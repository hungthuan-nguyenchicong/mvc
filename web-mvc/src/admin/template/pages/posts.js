// web-mvc/src/admin/template/pages/posts.js
import './posts/posts.scss';
function posts() {
    const container = document.querySelector('.content');

    //const params = params;
    async function index() {
        const module = await import('./posts/post-index');
        const htmlContent = await module.adminPostIndex();
        container.innerHTML = htmlContent;

        // Gọi hàm requestServer() để lấy dữ liệu sau khi HTML đã được render
        // Dữ liệu trả về sẽ được hiển thị trên console.log()
        //await module.requestServer();
        //await module.init();
        await module.requestServer();
    }
    async function create() {
        const module = await import('./posts/post-create')
        const htmlContent = module.adminPostCreate();
        container.innerHTML = htmlContent;

        module.handleFormSubmit();
    }
    async function show(params = {}) {
        const module = await import('./posts/post-show');
        const htmlContent = module.adminPostShow();
        container.innerHTML = htmlContent;

        module.requestServer(params);
    }
    return {
        index,
        create,
        show,
    }
}

export {posts}