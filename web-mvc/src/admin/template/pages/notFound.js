// web-mvc/src/admin/template/pages/notFound.js

function notFound() {
    const container = document.querySelector('.content');
    function index(message = 'Page Not Found') {
        const htmlContent = render(message);
        container.innerHTML = htmlContent;
    }
    function render(message) {
        return /* html */ `
        <h1>Page 404</h1>
        <p>${message}</p>
        `;
    }
    return {index}
}

export {notFound}