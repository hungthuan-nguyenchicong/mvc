//web-mvc/src/admin/template/pages/products.js
function products() {
    const container = document.querySelector('.content');

    async function index() {
        const module = await import('./products/product-index');
        module.productIndex(container)
    }

    async function create() {
        const module = await import('./products/product-create');
        module.productCreate(container);
    }
    return {
        index,
        create,
    }
}

export { products }